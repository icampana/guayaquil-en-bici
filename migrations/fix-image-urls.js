#!/usr/bin/env node
// Fix absolute image URLs in markdown files

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const blogDir = join(__dirname, '../src/content/blog');

// Pattern to match absolute URLs
const absoluteUrlPattern = /http:\/\/guayaquilenbici\.org\/wp-content\/uploads\//g;
const replacement = '/uploads/wp-content/uploads/';

let fixedCount = 0;
let fileCount = 0;

// Get all markdown files
const files = readdirSync(blogDir).filter(f => f.endsWith('.md'));

console.log(`Scanning ${files.length} blog posts...`);

files.forEach(file => {
  const filePath = join(blogDir, file);
  let content = readFileSync(filePath, 'utf-8');

  // Check if file contains absolute URLs
  if (content.includes('http://guayaquilenbici.org/wp-content/uploads/')) {
    const matches = content.match(absoluteUrlPattern);
    const count = matches ? matches.length : 0;

    // Replace absolute URLs with relative paths
    const newContent = content.replace(absoluteUrlPattern, replacement);

    // Write back to file
    writeFileSync(filePath, newContent, 'utf-8');

    console.log(`✓ Fixed ${count} URL(s) in: ${file}`);
    fixedCount += count;
    fileCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} absolute URLs in ${fileCount} files`);
