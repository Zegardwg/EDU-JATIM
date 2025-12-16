'use client'

import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { memo } from 'react'

// Cache untuk icons
const iconCache = new Map<string, L.DivIcon>()

const getSchoolIcon = (jenis: string): L.DivIcon => {
  if (iconCache.has(jenis)) {
    return iconCache.get(jenis)!
  }

  const colorMap: Record<string, string> = {
    'SD': '#3b82f6', 'SMP': '#10b981',
    'SMA': '#8b5cf6', 'SMK': '#f97316',
    'SLB': '#ef4444',
  }
  const color = colorMap[jenis] || '#6b7280'

  const icon = L.divIcon({
    html: `<div style="
      background-color:${color};
      width:14px;
      height:14px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 1px 2px rgba(0,0,0,0.1);
    "></div>`,
    className: 'custom-school-icon',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

  iconCache.set(jenis, icon)
  return icon
}

const SchoolMarker = memo(({ school }: { school: any }) => {
  const lat = parseFloat(school.lintang)
  const lng = parseFloat(school.bujur)
  
  if (isNaN(lat) || isNaN(lng)) return null

  return (
    <Marker
      position={[lat, lng]}
      icon={getSchoolIcon(school.bentuk)}
    >
      <Popup>
        <div className="p-2 max-w-[200px]">
          <h3 className="font-bold text-sm text-gray-800 mb-1">{school.sekolah}</h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                school.bentuk === 'SD' ? 'bg-blue-100 text-blue-800' :
                school.bentuk === 'SMP' ? 'bg-green-100 text-green-800' :
                school.bentuk === 'SMA' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {school.bentuk}
              </span>
            </div>
            <p className="text-xs text-gray-600 truncate">{school.alamat_jalan}</p>
            <p className="text-xs text-gray-500">{school.kabupaten_kota}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  )
})

SchoolMarker.displayName = 'SchoolMarker'

export default SchoolMarker