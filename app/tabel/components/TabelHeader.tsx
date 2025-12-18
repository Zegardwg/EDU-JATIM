// /app/tabel/components/TabelHeader.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Search,
  Download,
  X,
  ChevronDown,
  RefreshCw,
  Map,
  BookOpen,
  AlertCircle,
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
  // PROPS BARU UNTUK INTEGRASI
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
  const [searchQuery, setSearchQuery] = useState(
    activeFilters.searchQuery || ""
  );
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Calculate statistics from data
  const stats = useMemo(() => {
    if (!data.length)
      return {
        total: 0,
        negeri: 0,
        swasta: 0,
        withCoords: 0,
        jenisCount: {} as Record<string, number>,
      };

    return {
      total: data.length,
      negeri: data.filter((s) => s.status === "N").length,
      swasta: data.filter((s) => s.status === "S").length,
      withCoords: data.filter((s) => {
        const lat = parseFloat(s.lintang);
        const lng = parseFloat(s.bujur);
        return !isNaN(lat) && !isNaN(lng);
      }).length,
      jenisCount: data.reduce((acc, sekolah) => {
        acc[sekolah.bentuk] = (acc[sekolah.bentuk] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [data]);

  // Event Handlers
  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onSearch(value);

      // Update filter state jika onFilterChange tersedia
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

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Left: Title and Stats */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen size={20} className="text-blue-600" />
            Data Sekolah Jawa Timur
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium text-gray-700">
                  {stats.total.toLocaleString("id-ID")}
                </span>
                <span className="text-gray-500 ml-1">sekolah</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">
                    {stats.negeri.toLocaleString("id-ID")} Negeri
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">
                    {stats.swasta.toLocaleString("id-ID")} Swasta
                  </span>
                </div>

                {stats.withCoords > 0 && (
                  <div className="flex items-center gap-1">
                    <Map size={12} className="text-blue-500" />
                    <span className="text-xs text-gray-600">
                      {stats.withCoords.toLocaleString("id-ID")} koordinat
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              title="Refresh data">
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
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
              title="Lihat di peta interaktif">
              <Map size={16} />
              <span className="hidden sm:inline">Lihat di Peta</span>
            </button>
          )}

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
              <ChevronDown size={14} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                    <Download size={14} />
                    Export CSV (.csv)
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                    <Download size={14} />
                    Export Excel (.xlsx)
                  </button>
                  <button
                    onClick={() => handleExport("json")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                    <Download size={14} />
                    Export JSON (.json)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Cari sekolah, NPSN, alamat, atau kabupaten..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Hapus pencarian">
            <X size={18} />
          </button>
        )}

        {/* Search Tips */}
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
          <AlertCircle size={12} />
          <span>Tips: Cari berdasarkan nama sekolah, NPSN, atau alamat</span>
        </div>
      </div>

      {/* Jenis Sekolah Quick Stats */}
      {Object.keys(stats.jenisCount).length > 0 && (
        <div className="bg-gray-50 border rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            📊 Distribusi Jenjang Sekolah
          </h4>
          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(stats.jenisCount)
              .sort((a, b) => b[1] - a[1])
              .map(([jenis, count]) => (
                <div key={jenis} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    {jenis}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    {count.toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
