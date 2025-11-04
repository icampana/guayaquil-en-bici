#!/usr/bin/env node
// Generate Netlify _redirects file from Drupal URL aliases

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load URL aliases
const aliases = JSON.parse(readFileSync(join(__dirname, 'data/url_aliases.json'), 'utf-8'));

// Get all created markdown files
const contentDir = join(__dirname, '../src/content');
const blogFiles = readdirSync(join(contentDir, 'blog')).map(f => basename(f, '.md'));
const pageFiles = readdirSync(join(contentDir, 'pages')).map(f => basename(f, '.md'));
const bannerFiles = readdirSync(join(contentDir, 'banners')).map(f => basename(f, '.md'));
const serviceFiles = readdirSync(join(contentDir, 'services')).map(f => basename(f, '.md'));
const videoFiles = readdirSync(join(contentDir, 'videos')).map(f => basename(f, '.md'));

// Helper to extract slug from URL
function extractSlug(url) {
  // Remove date prefix (YYYY/MM/DD/)
  const withoutDate = url.replace(/^\d{4}\/\d{2}\/\d{2}\//, '');
  // Remove prefixes like 'blog/', 'content/', 'informacion-ciclista/', 'actividades/', 'masa-critica/'
  const withoutPrefix = withoutDate.replace(/^(blog\/|content\/|informacion-ciclista\/|actividades\/|masa-critica\/|tienda\/producto\/)/, '');
  // Decode URL-encoded characters
  return decodeURIComponent(withoutPrefix);
}

// Build redirect rules
const redirects = [];
const notFound = [];

// Process each alias
aliases.forEach(({ source, alias }) => {
  const nodeId = source.replace('node/', '');
  const slug = extractSlug(alias);

  // Skip theme example pages
  const themePages = ['home', 'contact-us', 'styleguide', 'no-sidebar', 'two-sidebars', 'right-sidebar', 'left-sidebar'];
  if (themePages.includes(alias)) {
    return;
  }

  // Skip URLs with special characters that couldn't be converted
  if (alias.includes('%c2%bf')) {
    return; // Skip "¿quienes-asisten-a-los-ciclopaseos" - has encoding issue
  }

  // Determine new URL based on content type
  let newUrl = null;

  // Check if it's a blog post
  if (blogFiles.includes(slug)) {
    newUrl = `/blog/${slug}`;
  }
  // Check if it's a page
  else if (pageFiles.includes(slug)) {
    newUrl = `/${slug}`;
  }
  // Check if it's a banner (usually redirects to homepage or relevant page)
  else if (bannerFiles.includes(slug)) {
    newUrl = '/'; // Banners typically redirect to homepage
  }
  // Check if it's a service
  else if (serviceFiles.includes(slug)) {
    newUrl = `/#services`; // Services are typically on homepage
  }
  // Check if it's a video
  else if (videoFiles.includes(slug)) {
    newUrl = `/#videos`; // Videos section on homepage
  }
  // Special case: manifiesto ciudadano (it's a blog post but might have special path)
  else if (slug.includes('manifiesto-ciudadano')) {
    const possibleSlug = 'manifiesto-ciudadano-por-el-derecho-a-circular-y-pedalear-en-condiciones-dignas';
    if (blogFiles.includes(possibleSlug)) {
      newUrl = `/blog/${possibleSlug}`;
    }
  }
  // Special case: campana la bicicleta (campaign page)
  else if (slug.includes('campana-la-bicicleta')) {
    const possibleSlug = 'campana-la-bicicleta-como-derecho-humano';
    if (blogFiles.includes(possibleSlug)) {
      newUrl = `/blog/${possibleSlug}`;
    }
  }
  // Special redirects for old event/form pages that don't exist anymore
  else if (slug.includes('formulario') || slug.includes('inscripcion') || slug.includes('reserva')) {
    newUrl = '/contactanos'; // Forms redirect to contact page
  }

  if (newUrl) {
    // Add redirect from node/XXX to new URL
    redirects.push(`/node/${nodeId} ${newUrl} 301`);

    // Add redirect from old alias to new URL (if different)
    const oldPath = `/${alias}`;
    if (oldPath !== newUrl) {
      redirects.push(`${oldPath} ${newUrl} 301`);
    }
  } else {
    notFound.push(`# Not found: /node/${nodeId} (${alias}) -> slug: ${slug}`);
  }
});

// Add manual redirects for specific unmapped URLs
const manualRedirects = [
  '# Manual redirects for important pages',
  '/node/222 /contactanos 301  # Como formar parte del colectivo',
  '/node/240 /contactanos 301  # Como puedo ser parte del colectivo',
  '/node/57 /masa-critica 301  # Masa critica de Guayaquil',
  '/node/56 /blog 301  # Conociendo los policiclos',
  '/node/241 / 301  # Tienda producto (jarro GEB)',
  '/node/224 /blog 301  # Pedaleada isla santay',
  '/node/228 /alley-cat-guayaquil 301  # Primer gato de independencia',
  '/node/235 /blog 301  # Prestamo de bicicletas',
  '/node/238 /blog 301  # Rodada de altura 2015',
  '/node/243 /blog 301  # Encuesta diagnostico',
  '',
  '# Blog posts with date prefixes in alias',
  '/blog/2014/07/01/de-una-ciudad-turistica-una-ciudad-con-movilidad-amigable /blog 301',
  '/blog/2015/05/20/las-preguntas-que-olvido-ant /blog 301',
  '',
];

// Add special redirects for common patterns
const specialRedirects = [
  '# Homepage',
  '/ /index.html 200',
  '',
  '# Blog main page',
  '/blog /blog/index.html 200',
  '',
  '# Catch-all for old Drupal paths',
  '/node/* /404 404',
  '',
  '# Catch-all 404',
  '/* /404 404',
];

// Generate _redirects content
const redirectsContent = [
  '# Netlify Redirects - Generated from Drupal URL aliases',
  '# https://docs.netlify.com/routing/redirects/',
  '',
  '# Old Drupal URLs to new Astro URLs',
  '',
  ...redirects,
  '',
  ...manualRedirects,
  '',
  ...specialRedirects,
  '',
  '# URLs that could not be mapped:',
  ...notFound,
].join('\n');

// Write to public/_redirects
const outputPath = join(__dirname, '../public/_redirects');
writeFileSync(outputPath, redirectsContent, 'utf-8');

const manualCount = manualRedirects.filter(r => r.startsWith('/')).length;
console.log(`✅ Generated ${redirects.length} automatic redirect rules`);
console.log(`➕ Added ${manualCount} manual redirects`);
console.log(`⚠️  ${notFound.length} URLs remaining unmapped (see report)`);
console.log(`📝 Redirects file: ${outputPath}`);

// Also generate a report
const reportPath = join(__dirname, 'data/redirects-report.txt');
writeFileSync(reportPath, redirectsContent, 'utf-8');
console.log(`📊 Report saved to: ${reportPath}`);
