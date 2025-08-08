'use client'

import { DomainConfig } from '@/lib/types'
import { getBrandColorStyles, getThemeClasses, getBrandStyles } from '@/lib/brand-colors'
import { useState } from 'react'
import { UmamiAnalytics } from '@/components/analytics/UmamiAnalytics'
import { WorkingMatrixRain } from '@/components/terminal/WorkingMatrixRain'

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
  
  // Get brand color CSS variables and inline styles
  const brandColorStyles = getBrandColorStyles(config)
  const themeClasses = getThemeClasses(config)
  const brandStyles = getBrandStyles(config)
  
  // Base styling with terminal override
  const isTerminal = config.template.theme === 'terminal'
  const isDark = config.template.colorMode === 'dark'
  
  // Terminal can be light or dark mode
  const themeStyles = isTerminal 
    ? isDark 
      ? 'bg-black text-green-400 font-mono' 
      : 'bg-white text-green-700 font-mono'
    : isDark 
      ? 'bg-gray-900 text-white' 
      : 'bg-white text-gray-900'

  return (
    <>
      <UmamiAnalytics />
      <div className={`min-h-screen ${themeStyles} ${isTerminal ? 'relative overflow-hidden' : ''}`} style={brandColorStyles}>
      {isTerminal && <WorkingMatrixRain />}
      <div className={isTerminal ? 'relative z-10' : ''}>
      {/* Header */}
      <header className={`border-b ${isTerminal ? 'border-green-500 bg-black/90 backdrop-blur-sm' : config.template.colorMode === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {config.domain.logo && (
              <img 
                src={config.domain.logo} 
                alt={config.domain.name} 
                className={`${
                  config.domain.logoSize === 'small' ? 'h-8' :
                  config.domain.logoSize === 'medium' ? 'h-12' :
                  config.domain.logoSize === 'xl' ? 'h-20' :
                  'h-16' // default large
                } w-auto`}
              />
            )}
            <div>
              <div className={`text-xl font-bold ${isTerminal ? 'text-green-400' : ''}`}>
                {isTerminal ? `[${config.domain.name.toUpperCase()}]` : config.domain.name.toUpperCase()}
              </div>
              <div 
                className={`inline-block mt-1 px-3 py-1 text-xs rounded border font-semibold ${isTerminal ? 'animate-pulse border-yellow-500 text-yellow-400' : 'animate-pulse-slow'}`}
                style={isTerminal ? {} : {
                  borderColor: config.template.brandColors?.primary || 'var(--brand-primary, #000)',
                  color: config.template.brandColors?.primary || 'var(--brand-primary, #000)'
                }}
              >
                {config.domain.status === 'coming_soon' ? 'COMING SOON' : config.domain.status.toUpperCase()}
              </div>
            </div>
          </div>
          {(config.controls?.forms?.domainInquiry ?? config.domain.forSale) && (
            <button
              onClick={() => setShowDomainModal(true)}
              className={`text-sm cursor-pointer transition ${isTerminal ? 'text-green-600 hover:text-green-400' : 'hover:underline'}`}
              style={isTerminal ? {} : brandStyles.primaryText}
            >
              {isTerminal ? 'DOMAIN MAY BE FOR SALE →' : 'DOMAIN MAY BE FOR SALE →'}
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
              {(config.controls?.forms?.emailCapture ?? config.features.showEmailCapture) && universalComponents.emailCapture}
              
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
      {showDomainModal && (config.controls?.forms?.domainInquiry ?? config.domain.forSale) && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
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
      </div>
    </>
  )
}