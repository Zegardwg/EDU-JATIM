"use client";

import {
  MapContainer as LeafletMap,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
  GeoJSON,
} from "react-leaflet";
import { memo, useCallback, useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Import MarkerClusterGroup
import MarkerClusterGroup from "react-leaflet-cluster";

// Import GeoJSON data dari file terpisah
import {
  jawaTimurGeoJSON,
  getGeoJsonStyle,
  getRegionColor,
} from "./utils/jawaTimurBoundaries";

// Fix untuk default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Komponen untuk batas wilayah Jawa Timur
const JawaTimurBoundaries = memo(
  ({
    showBoundaries,
    onRegionClick,
  }: {
    showBoundaries: boolean;
    onRegionClick?: (regionName: string) => void;
  }) => {
    const onEachFeature = useCallback(
      (feature: any, layer: any) => {
        if (feature.properties) {
          const { name, code, level } = feature.properties;
          const isCity = level === "city";

          const popupContent = `
        <div class="p-3 min-w-[180px]">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-4 h-4 rounded" style="background-color: ${getRegionColor(
              code
            )}"></div>
            <div>
              <h3 class="font-bold text-sm text-gray-800">${name}</h3>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded ${
                  isCity
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }">
                  ${isCity ? "Kota" : "Kabupaten"}
                </span>
                <span class="text-xs text-gray-500">${code}</span>
              </div>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-200">
            <p class="text-xs text-gray-500">Klik untuk filter sekolah di wilayah ini</p>
          </div>
        </div>
      `;

          layer.bindPopup(popupContent);

          // Event handlers
          layer.on({
            click: () => {
              if (onRegionClick) {
                onRegionClick(name);
              }
            },
            mouseover: (e: any) => {
              e.target.setStyle({
                weight: 3,
                fillOpacity: 0.2,
                opacity: 1,
              });
              e.target.bringToFront();
            },
            mouseout: (e: any) => {
              e.target.setStyle(getGeoJsonStyle(feature));
            },
          });
        }
      },
      [onRegionClick]
    );

    if (!showBoundaries) return null;

    return (
      <GeoJSON
        key="jawa-timur-boundaries"
        data={jawaTimurGeoJSON as any}
        style={getGeoJsonStyle}
        onEachFeature={onEachFeature}
      />
    );
  }
);

JawaTimurBoundaries.displayName = "JawaTimurBoundaries";

// Komponen Marker Sekolah (sama seperti sebelumnya)
const SimpleSchoolMarker = memo(({ school }: { school: any }) => {
  const lat = parseFloat(school.lintang);
  const lng = parseFloat(school.bujur);

  if (isNaN(lat) || isNaN(lng)) return null;

  const getSchoolIcon = (jenis: string) => {
    const colorMap: Record<string, string> = {
      SD: "#3b82f6",
      SMP: "#10b981",
      SMA: "#8b5cf6",
      SMK: "#f97316",
      SLB: "#ef4444",
    };
    const color = colorMap[jenis] || "#6b7280";

    return L.divIcon({
      html: `<div style="
        background-color:${color};
        width:12px;
        height:12px;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 1px 2px rgba(0,0,0,0.1);
      "></div>`,
      className: "custom-school-icon",
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  return (
    <Marker position={[lat, lng]} icon={getSchoolIcon(school.bentuk)}>
      <Popup>
        <div className="p-2 max-w-[200px]">
          <h3 className="font-bold text-sm text-gray-800 mb-1">
            {school.sekolah}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <span
                className={`px-1.5 py-0.5 rounded text-xs ${
                  school.bentuk === "SD"
                    ? "bg-blue-100 text-blue-800"
                    : school.bentuk === "SMP"
                    ? "bg-green-100 text-green-800"
                    : school.bentuk === "SMA"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                {school.bentuk}
              </span>
            </div>
            <p className="text-xs text-gray-600 truncate">
              {school.alamat_jalan}
            </p>
            <p className="text-xs text-gray-500">{school.kabupaten_kota}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

SimpleSchoolMarker.displayName = "SimpleSchoolMarker";

// Custom cluster icon
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  const size = Math.min(25 + Math.log(count) * 8, 50);

  return L.divIcon({
    html: `<div style="
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: ${size > 40 ? "14px" : "12px"};
    ">${count}</div>`,
    className: "custom-cluster-icon",
    iconSize: L.point(size, size, true),
  });
};

// Optimized viewport filtering
function useVisibleSchools(schools: any[], batchSize: number = 1000) {
  const [visibleSchools, setVisibleSchools] = useState<any[]>([]);
  const mapRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const updateVisibleSchools = useCallback(() => {
    if (!mapRef.current || schools.length === 0) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const bounds = mapRef.current.getBounds();

        const sampleSize = Math.min(schools.length, 5000);
        const sampledSchools =
          schools.length > 5000
            ? schools.filter(
                (_, i) => i % Math.ceil(schools.length / sampleSize) === 0
              )
            : schools;

        const schoolsInViewport = sampledSchools.filter((school) => {
          try {
            const lat = parseFloat(school.lintang);
            const lng = parseFloat(school.bujur);
            return bounds.contains([lat, lng]);
          } catch {
            return false;
          }
        });

        setVisibleSchools(schoolsInViewport.slice(0, batchSize));
      } catch (error) {
        console.warn("Error updating visible schools:", error);
      }
    }, 100);
  }, [schools, batchSize]);

  const MapEvents = () => {
    const map = useMapEvents({
      moveend: () => {
        mapRef.current = map;
        updateVisibleSchools();
      },
      zoomend: () => {
        mapRef.current = map;
        updateVisibleSchools();
      },
      load: () => {
        mapRef.current = map;
        updateVisibleSchools();
      },
    });
    return null;
  };

  useEffect(() => {
    updateVisibleSchools();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateVisibleSchools]);

  return { visibleSchools, MapEvents };
}

// Main Map Component
interface MapComponentProps {
  schools: any[];
}

function MapComponent({ schools }: MapComponentProps) {
  const center: [number, number] = [-7.5, 112.5];
  const { visibleSchools, MapEvents } = useVisibleSchools(schools, 1500);
  const [performanceMode, setPerformanceMode] = useState(
    schools.length > 10000
  );
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filteredSchools, setFilteredSchools] = useState<any[]>(schools);

  // Filter sekolah berdasarkan wilayah yang dipilih
  useEffect(() => {
    if (selectedRegion) {
      const filtered = schools.filter((school) =>
        school.kabupaten_kota
          ?.toLowerCase()
          .includes(selectedRegion.toLowerCase())
      );
      setFilteredSchools(filtered);
    } else {
      setFilteredSchools(schools);
    }
  }, [selectedRegion, schools]);

  const handleRegionClick = useCallback((regionName: string) => {
    setSelectedRegion((prev) => (prev === regionName ? null : regionName));
  }, []);

  const regionStats = useMemo(() => {
    const stats: Record<
      string,
      { total: number; jenis: Record<string, number> }
    > = {};

    schools.forEach((school) => {
      const region = school.kabupaten_kota;
      if (!region) return;

      if (!stats[region]) {
        stats[region] = { total: 0, jenis: {} };
      }

      stats[region].total++;
      stats[region].jenis[school.bentuk] =
        (stats[region].jenis[school.bentuk] || 0) + 1;
    });

    return stats;
  }, [schools]);

  console.log(
    `🗺️ Rendering ${visibleSchools.length}/${filteredSchools.length} sekolah`
  );

  return (
    <LeafletMap
      center={center}
      zoom={8}
      className="h-full w-full"
      scrollWheelZoom={true}
      minZoom={7}
      maxZoom={18}
      maxBounds={[
        [-9.5, 110.0],
        [-5.5, 115.5],
      ]}
      maxBoundsViscosity={1.0}>
      <MapEvents />

      <TileLayer
        attribution="© OpenStreetMap | Batas Wilayah: Laravel Nusa"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Batas Wilayah Jawa Timur */}
      <JawaTimurBoundaries
        showBoundaries={showBoundaries}
        onRegionClick={handleRegionClick}
      />

      {/* Marker Clustering */}
      <MarkerClusterGroup
        chunkedLoading
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        spiderfyOnMaxZoom={false}
        disableClusteringAtZoom={performanceMode ? 14 : 16}
        maxClusterRadius={performanceMode ? 60 : 40}
        iconCreateFunction={createClusterCustomIcon}
        chunkProgress={(processed, total) => {
          console.log(`Loading markers: ${processed}/${total}`);
        }}>
        {visibleSchools
          .filter((school) => filteredSchools.includes(school))
          .map((school, index) => (
            <SimpleSchoolMarker key={`${school.id}-${index}`} school={school} />
          ))}
      </MarkerClusterGroup>

      {/* Controls Panel */}
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control leaflet-bar bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 m-2 space-y-4 min-w-[280px]">
          {/* Header */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              Peta Sekolah Jawa Timur
            </h3>
            <p className="text-xs text-gray-600">
              {selectedRegion
                ? `Filter: ${selectedRegion} (${filteredSchools.length} sekolah)`
                : `${schools.length.toLocaleString("id-ID")} sekolah`}
            </p>
          </div>

          {/* Region Filter */}
          {selectedRegion && (
            <div className="p-2 bg-blue-50 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-blue-800">
                  Filter Aktif:
                </span>
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="text-xs text-blue-600 hover:text-blue-800">
                  Hapus Filter
                </button>
              </div>
              <p className="text-sm font-semibold text-blue-900">
                {selectedRegion}
              </p>
              {regionStats[selectedRegion] && (
                <div className="text-xs text-blue-700 mt-1">
                  {regionStats[selectedRegion].total} sekolah •{" "}
                  {Object.entries(regionStats[selectedRegion].jenis)
                    .map(([jenis, count]) => `${jenis}: ${count}`)
                    .join(", ")}
                </div>
              )}
            </div>
          )}

          {/* Performance Mode */}
          <div>
            <div className="text-xs font-medium text-gray-700 mb-2">
              Pengaturan Peta
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setPerformanceMode(!performanceMode)}
                className={`w-full text-sm px-3 py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors ${
                  performanceMode
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {performanceMode ? "⚡ Mode Cepat" : "✨ Mode Detail"}
                <span className="text-xs opacity-75">
                  {performanceMode
                    ? "(Klaster lebih besar)"
                    : "(Klaster lebih detail)"}
                </span>
              </button>
            </div>
          </div>

          {/* Layer Controls */}
          <div className="border-t border-gray-200 pt-3">
            <div className="text-xs font-medium text-gray-700 mb-2">
              Layer Peta
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">
                    {showBoundaries && (
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">Batas Wilayah</span>
                </div>
                <input
                  type="checkbox"
                  checked={showBoundaries}
                  onChange={(e) => setShowBoundaries(e.target.checked)}
                  className="sr-only"
                />
              </label>

              <div className="text-xs text-gray-500 pl-6">
                <p>Klik wilayah untuk filter sekolah</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded"></div>
                    <span>Kabupaten</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded"></div>
                    <span>Kota</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 pt-3">
            <div className="text-xs font-medium text-gray-700 mb-2">
              Statistik
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Total Sekolah:</span>
                <span className="font-medium">
                  {schools.length.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Terlihat di peta:</span>
                <span className="font-medium">{visibleSchools.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Wilayah:</span>
                <span className="font-medium">38 Kab/Kota</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend untuk Jenis Sekolah */}
      <div className="leaflet-bottom leaflet-left">
        <div className="leaflet-control leaflet-bar bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-3 m-2">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Jenis Sekolah
          </div>
          <div className="space-y-1">
            {[
              { jenis: "SD", warna: "#3b82f6", label: "Sekolah Dasar" },
              { jenis: "SMP", warna: "#10b981", label: "SMP" },
              { jenis: "SMA", warna: "#8b5cf6", label: "SMA" },
              { jenis: "SMK", warna: "#f97316", label: "SMK" },
              { jenis: "SLB", warna: "#ef4444", label: "SLB" },
            ].map((item) => (
              <div key={item.jenis} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: item.warna }}></div>
                <span className="text-xs text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LeafletMap>
  );
}

export default memo(MapComponent);
