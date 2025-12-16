'use client'

interface Sekolah {
  sekolah: string
  bentuk: string
  status: string
  alamat_jalan: string
  kabupaten_kota: string
}

interface DataTablePreviewProps {
  data: Sekolah[]
}

export default function DataTablePreview({ data }: DataTablePreviewProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data yang tersedia
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Sekolah
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kabupaten
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">
                <div className="font-medium">{item.sekolah}</div>
                <div className="text-xs text-gray-500 truncate max-w-xs">
                  {item.alamat_jalan}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.bentuk === 'SD' ? 'bg-blue-100 text-blue-800' :
                  item.bentuk === 'SMP' ? 'bg-green-100 text-green-800' :
                  item.bentuk === 'SMA' ? 'bg-purple-100 text-purple-800' :
                  item.bentuk === 'SMK' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.bentuk}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'N' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status === 'N' ? 'Negeri' : 'Swasta'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {item.kabupaten_kota?.trim() || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}