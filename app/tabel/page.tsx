// /app/tabel/page.tsx - VERSI DIPERBAIKI
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllSekolahData } from "./lib/api";
import { processTableData } from "./lib/table-processing";
import { exportToCSV, exportToJSON, downloadFile } from "./lib/export-utils";
import TabelHeader from "./components/TabelHeader";
import DataTableClient from "./components/DataTableClient";
import FilterSidebar from "./components/FilterSidebar";
import { Sekolah } from "./types/sekolah";
import { Filter, X, Loader2, Database, BarChart3, MapPin } from "lucide-react";

interface TableFilters {
  kabupaten: string[];
  jenis: string[];
  status: string[];
  searchQuery: string;
}

interface ProgressData {
  page: number;
  totalFetched: number;
  currentPageData: number;
  message: string;
}

export default function TabelPage() {
  // States
  const [tableData, setTableData] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressData>({
    page: 1,
    totalFetched: 0,
    currentPageData: 0,
    message: "Memulai pengambilan data...",
  });

  // Filter state
  const [filters, setFilters] = useState<TableFilters>({
    kabupaten: [],
    jenis: [],
    status: [],
    searchQuery: "",
  });

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch data on component mount dengan progress indicator
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setIsFetching(true);
        setError(null);

        console.log("📥 Memulai pengambilan data sekolah Jawa Timur...");

        const sekolahData = await getAllSekolahData({
          maxPages: 40,
          perPage: 1000,
          delayBetweenPages: 30,
          onProgress: (progressData) => {
            setProgress(progressData);
          },
        });

        console.log(`✅ Data diterima: ${sekolahData.length} sekolah`);

        const processedData = processTableData(sekolahData);
        setTableData(processedData);
        setIsFetching(false);
      } catch (err) {
        console.error("❌ Error loading table data:", err);
        setError(
          "Gagal memuat data. Silakan refresh halaman atau coba lagi nanti."
        );
        setIsFetching(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter data berdasarkan filters
  const filteredData = useMemo(() => {
    if (tableData.length === 0) return [];

    let result = [...tableData];

    // Apply kabupaten filter
    if (filters.kabupaten.length > 0) {
      result = result.filter((sekolah) =>
        filters.kabupaten.includes(sekolah.kabupaten_kota)
      );
    }

    // Apply jenis filter
    if (filters.jenis.length > 0) {
      result = result.filter((sekolah) =>
        filters.jenis.includes(sekolah.bentuk)
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter((sekolah) =>
        filters.status.includes(sekolah.status)
      );
    }

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (sekolah) =>
          sekolah.sekolah.toLowerCase().includes(query) ||
          sekolah.alamat_jalan.toLowerCase().includes(query) ||
          sekolah.npsn.includes(query) ||
          sekolah.kabupaten_kota.toLowerCase().includes(query) ||
          sekolah.kecamatan.toLowerCase().includes(query)
      );
    }

    return result;
  }, [tableData, filters]);

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    if (tableData.length === 0) {
      return {
        kabupaten: [],
        jenis: [],
        status: [],
      };
    }

    const kabupatenList = Array.from(
      new Set(tableData.map((s) => s.kabupaten_kota).filter(Boolean))
    ).sort();

    const jenisList = Array.from(
      new Set(tableData.map((s) => s.bentuk).filter(Boolean))
    ).sort();

    const statusList = ["N", "S"];

    return {
      kabupaten: kabupatenList,
      jenis: jenisList,
      status: statusList,
    };
  }, [tableData]);

  // Handler untuk export
  const handleExport = (format: "csv" | "excel" | "json") => {
    const exportData = filteredData;

    switch (format) {
      case "csv":
        const csvContent = exportToCSV(exportData);
        downloadFile(
          csvContent,
          `sekolah-jatim.csv`,
          "text/csv;charset=utf-8;"
        );
        break;

      case "excel":
        alert("Fitur export Excel akan segera tersedia!");
        break;

      case "json":
        const jsonContent = exportToJSON(exportData);
        downloadFile(jsonContent, `sekolah-jatim.json`, "application/json");
        break;
    }
  };

  // Handler untuk search dari TabelHeader
  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  // Handler untuk row click
  const handleRowClick = useCallback((sekolah: Sekolah) => {
    const message = `
📚 ${sekolah.sekolah}
📌 ${sekolah.alamat_jalan}
🏫 ${sekolah.kabupaten_kota}, ${sekolah.kecamatan}
🎓 ${sekolah.bentuk} • ${sekolah.status === "N" ? "Negeri" : "Swasta"}
🔢 NPSN: ${sekolah.npsn}
📍 Koordinat: ${sekolah.lintang}, ${sekolah.bujur}
    `.trim();

    alert(message);
  }, []);

  // Handler untuk view on map
  const handleViewOnMap = useCallback((sekolah: Sekolah) => {
    const lat = parseFloat(sekolah.lintang);
    const lng = parseFloat(sekolah.bujur);

    if (!isNaN(lat) && !isNaN(lng)) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    } else {
      alert("Sekolah ini tidak memiliki koordinat yang valid.");
    }
  }, []);

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      kabupaten: [],
      jenis: [],
      status: [],
      searchQuery: "",
    });
  };

  // **Loading State dengan Progress Indicator**
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b mb-6 rounded-lg">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Database className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    📊 Tabel Data Sekolah Jawa Timur
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Mengambil data dari server...
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Progress Indicator Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Loader2
                    className="text-emerald-600 animate-spin"
                    size={20}
                  />
                  Mengambil Data Sekolah
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Sedang mengambil semua data sekolah dari API. Harap tunggu...
                </p>
              </div>

              <div className="px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-sm font-medium text-emerald-700">
                  {progress.totalFetched.toLocaleString("id-ID")} data terkumpul
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Halaman {progress.page}</span>
                <span>{progress.message}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (progress.totalFetched / 40000) * 100,
                      100
                    )}%`,
                  }}></div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-emerald-100 rounded">
                    <Database size={16} className="text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-emerald-700">
                    Data Terkumpul
                  </span>
                </div>
                <div className="text-2xl font-bold text-emerald-800">
                  {progress.totalFetched.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-teal-100 rounded">
                    <BarChart3 size={16} className="text-teal-600" />
                  </div>
                  <span className="text-sm font-medium text-teal-700">
                    Halaman Saat Ini
                  </span>
                </div>
                <div className="text-2xl font-bold text-teal-800">
                  {progress.page}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-green-100 rounded">
                    <MapPin size={16} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-700">
                    Data Terakhir
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {progress.currentPageData}
                </div>
              </div>
            </div>

            {/* Tips & Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Loader2 className="text-yellow-600 animate-spin" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">
                    Sedang Mengambil Semua Data
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Aplikasi sedang mengambil{" "}
                    <strong>semua data sekolah</strong> dari API. Proses ini
                    hanya dilakukan sekali saat pertama kali membuka halaman.
                    Data akan tersimpan dan bisa difilter dengan cepat setelah
                    selesai.
                  </p>
                  <div className="mt-2 text-xs text-yellow-600">
                    ⏳ Estimasi waktu: 1-2 menit untuk 40,000+ data
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skeleton untuk Table dan Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-8 bg-gray-100 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Search bar skeleton */}
                <div className="h-12 bg-gray-200 rounded w-full mb-6 animate-pulse"></div>

                {/* Table header skeleton */}
                <div className="grid grid-cols-6 gap-4 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>

                {/* Table rows skeleton */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="grid grid-cols-6 gap-4 mb-3">
                    {[...Array(6)].map((_, j) => (
                      <div
                        key={j}
                        className="h-10 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Data diambil dari API Sekolah Indonesia
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Jangan tutup halaman ini selama proses pengambilan data
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Kembali ke Home
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                📊 Tabel Data Sekolah Jawa Timur
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredData.length.toLocaleString("id-ID")} dari{" "}
                {tableData.length.toLocaleString("id-ID")} sekolah
                {isFetching && (
                  <span className="ml-2 text-emerald-600 text-sm">
                    <Loader2 size={14} className="inline animate-spin mr-1" />
                    Masih mengambil data...
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle Sidebar Button (Mobile) */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2">
                <Filter size={16} />
                {isSidebarOpen ? "Sembunyikan Filter" : "Tampilkan Filter"}
              </button>

              <a
                href="/"
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                ← Home
              </a>
              <a
                href="/peta"
                className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                🌍 Lihat Peta
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header dengan Search */}
        <div className="mb-6">
          <TabelHeader
            data={tableData}
            onSearch={handleSearch}
            onExport={handleExport}
            onFilterChange={setFilters}
            onRefresh={() => window.location.reload()}
            onViewMap={() => (window.location.href = "/peta")}
            isLoading={isFetching}
            activeFilters={filters}
          />
        </div>

        {/* Filter & Table Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <div
            className={`
            ${isSidebarOpen ? "block" : "hidden"} 
            lg:block lg:w-1/4
          `}>
            <div className="bg-white rounded-xl shadow-xl border overflow-hidden sticky top-6">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Filter size={18} />
                    Filter Data
                  </h3>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1"
                    disabled={Object.values(filters).every((f) =>
                      Array.isArray(f) ? f.length === 0 : f === ""
                    )}>
                    <X size={14} />
                    Hapus Semua
                  </button>
                </div>
              </div>

              <FilterSidebar
                filterOptions={filterOptions}
                activeFilters={filters}
                onFilterChange={setFilters}
                totalData={tableData.length}
                filteredData={filteredData.length}
              />
            </div>

            {/* Quick Stats Card */}
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <h4 className="font-semibold text-emerald-800 mb-2">
                📈 Statistik Data
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Total Data:</span>
                  <span className="font-medium">
                    {tableData.length.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Tampil:</span>
                  <span className="font-medium">
                    {filteredData.length.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Kabupaten:</span>
                  <span className="font-medium">
                    {filterOptions.kabupaten.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Status:</span>
                  <span className="font-medium">
                    {isFetching ? "⏳ Mengambil data..." : "✅ Siap"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className={`${isSidebarOpen ? "lg:w-3/4" : "w-full"}`}>
            <div className="bg-white rounded-xl shadow-xl border overflow-hidden">
              <DataTableClient
                initialData={tableData}
                pageSize={50}
                onRowClick={handleRowClick}
                onViewOnMap={handleViewOnMap}
                activeFilters={filters}
                onFilterChange={setFilters}
              />
            </div>

            {/* Data Info Card */}
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Database size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {tableData.length.toLocaleString("id-ID")} Data Sekolah
                    </p>
                    <p className="text-xs text-gray-600">
                      Semua data sudah diambil dan siap digunakan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isFetching
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-emerald-500"
                    }`}></div>
                  <span className="text-gray-600">
                    {isFetching
                      ? "Masih mengambil data..."
                      : "✅ Semua data siap"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="text-sm font-medium text-emerald-800">
                  🎓 Jenjang Terpilih
                </div>
                <div className="mt-1 text-lg font-bold text-emerald-900">
                  {filters.jenis.length > 0
                    ? filters.jenis.join(", ")
                    : "Semua Jenjang"}
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="text-sm font-medium text-teal-800">
                  🏫 Status Terpilih
                </div>
                <div className="mt-1 text-lg font-bold text-teal-900">
                  {filters.status.length === 0
                    ? "Semua Status"
                    : filters.status.length === 2
                    ? "Negeri & Swasta"
                    : filters.status.includes("N")
                    ? "Negeri Saja"
                    : "Swasta Saja"}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800">
                  📍 Kabupaten Terpilih
                </div>
                <div className="mt-1 text-lg font-bold text-green-900">
                  {filters.kabupaten.length === 0
                    ? "Semua Kabupaten"
                    : `${filters.kabupaten.length} Kabupaten`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Data diambil dari API Sekolah Indonesia •{" "}
            {tableData.length.toLocaleString("id-ID")} data sekolah
          </p>
          {isFetching && (
            <p className="text-xs text-emerald-600 mt-1">
              ⏳ Masih mengambil data tambahan di background...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
