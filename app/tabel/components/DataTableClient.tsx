// /app/tabel/components/DataTableClient.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // TAMBAHKAN
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  FilterFn,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  MapPin,
  Copy,
  ExternalLink,
  X,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { Sekolah } from '../types/sekolah';

// Define custom filter functions
const fuzzyFilter: FilterFn<Sekolah> = (row, columnId, value, addMeta) => {
  const itemValue = row.getValue(columnId) as string;
  if (!value) return true;
  return itemValue?.toLowerCase().includes(value.toLowerCase());
};

interface DataTableClientProps {
  initialData: Sekolah[];
  pageSize?: number;
  onRowClick?: (sekolah: Sekolah) => void;
  onViewOnMap?: (sekolah: Sekolah) => void;
  activeFilters?: {
    kabupaten: string[];
    jenis: string[];
    status: string[];
    searchQuery: string;
  };
  onFilterChange?: (filters: any) => void;
}

export default function DataTableClient({ 
  initialData, 
  pageSize = 50,
  onRowClick,
  onViewOnMap,
  activeFilters = {
    kabupaten: [],
    jenis: [],
    status: [],
    searchQuery: '',
  },
  onFilterChange,
}: DataTableClientProps) {
  const router = useRouter(); // TAMBAHKAN
  
  // States
  const [data, setData] = useState<Sekolah[]>(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState(activeFilters.searchQuery);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [filteredCount, setFilteredCount] = useState(initialData.length);
  const [copiedNPSN, setCopiedNPSN] = useState<string | null>(null); // TAMBAHKAN
  
  // Update data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Apply external filters
  useEffect(() => {
    let filteredData = initialData;
    
    // Apply kabupaten filter
    if (activeFilters.kabupaten.length > 0) {
      filteredData = filteredData.filter(sekolah => 
        activeFilters.kabupaten.includes(sekolah.kabupaten_kota)
      );
    }
    
    // Apply jenis filter
    if (activeFilters.jenis.length > 0) {
      filteredData = filteredData.filter(sekolah => 
        activeFilters.jenis.includes(sekolah.bentuk)
      );
    }
    
    // Apply status filter
    if (activeFilters.status.length > 0) {
      filteredData = filteredData.filter(sekolah => 
        activeFilters.status.includes(sekolah.status)
      );
    }
    
    // Apply search filter
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase();
      filteredData = filteredData.filter(sekolah => 
        sekolah.sekolah.toLowerCase().includes(query) ||
        sekolah.alamat_jalan.toLowerCase().includes(query) ||
        sekolah.npsn.includes(query) ||
        sekolah.kabupaten_kota.toLowerCase().includes(query)
      );
    }
    
    setData(filteredData);
    setFilteredCount(filteredData.length);
    setGlobalFilter(activeFilters.searchQuery);
    
  }, [initialData, activeFilters]);

  // Render sort icon function
  const renderSortIcon = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (!column?.getCanSort()) return null;
    
    const sortDirection = column.getIsSorted();
    if (sortDirection === 'asc') {
      return <ChevronUp size={14} className="text-blue-600" />;
    } else if (sortDirection === 'desc') {
      return <ChevronDown size={14} className="text-blue-600" />;
    }
    return <ChevronsUpDown size={14} className="text-gray-400" />;
  };

  // Define columns
  const columns = useMemo<ColumnDef<Sekolah>[]>(
    () => [
      {
        accessorKey: 'sekolah',
        header: 'Nama Sekolah',
        cell: ({ row }) => {
          const sekolah = row.original;
          return (
            <div className="min-w-[250px]">
              <div 
                className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer truncate group"
                onClick={(e) => {
                  const openInNewTab = e.ctrlKey || e.metaKey;
                  if (openInNewTab) {
                    window.open(`/tabel/${sekolah.npsn}`, '_blank');
                  } else {
                    router.push(`/tabel/${sekolah.npsn}`);
                  }
                }}
                title="Klik untuk lihat detail • Ctrl+Klik untuk tab baru"
              >
                {sekolah.sekolah}
                <ExternalLink size={12} className="inline-block ml-1 opacity-0 group-hover:opacity-100 text-blue-500" />
              </div>
              <div className="text-xs text-gray-500 truncate mt-1" title={sekolah.alamat_jalan}>
                {sekolah.alamat_jalan}
              </div>
            </div>
          );
        },
        enableSorting: true,
        filterFn: fuzzyFilter,
        size: 300,
      },
      {
        accessorKey: 'npsn',
        header: 'NPSN',
        cell: ({ row }) => {
          const npsn = row.getValue('npsn') as string;
          return (
            <div className="font-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{npsn}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyNPSN(npsn);
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors relative"
                  title="Salin NPSN"
                >
                  <Copy size={12} className={`${
                    copiedNPSN === npsn ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                  }`} />
                  {copiedNPSN === npsn && (
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded whitespace-nowrap">
                      Disalin!
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        },
        enableSorting: true,
        size: 120,
      },
      {
        accessorKey: 'bentuk',
        header: 'Jenjang',
        cell: ({ row }) => {
          const bentuk = row.getValue('bentuk') as string;
          const colorMap: Record<string, string> = {
            'SD': 'bg-blue-100 text-blue-800 border border-blue-200',
            'SMP': 'bg-green-100 text-green-800 border border-green-200',
            'SMA': 'bg-purple-100 text-purple-800 border border-purple-200',
            'SMK': 'bg-orange-100 text-orange-800 border border-orange-200',
            'SLB': 'bg-red-100 text-red-800 border border-red-200',
          };
          
          return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[bentuk] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
              {bentuk}
            </span>
          );
        },
        enableSorting: true,
        filterFn: 'includesString',
        size: 100,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          return (
            <span className={`px-2.5 py-1 rounded text-xs font-medium ${
              status === 'N' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {status === 'N' ? 'Negeri' : 'Swasta'}
            </span>
          );
        },
        enableSorting: true,
        size: 100,
      },
      {
        accessorKey: 'kabupaten_kota',
        header: 'Kabupaten/Kota',
        cell: ({ row }) => (
          <div className="text-sm">
            <div className="font-medium text-gray-800">{row.getValue('kabupaten_kota')}</div>
            <div className="text-xs text-gray-500 mt-1">{row.original.kecamatan}</div>
          </div>
        ),
        enableSorting: true,
        filterFn: fuzzyFilter,
        size: 200,
      },
      {
        accessorKey: 'lintang',
        header: 'Koordinat',
        cell: ({ row }) => {
          const sekolah = row.original;
          const lat = parseFloat(sekolah.lintang);
          const lng = parseFloat(sekolah.bujur);
          
          if (isNaN(lat) || isNaN(lng)) {
            return (
              <div className="text-xs text-gray-400 italic">
                Tidak ada koordinat
              </div>
            );
          }
          
          const hasValidCoords = !isNaN(lat) && !isNaN(lng);
          
          return (
            <div className="text-xs">
              <div className="font-mono">{lat.toFixed(6)}</div>
              <div className="font-mono">{lng.toFixed(6)}</div>
              {hasValidCoords && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOnMap(sekolah);
                  }}
                  className="mt-1 text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                  title="Lihat di Google Maps"
                >
                  <MapPin size={10} />
                  Lihat Peta
                </button>
              )}
            </div>
          );
        },
        enableSorting: false,
        size: 140,
      },
      {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
          const sekolah = row.original;
          const hasValidCoords = !isNaN(parseFloat(sekolah.lintang)) && !isNaN(parseFloat(sekolah.bujur));
          
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const openInNewTab = e.ctrlKey || e.metaKey;
                  if (openInNewTab) {
                    window.open(`/tabel/${sekolah.npsn}`, '_blank');
                  } else {
                    router.push(`/tabel/${sekolah.npsn}`);
                  }
                }}
                className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                title="Lihat Detail (Ctrl+Klik untuk tab baru)"
              >
                <ExternalLink size={16} />
              </button>
              
              {hasValidCoords && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOnMap(sekolah);
                  }}
                  className="p-2 hover:bg-green-50 text-green-600 rounded transition-colors"
                  title="Lihat di Google Maps"
                >
                  <MapPin size={16} />
                </button>
              )}
            </div>
          );
        },
        enableSorting: false,
        size: 100,
      },
    ],
    [copiedNPSN, router]
  );

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Event Handlers
  const handleRowClick = useCallback((sekolah: Sekolah) => {
    // Navigasi ke halaman detail dengan NPSN
    router.push(`/tabel/${sekolah.npsn}`);
  }, [router]);

  const handleViewOnMap = useCallback((sekolah: Sekolah) => {
    const lat = parseFloat(sekolah.lintang);
    const lng = parseFloat(sekolah.bujur);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
      // Fallback ke pencarian alamat
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(sekolah.alamat_jalan + ', ' + sekolah.kabupaten_kota)}`, '_blank');
    }
    
    if (onViewOnMap) {
      onViewOnMap(sekolah);
    }
  }, [onViewOnMap]);

  const handleCopyNPSN = useCallback(async (npsn: string) => {
    try {
      await navigator.clipboard.writeText(npsn);
      setCopiedNPSN(npsn);
      setTimeout(() => setCopiedNPSN(null), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleExportCSV = useCallback(() => {
    const headers = table.getAllColumns()
      .filter(col => col.getIsVisible())
      .map(col => {
        const header = col.columnDef.header;
        return typeof header === 'string' ? header : col.id;
      })
      .filter(Boolean) as string[];
    
    const rows = table.getFilteredRowModel().rows.map(row => 
      table.getAllColumns()
        .filter(col => col.getIsVisible())
        .map(col => {
          const cellValue = row.getValue(col.id);
          // Format khusus untuk beberapa kolom
          if (col.id === 'status') {
            return cellValue === 'N' ? 'Negeri' : 'Swasta';
          }
          // Handle special characters for CSV
          const value = String(cellValue || '');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    );
    
    const csvContent = [
      headers.join(','),
      ...rows
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `data-sekolah-jatim-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [table]);

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((columnId: string) => {
    table.setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  }, [table]);

  // Handle search from TabelHeader
  const handleSearchChange = useCallback((value: string) => {
    setGlobalFilter(value);
    if (onFilterChange) {
      onFilterChange({ ...activeFilters, searchQuery: value });
    }
  }, [onFilterChange, activeFilters]);

  // Check if any filters are active
  const isFiltered = useMemo(() => {
    return activeFilters.kabupaten.length > 0 || 
           activeFilters.jenis.length > 0 || 
           activeFilters.status.length > 0 ||
           activeFilters.searchQuery.length > 0;
  }, [activeFilters]);

  return (
    <div className="space-y-4">
      {/* Active Filters Bar */}
      {isFiltered && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-800 flex items-center gap-1">
              <Filter size={14} />
              Filter Aktif:
            </span>
            
            {/* Kabupaten Filters */}
            {activeFilters.kabupaten.map(kab => (
              <span key={kab} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-700">
                📍 {kab}
                <button
                  onClick={() => {
                    if (onFilterChange) {
                      onFilterChange({
                        ...activeFilters,
                        kabupaten: activeFilters.kabupaten.filter(k => k !== kab)
                      });
                    }
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  title="Hapus filter"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            
            {/* Jenis Filters */}
            {activeFilters.jenis.map(jenis => (
              <span key={jenis} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-700">
                🎓 {jenis}
                <button
                  onClick={() => {
                    if (onFilterChange) {
                      onFilterChange({
                        ...activeFilters,
                        jenis: activeFilters.jenis.filter(j => j !== jenis)
                      });
                    }
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  title="Hapus filter"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            
            {/* Status Filters */}
            {activeFilters.status.map(status => (
              <span key={status} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-700">
                {status === 'N' ? '🏫 Negeri' : '🏢 Swasta'}
                <button
                  onClick={() => {
                    if (onFilterChange) {
                      onFilterChange({
                        ...activeFilters,
                        status: activeFilters.status.filter(s => s !== status)
                      });
                    }
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  title="Hapus filter"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
            
            {/* Search Filter */}
            {activeFilters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-700">
                🔍 "{activeFilters.searchQuery}"
                <button
                  onClick={() => {
                    if (onFilterChange) {
                      onFilterChange({ ...activeFilters, searchQuery: '' });
                    }
                    setGlobalFilter('');
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                  title="Hapus pencarian"
                >
                  <X size={10} />
                </button>
              </span>
            )}
            
            {/* Clear All */}
            {isFiltered && (
              <button
                onClick={() => {
                  if (onFilterChange) {
                    onFilterChange({ kabupaten: [], jenis: [], status: [], searchQuery: '' });
                  }
                  setGlobalFilter('');
                }}
                className="ml-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <X size={12} />
                Hapus Semua Filter
              </button>
            )}
          </div>
          
          {/* Filter Summary */}
          <div className="mt-2 text-xs text-blue-700 flex items-center gap-3">
            <span>
              Menampilkan <strong>{filteredCount.toLocaleString('id-ID')}</strong> dari{' '}
              <strong>{initialData.length.toLocaleString('id-ID')}</strong> data
            </span>
            {filteredCount !== initialData.length && (
              <span className="px-2 py-0.5 bg-blue-100 rounded-full">
                {Math.round((filteredCount / initialData.length) * 100)}% data terfilter
              </span>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        {/* Global Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari sekolah, alamat, atau kabupaten..."
              value={globalFilter ?? ''}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            />
            {globalFilter && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                title="Hapus pencarian"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Column Visibility */}
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
              <Eye size={16} />
              Kolom
              <ChevronDown size={14} />
            </button>
            
            <div className="absolute right-0 mt-1 w-56 bg-white border rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tampilkan Kolom
                </div>
                {table.getAllColumns()
                  .filter(column => column.getCanHide())
                  .map(column => (
                    <label
                      key={column.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={() => toggleColumnVisibility(column.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 flex-1">
                        {typeof column.columnDef.header === 'string' 
                          ? column.columnDef.header 
                          : column.id}
                      </span>
                      {column.getIsVisible() && (
                        <Eye size={14} className="text-green-600" />
                      )}
                    </label>
                  ))}
                <div className="border-t pt-2">
                  <button
                    onClick={() => {
                      table.getAllColumns().forEach(col => {
                        if (col.getCanHide()) {
                          table.setColumnVisibility(prev => ({ ...prev, [col.id]: true }));
                        }
                      });
                    }}
                    className="w-full text-left px-2 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    Tampilkan Semua
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-900' : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {renderSortIcon(header.column.id)}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                      <AlertCircle size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Tidak ada data ditemukan
                      </p>
                      <p className="text-sm text-gray-500 mb-6 text-center">
                        {isFiltered 
                          ? "Coba ubah filter atau kata kunci pencarian Anda" 
                          : "Data sedang dimuat atau tidak tersedia"}
                      </p>
                      {isFiltered && (
                        <button
                          onClick={() => {
                            if (onFilterChange) {
                              onFilterChange({ kabupaten: [], jenis: [], status: [], searchQuery: '' });
                            }
                          }}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Reset Semua Filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => {
                  const sekolah = row.original;
                  return (
                    <tr 
                      key={row.id}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedRow === sekolah.npsn ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleRowClick(sekolah)}
                      title="Klik untuk lihat detail • Ctrl+Klik untuk tab baru"
                    >
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          className="px-4 py-3.5 text-sm"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-sm text-gray-600">
          Menampilkan{' '}
          <span className="font-medium">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{' '}
          -{' '}
          <span className="font-medium">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{' '}
          dari{' '}
          <span className="font-medium">
            {table.getFilteredRowModel().rows.length.toLocaleString('id-ID')}
          </span>{' '}
          data
        </div>

        <div className="flex items-center gap-4">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {[10, 25, 50, 100].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} per halaman
                </option>
              ))}
            </select>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Halaman pertama"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Halaman sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-2 mx-2">
              <span className="text-sm font-medium">
                Halaman {table.getState().pagination.pageIndex + 1}
              </span>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-600">
                {table.getPageCount()}
              </span>
            </div>
            
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Halaman berikutnya"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Halaman terakhir"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Table Information Footer */}
      <div className="pt-2 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Klik baris untuk lihat detail sekolah</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink size={12} className="text-blue-500" />
              <span>Ctrl+Klik untuk buka di tab baru</span>
            </div>
          </div>
          
          <div className="text-xs">
            <span className="font-medium">Hotkeys:</span>
            <span className="ml-2">
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl</kbd>
              <span className="mx-1">+</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Klik</kbd>
              <span className="ml-2">= Buka detail di tab baru</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}