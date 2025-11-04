#!/usr/bin/env node
// Fix absolute image URLs in markdown files

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const blogDir = join(__dirname, '../src/content/blog');

// Patterns to match absolute URLs
const patterns = [
  {
    pattern: /https?:\/\/guayaquilenbici\.org\/wp-content\/uploads\//g,
    replacement: '/uploads/wp-content/uploads/'
  },
  {
    pattern: /https?:\/\/guayaquilenbici\.org\/sites\/default\/files\/wp-content\/uploads\//g,
    replacement: '/uploads/wp-content/uploads/'
  },
  {
    // Remove external image references completely (they don't exist locally)
    pattern: /!\[([^\]]*)\]\(https?:\/\/(?!guayaquilenbici\.org)[^\)]+\)(\s*"[^"]*")?/g,
    replacement: '' // Remove the entire markdown image
  }
];

let fixedCount = 0;
let fileCount = 0;

// Scan both blog and pages directories
const directories = [
  { path: join(__dirname, '../src/content/blog'), name: 'blog' },
  { path: join(__dirname, '../src/content/pages'), name: 'pages' }
];

directories.forEach(dir => {
  const files = readdirSync(dir.path).filter(f => f.endsWith('.md'));
  console.log(`\nScanning ${files.length} ${dir.name} files...`);

  files.forEach(file => {
    const filePath = join(dir.path, file);
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;
    let totalFixed = 0;

    // Apply all patterns
    patterns.forEach(({ pattern, replacement }) => {
      const before = content;
      content = content.replace(pattern, replacement);
      if (content !== before) {
        const matches = before.match(pattern);
        const count = matches ? matches.length : 0;
        totalFixed += count;
        modified = true;
      }
    });

    if (modified) {
      // Clean up any double newlines created by removing images
      content = content.replace(/\n\n\n+/g, '\n\n');

      // Write back to file
      writeFileSync(filePath, content, 'utf-8');

      console.log(`✓ Fixed ${totalFixed} URL(s) in: ${file}`);
      fixedCount += totalFixed;
      fileCount++;
    }
  });
});

console.log(`\n✅ Fixed ${fixedCount} absolute URLs in ${fileCount} files`);
