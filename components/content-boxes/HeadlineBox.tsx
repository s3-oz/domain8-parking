import { DomainConfig } from '@/lib/types'

interface HeadlineBoxProps {
  content: {
    title: string
    subtitle?: string
  }
  config: DomainConfig
}

export function HeadlineBox({ content, config }: HeadlineBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  const isTerminal = config.template.theme === 'terminal'
  
  return (
    <div className={isTerminal ? 'text-center' : ''}>
      <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
        isTerminal ? 'text-green-400 glitch' : 
        isDark ? 'text-white' : 'text-gray-900'
      }`} data-text={content.title}>
        {content.title}
      </h1>
      {content.subtitle && (
        <p className={`text-lg md:text-xl ${
          isTerminal ? 'text-green-300 max-w-2xl mx-auto' :
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {content.subtitle}
        </p>
      )}
    </div>
  )
}