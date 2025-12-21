"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import MapContainer from "./components/MapContainer";
import FilterPanel from "./components/FilterPanel";
import { getAllSekolahData } from "../lib/api";

// Debounce function
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function PetaPage() {
  const [allSchools, setAllSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({
    currentPage: 0,
    totalPages: 0,
    fetchedCount: 0,
    estimatedTotal: 27614, // Estimasi awal
    message: "Memulai pengambilan data...",
    currentPageData: 0,
  });
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState({
    kabupaten: [] as string[],
    jenis: [] as string[],
    status: [] as string[],
  });
  const debouncedFilters = useDebounce(filters, 300);

  // Fetch data dengan progress tracking
  useEffect(() => {
    let isMounted = true;
    let fetchedSoFar = 0;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Reset progress
        setLoadingProgress({
          currentPage: 0,
          totalPages: 30, // Estimasi 30 halaman
          fetchedCount: 0,
          estimatedTotal: 27614,
          message: "Memulai...",
          currentPageData: 0,
        });

        // Fetch dengan progress callback
        const data = await getAllSekolahData({
          maxPages: 40, // Coba hingga 40 halaman (40,000 data)
          perPage: 1000,
          delayBetweenPages: 30, // 30ms delay
          onProgress: (progress) => {
            if (!isMounted) return;

            fetchedSoFar = progress.totalFetched;
            const estimatedTotal = Math.max(
              27614,
              progress.totalFetched + 1000
            ); // Update estimasi

            setLoadingProgress({
              currentPage: progress.page,
              totalPages: Math.ceil(estimatedTotal / 1000),
              fetchedCount: progress.totalFetched,
              estimatedTotal,
              message: progress.message,
              currentPageData: progress.currentPageData,
            });
          },
        });

        if (!isMounted) return;

        if (data.length === 0) {
          throw new Error("Tidak ada data yang berhasil diambil");
        }

        setAllSchools(data);
        console.log(`✅ Berhasil load ${data.length} sekolah`);

        // Update estimasi berdasarkan data actual
        const estimatedTotal = data.length;
        setLoadingProgress((prev) => ({
          ...prev,
          estimatedTotal,
          message: `Selesai! ${data.length.toLocaleString(
            "id-ID"
          )} sekolah loaded`,
        }));
      } catch (err) {
        console.error("Error:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Gagal memuat data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter schools dengan optimization
  const filteredSchools = useMemo(() => {
    if (allSchools.length === 0) return [];

    const { kabupaten, jenis, status } = debouncedFilters;

    // Jika tidak ada filter, return semua
    if (kabupaten.length === 0 && jenis.length === 0 && status.length === 0) {
      return allSchools;
    }

    return allSchools.filter((school) => {
      // Filter by kabupaten
      if (kabupaten.length > 0) {
        const schoolKabupaten = school.kabupaten_kota;
        if (!schoolKabupaten || !kabupaten.includes(schoolKabupaten)) {
          return false;
        }
      }

      // Filter by jenis
      if (jenis.length > 0 && !jenis.includes(school.bentuk)) {
        return false;
      }

      // Filter by status
      if (status.length > 0 && !status.includes(school.status)) {
        return false;
      }

      return true;
    });
  }, [allSchools, debouncedFilters]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (loadingProgress.estimatedTotal === 0) return 0;
    return Math.min(
      100,
      (loadingProgress.fetchedCount / loadingProgress.estimatedTotal) * 100
    );
  }, [loadingProgress]);

  // Loading screen dengan progress bar detail
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-lg mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
          <div className="relative w-40 h-40 mx-auto mb-8">
            {/* Outer ring */}
            <div className="absolute inset-0 border-8 border-emerald-100 rounded-full"></div>

            {/* Progress ring */}
            <div
              className="absolute inset-0 border-8 border-emerald-600 rounded-full border-t-transparent border-r-transparent"
              style={{
                transform: `rotate(${progressPercentage * 3.6}deg)`,
                transition: "transform 0.3s ease",
              }}></div>

            {/* Center content */}
            <div className="absolute inset-8 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-emerald-600">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {loadingProgress.fetchedCount.toLocaleString("id-ID")}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Memuat Data Sekolah Jawa Timur
          </h2>

          <p className="text-gray-600 mb-6">{loadingProgress.message}</p>

          {/* Detailed progress info */}
          <div className="space-y-4 mb-6">
            <div>
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>
                  Halaman {loadingProgress.currentPage} dari{" "}
                  {loadingProgress.totalPages}
                </span>
                <span>{loadingProgress.currentPageData} data/halaman</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <div className="font-medium text-emerald-700">Diambil</div>
                <div className="text-xl font-bold text-emerald-800">
                  {loadingProgress.fetchedCount.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700">Estimasi Total</div>
                <div className="text-xl font-bold text-gray-800">
                  {loadingProgress.estimatedTotal.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>⏳ Harap tunggu, mengambil semua data (~27,614 sekolah)...</p>
            <p>📡 Koneksi internet stabil akan mempercepat proses</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Terjadi Error
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Data yang berhasil diambil:{" "}
            {allSchools.length.toLocaleString("id-ID")} sekolah
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Coba Lagi
            </button>
            <button
              onClick={() => {
                // Lanjut dengan data yang sudah ada
                setIsLoading(false);
              }}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
              Lanjut dengan {allSchools.length.toLocaleString("id-ID")} data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Peta Sekolah Jawa Timur</h1>
              <p className="text-emerald-200 text-sm mt-1">
                {filteredSchools.length.toLocaleString("id-ID")} sekolah
                ditampilkan ({allSchools.length.toLocaleString("id-ID")} total)
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <div className="flex items-center space-x-3">
                <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {allSchools.length.toLocaleString("id-ID")} sekolah
                </div>
                {filteredSchools.length < allSchools.length && (
                  <div className="text-sm bg-green-500/20 px-3 py-1 rounded-full">
                    Filter aktif
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-68px)]">
        {/* Filter Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
          <FilterPanel
            schools={allSchools}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer schools={filteredSchools} />

          {/* Data info */}
          {/* <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg border">
            <div className="space-y-1">
              <div className="font-medium text-gray-700">📊 Data Info</div>
              <div className="text-xs text-gray-600">
                Total: {allSchools.length.toLocaleString('id-ID')} sekolah
              </div>
              <div className="text-xs text-gray-600">
                Tampil: {filteredSchools.length.toLocaleString('id-ID')}
              </div>
              {allSchools.length >= 27000 && (
                <div className="text-xs text-green-600 font-medium">
                  ✅ Semua data berhasil diambil!
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>

      {/* Footer Stats */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 z-30">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">SD</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">SMP</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">SMA</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">SMK</span>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium">
                {allSchools.length.toLocaleString("id-ID")}
              </span>{" "}
              total •{" "}
              <span className="font-medium text-emerald-600">
                {filteredSchools.length.toLocaleString("id-ID")}
              </span>{" "}
              ditampilkan
              {filters.kabupaten.length > 0 && (
                <span className="ml-2">
                  • {filters.kabupaten.length} kabupaten
                </span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
