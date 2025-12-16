import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SekolahMap Jatim - Visualisasi Data Sekolah Jawa Timur',
  description: 'Aplikasi visualisasi data sekolah di Jawa Timur dengan peta interaktif dan analisis data',
  keywords: ['sekolah', 'jawa timur', 'peta', 'data', 'visualisasi', 'pendidikan'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}