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
  
  return (
    <div>
      <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {content.title}
      </h1>
      {content.subtitle && (
        <p className={`text-lg md:text-xl ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {content.subtitle}
        </p>
      )}
    </div>
  )
}