// /app/tabel/components/FilterSidebar.tsx
'use client';

import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { TableFilters } from './TabelHeader';
import { useState } from 'react';

interface FilterSidebarProps {
  filterOptions: {
    kabupaten: string[];
    jenis: string[];
    status: string[];
  };
  activeFilters: TableFilters;
  onFilterChange: (filters: TableFilters) => void;
  totalData: number;
  filteredData: number;
}

export default function FilterSidebar({
  filterOptions,
  activeFilters,
  onFilterChange,
  totalData,
  filteredData,
}: FilterSidebarProps) {
  // State untuk expand/collapse sections
  const [expandedSections, setExpandedSections] = useState({
    kabupaten: true,
    jenis: true,
    status: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handler untuk toggle filter
  const handleFilterToggle = (
    category: keyof Pick<TableFilters, 'kabupaten' | 'jenis' | 'status'>, 
    value: string
  ) => {
    const currentValues = activeFilters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...activeFilters,
      [category]: newValues
    });
  };

  // Handler untuk select all/none
  const handleSelectAll = (category: keyof Pick<TableFilters, 'kabupaten' | 'jenis' | 'status'>) => {
    if (activeFilters[category].length === filterOptions[category].length) {
      // Jika semua sudah dipilih, hapus semua
      onFilterChange({
        ...activeFilters,
        [category]: []
      });
    } else {
      // Pilih semua
      onFilterChange({
        ...activeFilters,
        [category]: [...filterOptions[category]]
      });
    }
  };

  return (
    <div className="divide-y">
      {/* Kabupaten/Kota Filter */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('kabupaten')}
          className="flex items-center justify-between w-full mb-2"
        >
          <h4 className="font-semibold text-gray-800">📍 Kabupaten/Kota</h4>
          {expandedSections.kabupaten ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.kabupaten && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {activeFilters.kabupaten.length} dari {filterOptions.kabupaten.length} dipilih
              </span>
              <button
                onClick={() => handleSelectAll('kabupaten')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {activeFilters.kabupaten.length === filterOptions.kabupaten.length 
                  ? 'Hapus Semua' 
                  : 'Pilih Semua'}
              </button>
            </div>
            
            <div className="max-h-64 overflow-y-auto pr-2 space-y-2">
              {filterOptions.kabupaten.map(kabupaten => (
                <label
                  key={kabupaten}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.kabupaten.includes(kabupaten)}
                    onChange={() => handleFilterToggle('kabupaten', kabupaten)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {kabupaten}
                  </span>
                  {activeFilters.kabupaten.includes(kabupaten) && (
                    <Check size={14} className="text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Jenis Sekolah Filter */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('jenis')}
          className="flex items-center justify-between w-full mb-2"
        >
          <h4 className="font-semibold text-gray-800">🎓 Jenjang Sekolah</h4>
          {expandedSections.jenis ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.jenis && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {activeFilters.jenis.length} dari {filterOptions.jenis.length} dipilih
              </span>
              <button
                onClick={() => handleSelectAll('jenis')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {activeFilters.jenis.length === filterOptions.jenis.length 
                  ? 'Hapus Semua' 
                  : 'Pilih Semua'}
              </button>
            </div>
            
            <div className="space-y-2">
              {filterOptions.jenis.map(jenis => (
                <label
                  key={jenis}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.jenis.includes(jenis)}
                    onChange={() => handleFilterToggle('jenis', jenis)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {jenis}
                  </span>
                  {activeFilters.jenis.includes(jenis) && (
                    <Check size={14} className="text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Status Sekolah Filter */}
      <div className="p-4">
        <button
          onClick={() => toggleSection('status')}
          className="flex items-center justify-between w-full mb-2"
        >
          <h4 className="font-semibold text-gray-800">🏫 Status Sekolah</h4>
          {expandedSections.status ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        
        {expandedSections.status && (
          <>
            <div className="mb-3">
              <span className="text-sm text-gray-600">
                {activeFilters.status.length} dari {filterOptions.status.length} dipilih
              </span>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.status.includes('N')}
                  onChange={() => handleFilterToggle('status', 'N')}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 flex-1">
                  Negeri
                </span>
                {activeFilters.status.includes('N') && (
                  <Check size={14} className="text-green-600" />
                )}
              </label>
              
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.status.includes('S')}
                  onChange={() => handleFilterToggle('status', 'S')}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700 flex-1">
                  Swasta
                </span>
                {activeFilters.status.includes('S') && (
                  <Check size={14} className="text-yellow-600" />
                )}
              </label>
            </div>
          </>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50">
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Total Data:</span>
            <span className="font-medium">{totalData.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Data Tampil:</span>
            <span className="font-medium">{filteredData.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Persentase:</span>
            <span className="font-medium">
              {totalData > 0 ? ((filteredData / totalData) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}