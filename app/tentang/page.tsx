"use client"

import { useState } from "react"
import { MapPin, Target, Eye, Users, Award, Database, Mail, Globe, ChevronDown, ChevronUp } from "lucide-react"

export default function TentangPage() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const stats = [
    { label: "Data Sekolah", value: "10,000+", icon: Database, color: "emerald" },
    { label: "Kabupaten/Kota", value: "38", icon: MapPin, color: "teal" },
    { label: "Pengguna Aktif", value: "5,000+", icon: Users, color: "green" },
    { label: "Update Data", value: "Real-time", icon: Award, color: "emerald" },
  ]

  const visionMission = [
    {
      title: "Visi Kami",
      icon: Eye,
      color: "emerald",
      description:
        "Menjadi platform terdepan dalam penyediaan data dan visualisasi informasi sekolah di Jawa Timur yang akurat, mudah diakses, dan bermanfaat bagi seluruh stakeholder pendidikan.",
      details: [
        "Transparansi data pendidikan untuk publik",
        "Kemudahan akses informasi sekolah",
        "Mendukung kebijakan pendidikan berbasis data",
      ],
    },
    {
      title: "Misi Kami",
      icon: Target,
      color: "teal",
      description:
        "Menyediakan sistem informasi geografis yang komprehensif untuk membantu perencanaan dan pengambilan keputusan di bidang pendidikan Jawa Timur.",
      details: [
        "Menyajikan data sekolah yang valid dan terkini",
        "Memudahkan analisis distribusi sekolah per wilayah",
        "Mendukung evaluasi pemerataan akses pendidikan",
      ],
    },
  ]

  const team = [
    { name: "Tim Pengembang", role: "Full-Stack Developer", initial: "TP", color: "emerald" },
    { name: "Data Analyst", role: "Data Visualization", initial: "DA", color: "teal" },
    { name: "UX Designer", role: "User Experience", initial: "UX", color: "green" },
    { name: "Project Manager", role: "Koordinator", initial: "PM", color: "emerald" },
  ]

  const features = [
    "Visualisasi data interaktif dengan charts dan graphs",
    "Peta digital dengan marker untuk setiap sekolah",
    "Filter data berdasarkan kabupaten, jenis, dan status",
    "Export data ke format CSV dan Excel",
    "Dashboard analytics real-time",
    "Responsive design untuk semua perangkat",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-teal-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
            <MapPin className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">SekolahMap Jawa Timur</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Platform Visualisasi Data Sekolah
            <span className="block text-emerald-100 mt-2">Provinsi Jawa Timur</span>
          </h1>
          <p className="text-xl text-emerald-50 max-w-2xl mx-auto leading-relaxed">
            Sistem informasi geografis komprehensif yang menyajikan data sekolah dengan visualisasi interaktif untuk
            mendukung kebijakan pendidikan berbasis data
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`text-3xl font-bold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-700 bg-clip-text text-transparent mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Visi & Misi</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Komitmen kami dalam meningkatkan transparansi dan aksesibilitas data pendidikan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {visionMission.map((item, index) => {
              const Icon = item.icon
              const isExpanded = expandedCard === index
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-300 ${
                    isExpanded
                      ? `border-${item.color}-500 shadow-${item.color}-200/50`
                      : `border-${item.color}-100 hover:border-${item.color}-300`
                  }`}
                >
                  <div className={`bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 px-6 py-5`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-slate-700 leading-relaxed mb-4">{item.description}</p>

                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : index)}
                      className={`flex items-center gap-2 text-${item.color}-600 font-semibold hover:text-${item.color}-700 transition-colors`}
                    >
                      {isExpanded ? "Tutup Detail" : "Lihat Detail"}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2">
                        {item.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-1.5 h-1.5 bg-${item.color}-500 rounded-full mt-2 flex-shrink-0`}></div>
                            <p className="text-slate-600">{detail}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-emerald-50/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Fitur Unggulan</h2>
            <p className="text-lg text-slate-600">
              Platform dilengkapi dengan berbagai fitur untuk memudahkan akses dan analisis data
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-md border border-emerald-100 hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Tim Kami</h2>
            <p className="text-lg text-slate-600">Profesional berdedikasi di balik platform ini</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center"
              >
                <div
                  className={`w-20 h-20 mx-auto bg-gradient-to-br from-${member.color}-500 to-${member.color}-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <span className="text-2xl font-bold text-white">{member.initial}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{member.name}</h3>
                <p className={`text-${member.color}-600 text-sm font-medium`}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-emerald-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-10 text-center">
              <h2 className="text-3xl font-bold text-white mb-3">Hubungi Kami</h2>
              <p className="text-emerald-50 text-lg">Ada pertanyaan atau saran? Kami siap membantu Anda</p>
            </div>

            <div className="p-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Email</div>
                    <div className="font-semibold text-slate-800">info@sekolahmap.id</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Website</div>
                    <div className="font-semibold text-slate-800">www.sekolahmap.id</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 text-center">
                <p className="text-slate-600 leading-relaxed">
                  Platform ini dikembangkan untuk mendukung transparansi dan kemudahan akses informasi pendidikan di
                  Provinsi Jawa Timur. Data yang disajikan bersumber dari database resmi dan diperbarui secara berkala.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
