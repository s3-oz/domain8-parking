'use client'

import { useState } from 'react'
import { DomainConfig } from '@/lib/types'

interface EmailCaptureProps {
  config: DomainConfig
}

export function EmailCapture({ config }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  const isDark = config.template.colorMode === 'dark'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to your email service
    console.log('Email captured:', { firstName, email })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
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
      <h3 className="text-lg font-bold mb-2">
        {config.emailCapture.headline}
      </h3>
      <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {config.emailCapture.description}
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
          className={`w-full py-2 px-4 rounded font-bold text-sm transition ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {config.emailCapture.buttonText}
        </button>
      </form>
    </div>
  )
}