import { DomainConfig } from '@/lib/types'

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
  
  const getTrendIcon = (trend?: string) => {
    switch(trend) {
      case 'up': return '↑'
      case 'down': return '↓'
      case 'stable': return '→'
      default: return ''
    }
  }
  
  const getTrendColor = (trend?: string) => {
    switch(trend) {
      case 'up': return isDark ? 'text-green-400' : 'text-green-600'
      case 'down': return isDark ? 'text-red-400' : 'text-red-600'
      case 'stable': return isDark ? 'text-yellow-400' : 'text-yellow-600'
      default: return ''
    }
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