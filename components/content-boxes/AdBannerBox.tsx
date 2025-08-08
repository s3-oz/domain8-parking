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
  const isTerminal = config.template.theme === 'terminal'
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {content.sponsor && (
          <span className={`text-xs ${
            isTerminal ? 'text-green-600 font-mono' :
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {isTerminal ? `[${content.sponsor}]` : content.sponsor}
          </span>
        )}
        <span className={`text-sm ${
          isTerminal ? 'text-green-400 font-mono' :
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {content.message}
        </span>
      </div>
      {content.cta && (
        <button className={`text-xs hover:underline ${
          isTerminal ? 'text-yellow-400 font-mono' :
          isDark ? 'text-blue-400' : 'text-blue-600'
        }`}>
          {content.cta} →
        </button>
      )}
    </div>
  )
}