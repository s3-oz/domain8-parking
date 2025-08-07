#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { checkDomain8Status } from '../lib/domain8-integration'
import { readDomainList } from './batch-deploy'

const CONFIGS_DIR = path.join(process.cwd(), 'configs')

interface SyncResult {
  domain: string
  action: 'disabled' | 'enabled' | 'updated' | 'unchanged'
  reason: string
}

async function syncDomain(domainName: string): Promise<SyncResult> {
  const configPath = path.join(CONFIGS_DIR, `${domainName}.json`)
  const configExists = fs.existsSync(configPath)
  
  // Check domain8 status
  const domain8Status = await checkDomain8Status(domainName)
  
  // If higher tier is live, disable tier0
  if (domain8Status.exists && !domain8Status.tier0Enabled) {
    if (configExists) {
      // Mark config as disabled
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      config.disabled = true
      config.disabledReason = `Higher tier active: ${domain8Status.phase}`
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      
      return {
        domain: domainName,
        action: 'disabled',
        reason: `Higher tier active (${domain8Status.phase})`
      }
    }
    return {
      domain: domainName,
      action: 'unchanged',
      reason: 'No tier0 config to disable'
    }
  }
  
  // If tier0 should be enabled
  if (configExists) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    let updated = false
    
    // Re-enable if was disabled
    if (config.disabled) {
      delete config.disabled
      delete config.disabledReason
      updated = true
    }
    
    // Update brand colors if available
    if (domain8Status.brandColors) {
      if (JSON.stringify(config.template.brandColors) !== JSON.stringify(domain8Status.brandColors)) {
        config.template.brandColors = domain8Status.brandColors
        updated = true
      }
    }
    
    if (updated) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      return {
        domain: domainName,
        action: config.disabled ? 'enabled' : 'updated',
        reason: config.disabled ? 'Re-enabled tier0' : 'Updated brand colors'
      }
    }
    
    return {
      domain: domainName,
      action: 'unchanged',
      reason: 'Config up to date'
    }
  }
  
  return {
    domain: domainName,
    action: 'unchanged',
    reason: 'No tier0 config exists'
  }
}

async function main() {
  console.log('🔄 Syncing tier-0 domains with domain8 status...\n')
  
  // Get all domains from CSV
  const csvDomains = await readDomainList()
  const domainNames = csvDomains.map(d => d.Name)
  
  // Also check existing configs
  const existingConfigs = fs.existsSync(CONFIGS_DIR) 
    ? fs.readdirSync(CONFIGS_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''))
    : []
  
  // Combine both lists (unique)
  const allDomains = [...new Set([...domainNames, ...existingConfigs])]
  
  console.log(`📋 Checking ${allDomains.length} domains...\n`)
  
  const results: SyncResult[] = []
  let disabled = 0
  let enabled = 0
  let updated = 0
  let unchanged = 0
  
  for (const domain of allDomains) {
    process.stdout.write(`Syncing ${domain}... `)
    const result = await syncDomain(domain)
    results.push(result)
    
    switch (result.action) {
      case 'disabled':
        disabled++
        console.log(`🔴 Disabled (${result.reason})`)
        break
      case 'enabled':
        enabled++
        console.log(`🟢 Enabled`)
        break
      case 'updated':
        updated++
        console.log(`🔄 Updated`)
        break
      case 'unchanged':
        unchanged++
        console.log(`✓ Unchanged`)
        break
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Sync Summary:')
  console.log(`🔴 Disabled: ${disabled}`)
  console.log(`🟢 Enabled: ${enabled}`)
  console.log(`🔄 Updated: ${updated}`)
  console.log(`✓ Unchanged: ${unchanged}`)
  console.log(`📁 Total: ${allDomains.length}`)
  
  // Write sync report
  const reportPath = path.join(process.cwd(), 'sync-report.json')
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { disabled, enabled, updated, unchanged, total: allDomains.length },
    results
  }, null, 2))
  
  console.log(`\n📄 Sync report saved to: sync-report.json`)
}

if (require.main === module) {
  main().catch(console.error)
}

export { syncDomain }