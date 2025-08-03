#!/usr/bin/env node

import Fastify from 'fastify';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import dotenv from 'dotenv';
import vine from '@vinejs/vine';

// Load environment variables
dotenv.config();

const __dirname = dirname(new URL(import.meta.url).pathname);

const fastify = Fastify({
  logger: true,
});

// Security headers
fastify.addHook('onSend', async (request, reply) => {
  reply.headers({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy':
      "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'",
  });
});

// Validation schemas
const zipSchema = vine.object({
  zip: vine.string().regex(/^\d{5}$/),
});

// Serve static files
fastify.register(import('@fastify/static'), {
  root: __dirname,
  prefix: '/',
});

// Route for the home page
fastify.get('/', async (request, reply) => {
  const html = readFileSync(join(__dirname, 'index.html'), 'utf8');
  reply.type('text/html').send(html);
});

// Weather API endpoint
fastify.get('/api/weather', async (request, reply) => {
  try {
    // Validate input
    const { zip } = await vine.validate({
      schema: zipSchema,
      data: request.query,
    });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return reply.status(500).send({
        error: 'Server Configuration Error',
        message: 'Weather API key not configured',
      });
    }

    // Fetch weather data from OpenWeatherMap with timeout
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&appid=${apiKey}&units=imperial`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(weatherUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': '14KB-Weather-App/1.0',
      },
    });
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      let message = 'Weather data unavailable';

      if (response.status === 404) {
        message = 'ZIP code not found. Please check and try again.';
      } else if (response.status === 401) {
        message = 'Weather service authentication failed';
      } else if (response.status === 429) {
        message = 'Too many requests. Please try again later.';
      }

      return reply.status(response.status).send({
        error: 'Weather API Error',
        message,
      });
    }

    // Return the weather data
    reply.send(data);
  } catch (error) {
    fastify.log.error(error);

    if (error.messages) {
      // Validation error
      return reply.status(400).send({
        error: 'Invalid Input',
        message: 'Please provide a valid 5-digit ZIP code',
      });
    }

    if (error.name === 'AbortError') {
      return reply.status(504).send({
        error: 'Request Timeout',
        message:
          'Weather service is taking too long to respond. Please try again.',
      });
    }

    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Unable to fetch weather data',
    });
  }
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  reply.send({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`Weather app running at http://localhost:${port}`);
    console.log("Don't forget to set your OPENWEATHER_API_KEY in .env file");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
