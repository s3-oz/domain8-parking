import { DomainConfig, ContentBox } from '@/lib/types'
import { HeadlineBox } from './HeadlineBox'
import { TextBox } from './TextBox'
import { FeaturesGridBox } from './FeaturesGridBox'
import { MetricsBox } from './MetricsBox'
import { CTABox } from './CTABox'
import { MapBox } from './MapBox'
import { AdBannerBox } from './AdBannerBox'
import { AdAlertBox } from './AdAlertBox'
import { AdNativeBox } from './AdNativeBox'
import { PlaceholderBox } from './PlaceholderBox'
import { TerminalLogBox } from './TerminalLogBox'

export function renderContentBox(box: ContentBox, config: DomainConfig): React.ReactNode {
  // If no content, show placeholder
  if (!box.content || Object.keys(box.content).length === 0) {
    return <PlaceholderBox type={box.type} position={box.position} config={config} />
  }
  
  switch (box.type) {
    case 'headline':
      return <HeadlineBox content={box.content} config={config} />
    case 'text':
      return <TextBox content={box.content} config={config} />
    case 'features-grid':
      return <FeaturesGridBox content={box.content} config={config} />
    case 'metrics':
      return <MetricsBox content={box.content} config={config} />
    case 'cta':
      return <CTABox content={box.content} config={config} />
    case 'map':
      return <MapBox content={box.content} config={config} />
    case 'ad-banner':
      return <AdBannerBox content={box.content} config={config} />
    case 'ad-alert':
      return <AdAlertBox content={box.content} config={config} />
    case 'ad-native':
      return <AdNativeBox content={box.content} config={config} />
    case 'terminal-log':
      return <TerminalLogBox content={box.content} config={config} />
    // Add more box types as needed
    default:
      return <PlaceholderBox type={box.type} position={box.position} config={config} />
  }
}

export { HeadlineBox, FeaturesGridBox, MetricsBox, CTABox, AdBannerBox, AdAlertBox }