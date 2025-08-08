'use client'

import { useState } from 'react'
import { DomainConfig } from '@/lib/types'
import { getBrandStyles } from '@/lib/brand-colors'

interface BusinessInquiryProps {
  config: DomainConfig
}

export function BusinessInquiry({ config }: BusinessInquiryProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'venue', // venue or brewery
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const isDark = config.template.colorMode === 'dark'
  const brandStyles = getBrandStyles(config)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'business',
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
        <h3 className="text-lg font-bold mb-2">Welcome Aboard!</h3>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          We'll be in touch within 24 hours to discuss getting your venue on Brewhaus.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
          className={`px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          required
        />
        
        <input
          type="text"
          placeholder="Your Name"
          value={formData.contactName}
          onChange={(e) => setFormData({...formData, contactName: e.target.value})}
          className={`px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          required
        />
        
        <input
          type="email"
          placeholder="Business Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={`px-3 py-2 rounded text-sm ${
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
          className={`px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          required
        />
        
        <select
          value={formData.businessType}
          onChange={(e) => setFormData({...formData, businessType: e.target.value})}
          className={`px-3 py-2 rounded text-sm ${
            isDark 
              ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
        >
          <option value="venue">Venue/Bar/Pub</option>
          <option value="brewery">Brewery</option>
          <option value="bottleshop">Bottle Shop</option>
          <option value="other">Other</option>
        </select>
        
        <div className="md:col-span-2">
          <textarea
            placeholder="Tell us about your business (Optional)"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows={3}
            className={`w-full px-3 py-2 rounded text-sm ${
              isDark 
                ? 'bg-gray-900 border border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded font-bold text-sm transition ${
              loading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : ''
            }`}
            style={loading ? {} : brandStyles.primary}
          >
            {loading ? 'SUBMITTING...' : 'GET EARLY ACCESS'}
          </button>
        </div>
      </form>
    </div>
  )
}