import { MapPin, Table, BarChart3, Search, Filter, Download, School, PieChart, TrendingUp } from 'lucide-react'

const features = [
  {
    title: 'Peta Interaktif',
    description: 'Visualisasi sekolah di peta dengan marker interaktif dan filter canggih.',
    icon: <MapPin className="w-5 h-5" />,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Tabel Data Lengkap',
    description: 'Akses semua data sekolah dalam format tabel dengan pencarian dan filter.',
    icon: <Table className="w-5 h-5" />,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Visualisasi Data',
    description: 'Grafik dan statistik untuk analisis data sekolah yang mendalam.',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Analisis Distribusi',
    description: 'Pie chart, bar chart, dan visualisasi distribusi sekolah.',
    icon: <PieChart className="w-5 h-5" />,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/10',
  },
  {
    title: 'Pencarian Cepat',
    description: 'Temukan sekolah berdasarkan nama, lokasi, atau kriteria lainnya.',
    icon: <Search className="w-5 h-5" />,
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500/10',
  },
  {
    title: 'Filter Lanjutan',
    description: 'Filter data berdasarkan kabupaten, jenis sekolah, status, dan lainnya.',
    icon: <Filter className="w-5 h-5" />,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10',
  },
  {
    title: 'Statistik Real-time',
    description: 'Update data statistik secara real-time dengan visualisasi yang jelas.',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
  },
  {
    title: 'Ekspor Data',
    description: 'Unduh data dalam format CSV untuk analisis lebih lanjut.',
    icon: <Download className="w-5 h-5" />,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500/10',
  },
]

export default function FeatureHighlights() {
  return (
    <>
      {/* Desktop & Tablet - Horizontal Scrolling */}
      <div className="hidden md:block">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fitur Utama</h3>
          <p className="text-gray-600">
            Kemampuan aplikasi dalam analisis data sekolah di Jawa Timur
          </p>
        </div>
        
        <div className="relative">
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          
          {/* Horizontal scroll container */}
          <div className="flex overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
            <div className="flex space-x-4 min-w-max">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex-shrink-0 w-64 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`h-2 rounded-t-xl bg-gradient-to-r ${feature.color}`} />
                  <div className="p-5">
                    <div className="flex items-start mb-4">
                      <div className={`p-3 rounded-lg ${feature.bgColor} mr-4`}>
                        <div className={`text-white bg-gradient-to-r ${feature.color} p-2 rounded-lg`}>
                          {feature.icon}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Scroll indicator */}
          <div className="flex justify-center mt-4 space-x-1">
            {features.map((_, index) => (
              <div
                key={index}
                className="w-1.5 h-1.5 bg-gray-300 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile - Vertical Grid */}
      <div className="md:hidden">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Fitur Utama</h3>
          <p className="text-gray-600">
            Kemampuan aplikasi dalam analisis data sekolah di Jawa Timur
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.slice(0, 4).map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className={`h-1.5 rounded-t-xl bg-gradient-to-r ${feature.color}`} />
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${feature.bgColor} mr-3`}>
                    <div className={`text-white bg-gradient-to-r ${feature.color} p-1.5 rounded-md`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* View More Button for Mobile */}
        {features.length > 4 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              + {features.length - 4} fitur lainnya
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// Add this to your globals.css for scrollbar hiding
// .scrollbar-hide {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// }
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }