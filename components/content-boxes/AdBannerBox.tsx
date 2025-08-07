import { DomainConfig } from '@/lib/types'

interface AdBannerBoxProps {
  content: {
    sponsor?: string
    message: string
    cta?: string
    link?: string
  }
  config: DomainConfig
}

export function AdBannerBox({ content, config }: AdBannerBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {content.sponsor && (
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {content.sponsor}
          </span>
        )}
        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {content.message}
        </span>
      </div>
      {content.cta && (
        <button className={`text-xs hover:underline ${
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`}>
          {content.cta} →
        </button>
      )}
    </div>
  )
}