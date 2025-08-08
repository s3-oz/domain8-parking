#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configsDir = path.join(__dirname, '..', 'configs');

// Get all JSON files
const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} config files to update`);

// Don't touch these domains
const skipDomains = ['brewhaus.com.au.json', 'seosem.com.au.json'];

let updated = 0;
let skipped = 0;
let errors = 0;

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
    
    // Update domain for sale
    if (config.domain && typeof config.domain === 'object') {
      config.domain.forSale = true;
    }
    
    // Also enable domain inquiry in controls
    if (config.controls && config.controls.forms) {
      config.controls.forms.domainInquiry = true;
    }
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n');
    updated++;
    
    // Log progress every 50 files
    if (updated % 50 === 0) {
      console.log(`Progress: ${updated} files updated`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    errors++;
  }
});

console.log(`\n✅ Domain Sale Update Complete!`);
console.log(`   Updated: ${updated} configs`);
console.log(`   Skipped: ${skipped} configs (protected)`);
if (errors > 0) {
  console.log(`   ❌ Errors: ${errors} files`);
}