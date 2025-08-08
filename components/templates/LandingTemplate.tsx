'use client'

import { DomainConfig } from '@/lib/types'
import { getBrandColorStyles, getThemeClasses, getBrandStyles } from '@/lib/brand-colors'
import { useState } from 'react'
import { UmamiAnalytics } from '@/components/analytics/UmamiAnalytics'
import { WorkingMatrixRain } from '@/components/terminal/WorkingMatrixRain'

interface LandingTemplateProps {
  config: DomainConfig
  contentBoxes: Map<string, React.ReactNode>
  universalComponents: {
    emailCapture?: React.ReactNode
    domainInquiry?: React.ReactNode
  }
}

export function LandingTemplate({ config, contentBoxes, universalComponents }: LandingTemplateProps) {
  const [showDomainModal, setShowDomainModal] = useState(false)
  
  // Get brand color CSS variables and inline styles
  const brandColorStyles = getBrandColorStyles(config)
  const themeClasses = getThemeClasses(config)
  const brandStyles = getBrandStyles(config)
  
  // Base styling with terminal support
  const isTerminal = config.template.theme === 'terminal'
  const isDark = config.template.colorMode === 'dark'
  
  const themeStyles = isTerminal 
    ? isDark 
      ? 'bg-black text-green-400 font-mono' 
      : 'bg-white text-green-700 font-mono'
    : isDark 
      ? 'bg-gray-900 text-white' 
      : 'bg-gray-50 text-gray-900'

  return (
    <>
      <UmamiAnalytics />
      <div className={`min-h-screen flex flex-col ${themeStyles} ${isTerminal ? 'relative overflow-hidden' : ''}`} style={brandColorStyles}>
      {isTerminal && <WorkingMatrixRain />}
      <div className={isTerminal ? 'relative z-10' : ''}>
      {/* Header - Same as Hero */}
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

      {/* Centered Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Main Content (headline, description) */}
          <div className="text-center">
            {contentBoxes.get('main')}
          </div>

          {/* Email Capture */}
          {(config.controls?.forms?.emailCapture ?? config.features.showEmailCapture) && (
            <div>
              {universalComponents.emailCapture}
            </div>
          )}

          {/* Additional Content */}
          {contentBoxes.get('additional') && (
            <div className="pt-8">
              {contentBoxes.get('additional')}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-auto py-6 text-center text-sm ${
        config.template.colorMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
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