#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { checkDomain8Status } from '../lib/domain8-integration'

const DOMAIN8_CSV = process.env.DOMAIN8_CSV || '/Users/oz/Sites/domain8/data/domain_list.csv'
const CONFIGS_DIR = path.join(process.cwd(), 'configs')

interface DomainRecord {
  Name: string
  'Business Idea': string
  'Model Type': string
  'Totals Revenue'?: string
  'Totals CTR'?: string
  'Traffic Source'?: string
}

interface DeploymentResult {
  domain: string
  status: 'deployed' | 'skipped' | 'error'
  reason: string
  config?: any
}

async function readDomainList(): Promise<DomainRecord[]> {
  try {
    const csvContent = fs.readFileSync(DOMAIN8_CSV, 'utf-8')
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      skip_records_with_error: true
    })
    return records
  } catch (error) {
    console.error('Error reading domain list:', error)
    return []
  }
}

function selectTemplate(domain: DomainRecord): 'landing' | 'hero' {
  // Hero template for more complex businesses
  const heroKeywords = ['directory', 'platform', 'comparison', 'community', 'membership', 'marketplace']
  const modelType = domain['Model Type']?.toLowerCase() || ''
  
  for (const keyword of heroKeywords) {
    if (modelType.includes(keyword)) {
      return 'hero'
    }
  }
  
  // Default to landing for simpler sites
  return 'landing'
}

function selectTheme(domain: DomainRecord): string {
  const businessIdea = domain['Business Idea']?.toLowerCase() || ''
  const modelType = domain['Model Type']?.toLowerCase() || ''
  
  // Technology theme
  if (businessIdea.includes('tech') || businessIdea.includes('software') || businessIdea.includes('app')) {
    return 'technology'
  }
  
  // Finance theme
  if (businessIdea.includes('insurance') || businessIdea.includes('loan') || businessIdea.includes('finance') || 
      businessIdea.includes('money') || businessIdea.includes('investment')) {
    return 'finance'
  }
  
  // Ecommerce theme
  if (modelType.includes('e-commerce') || businessIdea.includes('shop') || businessIdea.includes('store')) {
    return 'ecommerce'
  }
  
  // Professional theme
  if (businessIdea.includes('lawyer') || businessIdea.includes('service') || businessIdea.includes('consulting')) {
    return 'professional'
  }
  
  // Creative theme
  if (businessIdea.includes('art') || businessIdea.includes('design') || businessIdea.includes('creative')) {
    return 'creative'
  }
  
  // Comparison theme
  if (modelType.includes('comparison') || businessIdea.includes('compare')) {
    return 'comparison'
  }
  
  // Default to basic
  return 'basic'
}

function determineAdNetwork(domain: DomainRecord): string {
  const revenue = domain['Totals Revenue']
  const ctr = domain['Totals CTR']
  
  // If has revenue history, use adsense
  if (revenue && parseFloat(revenue.replace('$', '')) > 0) {
    return 'adsense'
  }
  
  // If good CTR, enable ads
  if (ctr && parseFloat(ctr.replace('%', '')) > 5) {
    return 'adsense'
  }
  
  return 'none'
}

async function generateConfig(domain: DomainRecord): Promise<any> {
  const template = selectTemplate(domain)
  const theme = selectTheme(domain)
  const adNetwork = determineAdNetwork(domain)
  
  const config = {
    domain: domain.Name,
    template: {
      type: template,
      theme: theme
    },
    content: {
      title: domain.Name.replace('.com.au', '').replace(/-/g, ' ').split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      tagline: `Welcome to ${domain.Name}`,
      description: domain['Business Idea'] || `Welcome to ${domain.Name}`,
      contentBoxes: {
        'main': {
          type: 'text',
          content: domain['Business Idea'] || `Content for ${domain.Name}`,
          aiPrompt: `Generate engaging content for a ${domain['Model Type']} website about: ${domain['Business Idea']}`
        }
      }
    },
    monetization: {
      forSale: true,
      price: "$2,500",
      ads: {
        enabled: adNetwork !== 'none',
        network: adNetwork !== 'none' ? adNetwork : undefined
      }
    }
  }
  
  // Add hero-specific content boxes
  if (template === 'hero') {
    config.content.contentBoxes['hero-headline'] = {
      type: 'text',
      content: `Discover ${config.content.title}`,
      aiPrompt: `Generate a compelling headline for: ${domain['Business Idea']}`
    }
    config.content.contentBoxes['hero-cta'] = {
      type: 'button',
      content: 'Get Started',
      aiPrompt: `Generate a call-to-action button text for: ${domain['Model Type']}`
    }
    config.content.contentBoxes['feature-1'] = {
      type: 'feature',
      title: 'Feature 1',
      content: 'Key feature description',
      aiPrompt: `Generate first key feature for: ${domain['Business Idea']}`
    }
    config.content.contentBoxes['feature-2'] = {
      type: 'feature',
      title: 'Feature 2',
      content: 'Key feature description',
      aiPrompt: `Generate second key feature for: ${domain['Business Idea']}`
    }
    config.content.contentBoxes['feature-3'] = {
      type: 'feature',
      title: 'Feature 3',
      content: 'Key feature description',
      aiPrompt: `Generate third key feature for: ${domain['Business Idea']}`
    }
  }
  
  return config
}

async function deployDomain(domain: DomainRecord): Promise<DeploymentResult> {
  const domainName = domain.Name
  
  try {
    // Check domain8 status
    const domain8Status = await checkDomain8Status(domainName)
    
    // Skip if higher tier is live
    if (domain8Status.exists && !domain8Status.tier0Enabled) {
      return {
        domain: domainName,
        status: 'skipped',
        reason: `Higher tier active (${domain8Status.phase})`
      }
    }
    
    // Check if config already exists
    const configPath = path.join(CONFIGS_DIR, `${domainName}.json`)
    if (fs.existsSync(configPath)) {
      return {
        domain: domainName,
        status: 'skipped',
        reason: 'Config already exists'
      }
    }
    
    // Generate config
    const config = await generateConfig(domain)
    
    // If domain8 has brand colors, inherit them
    if (domain8Status.brandColors) {
      config.template.brandColors = domain8Status.brandColors
    }
    
    // Write config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    
    return {
      domain: domainName,
      status: 'deployed',
      reason: 'Successfully deployed',
      config
    }
  } catch (error) {
    return {
      domain: domainName,
      status: 'error',
      reason: `Error: ${error.message}`
    }
  }
}

async function main() {
  console.log('🚀 Starting batch deployment for tier-0 domains...\n')
  
  // Ensure configs directory exists
  if (!fs.existsSync(CONFIGS_DIR)) {
    fs.mkdirSync(CONFIGS_DIR, { recursive: true })
  }
  
  // Read domain list
  const domains = await readDomainList()
  console.log(`📋 Found ${domains.length} domains in CSV\n`)
  
  // Process domains
  const results: DeploymentResult[] = []
  let deployed = 0
  let skipped = 0
  let errors = 0
  
  for (const domain of domains) {
    process.stdout.write(`Processing ${domain.Name}... `)
    const result = await deployDomain(domain)
    results.push(result)
    
    if (result.status === 'deployed') {
      deployed++
      console.log('✅ Deployed')
    } else if (result.status === 'skipped') {
      skipped++
      console.log(`⏭️  Skipped (${result.reason})`)
    } else {
      errors++
      console.log(`❌ Error (${result.reason})`)
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Deployment Summary:')
  console.log(`✅ Deployed: ${deployed}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`📁 Total: ${domains.length}`)
  
  // Write detailed report
  const reportPath = path.join(process.cwd(), 'deployment-report.json')
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { deployed, skipped, errors, total: domains.length },
    results
  }, null, 2))
  
  console.log(`\n📄 Detailed report saved to: deployment-report.json`)
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { readDomainList, deployDomain, generateConfig }