import Link from 'next/link'
import heroDemo from '@/configs/hero-demo.com.au.json'
import landingDemo from '@/configs/landing-demo.com.au.json'

export default function HomePage() {
  const domains = [
    {
      name: 'hero-demo.com.au',
      template: heroDemo.template.type,
      theme: heroDemo.template.theme,
      colorMode: heroDemo.template.colorMode
    },
    {
      name: 'landing-demo.com.au',
      template: landingDemo.template.type,
      theme: landingDemo.template.theme,
      colorMode: landingDemo.template.colorMode
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Domain8 Clean</h1>
        <p className="text-gray-600 mb-8">Tier 0 Domain Monetization System</p>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Available Domains</h2>
          
          {domains.length === 0 ? (
            <p className="text-gray-500">No domain configurations found. Add JSON files to the /configs directory.</p>
          ) : (
            <div className="space-y-2">
              {domains.map((domain) => (
                <Link
                  key={domain.name}
                  href={`/${domain.name}`}
                  className="block p-3 rounded hover:bg-gray-50 border border-gray-200 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-600">{domain.name}</div>
                      <div className="text-sm text-gray-500">View site →</div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2">
                        {domain.template && (
                          <span className={`px-2 py-1 text-xs rounded ${
                            domain.template === 'hero' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {domain.template.toUpperCase()}
                          </span>
                        )}
                        {domain.theme && (
                          <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                            {domain.theme}
                          </span>
                        )}
                        {domain.colorMode && (
                          <span className={`px-2 py-1 text-xs rounded ${
                            domain.colorMode === 'dark' 
                              ? 'bg-gray-700 text-gray-200' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {domain.colorMode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">Quick Start</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Add domain JSON configs to <code className="bg-blue-100 px-1 rounded">/configs</code></li>
            <li>2. Access domains at <code className="bg-blue-100 px-1 rounded">/[domain-name]</code></li>
            <li>3. Templates and themes are applied automatically</li>
          </ol>
        </div>
      </div>
    </div>
  )
}