#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';

const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
const engines = packageJson.engines;

if (!engines || !engines.node) {
  console.log('No Node.js version constraint found in package.json');
  process.exit(0);
}

const currentVersion = process.version;
const requiredVersion = engines.node;

// Parse version constraints
const versionRegex = /^>=(\d+\.\d+\.\d+)(?:\s*<(\d+\.\d+\.\d+))?$/;
const match = requiredVersion.match(versionRegex);

if (!match) {
  console.log(`Could not parse version constraint: ${requiredVersion}`);
  process.exit(1);
}

const minVersion = match[1];
const maxVersion = match[2];

// Extract current version numbers
const currentMajor = parseInt(currentVersion.slice(1).split('.')[0]);
const currentMinor = parseInt(currentVersion.slice(1).split('.')[1]);
const currentPatch = parseInt(currentVersion.slice(1).split('.')[2]);

// Extract minimum version numbers
const minMajor = parseInt(minVersion.split('.')[0]);
const minMinor = parseInt(minVersion.split('.')[1]);
const minPatch = parseInt(minVersion.split('.')[2]);

// Check minimum version
const currentVersionNumber = currentMajor * 10000 + currentMinor * 100 + currentPatch;
const minVersionNumber = minMajor * 10000 + minMinor * 100 + minPatch;

if (currentVersionNumber < minVersionNumber) {
  console.error(`❌ Node.js version ${currentVersion} is below minimum required ${minVersion}`);
  console.error(`Please upgrade to Node.js ${minVersion} or later`);
  console.error(`Recommended: Use nvm to install Node.js 22.18.0`);
  console.error(`  nvm install 22.18.0`);
  console.error(`  nvm use 22.18.0`);
  process.exit(1);
}

// Check maximum version if specified
if (maxVersion) {
  const maxMajor = parseInt(maxVersion.split('.')[0]);
  const maxMinor = parseInt(maxVersion.split('.')[1]);
  const maxPatch = parseInt(maxVersion.split('.')[2]);
  const maxVersionNumber = maxMajor * 10000 + maxMinor * 100 + maxPatch;

  if (currentVersionNumber >= maxVersionNumber) {
    console.error(`❌ Node.js version ${currentVersion} is above maximum supported ${maxVersion}`);
    console.error(`Please downgrade to Node.js 22.18.0 for best compatibility`);
    console.error(`  nvm install 22.18.0`);
    console.error(`  nvm use 22.18.0`);
    process.exit(1);
  }
}

console.log(`✅ Node.js version ${currentVersion} meets requirements (${requiredVersion})`);
process.exit(0);