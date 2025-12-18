"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DataTableClient from "./DataTableClient";
import { Sekolah } from "../types/sekolah";

export default function DataTableClientWrapper({
  initialData,
  pageSize,
}: {
  initialData: Sekolah[];
  pageSize: number;
}) {
  const router = useRouter();

  const handleRowClick = (sekolah: Sekolah) => {
    // client-side behavior: show alert or navigate
    // router.push(`/sekolah/${sekolah.npsn}`);
    alert(
      `Detail sekolah: ${sekolah.sekolah}\nNPSN: ${sekolah.npsn}\nAlamat: ${sekolah.alamat_jalan}`
    );
  };

  const handleViewOnMap = (sekolah: Sekolah) => {
    const lat = parseFloat(sekolah.lintang);
    const lng = parseFloat(sekolah.bujur);
    if (!isNaN(lat) && !isNaN(lng)) {
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    } else {
      alert("Sekolah ini tidak memiliki koordinat yang valid.");
    }
  };

  return (
    <DataTableClient
      initialData={initialData}
      pageSize={pageSize}
      onRowClick={handleRowClick}
      onViewOnMap={handleViewOnMap}
    />
  );
}
