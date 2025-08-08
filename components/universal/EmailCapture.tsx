'use client'

import { useState } from 'react'
import { DomainConfig } from '@/lib/types'
import { getThemeClasses, getBrandStyles } from '@/lib/brand-colors'

interface EmailCaptureProps {
  config: DomainConfig
}

export function EmailCapture({ config }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const isDark = config.template.colorMode === 'dark'
  const themeClasses = getThemeClasses(config)
  const brandStyles = getBrandStyles(config)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'consumer',
          domain: config.domain.name,
          data: {
            firstName,
            email
          }
        })
      })
      
      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          setSubmitted(false)
          setEmail('')
          setFirstName('')
        }, 3000)
      }
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  if (submitted) {
    return (
      <div className={`p-6 rounded-lg text-center ${
        isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
      }`}>
        <div className={`text-lg font-bold mb-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
          ✓ SUCCESS
        </div>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          {config.emailCapture.successMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-lg ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
    }`}>
      <div className="flex justify-center mb-3">
        <span 
          className="px-3 py-1.5 text-sm rounded border font-semibold animate-pulse-slow"
          style={{
            borderColor: config.template.brandColors?.primary || 'var(--brand-primary, #000)',
            color: config.template.brandColors?.primary || 'var(--brand-primary, #000)'
          }}
        >
          EARLY ACCESS
        </span>
      </div>
      <h3 className="text-lg font-bold mb-2 text-center">
        {config.emailCapture.headline || `Get Early Access to ${config.domain.name}`}
      </h3>
      <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {config.emailCapture.description || `Be the first to know when ${config.domain.name} launches. Get exclusive early access and special offers.`}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className={`w-full px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          required
        />
        <button
          type="submit"
          className={`w-full py-2 px-4 ${themeClasses.primary || 'rounded font-bold text-sm transition'}`}
          style={brandStyles.primary}
        >
          {config.emailCapture.buttonText}
        </button>
      </form>
      
      <p className={`text-xs mt-3 text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.
      </p>
    </div>
  )
}