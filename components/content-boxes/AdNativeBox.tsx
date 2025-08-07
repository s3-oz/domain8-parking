import { DomainConfig } from '@/lib/types'

interface AdNativeBoxProps {
  content: {
    type?: 'products' | 'articles' | 'mixed'
    items?: any[]
  }
  config: DomainConfig
}

export function AdNativeBox({ content, config }: AdNativeBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  
  // If no content, show placeholder
  if (!content.items || content.items.length === 0) {
    return (
      <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'}`}>
        <div className={`text-xs uppercase mb-3 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Sponsored Products
        </div>
        {/* Mock Amazon-style product cards */}
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={`native-ad-${i}`} className={`flex gap-3 p-3 rounded ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
              <div className={`w-16 h-16 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
              <div className="flex-1">
                <div className={`h-3 w-3/4 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                <div className={`h-3 w-1/2 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                <div className={`h-4 w-20 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  // Render actual content if provided
  return (
    <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
      {/* Render actual native ad content */}
      {content.items.map((item: any, index: number) => (
        <div key={index}>{/* Render item */}</div>
      ))}
    </div>
  )
}