import QuickCharts from "./components/home/QuickCharts";
import DataTablePreview from "./components/home/DataTablePreview";
import KabupatenDistribution from "./components/home/KabupatenDistribution";
import HeroSection from "./components/home/HeroSection";
import FeaturesGrid from "./components/home/FeaturesGrid";
import UpdatesTimeline from "./components/home/UpdatesTimeline";
import FAQAccordion from "./components/home/FAQAccordion";
import { getAllSekolahData } from "./lib/api";
import { Suspense } from "react";
import Link from "next/link";

function HeroSkeleton() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white animate-pulse"></div>
    </section>
  );
}

function ChartsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-64 bg-emerald-50 rounded-xl"></div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-emerald-50 rounded-lg"></div>
      ))}
    </div>
  );
}

export default async function DashboardPage() {
  const sekolahData = await getAllSekolahData().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Main Content Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Distribusi Kabupaten */}
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Distribusi Sekolah per Kabupaten
                      </h3>
                      <p className="text-emerald-100 text-sm mt-1">
                        Visualisasi jumlah sekolah di setiap wilayah
                      </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <span className="text-sm text-white font-semibold">
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
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5">
                  <h3 className="text-xl font-bold text-white">
                    Analisis Distribusi Sekolah
                  </h3>
                  <p className="text-teal-100 text-sm mt-1">
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
            <div className="space-y-6">
              {/* Data Preview Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
                  <h3 className="text-xl font-bold text-white">
                    Preview Data Sekolah
                  </h3>
                  <p className="text-green-100 text-sm mt-1">
                    Menampilkan {sekolahData.length.toLocaleString("id-ID")}{" "}
                    data sekolah
                  </p>
                </div>
                <div className="p-6">
                  <Suspense fallback={<TableSkeleton />}>
                    <DataTablePreview data={sekolahData.slice(0, 8)} />
                  </Suspense>
                  <div className="mt-6 pt-6 border-t border-emerald-100">
                    <Link
                      href="/tabel"
                      className="group inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300">
                      Lihat Semua Data
                      <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Summary Card */}
              <div className="bg-white rounded-2xl shadow-md border border-emerald-200 p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full mr-3"></span>
                  Ringkasan Data
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                    <span className="text-slate-600 font-medium">
                      Total Data
                    </span>
                    <span className="font-bold text-emerald-700 text-lg">
                      {sekolahData.length.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                    <span className="text-slate-600 font-medium">
                      Kabupaten/Kota
                    </span>
                    <span className="font-bold text-teal-700 text-lg">38</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                    <span className="text-slate-600 font-medium">
                      Update Terakhir
                    </span>
                    <span className="font-bold text-green-700 text-lg">
                      2024
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg">
                    <span className="text-slate-600 font-medium">
                      Status API
                    </span>
                    <span className="inline-flex items-center text-emerald-600 font-semibold">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                      Aktif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <FeaturesGrid />

      {/* Updates Timeline Section */}
      <Suspense
        fallback={<div className="h-96 bg-emerald-50 animate-pulse"></div>}>
        <UpdatesTimeline />
      </Suspense>

      {/* FAQ Accordion Section */}
      <Suspense
        fallback={<div className="h-96 bg-emerald-50 animate-pulse"></div>}>
        <FAQAccordion />
      </Suspense>
    </div>
  );
}
