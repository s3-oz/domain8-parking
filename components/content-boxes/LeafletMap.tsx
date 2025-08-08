'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet'
import { useEffect } from 'react'

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

interface LeafletMapProps {
  center: [number, number]
  zoom: number
  height: string
  locations: MapLocation[]
  showRadius?: boolean
  radiusMeters?: number
  isDark?: boolean
  brandColors?: {
    primary: string
    secondary: string
    accent?: string
  }
}

// Fix for default markers not showing
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

export default function LeafletMap({
  center,
  zoom,
  height,
  locations,
  showRadius = false,
  radiusMeters = 1000,
  isDark = false,
  brandColors
}: LeafletMapProps) {
  
  // Create custom icon with emoji or symbol
  const createCustomIcon = (emoji: string = '📍', color?: string) => {
    const markerColor = color || brandColors?.primary || '#D97A34'
    
    return L.divIcon({
      html: `
        <div style="
          background: ${markerColor};
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-45deg);
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          <span style="transform: rotate(45deg); font-size: 20px;">
            ${emoji}
          </span>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
    })
  }
  
  // Determine tile layer based on dark mode
  const tileUrl = isDark 
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  
  const attribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  
  return (
    <div style={{ height, position: 'relative' }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        keyboard={false}
        zoomControl={false}
      >
        <TileLayer
          attribution={attribution}
          url={tileUrl}
        />
        
        {/* Optional radius circle */}
        {showRadius && (
          <Circle
            center={center}
            radius={radiusMeters}
            pathOptions={{
              fillColor: brandColors?.primary || '#D97A34',
              fillOpacity: 0.1,
              color: brandColors?.primary || '#D97A34',
              weight: 2,
            }}
          />
        )}
        
        {/* Location markers */}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.icon || '📍')}
          >
            <Tooltip direction="top" offset={[0, -36]} opacity={0.9}>
              <div className="font-semibold">{location.name}</div>
              {location.type && (
                <div className="text-xs text-gray-600">{location.type}</div>
              )}
            </Tooltip>
            
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg mb-1">{location.name}</h3>
                {location.rating && (
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm">{location.rating}</span>
                  </div>
                )}
                {location.address && (
                  <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                )}
                {location.description && (
                  <p className="text-sm mt-2">{location.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg z-[1000]">
        <div className="text-xs font-semibold mb-1">
          {locations.length} Location{locations.length !== 1 ? 's' : ''}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Click markers for details
        </div>
      </div>
    </div>
  )
}