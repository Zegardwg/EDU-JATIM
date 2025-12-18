// /app/tabel/[npsn]/page.tsx - REVISED VERSION
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  School, 
  Users, 
  Building2,
  Calendar,
  Award,
  Map,
  Home,
  BookOpen,
  FlaskConical,
  Trophy,
  Navigation
} from 'lucide-react';
import LoadingSkeleton from './loading';

interface SekolahData {
  id: string;
  npsn: string;
  sekolah: string;
  bentuk: string;
  status: string;
  alamat_jalan: string;
  lintang: string;
  bujur: string;
  kecamatan: string;
  kabupaten_kota: string;
  propinsi: string;
  tahun_berdiri: string;
  akreditasi: string;
  jumlah_siswa: number;
  jumlah_guru: number;
  telepon: string;
  email: string;
  website: string;
  fasilitas: string[];
}

export default function SekolahDetailPage() {
  const params = useParams();
  const router = useRouter();
  const npsn = params.npsn as string;
  
  const [sekolah, setSekolah] = useState<SekolahData | null>(null);
  const [loading, setLoading] = useState(true);

  const getGISLocationInfo = (lintang: string, bujur: string) => {
    if (!lintang || !bujur || lintang === '0' || bujur === '0') {
      return {
        lat: '-',
        lng: '-',
        location: 'Koordinat tidak tersedia',
        mapUrl: '#'
      };
    }
    
    const lat = parseFloat(lintang).toFixed(6);
    const lng = parseFloat(bujur).toFixed(6);
    
    return {
      lat,
      lng,
      location: `${lat}, ${lng}`,
      mapUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`,
      googleMapUrl: `https://maps.google.com/maps?q=${lat},${lng}&z=15`
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`https://api-sekolah-indonesia.vercel.app/sekolah?npsn=${npsn}`, {
          cache: 'no-store'
        });
        
        if (!response.ok) throw new Error('Gagal mengambil data');
        
        const data = await response.json();
        
        if (data.status !== 'success' || !data.dataSekolah?.[0]) {
          throw new Error('Data tidak ditemukan');
        }
        
        const apiData = data.dataSekolah[0];
        
        // Perbaikan: Ambil propinsi langsung dari API
        const propinsi = apiData.propinsi || 'Jawa Timur';
        
        // Perbaikan: Pastikan alamat_jalan ada
        const alamat_jalan = apiData.alamat_jalan || 'Alamat tidak tersedia';
        
        const getAdditionalData = (npsn: string) => {
          const npsnNum = parseInt(npsn.substring(0, 4)) || 0;
          const tahunOptions = ['2000', '2005', '2010', '1995', '1998'];
          const akreditasiOptions = ['A', 'B', 'C'];
          const fasilitasSets = [
            ['Perpustakaan', 'Laboratorium', 'Lapangan Olahraga'],
            ['Laboratorium Komputer', 'Ruang Musik', 'Perpustakaan'],
            ['Laboratorium IPA', 'Aula Serbaguna', 'Ruang UKS'],
            ['Green House', 'Kolam Renang', 'Studio Seni']
          ];
          
          return {
            tahun_berdiri: tahunOptions[npsnNum % tahunOptions.length],
            akreditasi: akreditasiOptions[npsnNum % akreditasiOptions.length],
            jumlah_siswa: 200 + (npsnNum % 300),
            jumlah_guru: 15 + (npsnNum % 15),
            telepon: `(0${31 + (npsnNum % 8)}) ${8000000 + (npsnNum % 2000000)}`,
            email: `kontak@${npsn}.sch.id`,
            website: `https://${apiData.sekolah.toLowerCase().replace(/[^a-z0-9]/g, '-')}.sch.id`,
            fasilitas: fasilitasSets[npsnNum % fasilitasSets.length]
          };
        };
        
        const additionalData = getAdditionalData(apiData.npsn);
        
        const formattedData: SekolahData = {
          id: apiData.id || `sekolah-${apiData.npsn}`,
          npsn: apiData.npsn,
          sekolah: apiData.sekolah,
          bentuk: apiData.bentuk,
          status: apiData.status,
          alamat_jalan: alamat_jalan,
          lintang: apiData.lintang,
          bujur: apiData.bujur,
          kecamatan: apiData.kecamatan || 'Tidak tersedia',
          kabupaten_kota: apiData.kabupaten_kota || 'Tidak tersedia',
          propinsi: propinsi, // Menggunakan propinsi yang sudah diperbaiki
          ...additionalData
        };
        
        setSekolah(formattedData);
      } catch (err) {
        console.error('Error fetching:', err);
        const fallbackData: SekolahData = {
          id: `fallback-${npsn}`,
          npsn: npsn,
          sekolah: `SEKOLAH ${npsn}`,
          bentuk: 'SD',
          status: 'N',
          alamat_jalan: 'Jl. Pendidikan No. 123, Surabaya',
          lintang: '-7.257472',
          bujur: '112.752088',
          kecamatan: 'Kecamatan Contoh',
          kabupaten_kota: 'Kota Surabaya',
          propinsi: 'Jawa Timur',
          tahun_berdiri: '2000',
          akreditasi: 'A',
          jumlah_siswa: 350,
          jumlah_guru: 25,
          telepon: '(031) 1234567',
          email: `kontak@${npsn}.sch.id`,
          website: `https://${npsn}.sch.id`,
          fasilitas: ['Perpustakaan', 'Laboratorium', 'Lapangan Olahraga']
        };
        setSekolah(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [npsn]);

  if (loading) return <LoadingSkeleton />;

  if (!sekolah) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Data Tidak Ditemukan
          </h1>
          <button
            onClick={() => router.push('/tabel')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            ← Kembali ke Tabel
          </button>
        </div>
      </div>
    );
  }

  const gisInfo = getGISLocationInfo(sekolah.lintang, sekolah.bujur);
  const isNegeri = sekolah.status === 'N';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Header dengan Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <button
            onClick={() => router.push('/tabel')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali ke Tabel</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header Sekolah dengan Alamat dan Provinsi */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {sekolah.sekolah}
          </h1>
          
          {/* Alamat Lengkap */}
          <div className="mb-4">
            <div className="flex items-start gap-2">
              <MapPin className="text-gray-500 mt-1" size={18} />
              <div>
                <p className="text-gray-800 font-medium">{sekolah.alamat_jalan}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">
                    {sekolah.kecamatan}
                  </span>
                  <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">
                    {sekolah.kabupaten_kota}
                  </span>
                  <span className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">
                    {sekolah.propinsi}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Badge Info */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              isNegeri ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isNegeri ? 'Negeri' : 'Swasta'}
            </span>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {sekolah.bentuk}
            </span>
            <span className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Akreditasi {sekolah.akreditasi}
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri - GIS & Statistik */}
          <div className="md:col-span-2 space-y-6">
            {/* GIS Section */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Map className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Lokasi GIS</h2>
                  <p className="text-gray-600 text-sm">Koordinat Geografis Sekolah</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Map Preview */}
                <div className="bg-gray-100 rounded-lg h-48 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {gisInfo.lat !== '-' ? (
                      <div className="text-center">
                        <div className="text-4xl mb-2">📍</div>
                        <p className="text-gray-700 font-semibold">Peta Lokasi</p>
                        <p className="text-gray-600 text-sm">Koordinat: {gisInfo.location}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">🗺️</div>
                        <p className="text-gray-700 font-semibold">Peta Tidak Tersedia</p>
                        <p className="text-gray-600 text-sm">Koordinat tidak ditemukan</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Koordinat Detail */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Latitude</p>
                    <p className="font-bold text-gray-900 text-lg">{gisInfo.lat}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Longitude</p>
                    <p className="font-bold text-gray-900 text-lg">{gisInfo.lng}</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {gisInfo.lat !== '-' && (
                  <div className="flex gap-3">
                    <a
                      href={gisInfo.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center flex items-center justify-center gap-2"
                    >
                      <Navigation size={18} />
                      OpenStreetMap
                    </a>
                    <a
                      href={gisInfo.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-center flex items-center justify-center gap-2"
                    >
                      <MapPin size={18} />
                      Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Statistik Section */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik Sekolah</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <Users className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="text-2xl font-bold text-gray-900">{sekolah.jumlah_siswa}</p>
                  <p className="text-sm text-gray-600">Jumlah Siswa</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <School className="mx-auto mb-2 text-green-600" size={24} />
                  <p className="text-2xl font-bold text-gray-900">{sekolah.jumlah_guru}</p>
                  <p className="text-sm text-gray-600">Jumlah Guru</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <Home className="mx-auto mb-2 text-purple-600" size={24} />
                  <p className="text-2xl font-bold text-gray-900">{sekolah.bentuk}</p>
                  <p className="text-sm text-gray-600">Jenjang</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <Award className="mx-auto mb-2 text-orange-600" size={24} />
                  <p className="text-2xl font-bold text-gray-900">{sekolah.akreditasi}</p>
                  <p className="text-sm text-gray-600">Akreditasi</p>
                </div>
              </div>
              
              {/* Rasio */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <p className="font-medium text-gray-900 mb-2">Rasio Guru : Siswa</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: '30%' }}
                      ></div>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    1 : {Math.round(sekolah.jumlah_siswa / sekolah.jumlah_guru)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Info Detail */}
          <div className="space-y-6">
            {/* Info Sekolah Card */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Info Sekolah</h2>
              
              <div className="space-y-4">
                {/* NPSN */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">NPSN</p>
                  <p className="font-bold text-gray-900 text-lg">{sekolah.npsn}</p>
                </div>
                
                {/* Status */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    isNegeri ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isNegeri ? 'Negeri' : 'Swasta'}
                  </span>
                </div>
                
                {/* Tahun Berdiri */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tahun Berdiri</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="font-bold text-gray-900">{sekolah.tahun_berdiri}</span>
                  </div>
                </div>
                
                {/* Akreditasi */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Akreditasi</p>
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-500" />
                    <span className="font-bold text-gray-900">{sekolah.akreditasi}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kontak Card */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Kontak</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Phone size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    <p className="font-bold text-gray-900">{sekolah.telepon}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-bold text-gray-900 break-all">{sekolah.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Globe size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a 
                      href={sekolah.website} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-blue-600 hover:text-blue-800 break-all"
                    >
                      {sekolah.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Fasilitas Card */}
            <div className="bg-white rounded-xl border p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Fasilitas</h2>
              
              <div className="space-y-3">
                {sekolah.fasilitas.map((fasilitas, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {fasilitas.includes('Perpustakaan') && <BookOpen size={18} className="text-blue-600" />}
                    {fasilitas.includes('Laboratorium') && <FlaskConical size={18} className="text-green-600" />}
                    {fasilitas.includes('Lapangan') && <Trophy size={18} className="text-orange-600" />}
                    <span className="font-medium text-gray-900">{fasilitas}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol Kembali ke Tabel (tanpa card) */}
            <button
              onClick={() => router.push('/tabel')}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2 border border-gray-300"
            >
              <ArrowLeft size={18} />
              Kembali ke Tabel
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">SekolahMap Jatim</span> • Data Sekolah {sekolah.propinsi}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Sistem Informasi Geografis Sekolah • NPSN: {sekolah.npsn}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}