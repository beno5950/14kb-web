#!/usr/bin/env node

import { gzipSize } from 'gzip-size';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const MAX_SIZE = 14 * 1024; // 14KB in bytes
const BUILD_DIRS = ['apps/*/dist', 'apps/*/build'];

function findHtmlFiles(dir) {
  const files = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...findHtmlFiles(fullPath));
      } else if (extname(entry) === '.html') {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Directory doesn't exist, skip
  }
  
  return files;
}

async function checkPageSize(htmlFile) {
  try {
    const html = readFileSync(htmlFile, 'utf8');
    const gzippedSize = await gzipSize(html);
    
    return {
      file: htmlFile,
      size: gzippedSize,
      withinBudget: gzippedSize <= MAX_SIZE,
    };
  } catch (err) {
    console.error(`Error checking ${htmlFile}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Checking 14KB budget for all HTML pages...\n');
  
  const htmlFiles = [];
  
  // Find all HTML files in build directories
  for (const pattern of BUILD_DIRS) {
    const [appsDir, , buildDir] = pattern.split('/');
    try {
      const apps = readdirSync(appsDir);
      for (const app of apps) {
        const buildPath = join(appsDir, app, buildDir);
        htmlFiles.push(...findHtmlFiles(buildPath));
      }
    } catch (err) {
      // Apps directory doesn't exist yet
    }
  }
  
  if (htmlFiles.length === 0) {
    console.log('⚠️  No HTML files found in build directories');
    console.log('Run `pnpm build` first to generate built files');
    return;
  }
  
  const results = await Promise.all(htmlFiles.map(checkPageSize));
  const validResults = results.filter(Boolean);
  
  let allWithinBudget = true;
  
  for (const result of validResults) {
    const status = result.withinBudget ? '✅' : '❌';
    const sizeKB = (result.size / 1024).toFixed(2);
    
    console.log(`${status} ${result.file}: ${sizeKB}KB (gzipped)`);
    
    if (!result.withinBudget) {
      allWithinBudget = false;
      const overageKB = ((result.size - MAX_SIZE) / 1024).toFixed(2);
      console.log(`   ⚠️  Over budget by ${overageKB}KB`);
    }
  }
  
  console.log(`\n📊 Summary: ${validResults.length} pages checked`);
  console.log(`📦 Budget: ${MAX_SIZE / 1024}KB (gzipped) per page`);
  
  if (allWithinBudget) {
    console.log('🎉 All pages are within the 14KB budget!');
    process.exit(0);
  } else {
    console.log('💥 Some pages exceed the 14KB budget');
    process.exit(1);
  }
}

main().catch(console.error);