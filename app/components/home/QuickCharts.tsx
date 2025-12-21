"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface School {
  bentuk?: string
  status?: string
}

interface QuickChartsProps {
  data: School[]
}

const COLORS = {
  bentuk: ["#10b981", "#14b8a6", "#22c55e", "#84cc16"],
  status: ["#059669", "#0d9488", "#16a34a"],
}

export default function QuickCharts({ data }: QuickChartsProps) {
  const bentukData = useMemo(() => {
    const counts: Record<string, number> = {}
    data.forEach((school) => {
      const bentuk = school.bentuk || "Unknown"
      counts[bentuk] = (counts[bentuk] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {}
    data.forEach((school) => {
      const status = school.status || "Unknown"
      counts[status] = (counts[status] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Bentuk Sekolah Bar Chart */}
      <div>
        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
          Distribusi Jenis Sekolah
        </h4>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={bentukData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #d1fae5",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {bentukData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.bentuk[index % COLORS.bentuk.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Sekolah Pie Chart */}
      <div>
        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-teal-500 rounded-full"></div>
          Distribusi Status Sekolah
        </h4>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.status[index % COLORS.status.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #d1fae5",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
