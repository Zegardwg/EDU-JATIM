// /app/tabel/components/LoadingState.tsx
export default function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        
        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Memuat Data Sekolah...
          </h2>
          <p className="text-gray-600 max-w-md">
            Sedang mengambil data dari API. Proses ini mungkin memakan waktu beberapa detik 
            tergantung jumlah data yang tersedia.
          </p>
          
          {/* Progress indicator dots */}
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}