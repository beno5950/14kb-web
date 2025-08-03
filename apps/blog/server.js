#!/usr/bin/env node

import Fastify from 'fastify';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';

const __dirname = dirname(new URL(import.meta.url).pathname);

const fastify = Fastify({
  logger: true,
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

// Routes for blog posts (placeholder for now)
fastify.get('/posts/:slug', async (request, reply) => {
  const { slug } = request.params;
  
  // In a real implementation, this would render the markdown file
  // For now, just return a placeholder
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Post: ${slug}</title>
      <link rel="stylesheet" href="/src/styles.css">
    </head>
    <body>
      <header>
        <nav>
          <h1><a href="/">14KB Blog</a></h1>
        </nav>
      </header>
      <main>
        <article>
          <h1>${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
          <p>TODO: This blog post content will be implemented later.</p>
          <p><a href="/">← Back to blog</a></p>
        </article>
      </main>
    </body>
    </html>
  `;
  
  reply.type('text/html').send(html);
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Blog server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();