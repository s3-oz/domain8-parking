#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configsDir = path.join(__dirname, '..', 'configs');

// Get all JSON files
const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} config files to check`);

// Skip these domains
const skipDomains = ['brewhaus.com.au.json', 'seosem.com.au.json'];

let fixed = 0;
let skipped = 0;
let errors = 0;

// Valid themes in our system
const validThemes = ['basic', 'professional', 'terminal'];

files.forEach(file => {
  try {
    // Skip protected domains
    if (skipDomains.includes(file)) {
      console.log(`Skipping ${file} (protected domain)`);
      skipped++;
      return;
    }
    
    const filePath = path.join(configsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    
    let needsFix = false;
    
    // Check if template type is not landing
    if (config.template?.type !== 'landing') {
      console.log(`${file}: Template type is '${config.template?.type}' - fixing to 'landing'`);
      config.template.type = 'landing';
      needsFix = true;
    }
    
    // Check if theme is not valid
    if (config.template?.theme && !validThemes.includes(config.template.theme)) {
      console.log(`${file}: Theme '${config.template.theme}' is invalid - fixing to 'basic'`);
      config.template.theme = 'basic';
      needsFix = true;
    }
    
    // If using hero template, need to simplify content boxes
    if (needsFix && config.contentBoxes && !config.contentBoxes.main) {
      // Convert hero content boxes to landing format
      const headline = config.contentBoxes['main-headline']?.content || 
                      config.contentBoxes['hero-headline']?.content ||
                      {};
      
      config.contentBoxes = {
        "main": {
          type: "headline",
          position: "main",
          content: {
            title: headline.title || `Welcome to ${config.domain.name || config.domain}`,
            subtitle: headline.subtitle || config.domain.description || "Coming soon"
          }
        }
      };
      console.log(`  - Simplified content boxes for landing template`);
    }
    
    if (needsFix) {
      // Write back with proper formatting
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n');
      fixed++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    errors++;
  }
});

console.log(`\n✅ Template Fix Complete!`);
console.log(`   Fixed: ${fixed} configs`);
console.log(`   Skipped: ${skipped} configs (protected)`);
console.log(`   Already correct: ${files.length - fixed - skipped - errors} configs`);
if (errors > 0) {
  console.log(`   ❌ Errors: ${errors} files`);
}