'use client'

import { useState } from 'react'
import { DomainConfig } from '@/lib/types'

interface DomainInquiryProps {
  config: DomainConfig
}

export function DomainInquiry({ config }: DomainInquiryProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    offer: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const isDark = config.template.colorMode === 'dark'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'domain',
          domain: config.domain.name,
          data: formData
        })
      })
      
      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className={`text-2xl mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>✓</div>
        <h3 className="text-lg font-bold mb-2">Thank You!</h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          We'll review your inquiry and get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Domain Inquiry</h2>
      <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        Interested in purchasing <strong>{config.domain.name}</strong>? Send us your offer.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
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
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={`w-full px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className={`w-full px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          required
        />
        <input
          type="text"
          placeholder="Offer Amount (AUD)"
          value={formData.offer}
          onChange={(e) => setFormData({...formData, offer: e.target.value})}
          className={`w-full px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
        <textarea
          placeholder="Additional Message (Optional)"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows={3}
          className={`w-full px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded font-bold text-sm transition ${
            loading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'SUBMITTING...' : 'SUBMIT INQUIRY'}
        </button>
      </form>
    </div>
  )
}