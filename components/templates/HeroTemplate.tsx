'use client'

import { DomainConfig } from '@/lib/types'
import { useState } from 'react'

interface HeroTemplateProps {
  config: DomainConfig
  contentBoxes: Map<string, React.ReactNode>
  universalComponents: {
    emailCapture?: React.ReactNode
    domainInquiry?: React.ReactNode
  }
}

export function HeroTemplate({ config, contentBoxes, universalComponents }: HeroTemplateProps) {
  const [showDomainModal, setShowDomainModal] = useState(false)
  
  // Theme-based styling (will be expanded for each theme)
  const themeStyles = config.template.colorMode === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900'

  return (
    <div className={`min-h-screen ${themeStyles}`}>
      {/* Header */}
      <header className={`border-b ${config.template.colorMode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-xl font-bold">{config.domain.name.toUpperCase()}</div>
            <div className={`px-3 py-1 text-xs rounded border ${
              config.template.colorMode === 'dark' 
                ? 'border-gray-700 text-gray-400' 
                : 'border-gray-300 text-gray-600'
            }`}>
              {config.domain.status === 'coming_soon' ? 'COMING SOON' : config.domain.status.toUpperCase()}
            </div>
          </div>
          {config.domain.forSale && (
            <button
              onClick={() => setShowDomainModal(true)}
              className={`text-sm cursor-pointer hover:underline ${
                config.template.colorMode === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}
            >
              DOMAIN MAY BE FOR SALE →
            </button>
          )}
        </div>
      </header>

      {/* Ad Zone: Top Banner */}
      {contentBoxes.get('ad-top-banner') && (
        <div className={`border-b ${config.template.colorMode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto px-4 py-2">
            {contentBoxes.get('ad-top-banner')}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Ad Zone: Alert/Promotional Banner */}
          {contentBoxes.get('ad-alert') && (
            <div className="mb-6">
              {contentBoxes.get('ad-alert')}
            </div>
          )}
          
          {/* Hero Content Zone */}
          {contentBoxes.get('hero-headline') && (
            <div className="text-center mb-10">
              {contentBoxes.get('hero-headline')}
            </div>
          )}

          {/* Main Grid: Content + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area - 2 columns wide */}
            <div className="lg:col-span-2 space-y-8">
              {/* Main Dynamic Content Box */}
              {contentBoxes.get('main-content') && (
                <div>{contentBoxes.get('main-content')}</div>
              )}
              
              {/* Primary Content (3 feature boxes) */}
              {contentBoxes.get('primary-content') && (
                <div>{contentBoxes.get('primary-content')}</div>
              )}
              
              {/* Ad Zone: In-Content Native */}
              {contentBoxes.get('ad-native-1') && (
                <div>{contentBoxes.get('ad-native-1')}</div>
              )}
              
              {/* Secondary Content Box */}
              {contentBoxes.get('secondary-content') && (
                <div>{contentBoxes.get('secondary-content')}</div>
              )}
            </div>

            {/* Sidebar - 1 column wide */}
            <div className="space-y-6">
              {/* Email Capture - Always at top of sidebar */}
              {config.features.showEmailCapture && universalComponents.emailCapture}
              
              {/* Sidebar Zone 1 */}
              {contentBoxes.get('sidebar-1') && (
                <div>{contentBoxes.get('sidebar-1')}</div>
              )}
              
              {/* Ad Zone: Sidebar */}
              {contentBoxes.get('ad-sidebar') && (
                <div>{contentBoxes.get('ad-sidebar')}</div>
              )}
              
              {/* Sidebar Zone 2 */}
              {contentBoxes.get('sidebar-2') && (
                <div>{contentBoxes.get('sidebar-2')}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      {contentBoxes.get('feature-grid') && (
        <section className={`py-12 px-4 border-t ${config.template.colorMode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto">
            {contentBoxes.get('feature-grid')}
          </div>
        </section>
      )}

      {/* Ad Zone: Mid-Page Banner */}
      {contentBoxes.get('ad-mid-banner') && (
        <section className={`py-6 px-4 ${config.template.colorMode === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className="max-w-6xl mx-auto">
            {contentBoxes.get('ad-mid-banner')}
          </div>
        </section>
      )}

      {/* Lower Content Section */}
      {contentBoxes.get('lower-content') && (
        <section className={`py-12 px-4 ${contentBoxes.get('ad-mid-banner') ? '' : 'border-t'} ${config.template.colorMode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto">
            {contentBoxes.get('lower-content')}
          </div>
        </section>
      )}

      {/* Dynamic/Live Feed Section */}
      {contentBoxes.get('dynamic-feed') && (
        <section className={`py-12 px-4 border-t ${config.template.colorMode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto">
            {contentBoxes.get('dynamic-feed')}
          </div>
        </section>
      )}

      {/* Ad Zone: Bottom Banner */}
      {contentBoxes.get('ad-bottom-banner') && (
        <section className={`py-6 px-4 border-t ${config.template.colorMode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto">
            {contentBoxes.get('ad-bottom-banner')}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`mt-auto py-6 text-center text-sm border-t ${
        config.template.colorMode === 'dark' 
          ? 'text-gray-400 border-gray-800' 
          : 'text-gray-500 border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          {contentBoxes.get('footer') || (
            <p>&copy; {new Date().getFullYear()} {config.domain.name}</p>
          )}
        </div>
      </footer>

      {/* Domain Inquiry Modal */}
      {showDomainModal && config.domain.forSale && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDomainModal(false)}
        >
          <div 
            className={`rounded-lg p-6 max-w-md w-full ${
              config.template.colorMode === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {universalComponents.domainInquiry}
            <button 
              onClick={() => setShowDomainModal(false)}
              className={`mt-4 text-sm ${
                config.template.colorMode === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}