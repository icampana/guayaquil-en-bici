#!/usr/bin/env node

const menu = require('./data/menu_links.json');
const aliases = require('./data/url_aliases.json');

// Create alias lookup
const aliasMap = {};
aliases.forEach(a => {
  const nid = a.source.replace('node/', '');
  aliasMap[nid] = a.alias;
});

// Get useful menu items (filter out theme examples and duplicates)
const excludeIds = [640, 641, 642, 643, 658, 659, 394, 395]; // Theme layouts and duplicate portfolios
const topLevel = menu.filter(m => m.plid === '0' && !excludeIds.includes(parseInt(m.mlid)));

console.log('Cleaned menu structure:\n');
topLevel.forEach(parent => {
  let path = parent.link_path;
  if (path.startsWith('node/')) {
    const nid = path.replace('node/', '');
    path = aliasMap[nid] || path;
  }
  console.log(`${parent.link_title}: ${path}`);

  const children = menu.filter(m => m.plid === parent.mlid && !excludeIds.includes(parseInt(m.mlid)));
  children.forEach(child => {
    let childPath = child.link_path;
    if (childPath.startsWith('node/')) {
      const nid = childPath.replace('node/', '');
      childPath = aliasMap[nid] || childPath;
    }
    console.log(`  - ${child.link_title}: ${childPath}`);
  });
  console.log('');
});
