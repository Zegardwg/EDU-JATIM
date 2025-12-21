"use client"

import { Calendar, Database, TrendingUp, CheckCircle2 } from "lucide-react"

const updates = [
  {
    date: "Januari 2025",
    icon: Database,
    title: "Update Database Terbaru",
    description: "Data sekolah diperbarui dengan informasi terkini dari Dinas Pendidikan Jawa Timur",
    status: "completed",
    color: "emerald",
  },
  {
    date: "Desember 2024",
    icon: TrendingUp,
    title: "Peningkatan Performa API",
    description: "Optimasi kecepatan loading dan response time hingga 40% lebih cepat",
    status: "completed",
    color: "teal",
  },
  {
    date: "November 2024",
    icon: CheckCircle2,
    title: "Fitur Filter Lanjutan",
    description: "Penambahan filter berdasarkan multiple kriteria untuk pencarian lebih spesifik",
    status: "completed",
    color: "green",
  },
  {
    date: "Oktober 2024",
    icon: Calendar,
    title: "Launch Platform",
    description: "Peluncuran resmi platform SekolahMap Jawa Timur untuk publik",
    status: "completed",
    color: "emerald",
  },
]

export default function UpdatesTimeline() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-teal-100 rounded-full mb-4">
            <span className="text-teal-700 font-semibold text-sm">Timeline Update</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Update & Perkembangan Platform</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Kami terus mengembangkan platform untuk memberikan pengalaman terbaik
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-teal-200 to-green-200"></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {updates.map((update, index) => {
                const Icon = update.icon
                return (
                  <div key={index} className="relative pl-20">
                    {/* Icon Circle */}
                    <div
                      className={`absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-${update.color}-500 to-${update.color}-600 flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-emerald-100 transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-semibold text-emerald-700">{update.date}</span>
                        </div>
                        {update.status === "completed" && (
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Selesai
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{update.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{update.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
