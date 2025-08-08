import { DomainConfig } from '@/lib/types'
import { TerminalWindow } from '@/components/terminal/TerminalTheme'

interface Metric {
  label: string
  value: string
  trend?: 'up' | 'down' | 'stable'
}

interface MetricsBoxProps {
  content: {
    title?: string
    metrics: Metric[]
  }
  config: DomainConfig
}

export function MetricsBox({ content, config }: MetricsBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  const isTerminal = config.template.theme === 'terminal'
  
  const getTrendIcon = (trend?: string) => {
    switch(trend) {
      case 'up': return '↑'
      case 'down': return '↓'
      case 'stable': return '→'
      default: return ''
    }
  }
  
  const getTrendColor = (trend?: string, terminal?: boolean) => {
    if (terminal) {
      switch(trend) {
        case 'up': return 'text-green-400'
        case 'down': return 'text-red-400'
        case 'stable': return 'text-yellow-400'
        default: return ''
      }
    }
    switch(trend) {
      case 'up': return isDark ? 'text-green-400' : 'text-green-600'
      case 'down': return isDark ? 'text-red-400' : 'text-red-600'
      case 'stable': return isDark ? 'text-yellow-400' : 'text-yellow-600'
      default: return ''
    }
  }
  
  if (isTerminal) {
    return (
      <TerminalWindow title={content.title?.toLowerCase().replace(' ', '-') || 'system-metrics'} isLightMode={!isDark}>
        <div className="space-y-2 text-sm">
          {content.metrics.map((metric, index) => (
            <div key={index} className="flex justify-between">
              <span className={isDark ? 'text-green-300' : 'text-green-600'}>{metric.label}:</span>
              <div className="flex items-center space-x-2">
                <span className={isDark ? 'text-green-400' : 'text-green-700'}>{metric.value}</span>
                {metric.trend && (
                  <span className={getTrendColor(metric.trend, !isDark)}>
                    {getTrendIcon(metric.trend)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </TerminalWindow>
    )
  }
  
  return (
    <div className={`p-6 rounded-lg ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
    }`}>
      {content.title && (
        <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {content.title}
        </h3>
      )}
      
      <div className="space-y-3">
        {content.metrics.map((metric, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {metric.label}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {metric.value}
              </span>
              {metric.trend && (
                <span className={getTrendColor(metric.trend)}>
                  {getTrendIcon(metric.trend)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}