import { DomainConfig } from '@/lib/types'

interface PlaceholderBoxProps {
  type: string
  position: string
  config: DomainConfig
}

export function PlaceholderBox({ type, position, config }: PlaceholderBoxProps) {
  const isDark = config.template.colorMode === 'dark'
  
  const getPlaceholderContent = () => {
    switch(type) {
      case 'headline':
        return (
          <div className="space-y-2">
            <div className={`text-xs uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Headline & Subtitle</div>
            <div className={`h-8 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
            <div className={`h-4 w-3/4 mx-auto rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
          </div>
        )
      case 'features-grid':
        const gridCount = position === 'feature-grid' ? 6 : 3
        const cols = position === 'feature-grid' ? 'md:grid-cols-3' : 'md:grid-cols-3'
        return (
          <div>
            <div className={`text-xs uppercase mb-3 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {gridCount} Feature Boxes
            </div>
            <div className={`grid grid-cols-1 ${cols} gap-4`}>
              {Array.from({length: gridCount}).map((_, i) => (
                <div key={i} className={`p-4 rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                  <div className={`h-6 w-6 rounded mb-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
                  <div className={`h-4 rounded mb-2 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
                  <div className={`h-3 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
                </div>
              ))}
            </div>
          </div>
        )
      case 'metrics':
        return (
          <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className={`text-xs uppercase mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Metrics Widget</div>
            {[1,2,3,4].map(i => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className={`h-3 w-20 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
                <div className={`h-4 w-16 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
              </div>
            ))}
          </div>
        )
      case 'cta':
        return (
          <div className={`p-8 rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'} text-center`}>
            <div className={`text-xs uppercase mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Call to Action</div>
            <div className={`h-6 w-3/4 mx-auto rounded mb-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
            <div className={`h-4 w-1/2 mx-auto rounded mb-4 ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
            <div className={`h-10 w-32 mx-auto rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
          </div>
        )
      case 'ad-banner':
        return (
          <div className={`h-20 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse flex items-center justify-center`}>
            <div className="text-center">
              <div className={`text-xs uppercase ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Banner Ad</div>
              <div className={`text-xs ${isDark ? 'text-gray-700' : 'text-gray-500'}`}>728x90</div>
            </div>
          </div>
        )
      case 'dynamic-feed':
      case 'main-content':
        return (
          <div className={`p-8 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className={`text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <div className="text-xs uppercase mb-2">Main Dynamic Content</div>
              <div className="text-xs opacity-75">News Feed / Demo / Interactive Content</div>
              <div className={`mt-4 h-96 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
            </div>
          </div>
        )
      case 'ad-native':
        const isSidebar = position.includes('sidebar')
        return (
          <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-300 bg-gray-50'}`}>
            <div className={`text-xs uppercase mb-3 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {isSidebar ? 'Sidebar Ads' : 'Native Ads'}
            </div>
            <div className="space-y-3">
              {(isSidebar ? [1, 2] : [1, 2, 3]).map(i => (
                <div key={i} className={`flex gap-3 p-3 rounded ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                  <div className={`w-16 h-16 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse flex-shrink-0`} />
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
      case 'ad-alert':
        return (
          <div className={`p-4 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className={`text-xs uppercase mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Alert/Promo Banner</div>
            <div className="flex justify-between items-center">
              <div className={`h-4 w-2/3 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
              <div className={`h-8 w-24 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`} />
            </div>
          </div>
        )
      default:
        return (
          <div className={`p-8 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className={`text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <div className="text-xs uppercase mb-1">{type}</div>
              <div className="text-xs opacity-75">{position}</div>
            </div>
          </div>
        )
    }
  }
  
  return getPlaceholderContent()
}