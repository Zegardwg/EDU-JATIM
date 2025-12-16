'use client'

import { useState } from 'react'
import { 
  X, 
  School, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Users,
  Calendar,
  Award,
  ExternalLink,
  Copy
} from 'lucide-react'

interface Sekolah {
  id: string
  sekolah: string
  bentuk: string
  status: string
  alamat_jalan: string
  kabupaten_kota: string
  kecamatan: string
  npsn: string
  lintang: string
  bujur: string
}

export default function InfoPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<Sekolah | null>(null)

  // Mock data for demo
  const mockSchool: Sekolah = {
    id: '1',
    sekolah: 'SDN JATIPASAR',
    bentuk: 'SD',
    status: 'N',
    alamat_jalan: 'Jalan Botok Palung No. 7',
    kabupaten_kota: 'Kab. Mojokerto',
    kecamatan: 'Kec. Trowulan',
    npsn: '20502808',
    lintang: '-7.5464000',
    bujur: '112.3892000'
  }

  const openPanel = (school: Sekolah) => {
    setSelectedSchool(school)
    setIsOpen(true)
  }

  const closePanel = () => {
    setIsOpen(false)
    setSelectedSchool(null)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Add toast notification here
    console.log('Copied:', text)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => openPanel(mockSchool)}
        className="absolute bottom-20 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-[1000]"
      >
        <School className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="absolute top-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 h-[calc(100vh-120px)] bg-white rounded-xl shadow-2xl border border-gray-200 z-[1000] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Detail Sekolah</h2>
            <p className="text-blue-200 text-sm mt-1">Informasi lengkap sekolah</p>
          </div>
          <button
            onClick={closePanel}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedSchool ? (
          <>
            {/* School Name */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedSchool.sekolah}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedSchool.bentuk === 'SD' ? 'bg-blue-100 text-blue-800' :
                  selectedSchool.bentuk === 'SMP' ? 'bg-green-100 text-green-800' :
                  selectedSchool.bentuk === 'SMA' ? 'bg-purple-100 text-purple-800' :
                  selectedSchool.bentuk === 'SMK' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedSchool.bentuk}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedSchool.status === 'N' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedSchool.status === 'N' ? 'Negeri' : 'Swasta'}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-6">
              {/* NPSN */}
              <div className="flex items-start">
                <Award className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">NPSN</span>
                    <button
                      onClick={() => copyToClipboard(selectedSchool.npsn)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <code className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                    {selectedSchool.npsn}
                  </code>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-700 block mb-1">Lokasi</span>
                  <p className="text-gray-900">{selectedSchool.alamat_jalan}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedSchool.kecamatan}, {selectedSchool.kabupaten_kota}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>Koordinat: </span>
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {selectedSchool.lintang}, {selectedSchool.bujur}
                    </code>
                  </div>
                </div>
              </div>

              {/* Coordinates Actions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">Aksi Koordinat</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const url = `https://www.google.com/maps?q=${selectedSchool.lintang},${selectedSchool.bujur}`
                      window.open(url, '_blank')
                    }}
                    className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="text-sm">Google Maps</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(`${selectedSchool.lintang}, ${selectedSchool.bujur}`)}
                    className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    <span className="text-sm">Salin Koordinat</span>
                  </button>
                </div>
              </div>

              {/* Additional Info (Placeholder) */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-700 mb-3">Informasi Tambahan</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-3" />
                    <span>Data siswa dan guru tersedia di halaman detail</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>Tahun berdiri: -</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    <span>Kontak: -</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Tidak ada sekolah dipilih</h3>
            <p className="text-gray-500">Klik salah satu marker di peta untuk melihat detail sekolah</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              if (selectedSchool) {
                window.open(`/sekolah/${selectedSchool.id}`, '_blank')
              }
            }}
            className="flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Halaman Detail
          </button>
          <button
            onClick={closePanel}
            className="flex items-center justify-center py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}