import { DomainConfig } from '@/lib/types'
import { getThemeClasses, getBrandStyles } from '@/lib/brand-colors'
import { BusinessInquiry } from '../universal/BusinessInquiry'

interface CTABoxProps {
  content: {
    text: string
    buttonText: string
    description?: string
    showForm?: boolean
  }
  config: DomainConfig
}

export function CTABox({ content, config }: CTABoxProps) {
  const isDark = config.template.colorMode === 'dark'
  const isTerminal = config.template.theme === 'terminal'
  const themeClasses = getThemeClasses(config)
  const brandStyles = getBrandStyles(config)
  
  // Check if business inquiry is enabled in controls
  const businessInquiryEnabled = config.controls?.forms?.businessInquiry ?? false
  
  // Auto-detect if this is a business CTA AND if it's enabled
  const isBusinessCTA = businessInquiryEnabled && (
    content.showForm ||
    content.text?.toLowerCase().includes('venue') ||
    content.text?.toLowerCase().includes('business') ||
    content.text?.toLowerCase().includes('brewery') ||
    content.text?.toLowerCase().includes('owner')
  )
  
  return (
    <div className={`text-center p-8 rounded-lg ${
      isTerminal ? 'bg-black border-2 border-green-500' :
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
    }`}>
      <h2 className={`text-2xl font-bold mb-3 ${
        isTerminal ? 'text-green-400 font-mono' :
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {content.text}
      </h2>
      {content.description && (
        <p className={`mb-6 ${
          isTerminal ? 'text-green-300 font-mono' :
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {content.description}
        </p>
      )}
      
      {isBusinessCTA ? (
        <BusinessInquiry config={config} />
      ) : (
        <button 
          className={`px-8 py-3 ${
            isTerminal ? 'border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-mono font-bold transition-all' :
            themeClasses.primary
          }`}
          style={isTerminal ? {} : brandStyles.primary}
        >
          {content.buttonText}
        </button>
      )}
    </div>
  )
}