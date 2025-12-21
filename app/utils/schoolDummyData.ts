// Dummy data sekolah untuk visualisasi
export interface School {
  id: string
  name: string
  type: "SD" | "SMP" | "SMA" | "SMK"
  lat: number
  lng: number
  regency: string
  address: string
  students: number
  accreditation: "A" | "B" | "C"
  image: string
}

export const dummySchools: School[] = [
  // Surabaya
  {
    id: "1",
    name: "SMAN 5 Surabaya",
    type: "SMA",
    lat: -7.257472,
    lng: 112.752088,
    regency: "Kota Surabaya",
    address: "Jl. Kusuma Bangsa No.21",
    students: 1200,
    accreditation: "A",
    image: "/modern-school-building.png",
  },
  {
    id: "2",
    name: "SMPN 12 Surabaya",
    type: "SMP",
    lat: -7.265472,
    lng: 112.742088,
    regency: "Kota Surabaya",
    address: "Jl. Pucang Anom Timur",
    students: 980,
    accreditation: "A",
    image: "/junior-high-school-indonesia.jpg",
  },
  {
    id: "3",
    name: "SDN Gubeng 1",
    type: "SD",
    lat: -7.275472,
    lng: 112.762088,
    regency: "Kota Surabaya",
    address: "Jl. Gubeng Kertajaya",
    students: 650,
    accreditation: "A",
    image: "/elementary-school-indonesia.jpg",
  },
  {
    id: "4",
    name: "SMKN 2 Surabaya",
    type: "SMK",
    lat: -7.285472,
    lng: 112.732088,
    regency: "Kota Surabaya",
    address: "Jl. Tentara Genie Pelajar",
    students: 1450,
    accreditation: "A",
    image: "/vocational-school-building.jpg",
  },
  {
    id: "5",
    name: "SMAN 1 Surabaya",
    type: "SMA",
    lat: -7.267472,
    lng: 112.755088,
    regency: "Kota Surabaya",
    address: "Jl. Wijaya Kusuma",
    students: 1350,
    accreditation: "A",
    image: "/high-school-indonesia-building.jpg",
  },
  // Malang
  {
    id: "6",
    name: "SMAN 3 Malang",
    type: "SMA",
    lat: -7.96662,
    lng: 112.632632,
    regency: "Kabupaten Malang",
    address: "Jl. Raya Tlogomas",
    students: 1100,
    accreditation: "A",
    image: "/school-campus-malang.jpg",
  },
  {
    id: "7",
    name: "SMPN 5 Malang",
    type: "SMP",
    lat: -7.98362,
    lng: 112.622632,
    regency: "Kabupaten Malang",
    address: "Jl. Prof. Moch. Yamin",
    students: 890,
    accreditation: "A",
    image: "/middle-school-indonesia.jpg",
  },
  {
    id: "8",
    name: "SDN Lowokwaru 1",
    type: "SD",
    lat: -7.95662,
    lng: 112.642632,
    regency: "Kabupaten Malang",
    address: "Jl. Soekarno Hatta",
    students: 720,
    accreditation: "B",
    image: "/primary-school-malang.jpg",
  },
  {
    id: "9",
    name: "SMKN 4 Malang",
    type: "SMK",
    lat: -7.97662,
    lng: 112.612632,
    regency: "Kabupaten Malang",
    address: "Jl. Tugu",
    students: 1300,
    accreditation: "A",
    image: "/vocational-high-school.jpg",
  },
  // Jember
  {
    id: "10",
    name: "SMAN 1 Jember",
    type: "SMA",
    lat: -8.16662,
    lng: 113.699632,
    regency: "Kabupaten Jember",
    address: "Jl. Letjen Suprapto",
    students: 1050,
    accreditation: "A",
    image: "/school-building-jember.jpg",
  },
  {
    id: "11",
    name: "SMPN 3 Jember",
    type: "SMP",
    lat: -8.17662,
    lng: 113.709632,
    regency: "Kabupaten Jember",
    address: "Jl. Gajah Mada",
    students: 850,
    accreditation: "A",
    image: "/junior-school-campus.jpg",
  },
  {
    id: "12",
    name: "SDN Jember Lor 1",
    type: "SD",
    lat: -8.15662,
    lng: 113.689632,
    regency: "Kabupaten Jember",
    address: "Jl. Kaliurang",
    students: 680,
    accreditation: "B",
    image: "/elementary-school.png",
  },
  {
    id: "13",
    name: "SMKN 5 Jember",
    type: "SMK",
    lat: -8.18662,
    lng: 113.719632,
    regency: "Kabupaten Jember",
    address: "Jl. Brawijaya",
    students: 1200,
    accreditation: "A",
    image: "/technical-school-building.jpg",
  },
]

export const getSchoolTypeColor = (type: School["type"]): string => {
  const colorMap = {
    SD: "#16a34a", // green-600
    SMP: "#3b82f6", // blue-500
    SMA: "#f59e0b", // amber-500
    SMK: "#8b5cf6", // purple-500
  }
  return colorMap[type]
}

export const getSchoolStats = () => {
  const stats = {
    SD: dummySchools.filter((s) => s.type === "SD").length,
    SMP: dummySchools.filter((s) => s.type === "SMP").length,
    SMA: dummySchools.filter((s) => s.type === "SMA").length,
    SMK: dummySchools.filter((s) => s.type === "SMK").length,
    total: dummySchools.length,
    totalStudents: dummySchools.reduce((sum, s) => sum + s.students, 0),
  }
  return stats
}
