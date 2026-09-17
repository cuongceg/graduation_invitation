import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CarFront, Pin, Navigation, PersonStanding } from 'lucide-react';
import { LanguageCode } from '../types';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN';
mapboxgl.accessToken = MAPBOX_TOKEN;
const MAPBOX_STYLE_URL = 'mapbox://styles/thuckubin/cmtpb2i4800fa01r284107ab2';

type TravelMode = 'driving' | 'walking';

interface WaypointInfo {
  id: 'ceremony';
  title: string;
  coords: [number, number]; // [lng, lat]
  color: string;
}

const CEREMONY_WAYPOINT: WaypointInfo = {
  id: 'ceremony',
  title: 'CEREMONY HALL (NORTH QUAD)',
  coords: [105.84245671713994, 21.006461474319902],
  color: '#FF1E42',
};

export const WayfindingSection: React.FC<{ language: LanguageCode }> = ({ language }) => {
  const isVietnamese = language === 'vi';
  const [travelMode, setTravelMode] = useState<TravelMode>('walking');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeStats, setRouteStats] = useState<{ distance: string; duration: string } | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Initialize the Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE_URL,
      center: [105.8431, 21.0056],
      zoom: 16.5,
      pitch: 0,
      attributionControl: false,
    });

    mapRef.current = map;

    (window as any).map = map;

    map.on('load', () => {
      // Add the fixed destination marker
      const el = document.createElement('div');
      el.className = 'cursor-pointer';
      el.innerHTML = `
        <div class="p-2 rounded-full border shadow-lg transition-transform hover:scale-110"
             style="border-color: ${CEREMONY_WAYPOINT.color}; background-color: ${CEREMONY_WAYPOINT.color}33;">
          <span class="w-2.5 h-2.5 rounded-full block animate-pulse" style="background-color: ${CEREMONY_WAYPOINT.color};"></span>
        </div>
      `;
      new mapboxgl.Marker({ element: el }).setLngLat(CEREMONY_WAYPOINT.coords).addTo(map);

      // Create the route source and layers
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      // Neon glow casing
      map.addLayer({
        id: 'route-casing',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#00E5FF',      // Walking route glow
          'line-width': 10,             // Bản rộng tạo quầng sáng
          'line-opacity': 0.4,
          'line-blur': 4,               // Làm nhòe viền tạo hiệu ứng neon
          'line-emissive-strength': 1.0,
        },
      });

      // Core route line
      map.addLayer({
        id: 'route-main',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#00E5FF',      // Walking route
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

  // Get the user's location through the Geolocation API
  const getUserLocation = (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('This browser does not support geolocation.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setUserLocation(coords);

          // Update the user's location marker on the map
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

  // Call the Mapbox Directions API and draw the route
  const fetchRoute = async (
    origin: [number, number],
    destination: [number, number],
    mode: TravelMode
  ) => {
    setIsLoadingRoute(true);
    try {
      // Mapbox routing profile: mapbox/driving or mapbox/walking
      const profile = mode === 'driving' ? 'mapbox/driving' : 'mapbox/walking';
      const url = `https://api.mapbox.com/directions/v5/${profile}/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        alert('No available route was found.');
        return;
      }

      const route = data.routes[0];

      // Format duration and distance
      const distKm = (route.distance / 1000).toFixed(1);
      const durationMin = Math.round(route.duration / 60);
      setRouteStats({
        distance: `${distKm} km`,
        duration: `${durationMin} phút`,
      });

      // Update the GeoJSON in the Mapbox layer
      if (mapRef.current) {
        const source = mapRef.current.getSource('route') as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: route.geometry,
          });
        }

        // Fit the camera around both endpoints
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
      console.error('Route calculation failed:', error);
      alert('Unable to load the route. Check your connection or Mapbox token.');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Start routing from the user's location
  const handleStartRouting = async (mode: TravelMode = travelMode) => {
    try {
      let currentOrigin = userLocation;
      if (!currentOrigin) {
        currentOrigin = await getUserLocation();
      }
      await fetchRoute(currentOrigin, CEREMONY_WAYPOINT.coords, mode);
    } catch (err: any) {
      alert('Something went wrong while fetching your location. You should change the device or fix my code.');
    }
  };

  // Recalculate the route when the travel mode changes
  const handleModeChange = (newMode: TravelMode) => {
    setTravelMode(newMode);
    if (mapRef.current?.getLayer('route-main') && mapRef.current.getLayer('route-casing')) {
      const isWalking = newMode === 'walking';
      mapRef.current.setPaintProperty('route-casing', 'line-color', isWalking ? '#00E5FF' : '#FFFFFF');
      mapRef.current.setPaintProperty('route-main', 'line-color', isWalking ? '#00E5FF' : '#3B82F6');
    }
    if (userLocation) {
      fetchRoute(userLocation, CEREMONY_WAYPOINT.coords, newMode);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3 w-full" id="sector-map-section">
      <div className="rounded-xl border border-[#232B3E] bg-[#131722] p-4 sm:p-6 flex flex-col gap-4 shadow-xl font-mono">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#232B3E] pb-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[#00E5FF] uppercase tracking-widest font-semibold">
            <Pin size={16} aria-hidden="true" />
            <span className="font-mono text-xs text-[#00E5FF] uppercase tracking-widest font-semibold">
              {isVietnamese ? '[ BẢN_ĐỒ ]' : '[ CAMPUS_WAYFINDING ]'}
            </span>
          </div>
          {routeStats && (
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-[#181E2C] border border-[#00E5FF]/60 text-[#00E5FF] uppercase tracking-wider font-semibold">
                [DIST: {routeStats.distance} // ETA: {routeStats.duration}]
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-300">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF1E42] shadow-[0_0_8px_rgba(255,30,66,0.6)]"></span>
            <span>My bachelor's degree location</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
            <span>Parking area</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <span>Waiting and resting area</span>
          </span>
        </div>

        {/* Mapbox Canvas */}
        <div className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden border-2 border-[#232B3E] bg-[#0B0D13]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* User location badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded border border-[#00E5FF]/40 bg-[#0B0D13]/90 backdrop-blur-sm text-[10px] text-[#00E5FF] font-semibold tracking-wider flex items-center gap-1.5 pointer-events-none z-10">
            <span className={`w-1.5 h-1.5 rounded-full ${userLocation ? 'bg-[#00E5FF] animate-pulse' : 'bg-gray-500'}`}></span>
            {userLocation
              ? `USER_GPS: ${userLocation[1].toFixed(4)}°N, ${userLocation[0].toFixed(4)}°E`
              : isVietnamese ? 'GPS: ĐANG CHỜ VỊ TRÍ' : 'GPS: WAITING_FOR_LOCATION'}
          </div>

          {/* Travel mode controls */}
          <div className="absolute bottom-3 left-3 sm:top-3 sm:right-3 sm:bottom-auto sm:left-auto flex gap-1 z-10 bg-[#0B0D13]/80 p-1 rounded-lg border border-[#232B3E]">
            <button
              type="button"
              onClick={() => handleModeChange('walking')}
              aria-label={isVietnamese ? 'Đi bộ' : 'Walking'}
              title={isVietnamese ? 'Đi bộ' : 'Walking'}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                travelMode === 'walking'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PersonStanding size={15} aria-hidden="true" />
              <span>{isVietnamese ? 'Đi bộ' : 'Walking'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('driving')}
              aria-label={isVietnamese ? 'Lái xe' : 'Driving'}
              title={isVietnamese ? 'Lái xe' : 'Driving'}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                travelMode === 'driving'
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CarFront size={15} aria-hidden="true" />
              <span>{isVietnamese ? 'Lái xe' : 'Driving'}</span>
            </button>
          </div>

          <div className="absolute bottom-3 right-3 z-10 flex flex-col items-center gap-2">

            <button
              type="button"
              onClick={() => handleStartRouting()}
              disabled={isLoadingRoute}
              aria-label={isLoadingRoute ? 'Đang tìm đường' : 'Route từ vị trí của tôi'}
              title={isLoadingRoute ? 'Đang tìm đường' : 'Route từ vị trí của tôi'}
              className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border-2 border-[#FF1E42] bg-[#FF1E42] text-white shadow-[0_0_20px_rgba(255,30,66,0.45)] transition-all duration-300 hover:scale-110 hover:bg-[#ff3352] focus:outline-none focus:ring-2 focus:ring-[#FF1E42] focus:ring-offset-2 focus:ring-offset-[#0B0D13] disabled:cursor-wait disabled:opacity-60"
            >
              <Navigation size={18} className={isLoadingRoute ? 'animate-pulse' : ''} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};