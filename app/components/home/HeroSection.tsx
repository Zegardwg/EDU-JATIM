'use client'


export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-600">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Visualisasi Data Sekolah
            <span className="block text-blue-200">Jawa Timur</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Eksplorasi data lengkap sekolah di Jawa Timur melalui peta interaktif, 
            analisis statistik, dan visualisasi data yang informatif.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/peta"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-white text-blue-700 rounded-full hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Mulai Eksplorasi Peta
            </a>
            <a
              href="#stats"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-transparent text-white border-2 border-white rounded-full hover:bg-white/10 transition-all"
            >
              Lihat Statistik
            </a>
          </div>
        </div>
      </div>
      
      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full h-16 text-white" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  )
}