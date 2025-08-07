import { DomainConfig } from '@/lib/types'

interface CTABoxProps {
  content: {
    text: string
    buttonText: string
    description?: string
  }
  config: DomainConfig
}

export function CTABox({ content, config }: CTABoxProps) {
  const isDark = config.template.colorMode === 'dark'
  
  return (
    <div className={`text-center p-8 rounded-lg ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
    }`}>
      <h2 className={`text-2xl font-bold mb-3 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {content.text}
      </h2>
      {content.description && (
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {content.description}
        </p>
      )}
      <button className={`px-8 py-3 rounded font-bold transition ${
        isDark 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}>
        {content.buttonText}
      </button>
    </div>
  )
}