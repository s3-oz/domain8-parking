import { DomainConfig } from '@/lib/types'
import { TerminalWindow } from '@/components/terminal/TerminalTheme'

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
  const isTerminal = config.template.theme === 'terminal'
  
  return (
    <div>
      {content.title && (
        <h2 className={`text-2xl font-bold mb-6 text-center ${
          isTerminal ? 'text-green-400' :
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {isTerminal ? `// ${content.title.toUpperCase()}` : content.title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.features.map((feature, index) => (
          isTerminal ? (
            <TerminalWindow key={index} title={`module-${index + 1}`} isLightMode={!isDark}>
              <div className="text-center">
                {feature.icon && (
                  <div className="text-3xl mb-3">{feature.icon}</div>
                )}
                <div className={`font-bold mb-2 uppercase ${isDark ? 'text-green-400' : 'text-green-700'}`}>{feature.title}</div>
                <div className={`text-xs ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  {feature.description}
                </div>
              </div>
            </TerminalWindow>
          ) : (
            <div 
              key={index}
              className={`p-6 rounded-lg ${
                isDark 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                {feature.icon && (
                  <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                )}
                <div className="flex-1">
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
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  )
}