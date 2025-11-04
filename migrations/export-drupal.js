#!/usr/bin/env node

/**
 * Drupal 7 to Astro Migration Script
 *
 * This script exports content from the Drupal 7 database running in Docker
 * and saves it to JSON files for processing into Markdown format.
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const DOCKER_CONTAINER = 'geb-db-1';
const DB_USER = 'drupal';
const DB_PASS = 'drupal';
const DB_NAME = 'drupal';
const OUTPUT_DIR = './migrations/data';

// Ensure output directory exists
mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Execute a MySQL query via Docker with proper UTF-8 encoding
 */
function query(sql) {
  try {
    const command = `docker exec ${DOCKER_CONTAINER} mysql -u ${DB_USER} -p${DB_PASS} ${DB_NAME} --default-character-set=utf8mb4 -e "${sql.replace(/"/g, '\\"')}" --batch --skip-column-names`;
    const result = execSync(command, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    return result.trim();
  } catch (error) {
    console.error('Query error:', error.message);
    return '';
  }
}

/**
 * Parse tab-separated MySQL output into array of objects
 */
function parseResult(result, columns) {
  if (!result) return [];

  const lines = result.split('\n');
  return lines.map(line => {
    const values = line.split('\t');
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = values[i] === 'NULL' ? null : values[i];
    });
    return obj;
  });
}

console.log('🚀 Starting Drupal content export...\n');

// 1. Export all nodes
console.log('📄 Exporting nodes...');
const nodesQuery = `
  SELECT
    nid, type, language, title, uid, status, created, changed
  FROM node
  ORDER BY type, created
`;
const nodesResult = query(nodesQuery);
const nodes = parseResult(nodesResult, ['nid', 'type', 'language', 'title', 'uid', 'status', 'created', 'changed']);
writeFileSync(join(OUTPUT_DIR, 'nodes.json'), JSON.stringify(nodes, null, 2));
console.log(`✅ Exported ${nodes.length} nodes\n`);

// 2. Export node body content
console.log('📝 Exporting node bodies...');
const bodiesQuery = `
  SELECT
    entity_id as nid, body_value, body_summary, body_format
  FROM field_data_body
`;
const bodiesResult = query(bodiesQuery);
const bodies = parseResult(bodiesResult, ['nid', 'body_value', 'body_summary', 'body_format']);
writeFileSync(join(OUTPUT_DIR, 'bodies.json'), JSON.stringify(bodies, null, 2));
console.log(`✅ Exported ${bodies.length} node bodies\n`);

// 3. Export blog categories (taxonomy)
console.log('🏷️  Exporting taxonomy terms...');
const termsQuery = `
  SELECT
    tid, vid, name, description, weight
  FROM taxonomy_term_data
  ORDER BY vid, weight
`;
const termsResult = query(termsQuery);
const terms = parseResult(termsResult, ['tid', 'vid', 'name', 'description', 'weight']);
writeFileSync(join(OUTPUT_DIR, 'taxonomy_terms.json'), JSON.stringify(terms, null, 2));
console.log(`✅ Exported ${terms.length} taxonomy terms\n`);

// 4. Export taxonomy vocabularies
console.log('📚 Exporting vocabularies...');
const vocabsQuery = `
  SELECT
    vid, name, machine_name, description
  FROM taxonomy_vocabulary
`;
const vocabsResult = query(vocabsQuery);
const vocabs = parseResult(vocabsResult, ['vid', 'name', 'machine_name', 'description']);
writeFileSync(join(OUTPUT_DIR, 'vocabularies.json'), JSON.stringify(vocabs, null, 2));
console.log(`✅ Exported ${vocabs.length} vocabularies\n`);

// 5. Export term relationships (which terms are assigned to which nodes)
console.log('🔗 Exporting term relationships...');
const termRefsQuery = `
  SELECT
    entity_id as nid, field_blog_categories_tid as tid
  FROM field_data_field_blog_categories
  UNION ALL
  SELECT
    entity_id as nid, field_tags_tid as tid
  FROM field_data_field_tags
  UNION ALL
  SELECT
    entity_id as nid, field_video_category_tid as tid
  FROM field_data_field_video_category
`;
const termRefsResult = query(termRefsQuery);
const termRefs = parseResult(termRefsResult, ['nid', 'tid']);
writeFileSync(join(OUTPUT_DIR, 'term_references.json'), JSON.stringify(termRefs, null, 2));
console.log(`✅ Exported ${termRefs.length} term relationships\n`);

// 6. Export images
console.log('🖼️  Exporting image references...');
const imagesQuery = `
  SELECT
    entity_id as nid, 'image' as field_type, field_image_fid as fid, field_image_alt as alt, field_image_title as title
  FROM field_data_field_image
  UNION ALL
  SELECT
    entity_id as nid, 'banner' as field_type, field_imagen_banner_fid as fid, field_imagen_banner_alt as alt, field_imagen_banner_title as title
  FROM field_data_field_imagen_banner
  UNION ALL
  SELECT
    entity_id as nid, 'product' as field_type, field_foto_producto_fid as fid, field_foto_producto_alt as alt, field_foto_producto_title as title
  FROM field_data_field_foto_producto
`;
const imagesResult = query(imagesQuery);
const images = parseResult(imagesResult, ['nid', 'field_type', 'fid', 'alt', 'title']);
writeFileSync(join(OUTPUT_DIR, 'images.json'), JSON.stringify(images, null, 2));
console.log(`✅ Exported ${images.length} image references\n`);

// 7. Export file metadata
console.log('📎 Exporting file metadata...');
const filesQuery = `
  SELECT
    fid, uid, filename, uri, filemime, filesize, status, timestamp
  FROM file_managed
`;
const filesResult = query(filesQuery);
const files = parseResult(filesResult, ['fid', 'uid', 'filename', 'uri', 'filemime', 'filesize', 'status', 'timestamp']);
writeFileSync(join(OUTPUT_DIR, 'files.json'), JSON.stringify(files, null, 2));
console.log(`✅ Exported ${files.length} file records\n`);

// 8. Export video files
console.log('🎥 Exporting video file references...');
const videosQuery = `
  SELECT
    entity_id as nid, field_video_fid as fid, field_video_description as description
  FROM field_data_field_video
`;
const videosResult = query(videosQuery);
const videos = parseResult(videosResult, ['nid', 'fid', 'description']);
writeFileSync(join(OUTPUT_DIR, 'videos.json'), JSON.stringify(videos, null, 2));
console.log(`✅ Exported ${videos.length} video file references\n`);

// 9. Export icons (for services)
console.log('🎨 Exporting icon values...');
const iconsQuery = `
  SELECT
    entity_id as nid, field_icon_value as icon_value
  FROM field_data_field_icon
`;
const iconsResult = query(iconsQuery);
const icons = parseResult(iconsResult, ['nid', 'icon_value']);
writeFileSync(join(OUTPUT_DIR, 'icons.json'), JSON.stringify(icons, null, 2));
console.log(`✅ Exported ${icons.length} icon values\n`);

// 10. Export links (for services and banners)
console.log('🔗 Exporting links...');
const linksQuery = `
  SELECT
    entity_id as nid, field_enlace_url as url, field_enlace_title as title
  FROM field_data_field_enlace
`;
const linksResult = query(linksQuery);
const links = parseResult(linksResult, ['nid', 'url', 'title']);
writeFileSync(join(OUTPUT_DIR, 'links.json'), JSON.stringify(links, null, 2));
console.log(`✅ Exported ${links.length} link references\n`);

// 11. Export menu links
console.log('🍔 Exporting menu links...');
const menuQuery = `
  SELECT
    mlid, menu_name, link_path, link_title, plid, weight, depth, has_children
  FROM menu_links
  WHERE menu_name = 'main-menu'
  ORDER BY weight, link_title
`;
const menuResult = query(menuQuery);
const menuLinks = parseResult(menuResult, ['mlid', 'menu_name', 'link_path', 'link_title', 'plid', 'weight', 'depth', 'has_children']);
writeFileSync(join(OUTPUT_DIR, 'menu_links.json'), JSON.stringify(menuLinks, null, 2));
console.log(`✅ Exported ${menuLinks.length} menu items\n`);

// 12. Export URL aliases (for SEO)
console.log('🔗 Exporting URL aliases...');
const aliasesQuery = `
  SELECT
    source, alias, language
  FROM url_alias
  WHERE source LIKE 'node/%'
  ORDER BY source
`;
const aliasesResult = query(aliasesQuery);
const aliases = parseResult(aliasesResult, ['source', 'alias', 'language']);
writeFileSync(join(OUTPUT_DIR, 'url_aliases.json'), JSON.stringify(aliases, null, 2));
console.log(`✅ Exported ${aliases.length} URL aliases\n`);

// Summary
console.log('📊 Export Summary:');
console.log('================');
console.log(`Nodes: ${nodes.length}`);
console.log(`Bodies: ${bodies.length}`);
console.log(`Taxonomies: ${terms.length} terms in ${vocabs.length} vocabularies`);
console.log(`Images: ${images.length}`);
console.log(`Files: ${files.length}`);
console.log(`Videos: ${videos.length}`);
console.log(`Icons: ${icons.length}`);
console.log(`Links: ${links.length}`);
console.log(`Menu items: ${menuLinks.length}`);
console.log(`URL aliases: ${aliases.length}`);
console.log('\n✨ Export complete! Data saved to migrations/data/\n');
