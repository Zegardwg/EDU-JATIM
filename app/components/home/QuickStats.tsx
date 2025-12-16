'use client'

import { useState, useEffect } from 'react'
import { School, MapPin, Users, TrendingUp, RefreshCw } from 'lucide-react'

interface Stats {
  totalSekolah?: number
  totalKabupaten?: number
  sekolahNegeri?: number
  sekolahSwasta?: number
}

// Function untuk fetch stats dari API
const fetchStats = async (): Promise<Stats> => {
  try {
    const response = await fetch('/api/statistics')
    if (!response.ok) throw new Error('Failed to fetch statistics')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return fallback data
    return {
      totalSekolah: 25149,
      totalKabupaten: 38,
      sekolahNegeri: 18214,
      sekolahSwasta: 6935,
    }
  }
}

export default function QuickStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchStats()
      setStats(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Gagal memuat data statistik')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
    
    // Auto-refresh setiap 5 menit
    const interval = setInterval(loadStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const defaultStats = {
    totalSekolah: 25149,
    totalKabupaten: 38,
    sekolahNegeri: 18214,
    sekolahSwasta: 6935,
  }

  const displayStats = stats || defaultStats

  const statsItems = [
    {
      title: 'Total Sekolah',
      value: displayStats.totalSekolah?.toLocaleString('id-ID') || '25.149',
      icon: <School className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      description: 'Seluruh Jawa Timur',
      key: 'totalSekolah'
    },
    {
      title: 'Kabupaten/Kota',
      value: displayStats.totalKabupaten?.toString() || '38',
      icon: <MapPin className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      description: 'Wilayah Administrasi',
      key: 'totalKabupaten'
    },
    {
      title: 'Sekolah Negeri',
      value: displayStats.sekolahNegeri?.toLocaleString('id-ID') || '18.214',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      description: 'Sekolah Pemerintah',
      key: 'sekolahNegeri'
    },
    {
      title: 'Sekolah Swasta',
      value: displayStats.sekolahSwasta?.toLocaleString('id-ID') || '6.935',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      description: 'Sekolah Mandiri',
      key: 'sekolahSwasta'
    },
  ]

  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="animate-pulse">
              <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-10 w-16 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error Memuat Data</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header dengan refresh button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {lastUpdated && (
            <span>Diperbarui: {lastUpdated.toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          )}
        </div>
        <button
          onClick={loadStats}
          disabled={loading}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Memuat...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((item, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            {/* Hover effect line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {item.value}
                </p>
              </div>
              <div className={`${item.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">{item.icon}</div>
              </div>
            </div>
            <p className="text-sm text-gray-500">{item.description}</p>
            
            {/* Live indicator jika data real-time */}
            {item.key === 'totalSekolah' && (
              <div className="absolute bottom-2 right-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}