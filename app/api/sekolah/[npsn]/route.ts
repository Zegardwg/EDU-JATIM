// /app/api/sekolah/[npsn]/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ npsn: string }> }
) {
  const { npsn } = await params;
  console.log("🔍 [API Route] Fetching NPSN:", npsn);

  try {
    // Langsung ambil dari API asli
    const apiUrl = `https://api-sekolah-indonesia.vercel.app/sekolah?npsn=${npsn}`;
    console.log("🌐 [API Route] Calling:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      cache: "no-store", // Penting: no cache
    });

    console.log("📊 [API Route] Response status:", response.status);

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const apiData = await response.json();
    console.log("📦 [API Route] API Data:", {
      success: apiData.status === "success",
      total_data: apiData.total_data,
      found: apiData.dataSekolah?.length || 0,
    });

    // Jika tidak ada data
    if (!apiData.dataSekolah || apiData.dataSekolah.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Sekolah dengan NPSN "${npsn}" tidak ditemukan`,
        },
        { status: 404 }
      );
    }

    // Ambil data pertama
    const sekolah = apiData.dataSekolah[0];

    // Format response sesuai dengan yang diharapkan client
    const formattedData = {
      id: sekolah.id || `sekolah-${sekolah.npsn}`,
      npsn: sekolah.npsn,
      sekolah: sekolah.sekolah,
      bentuk: sekolah.bentuk,
      status: sekolah.status,
      alamat_jalan: sekolah.alamat_jalan,
      lintang: sekolah.lintang || "0",
      bujur: sekolah.bujur || "0",
      kecamatan: sekolah.kecamatan,
      kabupaten_kota: sekolah.kabupaten_kota,
      propinsi: sekolah.propinsi,

      // Data tambahan (dummy karena tidak ada di API)
      tahun_berdiri: "2000", // Tidak ada di API, default
      akreditasi: getRandomAkreditasi(),
      jumlah_siswa: getRandomNumber(100, 500),
      jumlah_guru: getRandomNumber(10, 30),
      telepon: generatePhoneNumber(),
      email: generateEmail(sekolah.npsn),
      website: generateWebsite(sekolah.npsn),
      fasilitas: [
        "Perpustakaan",
        "Laboratorium",
        "Lapangan Olahraga",
        "Ruang Komputer",
      ],
    };

    console.log("✅ [API Route] Returning formatted data");

    return NextResponse.json({
      success: true,
      data: formattedData,
      metadata: {
        source: "api_sekolah_indonesia",
        exactMatch: true,
        timestamp: new Date().toISOString(),
        total_data: apiData.total_data,
      },
    });
  } catch (error) {
    console.error("❌ [API Route] Error:", error);

    // Return error yang clear
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data sekolah",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Helper functions
function getRandomAkreditasi(): string {
  const akreditasi = ["A", "B", "C"];
  return akreditasi[Math.floor(Math.random() * akreditasi.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhoneNumber(): string {
  const prefix = ["021", "031", "022", "024", "027", "028"];
  const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `(${randomPrefix}) ${number
    .toString()
    .replace(/(\d{3})(\d{4})/, "$1-$2")}`;
}

function generateEmail(npsn: string): string {
  const domains = ["sch.id", "yahoo.com", "gmail.com"];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `kontak@${npsn}.${domain}`;
}

function generateWebsite(npsn: string): string {
  const protocols = ["https://", "http://"];
  const protocol = protocols[Math.floor(Math.random() * protocols.length)];
  const www = Math.random() > 0.5 ? "www." : "";
  return `${protocol}${www}${npsn}.sch.id`;
}
