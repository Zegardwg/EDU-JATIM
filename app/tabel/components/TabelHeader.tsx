// /app/tabel/components/TabelHeader.tsx
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Search,
  Download,
  X,
  ChevronDown,
  RefreshCw,
  Map,
  BookOpen,
  Filter,
  BarChart3,
  Building2,
  School,
  MapPin,
  Users,
} from "lucide-react";
import { Sekolah } from "../types/sekolah";

interface TabelHeaderProps {
  data: Sekolah[];
  onSearch: (query: string) => void;
  onExport: (format: "csv" | "excel" | "json") => void;
  onFilterChange?: (filters: TableFilters) => void;
  onRefresh?: () => void;
  onViewMap?: () => void;
  isLoading?: boolean;
  activeFilters?: TableFilters;
}

export interface TableFilters {
  kabupaten: string[];
  jenis: string[];
  status: string[];
  searchQuery: string;
}

export default function TabelHeader({
  data,
  onSearch,
  onExport,
  onFilterChange,
  onRefresh,
  onViewMap,
  isLoading = false,
  activeFilters = {
    kabupaten: [],
    jenis: [],
    status: [],
    searchQuery: "",
  },
}: TabelHeaderProps) {
  // States
  const [searchQuery, setSearchQuery] = useState(activeFilters.searchQuery || "");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [filteredStats, setFilteredStats] = useState({
    total: 0,
    negeri: 0,
    swasta: 0,
    withCoords: 0,
    kabupatenCount: 0,
    jenisCount: {} as Record<string, number>,
  });

  // Calculate filtered statistics
  useEffect(() => {
    if (!data.length) {
      setFilteredStats({
        total: 0,
        negeri: 0,
        swasta: 0,
        withCoords: 0,
        kabupatenCount: 0,
        jenisCount: {},
      });
      return;
    }

    // Filter data based on active filters
    let filteredData = [...data];
    
    if (activeFilters.kabupaten.length > 0) {
      filteredData = filteredData.filter(s => 
        activeFilters.kabupaten.includes(s.kabupaten_kota)
      );
    }
    
    if (activeFilters.jenis.length > 0) {
      filteredData = filteredData.filter(s => 
        activeFilters.jenis.includes(s.bentuk)
      );
    }
    
    if (activeFilters.status.length > 0) {
      filteredData = filteredData.filter(s => 
        activeFilters.status.includes(s.status)
      );
    }
    
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase();
      filteredData = filteredData.filter(s => 
        s.sekolah.toLowerCase().includes(query) ||
        s.alamat_jalan.toLowerCase().includes(query) ||
        s.npsn.includes(query) ||
        s.kabupaten_kota.toLowerCase().includes(query)
      );
    }

    const stats = {
      total: filteredData.length,
      negeri: filteredData.filter((s) => s.status === "N").length,
      swasta: filteredData.filter((s) => s.status === "S").length,
      withCoords: filteredData.filter((s) => {
        const lat = parseFloat(s.lintang);
        const lng = parseFloat(s.bujur);
        return !isNaN(lat) && !isNaN(lng);
      }).length,
      kabupatenCount: new Set(filteredData.map(s => s.kabupaten_kota)).size,
      jenisCount: filteredData.reduce((acc, sekolah) => {
        acc[sekolah.bentuk] = (acc[sekolah.bentuk] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    setFilteredStats(stats);
  }, [data, activeFilters]);

  // Event Handlers
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onSearch(value);

      if (onFilterChange) {
        onFilterChange({
          ...activeFilters,
          searchQuery: value,
        });
      }
    },
    [onSearch, onFilterChange, activeFilters]
  );

  const handleExport = useCallback(
    (format: "csv" | "excel" | "json") => {
      setShowExportMenu(false);
      onExport(format);
    },
    [onExport]
  );

  // Check if any filters are active
  const isFiltered = useMemo(() => {
    return activeFilters.kabupaten.length > 0 || 
           activeFilters.jenis.length > 0 || 
           activeFilters.status.length > 0 ||
           activeFilters.searchQuery.length > 0;
  }, [activeFilters]);

  // Calculate percentage
  const filteredPercentage = data.length > 0 
    ? Math.round((filteredStats.total / data.length) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Main Header - Compact like Kemenperin */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Left: Title and Stats */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Data Sekolah Jawa Timur
              </h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{filteredStats.total.toLocaleString("id-ID")}</span> data
                  {isFiltered && (
                    <span className="ml-1 text-blue-600">
                      ({filteredPercentage}% dari total)
                    </span>
                  )}
                </span>
                
                {isFiltered && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full flex items-center gap-1">
                    <Filter size={10} />
                    Filter Aktif
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Stats Button */}
          <div className="relative group">
            
            {/* Stats Popover */}
            <div className="absolute right-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-3">
                <div className="text-xs font-medium text-gray-500 mb-2">📊 STATISTIK DATA</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Data:</span>
                    <span className="font-medium">{filteredStats.total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Negeri:</span>
                    <span className="font-medium text-green-600">{filteredStats.negeri.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Swasta:</span>
                    <span className="font-medium text-yellow-600">{filteredStats.swasta.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dengan Koordinat:</span>
                    <span className="font-medium text-blue-600">{filteredStats.withCoords.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kabupaten:</span>
                    <span className="font-medium">{filteredStats.kabupatenCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              title="Refresh data"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          {/* View on Map Button */}
          {onViewMap && (
            <button
              onClick={onViewMap}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
              title="Lihat di peta interaktif"
            >
              <Map size={16} />
              <span className="hidden sm:inline">Peta</span>
            </button>
          )}

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown size={14} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Format Export
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleExport("csv")}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 rounded"
                    >
                      <Download size={14} />
                      CSV (.csv)
                    </button>
                    <button
                      onClick={() => handleExport("excel")}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 rounded"
                    >
                      <Download size={14} />
                      Excel (.xlsx)
                    </button>
                    <button
                      onClick={() => handleExport("json")}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 rounded"
                    >
                      <Download size={14} />
                      JSON (.json)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Summary - Only show when filtered */}
      {isFiltered && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Filter Terpasang:
              </span>
            </div>
            
            {/* Filter Summary Chips */}
            <div className="flex flex-wrap gap-2">
              {activeFilters.kabupaten.length > 0 && (
                <div className="px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-700 flex items-center gap-1">
                  <MapPin size={10} />
                  {activeFilters.kabupaten.length} Kabupaten
                </div>
              )}
              
              {activeFilters.jenis.length > 0 && (
                <div className="px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-700 flex items-center gap-1">
                  <School size={10} />
                  {activeFilters.jenis.length} Jenjang
                </div>
              )}
              
              {activeFilters.status.length > 0 && (
                <div className="px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-700 flex items-center gap-1">
                  <Building2 size={10} />
                  {activeFilters.status.length === 2 ? 'Semua Status' : 
                   activeFilters.status[0] === 'N' ? 'Negeri' : 'Swasta'}
                </div>
              )}
              
              {activeFilters.searchQuery && (
                <div className="px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-700 flex items-center gap-1">
                  <Search size={10} />
                  Pencarian: "{activeFilters.searchQuery}"
                </div>
              )}
            </div>
            
            {/* Clear All Button */}
            <button
              onClick={() => {
                if (onFilterChange) {
                  onFilterChange({ kabupaten: [], jenis: [], status: [], searchQuery: '' });
                }
                setSearchQuery('');
                onSearch('');
              }}
              className="ml-auto text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <X size={12} />
              Hapus Semua Filter
            </button>
          </div>
          
          {/* Data Summary */}
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Data Tampil:</span>
              <span className="font-medium">{filteredStats.total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Persentase:</span>
              <span className="font-medium">{filteredPercentage}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Negeri:</span>
              <span className="font-medium text-green-600">{filteredStats.negeri.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Swasta:</span>
              <span className="font-medium text-yellow-600">{filteredStats.swasta.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid - Inspired by Kemenperin Dataset Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-100 rounded">
              <Users size={14} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Total Data</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {filteredStats.total.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isFiltered ? 'Data terfilter' : 'Semua data'}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-green-300 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-100 rounded">
              <School size={14} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Negeri</span>
          </div>
          <div className="text-lg font-bold text-green-700">
            {filteredStats.negeri.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {filteredStats.total > 0 
              ? `${Math.round((filteredStats.negeri / filteredStats.total) * 100)}% dari tampil` 
              : '0%'}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-yellow-300 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-yellow-100 rounded">
              <Building2 size={14} className="text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Swasta</span>
          </div>
          <div className="text-lg font-bold text-yellow-700">
            {filteredStats.swasta.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {filteredStats.total > 0 
              ? `${Math.round((filteredStats.swasta / filteredStats.total) * 100)}% dari tampil` 
              : '0%'}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-purple-300 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-100 rounded">
              <MapPin size={14} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Koordinat</span>
          </div>
          <div className="text-lg font-bold text-purple-700">
            {filteredStats.withCoords.toLocaleString('id-ID')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {filteredStats.total > 0 
              ? `${Math.round((filteredStats.withCoords / filteredStats.total) * 100)}% punya lokasi` 
              : '0%'}
          </div>
        </div>
      </div>
    </div>
  );
}