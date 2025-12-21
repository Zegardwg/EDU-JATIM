import Link from "next/link"
import { Github, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white mt-auto border-t border-emerald-900/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293a1 1 0 00-1.414 0l-1 1a1 1 0 000 1.414l15 15a1 1 0 001.414 0l1-1a1 1 0 000-1.414l-15-15z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                SekolahMap Jatim
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Visualisasi data sekolah di Jawa Timur dengan peta interaktif dan analisis data.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Navigasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/peta" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Peta Interaktif
                </Link>
              </li>
              <li>
                <Link href="/tabel" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Tabel Data
                </Link>
              </li>
              <li>
                <Link href="/visualisasi" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Visualisasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-400">Informasi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tentang" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Tentang Aplikasi
                </Link>
              </li>
              <li>
                <Link href="/panduan" className="text-slate-400 hover:text-teal-400 transition-colors">
                  Panduan
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-slate-400 hover:text-teal-400 transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-green-400">Credits</h3>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm mb-1">Data Sekolah:</p>
                <a
                  href="https://api-sekolah-indonesia.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
                >
                  API Sekolah Indonesia
                </a>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-sm">
                  <Heart className="w-4 h-4 text-emerald-400" />
                  <span>Made with</span>
                  <a
                    href="https://nextjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    Next.js 16
                  </a>
                </div>

                <div className="mt-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    <span className="text-sm">Source Code</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} SekolahMap Jatim. Data dari API Sekolah Indonesia.</p>
        </div>
      </div>
    </footer>
  )
}
