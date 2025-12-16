'use client'

import { useState, useEffect, memo } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Memoize MapComponent untuk prevent unnecessary re-renders
const MapComponent = memo(dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat peta sekolah...</p>
      </div>
    </div>
  )
}))

interface MapContainerProps {
  schools: any[]
}

function MapContainer({ schools }: MapContainerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat peta sekolah...</p>
        </div>
      </div>
    )
  }

  return <MapComponent schools={schools} />
}

// Add display name for debugging
MapContainer.displayName = 'MapContainer'

export default MapContainer