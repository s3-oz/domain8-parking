export interface DomainConfig {
  domain: {
    name: string
    status: 'coming_soon' | 'active' | 'maintenance'
    forSale: boolean
    category: 'basic' | 'comparison' | 'technology' | 'finance' | 'creative' | 'professional' | 'ecommerce' | 'terminal'
    keywords: string[]
    description: string
  }
  
  template: {
    type: 'landing' | 'hero'
    theme: 'basic' | 'comparison' | 'technology' | 'finance' | 'creative' | 'professional' | 'ecommerce' | 'terminal'
    colorMode: 'light' | 'dark'
  }
  
  features: {
    showEmailCapture: boolean
    enableAnalytics: boolean
  }
  
  contentBoxes: {
    [key: string]: ContentBox
  }
  
  ads: {
    enabled: boolean
    network?: string // 'adsense' | 'amazon' | 'custom' | etc
  }
  
  emailCapture: {
    headline: string
    description: string
    buttonText: string
    successMessage: string
  }
  
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface ContentBox {
  type: 'headline' | 'text' | 'features-grid' | 'metrics' | 'bullet-list' | 'cta' | 'testimonials' | 'faq' | 'comparison-table' | 'dynamic-feed' | 'ad-banner' | 'ad-native' | 'ad-alert'
  position: 
    // Landing template positions
    | 'main' 
    | 'additional'
    // Hero template positions  
    | 'hero-headline'
    | 'main-content'
    | 'primary-content'
    | 'secondary-content'
    | 'sidebar-1'
    | 'sidebar-2'
    | 'feature-grid'
    | 'lower-content'
    | 'dynamic-feed'
    | 'footer'
    // Ad positions
    | 'ad-top-banner'
    | 'ad-alert'
    | 'ad-native-1'
    | 'ad-sidebar'
    | 'ad-mid-banner'
    | 'ad-bottom-banner'
  enabled?: boolean // Simple on/off switch for ads
  content: any // This will hold the pre-generated content
}

export interface AdPlacement {
  enabled: boolean
  type: 'banner' | 'native' | 'affiliate'
  position: string
  size?: string
  network?: string
}