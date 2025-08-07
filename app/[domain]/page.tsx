import { renderContentBox } from '@/components/content-boxes'
import { LandingTemplate } from '@/components/templates/LandingTemplate'
import { HeroTemplate } from '@/components/templates/HeroTemplate'
import { EmailCapture } from '@/components/universal/EmailCapture'
import { DomainInquiry } from '@/components/universal/DomainInquiry'
import { notFound } from 'next/navigation'

// Import all configs - this makes them part of the module system
import heroDemo from '@/configs/hero-demo.com.au.json'
import landingDemo from '@/configs/landing-demo.com.au.json'
import { DomainConfig } from '@/lib/types'

// Map of all configs
const configs: Record<string, DomainConfig> = {
  'hero-demo.com.au': heroDemo as DomainConfig,
  'landing-demo.com.au': landingDemo as DomainConfig,
}

export default async function DomainPage({ params }: { params: { domain: string } }) {
  const config = configs[params.domain]
  
  if (!config) {
    notFound()
  }

  // Build content boxes map
  const contentBoxes = new Map<string, React.ReactNode>()
  
  Object.entries(config.contentBoxes).forEach(([key, box]) => {
    // Skip disabled ad boxes
    if (box.type?.startsWith('ad-') && box.enabled === false) {
      return
    }
    contentBoxes.set(box.position, renderContentBox(box, config))
  })

  // Universal components
  const universalComponents = {
    emailCapture: config.features.showEmailCapture ? <EmailCapture config={config} /> : undefined,
    domainInquiry: config.domain.forSale ? <DomainInquiry config={config} /> : undefined,
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
export async function generateMetadata({ params }: { params: { domain: string } }) {
  const config = configs[params.domain]
  
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