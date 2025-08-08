import { renderContentBox } from '@/components/content-boxes'
import { LandingTemplate } from '@/components/templates/LandingTemplate'
import { HeroTemplate } from '@/components/templates/HeroTemplate'
import { EmailCapture } from '@/components/universal/EmailCapture'
import { DomainInquiry } from '@/components/universal/DomainInquiry'
import { notFound } from 'next/navigation'
import { loadDomainConfig } from '@/lib/config-loader'
import type { DomainConfig } from '@/lib/types'

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params
  const config = await loadDomainConfig(domain)
  
  if (!config) {
    notFound()
  }

  // Build content boxes map
  const contentBoxes = new Map<string, React.ReactNode>()
  
  // Debug: Log what we're working with
  console.log('Config contentBoxes:', Object.keys(config.contentBoxes))
  
  Object.entries(config.contentBoxes).forEach(([key, box]) => {
    console.log(`Processing box ${key}: type=${box.type}, position=${box.position}`)
    
    // Check if this box should be rendered based on controls
    const isAdBox = box.type.startsWith('ad-')
    
    if (isAdBox) {
      // Check master ad switch first
      const adsEnabled = config.controls?.ads?.globalEnabled ?? config.ads.enabled
      if (!adsEnabled) return
      
      // Check specific ad position toggle
      const positionKey = box.position.replace('ad-', '').replace('-', '')
      const positionMappings: Record<string, string> = {
        'topbanner': 'topBanner',
        'alert': 'alert', 
        'sidebar': 'sidebar',
        'midbanner': 'midBanner',
        'bottombanner': 'bottomBanner',
        'native1': 'native1',
        'native2': 'native2'
      }
      
      const mappedKey = positionMappings[positionKey] as keyof NonNullable<NonNullable<DomainConfig['controls']>['ads']>['positions']
      const positionEnabled = config.controls?.ads?.positions?.[mappedKey] ?? box.enabled !== false
      if (!positionEnabled) return
    } else if (box.type === 'cta') {
      // Check if this is a business-related CTA
      const content = box.content as any
      const isBusinessCTA = 
        content?.showForm ||
        content?.text?.toLowerCase().includes('venue') ||
        content?.text?.toLowerCase().includes('business') ||
        content?.text?.toLowerCase().includes('brewery') ||
        content?.text?.toLowerCase().includes('owner') ||
        content?.text?.toLowerCase().includes('early access') ||
        content?.text?.toLowerCase().includes('priority access')
      
      // Skip business CTAs if businessInquiry is disabled
      if (isBusinessCTA && !config.controls?.forms?.businessInquiry) {
        return
      }
      
      // Check original enabled flag
      if (box.enabled === false) return
    } else {
      // Other non-ad boxes - check original enabled flag
      if (box.enabled === false) return
    }
    
    contentBoxes.set(box.position, renderContentBox(box, config))
  })
  
  console.log('ContentBoxes map keys:', Array.from(contentBoxes.keys()))

  // Universal components - check controls first, then legacy
  const universalComponents = {
    emailCapture: (config.controls?.forms?.emailCapture ?? config.features.showEmailCapture) 
      ? <EmailCapture config={config} /> 
      : undefined,
    domainInquiry: (config.controls?.forms?.domainInquiry ?? config.domain.forSale) 
      ? <DomainInquiry config={config} /> 
      : undefined,
  }

  // Render appropriate template
  if (config.template.type === 'hero') {
    return (
      <HeroTemplate
        config={config}
        contentBoxes={contentBoxes}
        universalComponents={universalComponents}
      />
    )
  }

  return (
    <LandingTemplate
      config={config}
      contentBoxes={contentBoxes}
      universalComponents={universalComponents}
    />
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params
  const config = await loadDomainConfig(domain)
  
  if (!config) {
    return {
      title: 'Domain Not Found',
      description: 'The requested domain configuration was not found.',
    }
  }

  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords.join(', '),
  }
}