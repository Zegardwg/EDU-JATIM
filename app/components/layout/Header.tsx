'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, BarChart3 } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Peta', href: '/peta', icon: <MapPin className="w-4 h-4" /> },
  { name: 'Tabel', href: '/tabel' },
  { name: 'Visualisasi', href: '/visualisasi', icon: <BarChart3 className="w-4 h-4" /> },
  { name: 'Kabupaten', href: '/kabupaten' },
  { name: 'Tentang', href: '/tentang' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">SekolahMap</span>
                <span className="text-sm font-semibold text-blue-600 ml-1">Jatim</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t mt-2 pt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}