#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configsDir = path.join(__dirname, '..', 'configs');

// Get all JSON files
const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} config files to update`);

let updated = 0;
let errors = 0;

files.forEach(file => {
  try {
    const filePath = path.join(configsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    
    // Create new ordered config with SEO near the top
    const orderedConfig = {};
    
    // 1. Domain section first
    if (config.domain) {
      orderedConfig.domain = config.domain;
    }
    
    // 2. SEO section second (moved from bottom)
    if (config.seo) {
      orderedConfig.seo = config.seo;
    }
    
    // 3. Template section
    if (config.template) {
      orderedConfig.template = config.template;
    }
    
    // 4. Controls section
    if (config.controls) {
      orderedConfig.controls = config.controls;
    }
    
    // 5. Features section
    if (config.features) {
      orderedConfig.features = config.features;
    }
    
    // 6. Content boxes
    if (config.contentBoxes) {
      orderedConfig.contentBoxes = config.contentBoxes;
    }
    
    // 7. Ads section
    if (config.ads) {
      orderedConfig.ads = config.ads;
    }
    
    // 8. Email capture section
    if (config.emailCapture) {
      orderedConfig.emailCapture = config.emailCapture;
    }
    
    // 9. Any other fields that might exist
    Object.keys(config).forEach(key => {
      if (!orderedConfig[key]) {
        orderedConfig[key] = config[key];
      }
    });
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(orderedConfig, null, 2) + '\n');
    updated++;
    
    // Log progress every 50 files
    if (updated % 50 === 0) {
      console.log(`Progress: ${updated}/${files.length} files updated`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    errors++;
  }
});

console.log(`\n✅ Complete!`);
console.log(`   Updated: ${updated} files`);
if (errors > 0) {
  console.log(`   Errors: ${errors} files`);
}