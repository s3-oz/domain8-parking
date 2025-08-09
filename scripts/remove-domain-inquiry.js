#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configsDir = path.join(__dirname, '..', 'configs');
const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

console.log(`Removing redundant domainInquiry from ${files.length} config files`);

let updated = 0;

files.forEach(file => {
  try {
    const filePath = path.join(configsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    
    // Remove domainInquiry from controls.forms if it exists
    if (config.controls?.forms?.domainInquiry !== undefined) {
      delete config.controls.forms.domainInquiry;
      
      // Write back with proper formatting
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + '\n');
      updated++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`✅ Removed domainInquiry from ${updated} configs`);
console.log(`   Now using forSale in domain section as single source of truth`);