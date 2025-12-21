"use client"

import { MapPin, Filter, Download, BarChart3, Table, Layers } from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "Peta Interaktif",
    description: "Visualisasi lokasi sekolah dengan marker berwarna berdasarkan jenis sekolah",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Filter,
    title: "Filter Canggih",
    description: "Filter data berdasarkan kabupaten, jenis sekolah, dan status operasional",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: BarChart3,
    title: "Visualisasi Data",
    description: "Grafik dan chart interaktif untuk analisis distribusi sekolah",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Table,
    title: "Tabel Lengkap",
    description: "Data sekolah lengkap dengan pencarian dan sorting yang mudah",
    color: "from-emerald-600 to-green-600",
  },
  {
    icon: Download,
    title: "Export Data",
    description: "Download data dalam format CSV/Excel untuk analisis lebih lanjut",
    color: "from-teal-600 to-emerald-600",
  },
  {
    icon: Layers,
    title: "Data Real-time",
    description: "Akses data terkini langsung dari API dengan performa optimal",
    color: "from-green-600 to-teal-600",
  },
]

export default function FeaturesGrid() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-emerald-100 rounded-full mb-4">
            <span className="text-emerald-700 font-semibold text-sm">Fitur Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Fitur Lengkap untuk Eksplorasi Data</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Platform kami menyediakan berbagai fitur untuk memudahkan akses dan analisis data sekolah di Jawa Timur
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-emerald-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/peta"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 group"
          >
            Mulai Eksplorasi
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
