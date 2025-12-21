"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, MapPin, Home, Table2, Info } from "lucide-react"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Peta", href: "/peta", icon: MapPin },
  { name: "Tabel", href: "/tabel", icon: Table2 },
  { name: "Tentang", href: "/tentang", icon: Info },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-300 transition-shadow">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline">
                <span className="text-xl font-bold text-slate-900">SekolahMap</span>
                <span className="text-sm font-bold text-emerald-600 ml-1.5 px-2 py-0.5 bg-emerald-50 rounded-md">
                  Jatim
                </span>
              </div>
              <p className="text-xs text-slate-500 -mt-0.5">Peta Pendidikan Jawa Timur</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Stats Badge - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-emerald-700">27,614 Sekolah</span>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 py-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-700 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
