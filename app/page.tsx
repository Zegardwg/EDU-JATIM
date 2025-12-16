import QuickCharts from "./components/home/QuickCharts";
import DataTablePreview from "./components/home/DataTablePreview";
import KabupatenDistribution from "./components/home/KabupatenDistribution";
import HeroSection from "./components/home/HeroSection";
import { getAllSekolahData } from "./lib/api";
import { Suspense } from "react";

// Loading skeleton component
function ChartsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-64 bg-gray-200 rounded-lg"></div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded"></div>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  try {
    const sekolahData = await getAllSekolahData().catch(() => []);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Charts */}
              <div className="lg:col-span-2 space-y-8">
                {/* Distribusi Kabupaten */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#1a365d] to-[#2d3748] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Distribusi Sekolah per Kabupaten
                        </h3>
                        <p className="text-blue-200 text-sm mt-1">
                          Visualisasi jumlah sekolah di setiap wilayah
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-sm text-white font-medium">
                          Top 10
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <Suspense fallback={<ChartsSkeleton />}>
                      <KabupatenDistribution data={sekolahData} />
                    </Suspense>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">
                      Analisis Distribusi Sekolah
                    </h3>
                    <p className="text-blue-200 text-sm mt-1">
                      Berdasarkan jenis dan status sekolah
                    </p>
                  </div>
                  <div className="p-6">
                    <Suspense fallback={<ChartsSkeleton />}>
                      <QuickCharts data={sekolahData} />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* Right Column - Data Preview */}
              <div className="space-y-8">
                {/* Data Preview Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                    <h3 className="text-xl font-bold text-white">
                      Preview Data Sekolah
                    </h3>
                    <p className="text-green-200 text-sm mt-1">
                      Contoh data dari{" "}
                      {sekolahData.length.toLocaleString("id-ID")} entri
                    </p>
                  </div>
                  <div className="p-6">
                    <Suspense fallback={<TableSkeleton />}>
                      <DataTablePreview data={sekolahData.slice(0, 8)} />
                    </Suspense>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <a
                        href="/tabel"
                        className="group inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all duration-300">
                        Lihat Semua Data
                        <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Stats Summary Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-blue-500 rounded-full mr-3"></span>
                    Ringkasan Data
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Data</span>
                      <span className="font-bold text-blue-700">
                        {sekolahData.length.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Kabupaten/Kota</span>
                      <span className="font-bold text-green-700">38</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Update Terakhir</span>
                      <span className="font-bold text-purple-700">2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status API</span>
                      <span className="inline-flex items-center text-green-600 font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Terjadi Kesalahan
          </h1>
          <p className="text-gray-600 mt-2">
            Gagal memuat data. Silakan coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }
}
