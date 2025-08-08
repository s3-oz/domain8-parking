'use client'

import { DomainConfig } from '@/lib/types'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import map component to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
    </div>
  )
})

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  type?: string
  description?: string
  icon?: string
  address?: string
  rating?: number
}

interface MapBoxProps {
  content: {
    center?: [number, number]
    zoom?: number
    height?: string
    locations?: MapLocation[]
    showRadius?: boolean
    radiusMeters?: number
    title?: string
    subtitle?: string
  }
  config: DomainConfig
}

export function MapBox({ content, config }: MapBoxProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const isDark = config.template.colorMode === 'dark'
  
  // Default Melbourne CBD if no center provided
  const center = content.center || [-37.8136, 144.9631]
  const zoom = content.zoom || 14
  const height = content.height || '400px'
  
  // Default some Melbourne breweries if no locations provided
  const defaultLocations: MapLocation[] = [
    {
      id: '1',
      name: 'Stomping Ground Brewing Co',
      lat: -37.8023,
      lng: 144.9737,
      type: 'brewery',
      icon: '🍺',
      address: '100 Gipps St, Collingwood',
      description: 'Award-winning craft brewery with beer garden',
      rating: 4.5
    },
    {
      id: '2',
      name: 'Moon Dog World',
      lat: -37.8262,
      lng: 144.9023,
      type: 'brewery',
      icon: '🍺',
      address: '32 Chifley Dr, Preston',
      description: 'Wild brewery with lagoon and tropical vibes',
      rating: 4.6
    },
    {
      id: '3',
      name: 'Mountain Goat Brewery',
      lat: -37.8285,
      lng: 144.9914,
      type: 'brewery',
      icon: '🍺',
      address: '80 North St, Richmond',
      description: 'Iconic Melbourne brewery since 1997',
      rating: 4.4
    },
    {
      id: '4',
      name: 'Colonial Brewing Co',
      lat: -37.8698,
      lng: 144.9964,
      type: 'brewery',
      icon: '🍺',
      address: '68-72 Bertie St, Port Melbourne',
      description: 'Waterfront brewery and kitchen',
      rating: 4.3
    },
    {
      id: '5',
      name: 'Two Birds Brewing',
      lat: -37.7593,
      lng: 145.0015,
      type: 'brewery',
      icon: '🍺',
      address: '136 Hall St, Spotswood',
      description: 'Female-owned craft brewery',
      rating: 4.5
    }
  ]
  
  const locations = content.locations || defaultLocations
  
  if (!isClient) {
    return (
      <div style={{ height }} className="bg-gray-100 animate-pulse flex items-center justify-center">
        <span className="text-gray-400">Loading map...</span>
      </div>
    )
  }
  
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {(content.title || content.subtitle) && (
        <div className="text-center mb-4">
          {content.title && (
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {content.title}
            </h3>
          )}
          {content.subtitle && (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {content.subtitle}
            </p>
          )}
        </div>
      )}
      <DynamicMap
        center={center}
        zoom={zoom}
        height={height}
        locations={locations}
        showRadius={content.showRadius}
        radiusMeters={content.radiusMeters}
        isDark={isDark}
        brandColors={config.template.brandColors}
      />
    </div>
  )
}