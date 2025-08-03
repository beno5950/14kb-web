#!/usr/bin/env node

import Fastify from 'fastify';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';

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
    'Content-Security-Policy': "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'"
  });
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
  
  // Validate slug to prevent XSS and directory traversal
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return reply.code(404).send('Post not found');
  }
  
  // Escape HTML output to prevent XSS
  const escapedSlug = slug.replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;')
                          .replace(/"/g, '&quot;')
                          .replace(/'/g, '&#x27;');
  
  const title = escapedSlug.replace(/-/g, ' ')
                           .replace(/\b\w/g, l => l.toUpperCase());
  
  // In a real implementation, this would render the markdown file
  // For now, just return a placeholder
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Post: ${title}</title>
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
      <h1>${title}</h1>
      <p>TODO: This blog post content will be implemented later.</p>
      <p><a href="/">← Back to blog</a></p>
    </article>
  </main>
</body>
</html>`;
  
  reply.type('text/html').send(html);
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Blog server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();