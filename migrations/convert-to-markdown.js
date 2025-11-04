#!/usr/bin/env node

/**
 * Drupal to Markdown Conversion Script
 *
 * Converts exported Drupal JSON data to Markdown files
 * with proper frontmatter for Astro content collections
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import TurndownService from 'turndown';
import slugify from 'slugify';

// Initialize Turndown for HTML to Markdown conversion
const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

const DATA_DIR = './migrations/data';
const CONTENT_DIR = './src/content';

// Content type to collection mapping
const TYPE_MAPPING = {
  'blog_post': 'blog',
  'page': 'pages',
  'our_service': 'services',
  'video': 'videos',
  'banner': 'banners',
};

// Helper: Check if content contains lorem ipsum
function isLoremIpsum(text) {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  const loremPatterns = [
    'lorem ipsum',
    'dolor sit amet',
    'consectetur adipiscing',
    'sed do eiusmod',
    'tempor incididunt',
    'ut labore et dolore',
  ];
  return loremPatterns.some(pattern => lowerText.includes(pattern));
}

// Helper: Load JSON file
function loadJSON(filename) {
  try {
    const path = join(DATA_DIR, filename);
    if (!existsSync(path)) {
      console.warn(`⚠️  File not found: ${filename}`);
      return [];
    }
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
    return [];
  }
}

// Helper: Create slug from title
function createSlug(title) {
  return slugify(title, { lower: true, strict: true, locale: 'es' });
}

// Helper: Convert timestamp to ISO date
function timestampToDate(timestamp) {
  return new Date(parseInt(timestamp) * 1000).toISOString();
}

// Helper: Decode HTML entities
function decodeHTMLEntities(text) {
  const entities = {
    '&nbsp;': ' ',
    '&iquest;': '¿',
    '&iexcl;': '¡',
    '&aacute;': 'á',
    '&eacute;': 'é',
    '&iacute;': 'í',
    '&oacute;': 'ó',
    '&uacute;': 'ú',
    '&ntilde;': 'ñ',
    '&Aacute;': 'Á',
    '&Eacute;': 'É',
    '&Iacute;': 'Í',
    '&Oacute;': 'Ó',
    '&Uacute;': 'Ú',
    '&Ntilde;': 'Ñ',
    '&uuml;': 'ü',
    '&Uuml;': 'Ü',
    '&amp;': '&',
    '&quot;': '"',
    '&lt;': '<',
    '&gt;': '>',
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replaceAll(entity, char);
  }
  return decoded;
}

// Helper: Clean HTML and convert to Markdown
function htmlToMarkdown(html) {
  if (!html) return '';

  // Remove Drupal-specific classes and attributes
  let cleaned = html
    .replace(/class="[^"]*"/g, '')
    .replace(/id="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/<p>\s*&nbsp;\s*<\/p>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\\n/g, '\n')
    .trim();

  // Decode HTML entities
  cleaned = decodeHTMLEntities(cleaned);

  // Convert to markdown
  let markdown = turndown.turndown(cleaned);

  // Clean up excessive newlines
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  return markdown;
}

// Helper: Get file path from URI
function getFilePathFromUri(uri) {
  if (!uri) return null;
  // Convert public://path/to/file.jpg to /uploads/path/to/file.jpg
  return uri.replace('public://', '/uploads/');
}

// Load all data
console.log('📂 Loading exported data...\n');
const nodes = loadJSON('nodes.json');
const bodies = loadJSON('bodies.json');
const terms = loadJSON('taxonomy_terms.json');
const vocabs = loadJSON('vocabularies.json');
const termRefs = loadJSON('term_references.json');
const images = loadJSON('images.json');
const files = loadJSON('files.json');
const videos = loadJSON('videos.json');
const icons = loadJSON('icons.json');
const links = loadJSON('links.json');
const aliases = loadJSON('url_aliases.json');

// Create indexes for fast lookup
const bodyByNid = {};
bodies.forEach(b => bodyByNid[b.nid] = b);

const termById = {};
terms.forEach(t => termById[t.tid] = t);

const vocabById = {};
vocabs.forEach(v => vocabById[v.vid] = v);

const fileById = {};
files.forEach(f => fileById[f.fid] = f);

const imagesByNid = {};
images.forEach(img => {
  if (!imagesByNid[img.nid]) imagesByNid[img.nid] = [];
  imagesByNid[img.nid].push(img);
});

const videosByNid = {};
videos.forEach(v => videosByNid[v.nid] = v);

const iconsByNid = {};
icons.forEach(i => iconsByNid[i.nid] = i);

const linksByNid = {};
links.forEach(l => linksByNid[l.nid] = l);

const termRefsByNid = {};
termRefs.forEach(tr => {
  if (!termRefsByNid[tr.nid]) termRefsByNid[tr.nid] = [];
  termRefsByNid[tr.nid].push(tr.tid);
});

const aliasesByNid = {};
aliases.forEach(a => {
  const nid = a.source.replace('node/', '');
  aliasesByNid[nid] = a.alias;
});

// Statistics
const stats = {
  total: 0,
  converted: 0,
  skipped: 0,
  loremIpsum: 0,
  byType: {}
};

console.log('🔄 Converting content to Markdown...\n');

// Process each node
nodes.forEach(node => {
  stats.total++;

  // Skip unpublished content
  if (node.status === '0') {
    stats.skipped++;
    return;
  }

  // Get content type collection
  const collection = TYPE_MAPPING[node.type];
  if (!collection) {
    console.log(`⚠️  Skipping unknown type: ${node.type} (${node.title})`);
    stats.skipped++;
    return;
  }

  // Get body content
  const body = bodyByNid[node.nid];
  const bodyText = body?.body_value || '';
  const summary = body?.body_summary || '';

  // Check for lorem ipsum
  if (isLoremIpsum(node.title) || isLoremIpsum(bodyText) || isLoremIpsum(summary)) {
    console.log(`🚫 Skipping lorem ipsum: ${node.title}`);
    stats.loremIpsum++;
    stats.skipped++;
    return;
  }

  // Skip if no meaningful content
  if (!bodyText && !summary && node.type !== 'banner') {
    console.log(`⚠️  Skipping empty content: ${node.title}`);
    stats.skipped++;
    return;
  }

  // Build frontmatter based on content type
  const frontmatter = {
    title: node.title,
  };

  // Add excerpt
  if (summary) {
    frontmatter.excerpt = decodeHTMLEntities(summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).substring(0, 200);
  } else if (bodyText) {
    const plainText = decodeHTMLEntities(bodyText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
    frontmatter.excerpt = plainText.substring(0, 200);
  }

  // Add publish date for blog posts
  if (collection === 'blog') {
    frontmatter.publishDate = timestampToDate(node.created);
    frontmatter.publish = true;

    // Add categories
    const nodeTerms = termRefsByNid[node.nid] || [];
    const categories = [];
    const tags = [];

    nodeTerms.forEach(tid => {
      const term = termById[tid];
      if (term) {
        const vocab = vocabById[term.vid];
        if (vocab) {
          if (vocab.machine_name === 'blog_categories') {
            categories.push(createSlug(term.name));
          } else if (vocab.machine_name === 'tags') {
            tags.push(term.name);
          }
        }
      }
    });

    if (categories.length > 0) {
      frontmatter.categories = categories;
    }
    if (tags.length > 0) {
      frontmatter.tags = tags;
    }
  }

  // Add featured image
  const nodeImages = imagesByNid[node.nid];
  if (nodeImages && nodeImages.length > 0) {
    const imageFile = fileById[nodeImages[0].fid];
    if (imageFile) {
      const imagePath = getFilePathFromUri(imageFile.uri);
      if (collection === 'blog') {
        frontmatter.featuredImage = imagePath;
      } else if (collection === 'banners') {
        frontmatter.image = imagePath;
      }
    }
  }

  // Add type-specific fields
  if (collection === 'services') {
    const icon = iconsByNid[node.nid];
    if (icon?.icon_value) {
      frontmatter.icon = icon.icon_value;
    }

    const link = linksByNid[node.nid];
    if (link?.url) {
      frontmatter.link = link.url;
    }

    frontmatter.order = parseInt(node.nid) % 10; // Simple ordering
  }

  if (collection === 'videos') {
    const video = videosByNid[node.nid];
    if (video?.fid) {
      const videoFile = fileById[video.fid];
      if (videoFile) {
        frontmatter.videoUrl = getFilePathFromUri(videoFile.uri);
      }
    }

    // Try to extract video category
    const nodeTerms = termRefsByNid[node.nid] || [];
    nodeTerms.forEach(tid => {
      const term = termById[tid];
      if (term) {
        const vocab = vocabById[term.vid];
        if (vocab?.machine_name === 'categoria_videos') {
          frontmatter.category = term.name;
        }
      }
    });
  }

  if (collection === 'banners') {
    const link = linksByNid[node.nid];
    if (link?.url) {
      frontmatter.link = link.url;
    }
    frontmatter.order = parseInt(node.nid) % 10;
    frontmatter.active = true;
  }

  if (collection === 'pages') {
    frontmatter.publish = true;
  }

  // Convert body to Markdown
  const markdown = htmlToMarkdown(bodyText);

  // Create filename
  const slug = aliasesByNid[node.nid]
    ? aliasesByNid[node.nid].split('/').pop()
    : createSlug(node.title);
  const filename = `${slug}.md`;

  // Ensure directory exists
  const collectionDir = join(CONTENT_DIR, collection);
  mkdirSync(collectionDir, { recursive: true });

  // Generate file content
  const yamlFrontmatter = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return null;
        return `${key}:\n${value.map(v => `  - ${JSON.stringify(v)}`).join('\n')}`;
      }
      return `${key}: ${JSON.stringify(value)}`;
    })
    .filter(Boolean)
    .join('\n');

  const fileContent = `---
${yamlFrontmatter}
---

${markdown}
`;

  // Write file
  const filepath = join(collectionDir, filename);
  writeFileSync(filepath, fileContent);

  stats.converted++;
  if (!stats.byType[collection]) stats.byType[collection] = 0;
  stats.byType[collection]++;

  console.log(`✅ ${collection}/${filename}`);
});

// Summary
console.log('\n📊 Conversion Summary:');
console.log('==================');
console.log(`Total nodes: ${stats.total}`);
console.log(`Converted: ${stats.converted}`);
console.log(`Skipped: ${stats.skipped}`);
console.log(`  - Lorem ipsum: ${stats.loremIpsum}`);
console.log(`  - Other reasons: ${stats.skipped - stats.loremIpsum}`);
console.log('\nBy content type:');
Object.entries(stats.byType).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});
console.log('\n✨ Conversion complete!\n');
