'use client'

interface School {
  sekolah?: string
  kabupaten_kota?: string
  bentuk?: string
  status?: string
}

interface DataTablePreviewProps {
  data: School[]
}

export default function DataTablePreview({ data }: DataTablePreviewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-emerald-200">
            <th className="text-left p-3 font-bold text-slate-700">Nama Sekolah</th>
            <th className="text-left p-3 font-bold text-slate-700">Kabupaten</th>
            <th className="text-left p-3 font-bold text-slate-700">Jenis</th>
          </tr>
        </thead>
        <tbody>
          {data.map((school, index) => (
            <tr key={index} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
              <td className="p-3 text-slate-800 font-medium truncate max-w-xs">{school.sekolah || "N/A"}</td>
              <td className="p-3 text-slate-600 truncate">{school.kabupaten_kota || "N/A"}</td>
              <td className="p-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    school.bentuk === "SD"
                      ? "bg-emerald-100 text-emerald-700"
                      : school.bentuk === "SMP"
                        ? "bg-teal-100 text-teal-700"
                        : school.bentuk === "SMA"
                          ? "bg-green-100 text-green-700"
                          : school.bentuk === "SMK"
                            ? "bg-lime-100 text-lime-700"
                            : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {school.bentuk || "N/A"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
