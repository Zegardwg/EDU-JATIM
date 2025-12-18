export interface SekolahAPI {
  id: string;
  sekolah: string;
  npsn: string;
  bentuk: string;
  status: string;
  alamat_jalan: string;
  lintang: string;
  bujur: string;
  kecamatan: string;
  kabupaten_kota: string;
  propinsi: string;
  kode_prop: string;
  kode_kab_kota: string;
  kode_kec: string;
}

export interface Sekolah {
  sekolah: string;
  npsn: string;
  bentuk: string;
  status: string;
  alamat_jalan: string;
  lintang: string;
  bujur: string;
  kecamatan: string;
  kabupaten_kota: string;
  provinsi: string;
}

export interface SekolahDetail extends Sekolah {
  tahun_berdiri?: string;
  akreditasi?: string;
  kurikulum?: string;
  jumlah_siswa?: number;
  jumlah_guru?: number;
  fasilitas?: string[];
  kontak?: {
    telepon?: string;
    email?: string;
    website?: string;
  };
}

// ... lainnya tetap sama