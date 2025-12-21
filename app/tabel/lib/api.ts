// /app/tabel/lib/api.ts

const API_BASE_URL = 'https://api-sekolah-indonesia.vercel.app';

interface FetchAllOptions {
  maxPages?: number;
  perPage?: number;
  delayBetweenPages?: number;
  onProgress?: (progress: {
    page: number;
    totalFetched: number;
    currentPageData: number;
    message: string;
  }) => void;
}

// Helper function: sleep
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function: process data sekolah
function processSekolahData(rawData: any[]): any[] {
  return rawData
    .map(item => ({
      id: item.id || generateId(),
      sekolah: item.sekolah || 'Nama tidak tersedia',
      bentuk: item.bentuk || 'Lainnya',
      status: item.status || 'N',
      alamat_jalan: item.alamat_jalan || '',
      kabupaten_kota: (item.kabupaten_kota || '').trim(),
      kecamatan: item.kecamatan || '',
      lintang: item.lintang,
      bujur: item.bujur,
      npsn: item.npsn || '',
      kode_prop: item.kode_prop,
      propinsi: item.propinsi,
      kode_kab_kota: item.kode_kab_kota,
      kode_kec: item.kode_kec
    }))
    .filter(item => {
      const lat = parseFloat(item.lintang);
      const lng = parseFloat(item.bujur);
      return !isNaN(lat) && !isNaN(lng);
    })
    .filter(item => item.sekolah && item.sekolah !== 'Nama tidak tersedia');
}

// Helper function: generate unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export async function getAllSekolahData(options: FetchAllOptions = {}): Promise<any[]> {
  const {
    maxPages = 40,
    perPage = 1000,
    delayBetweenPages = 30
  } = options;

  console.log('🚀 Memulai pengambilan data sekolah Jawa Timur...');

  try {
    let allData: any[] = [];
    let currentPage = 1;
    let totalPagesFetched = 0;
    let isCompleted = false;

    // Loop hingga tidak ada data lagi atau mencapai maxPages
    while (!isCompleted && currentPage <= maxPages) {
      try {
        if (options.onProgress) {
          options.onProgress({
            page: currentPage,
            totalFetched: allData.length,
            currentPageData: 0,
            message: `Mengambil halaman ${currentPage}...`
          });
        }

        console.log(`📄 Fetch halaman ${currentPage}...`);
        
        const searchParams = new URLSearchParams({
          provinsi: '050000', // Jawa Timur
          page: currentPage.toString(),
          perPage: perPage.toString(),
        });

        const response = await fetch(`${API_BASE_URL}/sekolah?${searchParams}`, {
          headers: {
            'User-Agent': 'SekolahMap-Jatim/1.0'
          }
        });
        
        if (!response.ok) {
          console.warn(`⚠️ Halaman ${currentPage} error: ${response.status}`);
          break;
        }
        
        const data = await response.json();
        const currentPageData = data.dataSekolah || [];
        
        if (currentPageData.length === 0) {
          console.log('✅ Tidak ada data lagi, fetch selesai!');
          isCompleted = true;
        } else {
          // Tambahkan data
          allData = [...allData, ...currentPageData];
          totalPagesFetched++;
          
          console.log(`📊 Halaman ${currentPage}: ${currentPageData.length} data (Total: ${allData.length})`);
          
          if (options.onProgress) {
            options.onProgress({
              page: currentPage,
              totalFetched: allData.length,
              currentPageData: currentPageData.length,
              message: `Halaman ${currentPage}: ${currentPageData.length} data`
            });
          }
          
          currentPage++;
          
          // Delay kecil antar halaman
          if (!isCompleted && currentPage <= maxPages) {
            await sleep(delayBetweenPages);
          }
        }
      } catch (pageError) {
        console.error(`❌ Error di halaman ${currentPage}:`, pageError);
        break;
      }
    }
    
    console.log(`🎉 Berhasil mengambil ${allData.length} data sekolah dari ${totalPagesFetched} halaman`);
    
    // Process dan filter data
    const processedData = processSekolahData(allData);
    
    console.log(`📍 ${processedData.length} data dengan koordinat valid`);
    return processedData;
    
  } catch (error) {
    console.error('❌ Error utama fetch semua data:', error);
    
    // Fallback: Ambil 1000 data pertama
    console.log('🔄 Fallback ke data terbatas...');
    return getSekolahData({ page: 1, perPage: 1000 });
  }
}

// Existing function untuk pagination
export async function getSekolahData(params: { page?: number, perPage?: number } = {}) {
  try {
    const searchParams = new URLSearchParams({
      provinsi: '050000',
      page: (params.page || 1).toString(),
      perPage: (params.perPage || 100).toString(),
    });

    const response = await fetch(`${API_BASE_URL}/sekolah?${searchParams}`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    return data.dataSekolah || [];
  } catch (error) {
    console.error('Error fetching sekolah data:', error);
    return [];
  }
}