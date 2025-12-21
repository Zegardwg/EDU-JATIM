"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, School, GraduationCap, BookOpen, Building2 } from "lucide-react"
import { jawaTimurGeoJSON } from "../../utils/jawaTimurBoundaries"
import { dummySchools, getSchoolTypeColor, getSchoolStats, type School as SchoolType } from "../../utils/schoolDummyData"
import Image from "next/image"

export default function HeroSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [filteredSchools, setFilteredSchools] = useState(dummySchools)
  const stats = getSchoolStats()

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredSchools(dummySchools)
    } else {
      setFilteredSchools(dummySchools.filter((school) => school.type === activeFilter))
    }
  }, [activeFilter])

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    // Dynamically import leaflet only on client side
    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Fix leaflet default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      // Initialize map centered on Jawa Timur
      const map = L.map(mapRef.current!, {
        center: [-7.8, 112.8],
        zoom: 8,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap contributors © CARTO",
        maxZoom: 19,
      }).addTo(map)

      L.geoJSON(jawaTimurGeoJSON as any, {
        style: (feature) => {
          return {
            color: "#16a34a",
            weight: 2,
            opacity: 0.8,
            fillColor: "#22c55e",
            fillOpacity: 0.2,
          }
        },
        onEachFeature: (feature, layer) => {
          const name = feature.properties?.name || "Unknown"
          layer.bindPopup(`<div class="font-bold text-sm">${name}</div>`)
        },
      }).addTo(map)

      // Add school markers
      dummySchools.forEach((school) => {
        const color = getSchoolTypeColor(school.type)

        const customIcon = L.divIcon({
          html: `<div class="school-marker" style="background-color: ${color}; border: 3px solid white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer;">
            <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
          </div>`,
          className: "custom-school-marker",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        const marker = L.marker([school.lat, school.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div class="p-3 min-w-[220px]">
              <div class="font-bold text-base mb-1">${school.name}</div>
              <div class="text-sm text-green-600 font-semibold mb-2">${school.type} • Akreditasi ${school.accreditation}</div>
              <div class="text-xs text-gray-600 mb-1">${school.address}</div>
              <div class="text-xs text-gray-600">${school.regency}</div>
              <div class="text-xs font-semibold text-gray-800 mt-2 pt-2 border-t">Siswa: ${school.students.toLocaleString()}</div>
            </div>
          `)

        marker.on("click", () => {
          setSelectedSchool(school)
        })
      })

      setMapInstance(map)
    }

    initMap()

    return () => {
      if (mapInstance) {
        mapInstance.remove()
      }
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-white">
      {/* Interactive Map Background */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 bg-gradient-to-b from-green-950/85 via-green-900/60 to-green-950/85 z-10" />

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/95 backdrop-blur-xl rounded-lg border-2 border-green-600 shadow-lg">
              <div className="relative w-8 h-8">
                <Image src="/logo-jawa-timur.jpg" alt="Logo Jawa Timur" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Dinas Pendidikan</span>
                <span className="text-xs text-green-700 font-semibold">Provinsi Jawa Timur</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 text-white leading-tight">
            Sistem Informasi
            <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent mt-2">
              Pemetaan Sekolah Jawa Timur
            </span>
          </h1>

          <p className="text-lg md:text-xl text-green-100 text-center mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
            Platform terpadu untuk memantau dan mengelola {stats.total.toLocaleString()}+ institusi pendidikan di
            seluruh Jawa Timur dengan teknologi pemetaan geografis terkini
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 border-2 ${
                activeFilter === "all"
                  ? "bg-white text-green-800 border-white shadow-xl shadow-white/20 scale-105"
                  : "bg-white/10 text-white border-white/30 backdrop-blur-xl hover:bg-white/20 hover:border-white/50"
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter("SD")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 border-2 ${
                activeFilter === "SD"
                  ? "bg-green-500 text-white border-green-400 shadow-xl shadow-green-500/30 scale-105"
                  : "bg-white/10 text-white border-white/30 backdrop-blur-xl hover:bg-white/20 hover:border-white/50"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              SD ({stats.SD})
            </button>
            <button
              onClick={() => setActiveFilter("SMP")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 border-2 ${
                activeFilter === "SMP"
                  ? "bg-blue-500 text-white border-blue-400 shadow-xl shadow-blue-500/30 scale-105"
                  : "bg-white/10 text-white border-white/30 backdrop-blur-xl hover:bg-white/20 hover:border-white/50"
              }`}
            >
              <School className="w-5 h-5" />
              SMP ({stats.SMP})
            </button>
            <button
              onClick={() => setActiveFilter("SMA")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 border-2 ${
                activeFilter === "SMA"
                  ? "bg-amber-500 text-white border-amber-400 shadow-xl shadow-amber-500/30 scale-105"
                  : "bg-white/10 text-white border-white/30 backdrop-blur-xl hover:bg-white/20 hover:border-white/50"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              SMA ({stats.SMA})
            </button>
            <button
              onClick={() => setActiveFilter("SMK")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-300 border-2 ${
                activeFilter === "SMK"
                  ? "bg-purple-500 text-white border-purple-400 shadow-xl shadow-purple-500/30 scale-105"
                  : "bg-white/10 text-white border-white/30 backdrop-blur-xl hover:bg-white/20 hover:border-white/50"
              }`}
            >
              <Building2 className="w-5 h-5" />
              SMK ({stats.SMK})
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="group bg-white/95 backdrop-blur-2xl rounded-lg p-6 border-2 border-green-600 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <School className="w-10 h-10 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold mb-1 text-green-800">{stats.total.toLocaleString()}</div>
              <div className="text-sm text-green-700 font-semibold">Total Sekolah</div>
            </div>
            <div className="group bg-white/95 backdrop-blur-2xl rounded-lg p-6 border-2 border-green-600 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold mb-1 text-green-800">38</div>
              <div className="text-sm text-green-700 font-semibold">Kab/Kota</div>
            </div>
            <div className="group bg-white/95 backdrop-blur-2xl rounded-lg p-6 border-2 border-green-600 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <GraduationCap className="w-10 h-10 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold mb-1 text-green-800">{(stats.totalStudents / 1000).toFixed(1)}K</div>
              <div className="text-sm text-green-700 font-semibold">Total Siswa</div>
            </div>
            <div className="group bg-white/95 backdrop-blur-2xl rounded-lg p-6 border-2 border-green-600 hover:border-green-400 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <div className="text-3xl font-bold mb-1 mx-auto text-green-800">2024</div>
              <div className="text-sm text-green-700 font-semibold mt-3">Data Terkini</div>
            </div>
          </div>

          {selectedSchool && (
            <div className="mt-8 max-w-2xl mx-auto bg-white/95 backdrop-blur-2xl rounded-lg p-6 border-2 border-green-600 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* School Image */}
                <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden border-2 border-green-500 flex-shrink-0">
                  <Image
                    src={selectedSchool.image || "/placeholder.svg"}
                    alt={selectedSchool.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* School Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900 mb-1 leading-tight">{selectedSchool.name}</h3>
                      <p className="text-sm text-green-700 font-bold bg-green-100 px-3 py-1 rounded inline-block">
                        {selectedSchool.type} • Akreditasi {selectedSchool.accreditation}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSchool(null)}
                      className="text-green-600 hover:text-green-900 hover:bg-green-100 p-1 rounded transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-green-800">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{selectedSchool.regency}</span>
                    </p>
                    <p className="text-green-700 pl-6">{selectedSchool.address}</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t-2 border-green-200">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-900">{selectedSchool.students.toLocaleString()}</span>
                      <span className="text-green-700">siswa terdaftar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


    </section>
  )
}
