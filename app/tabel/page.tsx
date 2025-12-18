// /app/tabel/page.tsx - UPDATE LAYOUT
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllSekolahData } from "./lib/api";
import { processTableData } from "./lib/table-processing";
import { exportToCSV, exportToJSON, downloadFile } from "./lib/export-utils";
import TabelHeader from "./components/TabelHeader";
import DataTableClient from "./components/DataTableClient";
import FilterSidebar from "./components/FilterSidebar"; // KOMPONEN BARU
import { Sekolah } from "./types/sekolah";
import { Filter, X } from "lucide-react";

interface TableFilters {
  kabupaten: string[];
  jenis: string[];
  status: string[];
  searchQuery: string;
}

export default function TabelPage() {
  // States - SAMA
  const [tableData, setTableData] = useState<Sekolah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<TableFilters>({
    kabupaten: [],
    jenis: [],
    status: [],
    searchQuery: "",
  });

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

    // Get unique kabupaten
    const kabupatenList = Array.from(
      new Set(tableData.map((s) => s.kabupaten_kota).filter(Boolean))
    ).sort();

    // Get unique jenis
    const jenisList = Array.from(
      new Set(tableData.map((s) => s.bentuk).filter(Boolean))
    ).sort();

    // Get unique status
    const statusList = ["N", "S"];

    return {
      kabupaten: kabupatenList,
      jenis: jenisList,
      status: statusList,
    };
  }, [tableData]);

  // Fetch data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        console.log("📥 Memulai pengambilan data sekolah Jawa Timur...");

        const sekolahData = await getAllSekolahData({
          maxPages: 40,
          perPage: 1000,
          delayBetweenPages: 30,
        });

        console.log(`✅ Data diterima: ${sekolahData.length} sekolah`);

        const processedData = processTableData(sekolahData);
        setTableData(processedData);
      } catch (err) {
        console.error("❌ Error loading table data:", err);
        setError(
          "Gagal memuat data. Silakan refresh halaman atau coba lagi nanti."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Handler untuk export
  const handleExport = (format: "csv" | "excel" | "json") => {
    const exportData = filteredData;

    switch (format) {
      case "csv":
        const csvContent = exportToCSV(exportData);
        downloadFile(
          csvContent,
          `sekolah-jatim-${new Date().toISOString().split("T")[0]}.csv`,
          "text/csv;charset=utf-8;"
        );
        break;

      case "excel":
        alert("Fitur export Excel akan segera tersedia!");
        break;

      case "json":
        const jsonContent = exportToJSON(exportData);
        downloadFile(
          jsonContent,
          `sekolah-jatim-${new Date().toISOString().split("T")[0]}.json`,
          "application/json"
        );
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 h-96 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded w-full mb-2"></div>
                ))}
              </div>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                🌍 Lihat Peta
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content dengan Sidebar Layout */}
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
            isLoading={false}
            activeFilters={filters}
          />
        </div>

        {/* Filter & Table Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter - KIRI */}
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
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                    disabled={Object.values(filters).every((f) =>
                      Array.isArray(f) ? f.length === 0 : f === ""
                    )}>
                    <X size={14} />
                    Hapus Semua
                  </button>
                </div>
              </div>

              {/* FilterSidebar Component */}
              <FilterSidebar
                filterOptions={filterOptions}
                activeFilters={filters}
                onFilterChange={setFilters}
                totalData={tableData.length}
                filteredData={filteredData.length}
              />
            </div>

            {/* Quick Stats Card */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                📈 Statistik Filter
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Total Data:</span>
                  <span className="font-medium">
                    {tableData.length.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Tampil:</span>
                  <span className="font-medium">
                    {filteredData.length.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Kabupaten Dipilih:</span>
                  <span className="font-medium">
                    {filters.kabupaten.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Filter Aktif:</span>
                  <span className="font-medium">
                    {filters.kabupaten.length +
                      filters.jenis.length +
                      filters.status.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table - KANAN */}
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

            {/* Quick Info */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800">
                  🎓 Jenjang Terpilih
                </div>
                <div className="mt-1 text-lg font-bold text-green-900">
                  {filters.jenis.length > 0
                    ? filters.jenis.join(", ")
                    : "Semua Jenjang"}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-800">
                  🏫 Status Terpilih
                </div>
                <div className="mt-1 text-lg font-bold text-purple-900">
                  {filters.status.length === 0
                    ? "Semua Status"
                    : filters.status.length === 2
                    ? "Negeri & Swasta"
                    : filters.status.includes("N")
                    ? "Negeri Saja"
                    : "Swasta Saja"}
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-sm font-medium text-orange-800">
                  📍 Kabupaten Terpilih
                </div>
                <div className="mt-1 text-lg font-bold text-orange-900">
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
            Data diambil dari API Sekolah Indonesia • Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </main>
    </div>
  );
}
