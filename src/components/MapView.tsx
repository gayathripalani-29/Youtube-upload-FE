import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types/property';
import { CHENNAI_HOTSPOTS } from '../data/mockProperties';
import { 
  Compass, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Video,
  Check,
  X,
  Crosshair,
  ArrowRight
} from 'lucide-react';

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  const { 
    filteredProperties, 
    selectedProperty, 
    setSelectedProperty, 
    mapCenter, 
    mapZoom,
    setMapCenterAndZoom,
    newlyAddedPropertyId,
    setActiveVideoProperty,
    isPickingLocation,
    pickedLocation,
    setPickedLocation,
    confirmPickedLocation,
    cancelLocationPicker,
  } = useProperties();

  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const TILE_URLS = {
    streets: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    terrain: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  };

  const ATTRIBUTIONS = {
    streets: 'Tiles &copy; Esri &mdash; World Street Map',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    terrain: 'Tiles &copy; Esri &mdash; World Topo Map'
  };

  // Helper to determine closest Chennai hotspot for friendly area name
  const getNearestLocalityName = (lat: number, lng: number) => {
    let closest = CHENNAI_HOTSPOTS[1];
    let minDistance = 999999;
    for (const h of CHENNAI_HOTSPOTS) {
      if (h.name === 'All Locations') continue;
      const d = Math.hypot(h.lat - lat, h.lng - lng);
      if (d < minDistance) {
        minDistance = d;
        closest = h;
      }
    }
    return closest ? `${closest.name}, Chennai` : 'Chennai, Tamil Nadu';
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: false,
      attributionControl: true,
      fadeAnimation: true,
      wheelDebounceTime: 40,
    });

    const layer = L.tileLayer(TILE_URLS[mapStyle], {
      attribution: ATTRIBUTIONS[mapStyle],
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = layer;
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(TILE_URLS[mapStyle]);
  }, [mapStyle]);

  // Fly to new center when mapCenter or mapZoom changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(mapCenter, mapZoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [mapCenter, mapZoom]);

  // Sync Markers with filtered properties
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers that are no longer in filtered list
    Object.keys(markersRef.current).forEach((id) => {
      if (!filteredProperties.find((p) => p.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    filteredProperties.forEach((property: Property) => {
      const isSelected = selectedProperty?.id === property.id;
      const isNewlyAdded = newlyAddedPropertyId === property.id;

      const beaconColor = isNewlyAdded ? 'beacon-emerald' : 'beacon-blue';
      const beaconMode = (isNewlyAdded || isSelected) ? 'beacon-always' : 'beacon-on-hover';
      const dotPingColor = isNewlyAdded ? 'bg-emerald-300' : 'bg-sky-300';
      const dotCoreColor = isNewlyAdded ? 'bg-emerald-200' : 'bg-white';
      const isPingActive = isNewlyAdded || isSelected;

      const markerHtml = `
        <div class="custom-marker-container group" data-id="${property.id}">
          <!-- Radar beacon on ground coordinate: Always active for new/selected, animated on HOVER for ALL markers! -->
          <div class="radar-beacon-container ${beaconColor} ${beaconMode}">
            <span class="beacon-wave beacon-wave-1"></span>
            <span class="beacon-wave beacon-wave-2"></span>
            <span class="beacon-core"></span>
          </div>

          <div class="property-pill-marker ${isSelected ? 'active' : ''} ${isNewlyAdded ? 'new-marker' : ''}" 
               data-id="${property.id}">
            <span class="flex items-center gap-1.5">
              <!-- Live Animated Dot: Active on HOVER for all markers, continuous for new/selected! -->
              <span class="marker-dot-wrapper">
                <span class="marker-dot-ping ${dotPingColor} ${isPingActive ? 'ping-active' : ''}"></span>
                <span class="marker-dot-core ${dotCoreColor}"></span>
              </span>
              <span>${property.price}</span>
            </span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      if (markersRef.current[property.id]) {
        markersRef.current[property.id].setIcon(customIcon);
        markersRef.current[property.id].setLatLng([property.latitude, property.longitude]);
      } else {
        const marker = L.marker([property.latitude, property.longitude], {
          icon: customIcon,
          riseOnHover: true,
        }).addTo(map);

        marker.bindTooltip(`
          <div class="p-1 font-sans text-xs">
            <p class="font-bold text-slate-900">${property.title}</p>
            <p class="text-blue-600 font-semibold">${property.price} &bull; ${property.area}</p>
          </div>
        `, {
          direction: 'top',
          offset: [0, -32],
          opacity: 0.95,
        });

        marker.on('mouseover', () => {
          marker.setZIndexOffset(1000);
        });

        marker.on('mouseout', () => {
          marker.setZIndexOffset(isSelected ? 500 : 0);
        });

        marker.on('click', () => {
          if (isPickingLocation) return;
          setSelectedProperty(property);
          map.flyTo([property.latitude, property.longitude], 15, { duration: 0.8 });
        });

        markersRef.current[property.id] = marker;
      }
    });
  }, [filteredProperties, selectedProperty, newlyAddedPropertyId, setSelectedProperty, isPickingLocation]);

  // Handle Location Picker Mode (Click on map to mark property location)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isPickingLocation) {
      // Clean up picker marker if picking mode is exited
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.remove();
        pickerMarkerRef.current = null;
      }
      return;
    }

    const initialLat = pickedLocation?.latitude || 13.0827;
    const initialLng = pickedLocation?.longitude || 80.2707;

    const pinHtml = `
      <div class="custom-picker-pin group">
        <div class="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-2xl shadow-2xl border-2 border-white whitespace-nowrap animate-bounce">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Marked Property Location</span>
        </div>
        <div class="w-4 h-4 bg-indigo-600 rotate-45 -mt-2 border-r-2 border-b-2 border-white shadow-md"></div>
      </div>
    `;

    const pinIcon = L.divIcon({
      html: pinHtml,
      className: '',
      iconSize: [140, 56],
      iconAnchor: [70, 52],
    });

    if (!pickerMarkerRef.current) {
      const marker = L.marker([initialLat, initialLng], {
        icon: pinIcon,
        draggable: true,
        zIndexOffset: 2000,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const nearest = getNearestLocalityName(pos.lat, pos.lng);
        setPickedLocation(prev => ({
          ...prev,
          latitude: Number(pos.lat.toFixed(6)),
          longitude: Number(pos.lng.toFixed(6)),
          locationName: nearest,
        }));
      });

      pickerMarkerRef.current = marker;
    } else {
      pickerMarkerRef.current.setLatLng([initialLat, initialLng]);
    }

    // Map click moves the pin
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([lat, lng]);
      }
      const nearest = getNearestLocalityName(lat, lng);
      setPickedLocation(prev => ({
        ...prev,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        locationName: nearest,
      }));
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isPickingLocation, pickedLocation, setPickedLocation]);

  // Jump to quick hotspot during picking mode
  const handleJumpToHotspot = (hotspot: typeof CHENNAI_HOTSPOTS[0]) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([hotspot.lat, hotspot.lng], 15, { duration: 0.8 });
    if (pickerMarkerRef.current) {
      pickerMarkerRef.current.setLatLng([hotspot.lat, hotspot.lng]);
    }
    setPickedLocation(prev => ({
      ...prev,
      latitude: hotspot.lat,
      longitude: hotspot.lng,
      locationName: `${hotspot.name}, Chennai`,
    }));
  };

  const handleResetView = () => {
    setMapCenterAndZoom([13.0334, 80.2326], 12);
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!isFullscreen) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative w-full h-full flex-1 overflow-hidden select-none ${isPickingLocation ? 'cursor-crosshair' : ''}`}>
      {/* Real-time Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Status & Count Pill (Top Left) - Hidden in picker mode to reduce clutter */}
      {!isPickingLocation && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-elevated border border-slate-200/80 text-xs font-semibold text-slate-800">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span>{filteredProperties.length} Properties in Chennai</span>
          </div>

          {/* Quick Map Style Switcher */}
          <div className="hidden sm:flex items-center bg-white/90 backdrop-blur-md rounded-2xl shadow-elevated border border-slate-200/80 p-1 text-xs">
            <button
              onClick={() => setMapStyle('streets')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                mapStyle === 'streets' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Streets
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-xl font-medium transition-all ${
                mapStyle === 'satellite' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={handleResetView}
          title="Reset View to Chennai Central"
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-elevated border border-slate-200/80 text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-elevated border border-slate-200/80 text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Map Legend (Bottom Left) */}
      {!isPickingLocation && (
        <div className="absolute bottom-6 left-4 z-20 hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-subtle border border-slate-200/60 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-900 border border-white"></span>
            <span>Verified Property</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Plotted (Radar Dot)</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
            <Video className="w-3 h-3" />
            <span>Video Included</span>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BANNER WHEN IN LOCATION PICKING MODE */}
      {isPickingLocation && (
        <div className="absolute top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-30 max-w-xl w-auto sm:w-full animate-modal-pop">
          <div className="bg-white/95 backdrop-blur-xl border border-blue-200 shadow-2xl rounded-3xl p-4 sm:p-5 flex flex-col gap-3 ring-4 ring-blue-500/15">
            
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white shadow-xs">
                  <MapPin className="w-4 h-4 animate-bounce" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Mark Property Location on Map</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                      Step 1
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Click anywhere on the map or drag the pin to set your exact coordinates
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={cancelLocationPicker}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Location Card */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-blue-50/80 border border-blue-100 rounded-2xl text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 truncate">
                <Compass className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span className="truncate">{pickedLocation?.locationName || 'Anna Nagar, Chennai'}</span>
              </div>
              <div className="font-mono text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-blue-200 font-bold">
                {pickedLocation?.latitude.toFixed(6)}, {pickedLocation?.longitude.toFixed(6)}
              </div>
            </div>

            {/* Quick Chennai Locality Jump Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-400 font-bold text-[10px] uppercase flex-shrink-0 mr-1">Quick Jump:</span>
              {CHENNAI_HOTSPOTS.slice(1, 8).map(hotspot => (
                <button
                  key={hotspot.name}
                  type="button"
                  onClick={() => handleJumpToHotspot(hotspot)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  {hotspot.name}
                </button>
              ))}
            </div>

            {/* Actions: Cancel & Confirm */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={cancelLocationPicker}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPickedLocation}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Location &amp; Enter Details</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
