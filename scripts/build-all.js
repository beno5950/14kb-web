#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'fs';
import { join, basename } from 'path';
import { gzipSize } from 'gzip-size';
import { createGzip } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const APPS_DIR = 'apps';
const BUILD_DIR = 'build';
const MAX_SIZE = 14 * 1024; // 14KB in bytes

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2);
}

async function gzipFile(inputPath, outputPath) {
  const gzip = createGzip({ level: 9 });
  const source = createReadStream(inputPath);
  const destination = createWriteStream(outputPath);
  
  await pipeline(source, gzip, destination);
}

async function buildApp(appName) {
  const appDir = join(APPS_DIR, appName);
  const buildScript = join(appDir, 'build.js');
  const packageJson = join(appDir, 'package.json');

  // Check if app has build script
  if (!statSync(buildScript, { throwIfNoEntry: false })) {
    log(`  Skipping ${appName} - no build script found`, colors.yellow);
    return null;
  }

  log(`  Building ${appName}...`, colors.blue);

  try {
    // Run the app's build script
    execSync(`cd ${appDir} && node build.js`, { 
      stdio: 'pipe',
      encoding: 'utf8'
    });

    // Check if dist/index.html exists
    const distHtml = join(appDir, 'dist', 'index.html');
    if (!statSync(distHtml, { throwIfNoEntry: false })) {
      log(`    Warning: No dist/index.html found for ${appName}`, colors.yellow);
      return null;
    }

    // Get file size information
    const htmlContent = readFileSync(distHtml, 'utf8');
    const rawSize = Buffer.byteLength(htmlContent, 'utf8');
    const gzippedSize = await gzipSize(htmlContent);
    
    const withinBudget = gzippedSize <= MAX_SIZE;
    const status = withinBudget ? 'PASS' : 'FAIL';
    const statusColor = withinBudget ? colors.green : colors.red;

    log(`    ${status} ${appName}: ${formatSize(gzippedSize)}KB gzipped`, statusColor);

    if (!withinBudget) {
      const overageKB = formatSize(gzippedSize - MAX_SIZE);
      log(`    Over budget by ${overageKB}KB`, colors.red);
    }

    return {
      name: appName,
      rawSize,
      gzippedSize,
      withinBudget,
      htmlContent,
    };
  } catch (error) {
    log(`    Error building ${appName}: ${error.message}`, colors.red);
    return null;
  }
}

async function main() {
  log('Building all apps and creating optimized deployments...', colors.cyan);
  
  // Create build directory
  mkdirSync(BUILD_DIR, { recursive: true });

  // Get all apps
  const apps = readdirSync(APPS_DIR).filter(item => {
    const appPath = join(APPS_DIR, item);
    return statSync(appPath).isDirectory();
  });

  if (apps.length === 0) {
    log('No apps found in apps/ directory', colors.yellow);
    return;
  }

  log(`Found ${apps.length} apps: ${apps.join(', ')}`, colors.blue);

  // Build each app
  const buildResults = [];
  for (const app of apps) {
    const result = await buildApp(app);
    if (result) {
      buildResults.push(result);
    }
  }

  if (buildResults.length === 0) {
    log('No apps were successfully built', colors.red);
    return;
  }

  log('\nCreating optimized deployments...', colors.cyan);

  // Create deployment structure for each app
  for (const result of buildResults) {
    const appBuildDir = join(BUILD_DIR, result.name);
    mkdirSync(appBuildDir, { recursive: true });

    // Copy optimized HTML
    const htmlPath = join(appBuildDir, 'index.html');
    writeFileSync(htmlPath, result.htmlContent);

    // Create gzipped version
    const gzipPath = join(appBuildDir, 'index.html.gz');
    await gzipFile(htmlPath, gzipPath);

    // Create Brotli compressed version if available
    try {
      execSync(`which brotli`, { stdio: 'pipe' });
      execSync(`brotli -c ${htmlPath} > ${join(appBuildDir, 'index.html.br')}`, { 
        stdio: 'pipe' 
      });
    } catch {
      // Brotli not available, skip
    }

    log(`  ${result.name}: Created deployment files`, colors.green);
  }

  // Create summary README
  const readmeContent = generateBuildReadme(buildResults);
  writeFileSync(join(BUILD_DIR, 'README.md'), readmeContent);

  // Update root package.json scripts if needed
  updateRootPackageJson();

  // Final summary
  log('\nBuild Summary:', colors.cyan);
  const totalApps = buildResults.length;
  const withinBudget = buildResults.filter(r => r.withinBudget).length;
  const overBudget = totalApps - withinBudget;

  log(`  Total apps built: ${totalApps}`, colors.blue);
  log(`  Within 14KB budget: ${withinBudget}`, colors.green);
  if (overBudget > 0) {
    log(`  Over budget: ${overBudget}`, colors.red);
  }

  const avgSize = buildResults.reduce((sum, r) => sum + r.gzippedSize, 0) / totalApps;
  log(`  Average size: ${formatSize(avgSize)}KB`, colors.blue);

  log(`\nOptimized builds available in: ${BUILD_DIR}/`, colors.green);
  
  // Exit with error if any apps are over budget
  if (overBudget > 0) {
    process.exit(1);
  }
}

function generateBuildReadme(buildResults) {
  const now = new Date().toISOString();
  
  let content = `# 14KB Web - Optimized Builds

This directory contains production-ready, optimized builds of all applications in the 14KB Web monorepo.

**Generated:** ${now}
**Build Target:** 14KB gzipped per page

## Applications

| App | Size (Gzipped) | Status | Files |
|-----|----------------|--------|-------|
`;

  buildResults.forEach(result => {
    const status = result.withinBudget ? '✅ Within Budget' : '❌ Over Budget';
    const sizeKB = formatSize(result.gzippedSize);
    
    content += `| **${result.name}** | ${sizeKB}KB | ${status} | [HTML](${result.name}/index.html) • [Gzipped](${result.name}/index.html.gz) |\n`;
  });

  content += `
## Deployment

Each application directory contains:

- \`index.html\` - Optimized single-file application
- \`index.html.gz\` - Pre-compressed with Gzip
- \`index.html.br\` - Pre-compressed with Brotli (if available)

### Web Server Configuration

#### Nginx
\`\`\`nginx
location / {
    # Serve pre-compressed files
    gzip_static on;
    brotli_static on;
    
    # Cache headers
    expires 1y;
    add_header Cache-Control "public, immutable";
}
\`\`\`

#### Apache
\`\`\`apache
# Enable pre-compressed files
LoadModule rewrite_module modules/mod_rewrite.so

RewriteEngine On
RewriteCond %{HTTP:Accept-Encoding} gzip
RewriteCond %{REQUEST_FILENAME}.gz -f
RewriteRule ^(.*)$ $1.gz [L]

<FilesMatch "\\.gz$">
    AddEncoding gzip .gz
</FilesMatch>
\`\`\`

#### Caddy
\`\`\`
{
    encode {
        precompressed gzip br
    }
    
    header {
        Cache-Control "public, max-age=31536000, immutable"
    }
}
\`\`\`

## Performance Metrics

- **Page Size Budget:** ≤14KB gzipped
- **Target Performance:**
  - First Contentful Paint: <1 second
  - Time to Interactive: <2 seconds
  - Cumulative Layout Shift: <0.1

## Applications Overview

`;

  buildResults.forEach(result => {
    content += `### ${result.name}\n`;
    content += `- **Size:** ${formatSize(result.rawSize)}KB uncompressed, ${formatSize(result.gzippedSize)}KB gzipped\n`;
    content += `- **Budget:** ${result.withinBudget ? 'Within' : 'Exceeds'} 14KB limit\n`;
    content += `- **Deployment:** Ready for production\n\n`;
  });

  content += `## Usage

### Direct File Serving
Serve the HTML files directly from any web server. Each file is self-contained with inlined CSS and JavaScript.

### CDN Deployment
Upload the optimized files to your CDN with appropriate cache headers for maximum performance.

### Docker Deployment
\`\`\`dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
\`\`\`

---

*Generated by 14KB Web build system*
`;

  return content;
}

function updateRootPackageJson() {
  try {
    const packagePath = 'package.json';
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    
    // Add build-all script if it doesn't exist
    if (!packageJson.scripts['build-all']) {
      packageJson.scripts['build-all'] = 'node scripts/build-all.js';
      writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
      log('  Added build-all script to root package.json', colors.green);
    }
  } catch (error) {
    log(`  Warning: Could not update package.json: ${error.message}`, colors.yellow);
  }
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});