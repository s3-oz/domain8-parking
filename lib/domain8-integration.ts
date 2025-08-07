import fs from 'fs'
import path from 'path'

// Get the domain8 path from environment variable
const DOMAIN8_PATH = process.env.DOMAIN8_PATH || '/Users/oz/Sites/domain8/domains'

interface Domain8Status {
  current_phase: string
  status: string
  tier0?: {
    enabled: boolean
    override?: boolean
    deployed_at?: string
  }
}

interface BrandVisual {
  color_palette: {
    primary: {
      hex: string
    }
    secondary: {
      hex: string
    }
    accent?: Array<{
      hex: string
    }>
  }
}

export async function checkDomain8Status(domainName: string) {
  const domainPath = path.join(DOMAIN8_PATH, domainName)
  
  // Check if domain exists in domain8
  if (!fs.existsSync(domainPath)) {
    return {
      exists: false,
      tier0Enabled: true // If no higher tier, tier0 is enabled
    }
  }
  
  // Check status.json
  const statusPath = path.join(domainPath, 'status.json')
  let status: Domain8Status | null = null
  
  if (fs.existsSync(statusPath)) {
    try {
      const statusData = fs.readFileSync(statusPath, 'utf-8')
      status = JSON.parse(statusData)
    } catch (error) {
      console.error(`Error reading status for ${domainName}:`, error)
    }
  }
  
  // Check for brand colors
  const brandPath = path.join(domainPath, '03-branding', 'brand-visual.json')
  let brandColors = null
  
  if (fs.existsSync(brandPath)) {
    try {
      const brandData = fs.readFileSync(brandPath, 'utf-8')
      const brandVisual: BrandVisual = JSON.parse(brandData)
      brandColors = {
        primary: brandVisual.color_palette.primary.hex,
        secondary: brandVisual.color_palette.secondary.hex,
        accent: brandVisual.color_palette.accent?.[0]?.hex
      }
    } catch (error) {
      console.error(`Error reading brand for ${domainName}:`, error)
    }
  }
  
  // Determine if tier0 should be enabled
  const isHigherTierLive = status?.current_phase?.includes('live') || 
                           status?.current_phase?.includes('production') ||
                           status?.status === 'deployed'
  
  // Check for explicit tier0 settings in status
  const tier0ExplicitlyDisabled = status?.tier0?.enabled === false
  
  return {
    exists: true,
    phase: status?.current_phase || 'unknown',
    status: status?.status || 'unknown',
    tier0Enabled: !isHigherTierLive && !tier0ExplicitlyDisabled,
    hasBrand: !!brandColors,
    brandColors,
    hasWebsite: fs.existsSync(path.join(domainPath, 'website'))
  }
}

export async function getAllDomain8Domains(): Promise<string[]> {
  try {
    if (!fs.existsSync(DOMAIN8_PATH)) {
      console.warn(`Domain8 path not found: ${DOMAIN8_PATH}`)
      return []
    }
    
    const items = fs.readdirSync(DOMAIN8_PATH)
    
    // Filter to only directories that look like domains
    return items.filter(item => {
      const itemPath = path.join(DOMAIN8_PATH, item)
      return fs.statSync(itemPath).isDirectory() && item.includes('.')
    })
  } catch (error) {
    console.error('Error reading domain8 domains:', error)
    return []
  }
}

// Enhanced config loader that checks domain8
export async function loadDomainConfigWithBrand(domainName: string) {
  // First, load the tier0 config if it exists
  const tier0ConfigPath = path.join(process.cwd(), 'configs', `${domainName}.json`)
  let config = null
  
  if (fs.existsSync(tier0ConfigPath)) {
    const configData = fs.readFileSync(tier0ConfigPath, 'utf-8')
    config = JSON.parse(configData)
  }
  
  // Check domain8 status and brand
  const domain8Status = await checkDomain8Status(domainName)
  
  // If domain8 has brand colors and tier0 is enabled, merge them
  if (domain8Status.tier0Enabled && domain8Status.brandColors && config) {
    config.template.brandColors = domain8Status.brandColors
  }
  
  return {
    config,
    domain8Status
  }
}