const fs = require('fs');
const path = require('path');

const configsDir = path.join(__dirname, '..', 'configs');

// Get all JSON files
const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} config files to migrate`);

files.forEach((file, index) => {
  const filePath = path.join(configsDir, file);
  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Skip if already has controls
  if (config.controls) {
    console.log(`${file} already has controls, skipping...`);
    return;
  }
  
  // Add controls section after template
  const newConfig = {
    domain: config.domain,
    template: config.template,
    
    // New controls section
    controls: {
      forms: {
        emailCapture: config.features?.showEmailCapture ?? true,
        domainInquiry: config.domain?.forSale ?? false,
        businessInquiry: false
      },
      ads: {
        globalEnabled: config.ads?.enabled ?? false,
        positions: {
          topBanner: config.contentBoxes?.['ad-top-banner']?.enabled !== false,
          alert: config.contentBoxes?.['ad-alert']?.enabled !== false,
          sidebar: config.contentBoxes?.['ad-sidebar']?.enabled !== false,
          midBanner: config.contentBoxes?.['ad-mid-banner']?.enabled !== false,
          bottomBanner: config.contentBoxes?.['ad-bottom-banner']?.enabled !== false,
          native1: config.contentBoxes?.['ad-native-1']?.enabled !== false,
          native2: config.contentBoxes?.['ad-native-2']?.enabled !== false
        }
      },
      analytics: config.features?.enableAnalytics ?? true
    },
    
    // Keep the rest
    features: config.features,
    contentBoxes: config.contentBoxes,
    ads: config.ads,
    emailCapture: config.emailCapture,
    seo: config.seo
  };
  
  // Write back
  fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2));
  
  if ((index + 1) % 10 === 0) {
    console.log(`Processed ${index + 1}/${files.length} files...`);
  }
});

console.log('Migration complete!');