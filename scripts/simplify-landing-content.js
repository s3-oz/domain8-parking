#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configsDir = path.join(__dirname, '..', 'configs');

// Get all JSON files
const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} config files to simplify`);

// Don't touch these domains as they have custom content
const skipDomains = ['brewhaus.com.au.json', 'seosem.com.au.json', 'hero-demo.com.au.json', 'landing-demo.com.au.json'];

let updated = 0;
let skipped = 0;
let errors = 0;

files.forEach(file => {
  try {
    // Skip protected domains
    if (skipDomains.includes(file)) {
      console.log(`Skipping ${file} (custom content)`);
      skipped++;
      return;
    }
    
    const filePath = path.join(configsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    
    // Only fix landing templates
    if (config.template?.type !== 'landing') {
      skipped++;
      return;
    }
    
    // Simplify contentBoxes for landing template - just the main headline
    config.contentBoxes = {
      "main": {
        type: "headline",
        position: "main",
        content: {
          title: config.contentBoxes?.main?.content?.title || `Welcome to ${config.domain.name.replace('.com.au', '').replace('.net.au', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
          subtitle: config.contentBoxes?.main?.content?.subtitle || config.domain.description || "Your premium Australian domain. Coming soon."
        }
      }
    };
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n');
    updated++;
    
    // Log progress every 50 files
    if (updated % 50 === 0) {
      console.log(`Progress: ${updated} files simplified`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    errors++;
  }
});

console.log(`\n✅ Landing Content Simplification Complete!`);
console.log(`   Updated: ${updated} configs`);
console.log(`   Skipped: ${skipped} configs`);
if (errors > 0) {
  console.log(`   ❌ Errors: ${errors} files`);
}