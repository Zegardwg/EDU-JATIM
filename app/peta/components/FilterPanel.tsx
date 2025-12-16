'use client'

import { useState, useMemo, useEffect } from 'react'
import { Filter, X, School, MapPin, Building2, Search, Check } from 'lucide-react'

interface Sekolah {
  id: string
  sekolah: string
  bentuk: string
  status: string
  kabupaten_kota: string
  lintang: string
  bujur: string
}

interface FilterPanelProps {
  schools: Sekolah[]
  onFilterChange?: (filters: {
    kabupaten: string[]
    jenis: string[]
    status: string[]
  }) => void
}

export default function FilterPanel({ schools, onFilterChange }: FilterPanelProps) {
  const [selectedKabupaten, setSelectedKabupaten] = useState<string[]>([])
  const [selectedJenis, setSelectedJenis] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [searchKabupaten, setSearchKabupaten] = useState('')

  // Extract unique values
  const uniqueKabupaten = useMemo(() => {
    const kabupatens = schools
      .map(s => s.kabupaten_kota?.trim())
      .filter(Boolean)
    return Array.from(new Set(kabupatens)).sort()
  }, [schools])

  const uniqueJenis = useMemo(() => {
    const jenis = schools.map(s => s.bentuk).filter(Boolean)
    return Array.from(new Set(jenis)).sort()
  }, [schools])

  // Filter kabupaten based on search
  const filteredKabupaten = useMemo(() => {
    if (!searchKabupaten.trim()) return uniqueKabupaten
    return uniqueKabupaten.filter(kab => 
      kab.toLowerCase().includes(searchKabupaten.toLowerCase())
    )
  }, [uniqueKabupaten, searchKabupaten])

  // Toggle functions
  const toggleKabupaten = (kabupaten: string) => {
    const newKabupaten = selectedKabupaten.includes(kabupaten)
      ? selectedKabupaten.filter(k => k !== kabupaten)
      : [...selectedKabupaten, kabupaten]
    setSelectedKabupaten(newKabupaten)
  }

  const toggleJenis = (jenis: string) => {
    const newJenis = selectedJenis.includes(jenis)
      ? selectedJenis.filter(j => j !== jenis)
      : [...selectedJenis, jenis]
    setSelectedJenis(newJenis)
  }

  const toggleStatus = (status: string) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status]
    setSelectedStatus(newStatus)
  }

  const resetFilters = () => {
    setSelectedKabupaten([])
    setSelectedJenis([])
    setSelectedStatus([])
    setSearchKabupaten('')
  }

  const selectAllKabupaten = () => {
    setSelectedKabupaten(uniqueKabupaten)
  }

  const clearAllKabupaten = () => {
    setSelectedKabupaten([])
  }

  // Calculate counts
  const filteredCount = useMemo(() => {
    return schools.filter(school => {
      if (selectedKabupaten.length > 0 && !selectedKabupaten.includes(school.kabupaten_kota?.trim())) return false
      if (selectedJenis.length > 0 && !selectedJenis.includes(school.bentuk)) return false
      if (selectedStatus.length > 0 && !selectedStatus.includes(school.status)) return false
      return true
    }).length
  }, [schools, selectedKabupaten, selectedJenis, selectedStatus])

  // Trigger filter change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        kabupaten: selectedKabupaten,
        jenis: selectedJenis,
        status: selectedStatus
      })
    }
  }, [selectedKabupaten, selectedJenis, selectedStatus, onFilterChange])

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Filter Peta</h2>
          </div>
          <div className="text-sm text-gray-600">
            {filteredCount} dari {schools.length} sekolah
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Kabupaten Filter */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-500 mr-2" />
              <h3 className="font-medium text-gray-700">Kabupaten/Kota</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAllKabupaten}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Pilih Semua
              </button>
              <button
                onClick={clearAllKabupaten}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchKabupaten}
              onChange={(e) => setSearchKabupaten(e.target.value)}
              placeholder="Cari kabupaten..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Kabupaten List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {filteredKabupaten.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                Tidak ditemukan kabupaten
              </div>
            ) : (
              filteredKabupaten.slice(0, 50).map(kabupaten => (
                <button
                  key={kabupaten}
                  onClick={() => toggleKabupaten(kabupaten)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                    selectedKabupaten.includes(kabupaten)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                >
                  <span className="truncate">{kabupaten}</span>
                  {selectedKabupaten.includes(kabupaten) && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
            {filteredKabupaten.length > 50 && (
              <div className="text-xs text-gray-500 text-center py-2">
                + {filteredKabupaten.length - 50} kabupaten lainnya
              </div>
            )}
          </div>
        </div>

        {/* Jenis Sekolah Filter */}
        <div>
          <div className="flex items-center mb-3">
            <School className="w-4 h-4 text-gray-500 mr-2" />
            <h3 className="font-medium text-gray-700">Jenis Sekolah</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {uniqueJenis.map(jenis => (
              <button
                key={jenis}
                onClick={() => toggleJenis(jenis)}
                className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                  selectedJenis.includes(jenis)
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{jenis}</span>
                {selectedJenis.includes(jenis) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Status Sekolah Filter */}
        <div>
          <div className="flex items-center mb-3">
            <Building2 className="w-4 h-4 text-gray-500 mr-2" />
            <h3 className="font-medium text-gray-700">Status Sekolah</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => toggleStatus('N')}
              className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                selectedStatus.includes('N')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span>Negeri</span>
              {selectedStatus.includes('N') && (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </button>
            <button
              onClick={() => toggleStatus('S')}
              className={`flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                selectedStatus.includes('S')
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span>Swasta</span>
              {selectedStatus.includes('S') && (
                <Check className="w-4 h-4 text-yellow-600" />
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedKabupaten.length > 0 || selectedJenis.length > 0 || selectedStatus.length > 0) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-2">Filter Aktif:</h4>
            <div className="space-y-1">
              {selectedKabupaten.length > 0 && (
                <div className="text-sm text-blue-700">
                  Kabupaten: {selectedKabupaten.length} dipilih
                </div>
              )}
              {selectedJenis.length > 0 && (
                <div className="text-sm text-blue-700">
                  Jenis: {selectedJenis.join(', ')}
                </div>
              )}
              {selectedStatus.length > 0 && (
                <div className="text-sm text-blue-700">
                  Status: {selectedStatus.map(s => s === 'N' ? 'Negeri' : 'Swasta').join(', ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <button
          onClick={resetFilters}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          Reset Semua Filter
        </button>
        <div className="text-xs text-gray-500 text-center">
          Filter diterapkan secara real-time
        </div>
      </div>
    </div>
  )
}