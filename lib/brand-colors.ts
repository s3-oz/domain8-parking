import { DomainConfig } from './types'

export function getBrandColorStyles(config: DomainConfig): React.CSSProperties {
  if (!config.template.brandColors) {
    return {}
  }

  const { primary, secondary, accent } = config.template.brandColors
  
  // Add terminal-specific CSS variables if using terminal theme
  if (config.template.theme === 'terminal') {
    return {
      '--brand-primary': primary,
      '--brand-secondary': secondary,
      '--brand-accent': accent || primary,
      '--brand-primary-hover': adjustBrightness(primary, -20),
      '--brand-secondary-hover': adjustBrightness(secondary, -20),
      '--brand-accent-hover': adjustBrightness(accent || primary, -20),
      // Terminal-specific variables
      '--terminal-base-bg': '#000000',
      '--terminal-background-20': 'rgba(0, 255, 65, 0.05)',
      '--terminal-primary': primary || '#00ff41',
      '--terminal-accent': accent || '#ffd700',
      '--terminal-border': secondary || '#00ff41',
      '--terminal-muted': adjustBrightness(primary || '#00ff41', -30),
      '--terminal-error': '#ff0041',
      '--terminal-warning': '#ffd700',
    } as React.CSSProperties
  }

  return {
    '--brand-primary': primary,
    '--brand-secondary': secondary,
    '--brand-accent': accent || primary,
    // Generate variations for hover states
    '--brand-primary-hover': adjustBrightness(primary, -20),
    '--brand-secondary-hover': adjustBrightness(secondary, -20),
    '--brand-accent-hover': adjustBrightness(accent || primary, -20),
  } as React.CSSProperties
}

// Utility to adjust brightness of hex colors
function adjustBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // Adjust brightness
  const adjust = (value: number) => {
    const adjusted = value + (255 * percent / 100)
    return Math.min(255, Math.max(0, adjusted))
  }
  
  // Convert back to hex
  const toHex = (value: number) => {
    const hex = Math.round(value).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`
}

// Get brand color styles for inline use
export function getBrandStyles(config: DomainConfig) {
  if (!config.template.brandColors) {
    return {}
  }

  const { primary, secondary, accent } = config.template.brandColors

  return {
    primary: {
      backgroundColor: primary,
      color: 'white'
    },
    primaryHover: {
      backgroundColor: adjustBrightness(primary, -20),
      color: 'white'
    },
    primaryText: {
      color: primary
    },
    secondary: {
      backgroundColor: secondary,
      color: 'white'
    },
    secondaryBorder: {
      borderColor: secondary
    },
    accent: {
      backgroundColor: accent || primary,
      color: 'white'
    }
  }
}

// Get theme-specific color classes with brand color support
export function getThemeClasses(config: DomainConfig) {
  const theme = config.template.theme
  const hasBrandColors = !!config.template.brandColors
  
  // If we have brand colors, return empty classes (will use inline styles)
  if (hasBrandColors) {
    return {
      primary: 'text-white rounded font-bold transition',
      primaryText: 'hover:underline transition',
      secondary: 'text-white rounded transition',
      secondaryBorder: '',
      accent: 'text-white rounded transition',
      accentText: '',
      header: 'bg-white border-b',
      headerDark: 'bg-gray-900 border-b',
      card: 'bg-white border border-gray-200',
      cardDark: 'bg-gray-800 border border-gray-700',
    }
  }
  
  // Default theme colors when no brand colors
  const themes = {
    basic: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      primaryText: 'text-blue-600 hover:text-blue-700',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      secondaryBorder: 'border-gray-300',
      accent: 'bg-purple-600 hover:bg-purple-700 text-white',
      accentText: 'text-purple-600',
      header: 'bg-white border-b border-gray-200',
      headerDark: 'bg-gray-900 border-b border-gray-800',
      card: 'bg-white border border-gray-200',
      cardDark: 'bg-gray-800 border border-gray-700',
    },
    comparison: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      primaryText: 'text-green-600 hover:text-green-700',
      secondary: 'bg-teal-600 hover:bg-teal-700 text-white',
      secondaryBorder: 'border-teal-300',
      accent: 'bg-orange-600 hover:bg-orange-700 text-white',
      accentText: 'text-orange-600',
      header: 'bg-white border-b border-gray-200',
      headerDark: 'bg-gray-900 border-b border-gray-800',
      card: 'bg-white border border-gray-200',
      cardDark: 'bg-gray-800 border border-gray-700',
    },
    technology: {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      primaryText: 'text-indigo-600 hover:text-indigo-700',
      secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
      secondaryBorder: 'border-slate-300',
      accent: 'bg-cyan-600 hover:bg-cyan-700 text-white',
      accentText: 'text-cyan-600',
      header: 'bg-white border-b border-gray-200',
      headerDark: 'bg-gray-900 border-b border-gray-800',
      card: 'bg-white border border-gray-200',
      cardDark: 'bg-gray-800 border border-gray-700',
    },
    finance: {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      primaryText: 'text-emerald-600 hover:text-emerald-700',
      secondary: 'bg-slate-700 hover:bg-slate-800 text-white',
      secondaryBorder: 'border-slate-400',
      accent: 'bg-amber-600 hover:bg-amber-700 text-white',
      accentText: 'text-amber-600',
      header: 'bg-white border-b border-gray-200',
      headerDark: 'bg-gray-900 border-b border-gray-800',
      card: 'bg-white border border-gray-200',
      cardDark: 'bg-gray-800 border border-gray-700',
    },
    creative: {
      primary: 'bg-pink-600 hover:bg-pink-700 text-white',
      primaryText: 'text-pink-600 hover:text-pink-700',
      secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
      secondaryBorder: 'border-purple-300',
      accent: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      accentText: 'text-yellow-600',
      header: 'bg-white border-b border-gray-200',
      headerDark: 'bg-gray-900 border-b border-gray-800',
      card: 'bg-white border border-gray-200',
      cardDark: 'bg-gray-800 border border-gray-700',
    },
    professional: {
      primary: 'bg-blue-700 hover:bg-blue-800 text-white',
      primaryText: 'text-blue-700 hover:text-blue-800',
      secondary: 'bg-gray-700 hover:bg-gray-800 text-white',
      secondaryBorder: 'border-gray-400',
      accent: 'bg-red-700 hover:bg-red-800 text-white',
      accentText: 'text-red-700',
      header: 'bg-white border-b border-gray-200',
      headerDark: 'bg-gray-900 border-b border-gray-800',
      card: 'bg-white border border-gray-200',
      cardDark: 'bg-gray-800 border border-gray-700',
    },
    ecommerce: {
      primary: 'bg-orange-600 hover:bg-orange-700 text-white',
      primaryText: 'text-orange-600 hover:text-orange-700',
      secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
      secondaryBorder: 'border-slate-300',
      accent: 'bg-green-600 hover:bg-green-700 text-white',
      accentText: 'text-green-600',
      header: 'bg-white border-b border-gray-200',
      headerDark: 'bg-gray-900 border-b border-gray-800',
      card: 'bg-white border border-gray-200',
      cardDark: 'bg-gray-800 border border-gray-700',
    },
    terminal: {
      primary: 'bg-green-500 hover:bg-green-600 text-black font-mono',
      primaryText: 'text-green-400 hover:text-green-300 font-mono',
      secondary: 'bg-gray-900 hover:bg-gray-800 text-green-400 font-mono',
      secondaryBorder: 'border-green-500',
      accent: 'bg-yellow-500 hover:bg-yellow-600 text-black font-mono',
      accentText: 'text-yellow-500 font-mono',
      header: 'bg-black border-b border-green-500',
      headerDark: 'bg-black border-b border-green-500',
      card: 'bg-black border border-green-500 shadow-green-500/20 shadow-lg',
      cardDark: 'bg-black border border-green-500 shadow-green-500/20 shadow-lg',
    },
  }
  
  return themes[theme] || themes.basic
}