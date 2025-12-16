'use client'

import { useState } from 'react'
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Navigation, 
  Layers, 
  Map,
  Satellite,
  Globe
} from 'lucide-react'

export default function MapControls() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeLayer, setActiveLayer] = useState<'street' | 'satellite' | 'topo'>('street')

  const tileLayers = {
    street: {
      name: 'Street Map',
      icon: <Map className="w-4 h-4" />,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    satellite: {
      name: 'Satellite',
      icon: <Satellite className="w-4 h-4" />,
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    },
    topo: {
      name: 'Topography',
      icon: <Globe className="w-4 h-4" />,
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
    }
  }

  const handleLayerChange = (layer: 'street' | 'satellite' | 'topo') => {
    setActiveLayer(layer)
    // Implement layer change logic here
    console.log('Changing to layer:', layer)
  }

  const handleZoomIn = () => {
    // Implement zoom in logic
    console.log('Zoom in')
  }

  const handleZoomOut = () => {
    // Implement zoom out logic
    console.log('Zoom out')
  }

  const handleLocate = () => {
    // Implement geolocation logic
    console.log('Locate user')
  }

  const handleFullscreen = () => {
    // Implement fullscreen logic
    console.log('Toggle fullscreen')
  }

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
      {/* Main Controls */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
        >
          <Layers className="w-5 h-5 text-gray-700" />
        </button>
        
        {isExpanded && (
          <div className="border-t border-gray-200 py-2">
            {Object.entries(tileLayers).map(([key, layer]) => (
              <button
                key={key}
                onClick={() => handleLayerChange(key as any)}
                className={`w-full flex items-center px-3 py-2 text-sm hover:bg-gray-50 ${
                  activeLayer === key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="mr-2">{layer.icon}</span>
                {layer.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Utility Controls */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <button
          onClick={handleLocate}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200"
          title="Lokasi saya"
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleFullscreen}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
          title="Fullscreen"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Layer Indicator */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow border border-gray-200">
        <div className="flex items-center">
          <span className="text-xs font-medium text-gray-700 mr-2">Layer:</span>
          <span className="text-sm text-gray-600 capitalize">{activeLayer}</span>
        </div>
      </div>
    </div>
  )
}