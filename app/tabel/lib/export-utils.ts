import { Sekolah } from '../types/sekolah';

export function exportToCSV(data: Sekolah[]): string {
  const headers = [
    'NPSN',
    'Nama Sekolah',
    'Jenjang',
    'Status',
    'Alamat',
    'Kabupaten/Kota',
    'Kecamatan',
    'Latitude',
    'Longitude',
    'Propinsi'
  ];

  const rows = data.map(sekolah => [
    sekolah.npsn,
    `"${sekolah.sekolah.replace(/"/g, '""')}"`,
    sekolah.bentuk,
    sekolah.status === 'N' ? 'Negeri' : 'Swasta',
    `"${sekolah.alamat_jalan.replace(/"/g, '""')}"`,
    sekolah.kabupaten_kota,
    sekolah.kecamatan,
    sekolah.lintang,
    sekolah.bujur,
    sekolah.provinsi
  ]);

  return [
    `# Total Data: ${data.length}`,
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

export function exportToJSON(data: Sekolah[]): string {
  return JSON.stringify({
    metadata: {
      exportedAt: new Date().toISOString(),
      totalRecords: data.length,
      source: 'EduMap Sekolah Jawa Timur'
    },
    data
  }, null, 2);
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}