#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { checkDomain8Status } from '../lib/domain8-integration'

const CONFIGS_DIR = path.join(process.cwd(), 'configs')

async function checkDomainStatus(domainName: string) {
  const configPath = path.join(CONFIGS_DIR, `${domainName}.json`)
  const configExists = fs.existsSync(configPath)
  
  const domain8Status = await checkDomain8Status(domainName)
  
  const status = {
    domain: domainName,
    tier0: {
      configExists,
      enabled: configExists && domain8Status.tier0Enabled,
      path: configExists ? configPath : null
    },
    domain8: {
      exists: domain8Status.exists,
      phase: domain8Status.phase,
      status: domain8Status.status,
      hasBrand: domain8Status.hasBrand,
      hasWebsite: domain8Status.hasWebsite,
      tier0Enabled: domain8Status.tier0Enabled
    }
  }
  
  if (configExists) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    status.tier0['template'] = config.template?.type
    status.tier0['theme'] = config.template?.theme
    status.tier0['disabled'] = config.disabled || false
  }
  
  return status
}

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Usage: npm run deploy:check <domain>')
    console.log('Example: npm run deploy:check example.com.au')
    process.exit(1)
  }
  
  const domainName = args[0]
  console.log(`\n🔍 Checking status for: ${domainName}\n`)
  
  const status = await checkDomainStatus(domainName)
  
  // Display status
  console.log('Tier-0 Status:')
  console.log(`  Config exists: ${status.tier0.configExists ? '✅' : '❌'}`)
  if (status.tier0.configExists) {
    console.log(`  Template: ${status.tier0.template}`)
    console.log(`  Theme: ${status.tier0.theme}`)
    console.log(`  Enabled: ${status.tier0.enabled ? '✅' : '❌'}`)
    if (status.tier0.disabled) {
      console.log(`  Status: 🔴 DISABLED`)
    }
  }
  
  console.log('\nDomain8 Status:')
  console.log(`  Exists: ${status.domain8.exists ? '✅' : '❌'}`)
  if (status.domain8.exists) {
    console.log(`  Phase: ${status.domain8.phase}`)
    console.log(`  Status: ${status.domain8.status}`)
    console.log(`  Has Brand: ${status.domain8.hasBrand ? '✅' : '❌'}`)
    console.log(`  Has Website: ${status.domain8.hasWebsite ? '✅' : '❌'}`)
    console.log(`  Tier-0 Allowed: ${status.domain8.tier0Enabled ? '✅' : '❌'}`)
  }
  
  // Recommendations
  console.log('\n📋 Recommendations:')
  if (!status.tier0.configExists && status.domain8.tier0Enabled) {
    console.log('  → Run `npm run deploy:batch` to create tier-0 config')
  } else if (status.tier0.configExists && !status.tier0.enabled) {
    console.log('  → Tier-0 is disabled because a higher tier is active')
  } else if (status.tier0.configExists && status.tier0.enabled) {
    console.log('  → Tier-0 is ready to serve traffic')
  }
  
  // Save detailed report
  const reportPath = path.join(process.cwd(), `status-${domainName}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(status, null, 2))
  console.log(`\n📄 Detailed status saved to: status-${domainName}.json`)
}

if (require.main === module) {
  main().catch(console.error)
}

export { checkDomainStatus }