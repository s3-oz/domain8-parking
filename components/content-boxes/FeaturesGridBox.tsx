import { DomainConfig } from '@/lib/types'

interface Feature {
  icon?: string
  title: string
  description: string
}

interface FeaturesGridBoxProps {
  content: {
    title?: string
    features: Feature[]
  }
  config: DomainConfig
}

export function FeaturesGridBox({ content, config }: FeaturesGridBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  
  return (
    <div>
      {content.title && (
        <h2 className={`text-2xl font-bold mb-6 text-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {content.title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.features.map((feature, index) => (
          <div 
            key={index}
            className={`p-6 rounded-lg ${
              isDark 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
          >
            {feature.icon && (
              <div className="text-3xl mb-3">{feature.icon}</div>
            )}
            <h3 className={`font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {feature.title}
            </h3>
            <p className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}