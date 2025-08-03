#!/usr/bin/env node

import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { dirname, join } from 'path';

const __dirname = dirname(new URL(import.meta.url).pathname);

// Ensure dist directory exists
mkdirSync(join(__dirname, 'dist'), { recursive: true });

// Build JavaScript
await build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  outfile: 'dist/main.js',
  target: 'es2020',
});

// Build CSS (just minify, no bundling needed)
await build({
  entryPoints: ['src/styles.css'],
  bundle: true,
  minify: true,
  outfile: 'dist/styles.css',
  loader: { '.css': 'css' },
});

// Process HTML and inline critical resources
const html = readFileSync('index.html', 'utf8');
const css = readFileSync('dist/styles.css', 'utf8');
const js = readFileSync('dist/main.js', 'utf8');

// Create optimized HTML with inlined critical CSS and JS
const optimizedHtml = html
  .replace('<link rel="stylesheet" href="src/styles.css">', `<style>${css}</style>`)
  .replace('<script src="src/main.js" type="module"></script>', `<script type="module">${js}</script>`);

writeFileSync('dist/index.html', optimizedHtml);

console.log('✅ Blog build complete');
console.log('📦 Output: dist/index.html');

// Calculate gzipped size
import { gzipSize } from 'gzip-size';
const size = await gzipSize(optimizedHtml);
const sizeKB = (size / 1024).toFixed(2);

console.log(`📏 Gzipped size: ${sizeKB}KB`);

if (size > 14 * 1024) {
  console.log('⚠️  Warning: Exceeds 14KB budget');
  process.exit(1);
} else {
  console.log('🎉 Within 14KB budget!');
}