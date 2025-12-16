'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, MapPin, School, X, ChevronRight } from 'lucide-react'

interface Sekolah {
  id: string
  sekolah: string
  bentuk: string
  kabupaten_kota: string
  lintang: string
  bujur: string
}

interface SearchBarProps {
  schools: Sekolah[]
  onSchoolSelect?: (school: Sekolah) => void
}

export default function SearchBar({ schools, onSchoolSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Filter schools based on query
  const filteredSchools = useMemo(() => {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase()
    return schools
      .filter(school => {
        const searchable = `
          ${school.sekolah} 
          ${school.bentuk} 
          ${school.kabupaten_kota}
        `.toLowerCase()
        return searchable.includes(lowerQuery)
      })
      .slice(0, 10) // Limit results
  }, [query, schools])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSchoolSelect = (school: Sekolah) => {
    setSelectedSchool(school)
    setQuery(school.sekolah)
    setIsOpen(false)
    if (onSchoolSelect) {
      onSchoolSelect(school)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSelectedSchool(null)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full md:w-96" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari sekolah, kabupaten, atau jenis sekolah..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredSchools.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="py-2">
            {filteredSchools.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSchoolSelect(school)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <School className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="font-medium text-gray-900 truncate">
                      {school.sekolah}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <MapPin className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">
                      {school.kabupaten_kota}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      school.bentuk === 'SD' ? 'bg-blue-100 text-blue-800' :
                      school.bentuk === 'SMP' ? 'bg-green-100 text-green-800' :
                      school.bentuk === 'SMA' ? 'bg-purple-100 text-purple-800' :
                      school.bentuk === 'SMK' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {school.bentuk}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 px-4 py-2 text-sm text-gray-500">
            {filteredSchools.length} hasil ditemukan
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && filteredSchools.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="text-center text-gray-500">
            Tidak ditemukan sekolah dengan kata kunci "{query}"
          </div>
        </div>
      )}

      {/* Selected School Info */}
      {selectedSchool && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-blue-900">{selectedSchool.sekolah}</div>
              <div className="text-sm text-blue-700">{selectedSchool.kabupaten_kota}</div>
            </div>
            <button
              onClick={clearSearch}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}