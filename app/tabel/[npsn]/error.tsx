'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function SekolahDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Detail sekolah error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h2>
          
          <p className="text-gray-600 mb-2">
            Gagal memuat data detail sekolah.
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            {error.message || 'Coba refresh halaman atau hubungi administrator.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <RefreshCw size={18} />
              Coba Lagi
            </button>
            
            <a
              href="/tabel"
              className="block px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              ← Kembali ke Tabel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}