import Link from 'next/link';
import { Home, Search, AlertCircle } from 'lucide-react';

export default function SekolahNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={40} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sekolah Tidak Ditemukan
          </h1>
          <p className="text-gray-600">
            Data sekolah dengan NPSN tersebut tidak ditemukan dalam database.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/tabel"
            className="block w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            ← Kembali ke Tabel Data
          </Link>

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <Home size={18} />
              Beranda
            </Link>
            <Link
              href="/peta"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Search size={18} />
              Cari di Peta
            </Link>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Tips:</strong> Pastikan NPSN yang Anda cari sudah benar. 
            Coba cari sekolah di tabel utama atau gunakan fitur peta untuk menemukan sekolah.
          </p>
        </div>
      </div>
    </div>
  );
}