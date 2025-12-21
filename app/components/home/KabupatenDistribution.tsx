"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface School {
  kabupaten_kota?: string
}

interface KabupatenDistributionProps {
  data: School[]
}

export default function KabupatenDistribution({ data }: KabupatenDistributionProps) {
  const kabupatenData = useMemo(() => {
    const counts: Record<string, number> = {}
    data.forEach((school) => {
      const kabupaten = school.kabupaten_kota || "Unknown"
      counts[kabupaten] = (counts[kabupaten] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  }, [data])

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={kabupatenData} layout="vertical" margin={{ left: 100, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
        <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }} width={95} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #d1fae5",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          cursor={{ fill: "#f0fdf4" }}
        />
        <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
