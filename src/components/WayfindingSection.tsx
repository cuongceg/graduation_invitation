import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';
mapboxgl.accessToken = MAPBOX_TOKEN;
const MAPBOX_STYLE_URL = 'mapbox://styles/thuckubin/cmtpb2i4800fa01r284107ab2';

type TravelMode = 'driving' | 'walking';

interface WaypointInfo {
  id: 'ceremony' | 'parking' | 'lounge';
  title: string;
  coords: [number, number]; // [lng, lat]
  color: string;
}

const WAYPOINTS: Record<string, WaypointInfo> = {
  ceremony: {
    id: 'ceremony',
    title: 'CEREMONY HALL (NORTH QUAD)',
    coords: [105.8431, 21.0056],
    color: '#FF1E42',
  },
  parking: {
    id: 'parking',
    title: 'GUEST PARKING LOT B',
    coords: [105.8415, 21.0042],
    color: '#3B82F6',
  },
  lounge: {
    id: 'lounge',
    title: 'WAITING LOUNGE',
    coords: [105.8445, 21.0048],
    color: '#10B981',
  },
};

interface StepInfo {
  instruction: string;
  distance: number;
  duration: number;
}

export const WayfindingSection: React.FC = () => {
  const [activePin, setActivePin] = useState<'ceremony' | 'parking' | 'lounge'>('ceremony');
  const [travelMode, setTravelMode] = useState<TravelMode>('walking');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeStats, setRouteStats] = useState<{ distance: string; duration: string } | null>(null);
  const [routeSteps, setRouteSteps] = useState<StepInfo[]>([]);
  const [showDirectionsDrawer, setShowDirectionsDrawer] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // 1. Khởi tạo bản đồ Mapbox
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE_URL,
      center: WAYPOINTS.ceremony.coords,
      zoom: 16.5,
      pitch: 45,
      attributionControl: false,
    });

    mapRef.current = map;

    (window as any).map = map;

    map.on('load', () => {
      // Đặt các Marker đích cố định
      Object.values(WAYPOINTS).forEach((wp) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer';
        el.innerHTML = `
          <div class="p-2 rounded-full border shadow-lg transition-transform hover:scale-110"
               style="border-color: ${wp.color}; background-color: ${wp.color}33;">
            <span class="w-2.5 h-2.5 rounded-full block" style="background-color: ${wp.color};"></span>
          </div>
        `;
        el.addEventListener('click', () => setActivePin(wp.id));
        new mapboxgl.Marker({ element: el }).setLngLat(wp.coords).addTo(map);
      });

      // Tạo Source & Layer cho tuyến đường (Route Line)
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Viền phát sáng neon
      map.addLayer({
        id: 'route-casing',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#FFFFFF',      // Neon Cyan sáng rực
          'line-width': 10,             // Bản rộng tạo quầng sáng
          'line-opacity': 0.4,
          'line-blur': 4,               // Làm nhòe viền tạo hiệu ứng neon
          'line-emissive-strength': 1.0,
        },
      });

      // 2. Layer lõi chính (Core line)
      map.addLayer({
        id: 'route-main',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3B82F6',      // Lõi trắng hoặc #00E5FF đặc
          'line-width': 4,              // Độ dày vừa đủ sắc nét
          'line-opacity': 1,
          'line-emissive-strength': 1.0,
        },
      });
    });

    return () => {
      delete (window as any).map;
      map.remove();
    };
  }, []);

  // 2. Lấy vị trí người dùng (Geolocation API)
  const getUserLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Trình duyệt không hỗ trợ Geolocation'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setUserLocation(coords);

          // Cập nhật marker vị trí người dùng trên map
          if (mapRef.current) {
            if (!userMarkerRef.current) {
              const el = document.createElement('div');
              el.innerHTML = `
                <div class="relative flex items-center justify-center w-6 h-6">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border-2 border-white"></span>
                </div>
              `;
              userMarkerRef.current = new mapboxgl.Marker({ element: el })
                .setLngLat(coords)
                .addTo(mapRef.current);
            } else {
              userMarkerRef.current.setLngLat(coords);
            }
          }
          resolve(coords);
        },
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  // 3. Gọi Mapbox Directions API và vẽ đường đi
  const fetchRoute = async (
    origin: [number, number],
    destination: [number, number],
    mode: TravelMode
  ) => {
    setIsLoadingRoute(true);
    try {
      // Mapbox routing profile: mapbox/driving hoặc mapbox/walking
      const profile = mode === 'driving' ? 'mapbox/driving' : 'mapbox/walking';
      const url = `https://api.mapbox.com/directions/v5/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&steps=true&overview=full&access_token=${MAPBOX_TOKEN}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        alert('Không tìm thấy tuyến đường khả dụng.');
        return;
      }

      const route = data.routes[0];

      // Format thời gian & khoảng cách
      const distKm = (route.distance / 1000).toFixed(1);
      const durationMin = Math.round(route.duration / 60);
      setRouteStats({
        distance: `${distKm} km`,
        duration: `${durationMin} phút`,
      });

      // Lấy turn-by-turn steps
      const steps: StepInfo[] = route.legs[0].steps.map((s: any) => ({
        instruction: s.maneuver.instruction,
        distance: Math.round(s.distance),
        duration: Math.round(s.duration),
      }));
      setRouteSteps(steps);
      setShowDirectionsDrawer(true);

      // Cập nhật GeoJSON vào Mapbox Layer
      if (mapRef.current) {
        const source = mapRef.current.getSource('route') as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: route.geometry,
          });
        }

        // Fit camera bao trọn cả điểm đầu và điểm cuối
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(origin);
        bounds.extend(destination);
        mapRef.current.fitBounds(bounds, {
          padding: 60,
          maxZoom: 17,
          duration: 1200,
        });
      }
    } catch (error) {
      console.error('Lỗi khi tính toán đường đi:', error);
      alert('Không thể tải tuyến đường. Vui lòng kiểm tra lại kết nối mạng hoặc Mapbox Token.');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Kích hoạt tìm đường từ vị trí người dùng
  const handleStartRouting = async (mode: TravelMode = travelMode) => {
    try {
      let currentOrigin = userLocation;
      if (!currentOrigin) {
        currentOrigin = await getUserLocation();
      }
      const targetDestination = WAYPOINTS[activePin].coords;
      await fetchRoute(currentOrigin, targetDestination, mode);
    } catch (err: any) {
      alert('Vui lòng cấp quyền truy cập vị trí (GPS) trên trình duyệt để dẫn đường.');
    }
  };

  // Tự động route lại khi thay đổi điểm đến hoặc phương tiện nếu đã có vị trí
  const handleModeChange = (newMode: TravelMode) => {
    setTravelMode(newMode);
    if (userLocation) {
      fetchRoute(userLocation, WAYPOINTS[activePin].coords, newMode);
    }
  };

  const handleSelectWaypoint = (key: 'ceremony' | 'parking' | 'lounge') => {
    setActivePin(key);
    if (userLocation) {
      fetchRoute(userLocation, WAYPOINTS[key].coords, travelMode);
    } else if (mapRef.current) {
      mapRef.current.flyTo({ center: WAYPOINTS[key].coords, zoom: 17 });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 w-full" id="sector-map-section">
      <div className="rounded-xl border border-[#232B3E] bg-[#131722] p-6 flex flex-col gap-4 shadow-xl font-mono">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232B3E] pb-3">
          <div>
            <span className="text-xs text-[#FF1E42] uppercase tracking-widest font-bold">
              CAMPUS_WAYFINDING // LIVE ROUTING
            </span>
            <h3 className="font-display text-lg uppercase font-bold text-white tracking-wide">
              Navigation to {WAYPOINTS[activePin].title}
            </h3>
          </div>
          {routeStats && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-[#181E2C] border border-[#00E5FF]/60 text-[#00E5FF] uppercase tracking-wider font-semibold">
                [DIST: {routeStats.distance} // ETA: {routeStats.duration}]
              </span>
            </div>
          )}
        </div>

        {/* Mapbox Canvas */}
        <div className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden border-2 border-[#232B3E] bg-[#0B0D13]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* User Location Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded border border-[#00E5FF]/40 bg-[#0B0D13]/90 backdrop-blur-sm text-[10px] text-[#00E5FF] font-semibold tracking-wider flex items-center gap-1.5 pointer-events-none z-10">
            <span className={`w-1.5 h-1.5 rounded-full ${userLocation ? 'bg-[#00E5FF] animate-pulse' : 'bg-gray-500'}`}></span>
            {userLocation
              ? `USER_GPS: ${userLocation[1].toFixed(4)}°N, ${userLocation[0].toFixed(4)}°E`
              : 'GPS: WAITING_FOR_LOCATION'}
          </div>

          {/* Overlay chọn Travel Mode (Đi bộ / Xe) */}
          <div className="absolute top-3 right-3 flex gap-1 z-10 bg-[#0B0D13]/80 p-1 rounded-lg border border-[#232B3E]">
            <button
              onClick={() => handleModeChange('walking')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                travelMode === 'walking'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚶 Đi bộ
            </button>
            <button
              onClick={() => handleModeChange('driving')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                travelMode === 'driving'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚗 Xe cộ
            </button>
          </div>
        </div>

        {/* Thao tác chọn địa điểm & Kích hoạt dẫn đường */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {(['ceremony', 'parking', 'lounge'] as const).map((key) => (
              <button
                key={key}
                onClick={() => handleSelectWaypoint(key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activePin === key
                    ? 'border-[#FF1E42] bg-[#181E2C] text-white font-semibold shadow-[0_0_8px_rgba(255,30,66,0.3)]'
                    : 'border-[#232B3E] bg-[#0B0D13] text-slate-300 hover:text-white'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: WAYPOINTS[key].color }}
                ></span>
                <span>{WAYPOINTS[key].title}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleStartRouting()}
            disabled={isLoadingRoute}
            className="px-4 py-2 rounded-lg bg-[#FF1E42] hover:bg-[#ff3352] text-white font-bold tracking-wider transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
          >
            <span>{isLoadingRoute ? 'ĐANG TÌM ĐƯỜNG...' : 'ROUTE TỪ VỊ TRÍ CỦA TÔI'}</span>
          </button>
        </div>

        {/* Drawer Turn-by-Turn Steps */}
        {showDirectionsDrawer && routeSteps.length > 0 && (
          <div className="mt-2 p-4 rounded-lg border border-[#00E5FF]/30 bg-[#0B0D13] text-xs flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#232B3E] pb-2 text-[#00E5FF]">
              <span className="font-bold uppercase tracking-wider">
                CHỈ DẪN DI CHUYỂN TỪNG BƯỚC ({travelMode === 'walking' ? 'ĐI BỘ' : 'PHƯƠNG TIỆN'})
              </span>
              <button
                onClick={() => setShowDirectionsDrawer(false)}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                [ ĐÓNG ]
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {routeSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded border border-[#232B3E] bg-[#131722] flex flex-col justify-between gap-1">
                  <div className="flex justify-between text-[10px] text-[#00E5FF]">
                    <span>BƯỚC {idx + 1}</span>
                    <span>{step.distance}m</span>
                  </div>
                  <p className="text-slate-200 text-[11px]">{step.instruction}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};