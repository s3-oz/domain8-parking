import { DomainConfig } from './types'
import fs from 'fs'
import path from 'path'

// Disable caching in development
const isDev = process.env.NODE_ENV === 'development'

export async function loadDomainConfig(domain: string): Promise<DomainConfig | null> {
  try {
    // Clean domain name (remove protocol, www, etc)
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0]
    
    // Try to load config file
    const configPath = path.join(process.cwd(), 'configs', `${cleanDomain}.json`)
    
    if (!fs.existsSync(configPath)) {
      console.log(`Config not found for domain: ${cleanDomain}`)
      return null
    }
    
    // In development, always read fresh
    if (isDev) {
      // Clear require cache if it exists
      delete require.cache[configPath]
    }
    
    const configData = fs.readFileSync(configPath, 'utf-8')
    const config: DomainConfig = JSON.parse(configData)
    
    return config
  } catch (error) {
    console.error(`Error loading config for ${domain}:`, error)
    return null
  }
}

// Get all available domain configs with basic info
export function getAllDomainConfigs(): Array<{name: string, template?: string, theme?: string, colorMode?: string}> {
  try {
    const configsDir = path.join(process.cwd(), 'configs')
    
    if (!fs.existsSync(configsDir)) {
      return []
    }
    
    const files = fs.readdirSync(configsDir).filter(file => file.endsWith('.json'))
    
    return files.map(file => {
      try {
        const configData = fs.readFileSync(path.join(configsDir, file), 'utf-8')
        const config = JSON.parse(configData)
        return {
          name: file.replace('.json', ''),
          template: config.template?.type,
          theme: config.template?.theme,
          colorMode: config.template?.colorMode
        }
      } catch {
        return {
          name: file.replace('.json', '')
        }
      }
    })
  } catch (error) {
    console.error('Error reading configs directory:', error)
    return []
  }
}