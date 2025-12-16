'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Sekolah {
  kabupaten_kota: string
}

interface KabupatenDistributionProps {
  data: Sekolah[]
}

interface ChartData {
  kabupaten: string
  jumlah: number
}

export default function KabupatenDistribution({ data }: KabupatenDistributionProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<'all' | 'top10' | 'bottom10'>('top10')

  useEffect(() => {
    if (data.length > 0) {
      // Group by kabupaten
      const kabupatenCount: Record<string, number> = {}
      
      data.forEach(item => {
        const kabupaten = item.kabupaten_kota?.trim() || 'Tidak Diketahui'
        kabupatenCount[kabupaten] = (kabupatenCount[kabupaten] || 0) + 1
      })
      
      // Convert to array and sort
      let processedData = Object.entries(kabupatenCount)
        .map(([kabupaten, jumlah]) => ({ 
          kabupaten: kabupaten.length > 20 ? kabupaten.substring(0, 20) + '...' : kabupaten,
          jumlah,
          fullName: kabupaten
        }))
        .sort((a, b) => b.jumlah - a.jumlah)
      
      // Apply filter
      if (selectedType === 'top10') {
        processedData = processedData.slice(0, 10)
      } else if (selectedType === 'bottom10') {
        processedData = processedData.slice(-10).reverse()
      }
      // else 'all' - show all (might be too many)
      
      setChartData(processedData)
      setLoading(false)
    }
  }, [data, selectedType])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#a4de6c', '#d0ed57']

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">
          Jumlah Sekolah per Kabupaten/Kota
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedType('top10')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedType === 'top10' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Top 10
          </button>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedType === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setSelectedType('bottom10')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedType === 'bottom10' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bottom 10
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Tidak ada data yang tersedia
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="kabupaten" 
                width={90}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value} sekolah`, 'Jumlah']}
                labelFormatter={(label) => `Kabupaten: ${label}`}
              />
              <Bar dataKey="jumlah" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600 text-center">
        Total {data.length.toLocaleString('id-ID')} data sekolah dari {new Set(data.map(d => d.kabupaten_kota?.trim())).size} kabupaten/kota
      </div>
    </div>
  )
}