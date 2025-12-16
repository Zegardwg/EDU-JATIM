"use client";

interface Sekolah {
  id: string;
  sekolah: string;
  alamat_jalan: string;
  lintang: string;
  bujur: string;
  bentuk: string;
}

interface MiniMapPreviewProps {
  data: Sekolah[];
}

export default function MiniMapPreview({ data }: MiniMapPreviewProps) {
  // Take only first 50 schools for preview
  const previewData = data.slice(0, 50);

  // Count valid coordinates
  const validSchoolsCount = previewData.filter((s) => {
    const lat = parseFloat(s.lintang);
    const lng = parseFloat(s.bujur);
    return !isNaN(lat) && !isNaN(lng);
  }).length;

  return (
    <div className="h-64 rounded-lg overflow-hidden border border-gray-300 relative">
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Komponen peta sedang dimuat...
          <br />
          <span className="text-sm">
            {validSchoolsCount} sekolah dengan koordinat valid
          </span>
        </p>
      </div>

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <p className="text-xs text-gray-600">
          {validSchoolsCount} sekolah ditampilkan
        </p>
      </div>

      <div className="absolute top-4 left-4">
        <a
          href="/peta"
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
          Buka Peta Lengkap →
        </a>
      </div>
    </div>
  );
}
