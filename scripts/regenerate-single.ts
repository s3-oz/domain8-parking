#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { generateConfig } from './batch-deploy'

const CONFIGS_DIR = path.join(process.cwd(), 'configs')

// Example domain record for brewhaus
const brewhausRecord = {
  Name: 'brewhaus.com.au',
  'Business Idea': 'E-commerce for homebrewing supplies or a homebrewers community/info site.',
  'Model Type': 'E-commerce/Information/Community',
  'Totals Revenue': '$0.18',
  'Totals CTR': '9.52%'
}

async function main() {
  const config = await generateConfig(brewhausRecord)
  
  // Add brand colors from domain8
  config.template.brandColors = {
    primary: "#D97A34",
    secondary: "#2C1810", 
    accent: "#7FB442"
  }
  
  // Write config
  const configPath = path.join(CONFIGS_DIR, 'brewhaus.com.au.json')
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  
  console.log('✅ Regenerated brewhaus.com.au.json with correct structure')
}

main().catch(console.error)