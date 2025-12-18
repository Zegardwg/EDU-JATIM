import { SekolahAPI, Sekolah } from '../types/sekolah';

export function processTableData(sekolahData: SekolahAPI[]): Sekolah[] {
  return sekolahData.map(item => ({
    sekolah: item.sekolah || '',
    npsn: item.npsn || '',
    bentuk: item.bentuk || '',
    status: item.status || '',
    alamat_jalan: item.alamat_jalan || '',
    lintang: item.lintang || '0',
    bujur: item.bujur || '0',
    kecamatan: item.kecamatan || '',
    kabupaten_kota: item.kabupaten_kota || '',
    provinsi: item.propinsi || '', // Convert propinsi to provinsi
  }));
}

// Fungsi untuk mapping langsung dari API response
export function mapAPIToSekolah(apiData: any): Sekolah {
  return {
    sekolah: apiData.sekolah || '',
    npsn: apiData.npsn || '',
    bentuk: apiData.bentuk || '',
    status: apiData.status || '',
    alamat_jalan: apiData.alamat_jalan || '',
    lintang: apiData.lintang || '0',
    bujur: apiData.bujur || '0',
    kecamatan: apiData.kecamatan || '',
    kabupaten_kota: apiData.kabupaten_kota || '',
    provinsi: apiData.propinsi || '', // API menggunakan "propinsi"
  };
}