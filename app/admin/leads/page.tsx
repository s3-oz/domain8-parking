'use client'

import { useEffect, useState } from 'react'

interface Lead {
  id: string
  leadType: string
  domain: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  message?: string
  status: string
  createdAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ type: '', domain: '' })

  useEffect(() => {
    fetchLeads()
  }, [filter])

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.type) params.append('type', filter.type)
      if (filter.domain) params.append('domain', filter.domain)
      
      const response = await fetch(`/api/submissions?${params}`)
      const data = await response.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Failed to fetch leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consumer': return 'bg-blue-100 text-blue-800'
      case 'domain': return 'bg-green-100 text-green-800'
      case 'business': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'converted': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading leads...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Lead Management</h1>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              <option value="consumer">Consumer</option>
              <option value="domain">Domain Inquiry</option>
              <option value="business">Business Inquiry</option>
            </select>
            
            <input
              type="text"
              placeholder="Filter by domain..."
              value={filter.domain}
              onChange={(e) => setFilter({ ...filter, domain: e.target.value })}
              className="px-4 py-2 border rounded-lg flex-1"
            />
            
            <button
              onClick={fetchLeads}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold">{leads.length}</div>
            <div className="text-gray-600">Total Leads</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold">
              {leads.filter(l => l.leadType === 'consumer').length}
            </div>
            <div className="text-gray-600">Consumers</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold">
              {leads.filter(l => l.leadType === 'domain').length}
            </div>
            <div className="text-gray-600">Domain Inquiries</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold">
              {leads.filter(l => l.leadType === 'business').length}
            </div>
            <div className="text-gray-600">Business Inquiries</div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Domain</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Message</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(lead.leadType)}`}>
                      {lead.leadType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {lead.domain}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>{lead.email}</div>
                    {lead.firstName && (
                      <div className="text-gray-500">
                        {lead.firstName} {lead.lastName}
                      </div>
                    )}
                    {lead.phone && (
                      <div className="text-gray-500">{lead.phone}</div>
                    )}
                    {lead.company && (
                      <div className="text-gray-500">{lead.company}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate">
                    {lead.message || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {leads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No leads found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}