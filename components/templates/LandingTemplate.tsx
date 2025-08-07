'use client'

import { DomainConfig } from '@/lib/types'
import { useState } from 'react'

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
  
  // Theme-based styling (will be expanded for each theme)
  const themeStyles = config.template.colorMode === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900'

  return (
    <div className={`min-h-screen flex flex-col ${themeStyles}`}>
      {/* Header - Same as Hero */}
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

      {/* Centered Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Main Content (headline, description) */}
          <div className="text-center">
            {contentBoxes.get('main')}
          </div>

          {/* Email Capture */}
          {config.features.showEmailCapture && (
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