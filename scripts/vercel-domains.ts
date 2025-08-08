#!/usr/bin/env node
/**
 * Script to add multiple domains to Vercel project
 * Run: npx tsx scripts/vercel-domains.ts
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const CONFIGS_DIR = path.join(process.cwd(), 'configs')

// Get all domain configs
const configFiles = fs.readdirSync(CONFIGS_DIR)
  .filter(file => file.endsWith('.json'))
  .map(file => file.replace('.json', ''))

console.log(`Found ${configFiles.length} domains to configure`)

// Add each domain to Vercel
configFiles.forEach((domain, index) => {
  console.log(`[${index + 1}/${configFiles.length}] Adding ${domain} to Vercel...`)
  
  try {
    // Add domain to Vercel project
    execSync(`vercel domains add ${domain}`, { stdio: 'inherit' })
    console.log(`✓ ${domain} added successfully`)
  } catch (error) {
    console.error(`✗ Failed to add ${domain}:`, error.message)
  }
  
  // Add a small delay to avoid rate limiting
  if (index < configFiles.length - 1) {
    execSync('sleep 1')
  }
})

console.log('\n📝 DNS Configuration needed for each domain in Cloudflare:')
console.log('Type: CNAME')
console.log('Name: @')
console.log('Target: cname.vercel-dns.com')
console.log('Proxy: OFF (DNS only)\n')

// Generate Cloudflare DNS records for bulk import
const dnsRecords = configFiles.map(domain => ({
  type: 'CNAME',
  name: domain,
  content: 'cname.vercel-dns.com',
  proxied: false
}))

fs.writeFileSync(
  'cloudflare-dns-records.json',
  JSON.stringify(dnsRecords, null, 2)
)

console.log('✓ Generated cloudflare-dns-records.json for bulk import')