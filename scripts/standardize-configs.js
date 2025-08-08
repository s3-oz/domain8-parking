#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configsDir = path.join(__dirname, '..', 'configs');

// Get all JSON files
const files = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} config files to standardize`);

// Skip these already-formatted domains
const skipDomains = ['brewhaus.com.au.json', 'seosem.com.au.json'];

let updated = 0;
let skipped = 0;
let errors = 0;

// Helper to generate domain-appropriate content
function generateContent(domainName, keywords = []) {
  const name = domainName.replace('.com.au', '').replace('.net.au', '');
  const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    heroHeadline: {
      title: `Welcome to ${displayName}`,
      subtitle: `Your destination for ${keywords[0] || displayName.toLowerCase()} in Australia. Discover premium services and solutions tailored for Australian businesses and consumers.`
    },
    mainContent: {
      title: "What We Offer",
      description: `${displayName} is coming soon. We're building something special for the Australian market.`,
      items: [
        `Premium ${keywords[0] || 'services'} solutions`,
        "Australian-focused content and services",
        "Expert guidance and support",
        "Innovative tools and resources"
      ]
    },
    features: [
      {
        title: "Australian Owned",
        description: "Proudly Australian owned and operated",
        icon: "🇦🇺"
      },
      {
        title: "Expert Service",
        description: "Professional support when you need it",
        icon: "⭐"
      },
      {
        title: "Coming Soon",
        description: "Register for early access and updates",
        icon: "🚀"
      }
    ],
    cta: {
      text: "Stay Updated",
      buttonText: "Get Early Access",
      description: "Be the first to know when we launch. Join our priority access list."
    }
  };
}

// Helper to determine category from old theme or domain name
function determineCategory(domain, oldTheme) {
  const domainLower = domain.toLowerCase();
  
  // Map old themes to categories
  const themeMap = {
    'ecommerce': 'ecommerce',
    'finance': 'finance',
    'technology': 'technology',
    'professional': 'professional',
    'comparison': 'comparison',
    'creative': 'creative'
  };
  
  if (oldTheme && themeMap[oldTheme]) {
    return themeMap[oldTheme];
  }
  
  // Guess from domain name
  if (domainLower.includes('shop') || domainLower.includes('buy') || domainLower.includes('sale')) {
    return 'ecommerce';
  }
  if (domainLower.includes('finance') || domainLower.includes('loan') || domainLower.includes('money')) {
    return 'finance';
  }
  if (domainLower.includes('tech') || domainLower.includes('web') || domainLower.includes('digital')) {
    return 'technology';
  }
  if (domainLower.includes('compare')) {
    return 'comparison';
  }
  
  return 'professional'; // default
}

files.forEach(file => {
  try {
    // Skip already formatted files
    if (skipDomains.includes(file)) {
      console.log(`Skipping ${file} (already formatted)`);
      skipped++;
      return;
    }
    
    const filePath = path.join(configsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    
    // Check if already in new format (has full domain object with name, status, etc)
    if (config.domain && typeof config.domain === 'object' && config.domain.name) {
      console.log(`Skipping ${file} (already in new format)`);
      skipped++;
      return;
    }
    
    // Extract domain name
    const domainName = typeof config.domain === 'string' ? config.domain : file.replace('.json', '');
    const domainBase = domainName.replace('.com.au', '').replace('.net.au', '');
    
    // Determine category
    const category = determineCategory(domainName, config.template?.theme);
    
    // Generate content
    const generatedContent = generateContent(domainName);
    
    // Build new standardized config
    const newConfig = {
      // 1. Domain section (expanded)
      domain: {
        name: domainName,
        status: "coming_soon",
        forSale: false,
        category: category,
        keywords: [
          domainBase.split('-').join(' '),
          "Australian business",
          "online services",
          category
        ],
        description: `${domainBase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - Premium Australian domain for ${category} services.`,
        logo: "",
        logoSize: "large"
      },
      
      // 2. SEO section (at top for visibility)
      seo: {
        title: `${domainBase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Australian ${category.charAt(0).toUpperCase() + category.slice(1)} Services`,
        description: `Discover ${domainBase.split('-').join(' ')} - your trusted source for ${category} solutions in Australia. Coming soon with premium services tailored for the Australian market.`,
        keywords: [
          domainBase.split('-').join(' '),
          `${category} Australia`,
          "Australian business",
          `${domainBase} services`,
          "online platform Australia"
        ]
      },
      
      // 3. Template section (standardized to landing + basic)
      template: {
        type: "landing",
        theme: "basic",
        colorMode: "light",
        brandColors: {
          primary: "#2563eb",
          secondary: "#1e40af",
          accent: "#3b82f6"
        }
      },
      
      // 4. Controls section (keep existing or use defaults with ads off)
      controls: config.controls || {
        forms: {
          emailCapture: true,
          domainInquiry: false,
          businessInquiry: false
        },
        ads: {
          globalEnabled: false,
          positions: {
            topBanner: false,
            alert: false,
            sidebar: false,
            midBanner: false,
            bottomBanner: false,
            native1: false,
            native2: false
          }
        },
        analytics: true
      },
      
      // 5. Features section
      features: {
        showEmailCapture: true,
        enableAnalytics: true
      },
      
      // 6. Content boxes (standard landing template boxes)
      contentBoxes: {
        "main-headline": {
          type: "headline",
          position: "main-headline",
          content: generatedContent.heroHeadline
        },
        "main-content": {
          type: "content",
          position: "main-content",
          content: generatedContent.mainContent
        },
        "features-grid": {
          type: "features-grid",
          position: "features-grid",
          content: {
            features: generatedContent.features
          }
        },
        "cta-section": {
          type: "cta",
          position: "cta-section",
          content: generatedContent.cta
        }
      },
      
      // 7. Ads section
      ads: {
        enabled: false,
        network: "adsense"
      },
      
      // 8. Email capture section
      emailCapture: {
        headline: "Get Early Access",
        description: `Be the first to know when ${domainBase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} launches. Join our priority access list.`,
        buttonText: "Join Waitlist",
        successMessage: "Success! You're on the list. We'll notify you when we launch."
      }
    };
    
    // Ensure ads are off in controls
    if (newConfig.controls && newConfig.controls.ads) {
      newConfig.controls.ads.globalEnabled = false;
    }
    
    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2) + '\n');
    updated++;
    
    // Log progress every 50 files
    if (updated % 50 === 0) {
      console.log(`Progress: ${updated} files standardized`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    errors++;
  }
});

console.log(`\n✅ Standardization Complete!`);
console.log(`   Updated: ${updated} configs to new format`);
console.log(`   Skipped: ${skipped} configs (already formatted)`);
if (errors > 0) {
  console.log(`   ❌ Errors: ${errors} files`);
}