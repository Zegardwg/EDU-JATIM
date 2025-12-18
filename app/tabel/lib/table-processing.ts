import { Sekolah } from '../types/sekolah';

export function processTableData(rawData: any[]): Sekolah[] {
  return rawData
    .map(item => ({
      id: item.id || generateId(),
      sekolah: item.sekolah || 'Nama tidak tersedia',
      bentuk: item.bentuk || 'Lainnya',
      status: item.status || 'N',
      alamat_jalan: item.alamat_jalan || '',
      kabupaten_kota: (item.kabupaten_kota || '').trim(),
      kecamatan: (item.kecamatan || '').trim(),
      lintang: item.lintang,
      bujur: item.bujur,
      npsn: item.npsn || '',
      kode_prop: item.kode_prop,
      propinsi: item.propinsi,
      kode_kab_kota: item.kode_kab_kota,
      kode_kec: item.kode_kec
    }))
    .filter(item => item.sekolah && item.sekolah !== 'Nama tidak tersedia')
    .sort((a, b) => {
      if (a.kabupaten_kota !== b.kabupaten_kota) {
        return a.kabupaten_kota.localeCompare(b.kabupaten_kota);
      }
      return a.sekolah.localeCompare(b.sekolah);
    });
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}