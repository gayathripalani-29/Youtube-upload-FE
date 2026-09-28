import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types/property';
import { 
  Compass, 
  Layers, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Video
} from 'lucide-react';

export const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const { 
    filteredProperties, 
    selectedProperty, 
    setSelectedProperty, 
    mapCenter, 
    mapZoom,
    setMapCenterAndZoom,
    newlyAddedPropertyId,
    setActiveVideoProperty
  } = useProperties();

  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Tile layers (100% Free, Zero API key required, No watermarks)
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

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Create Map instance
    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: false,
      attributionControl: true,
      fadeAnimation: true,
      wheelDebounceTime: 40,
    });

    // Add Tile Layer
    const layer = L.tileLayer(TILE_URLS[mapStyle], {
      attribution: ATTRIBUTIONS[mapStyle],
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = layer;

    // Add custom zoom control position
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

      // Custom HTML Marker Element
      const markerHtml = `
        <div class="property-pill-marker ${isSelected ? 'active' : ''} ${isNewlyAdded ? 'new-marker' : ''}" 
             data-id="${property.id}">
          <span class="flex items-center gap-1">
            ${isNewlyAdded ? '<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>' : ''}
            <span>${property.price}</span>
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [85, 34],
        iconAnchor: [42, 34],
      });

      if (markersRef.current[property.id]) {
        // Marker exists, update its icon & position
        markersRef.current[property.id].setIcon(customIcon);
        markersRef.current[property.id].setLatLng([property.latitude, property.longitude]);
      } else {
        // Create new marker
        const marker = L.marker([property.latitude, property.longitude], {
          icon: customIcon,
          riseOnHover: true,
        }).addTo(map);

        // Tooltip hover
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

        // Click Handler
        marker.on('click', () => {
          setSelectedProperty(property);
          map.flyTo([property.latitude, property.longitude], 15, { duration: 0.8 });
        });

        markersRef.current[property.id] = marker;
      }
    });
  }, [filteredProperties, selectedProperty, newlyAddedPropertyId, setSelectedProperty]);

  // Reset to Chennai view
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
    <div className="relative w-full h-full flex-1 overflow-hidden select-none">
      {/* Real-time Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Status & Count Pill (Top Left) */}
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

      {/* Map Legend / Quick Info (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-20 hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-subtle border border-slate-200/60 text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-900 border border-white"></span>
          <span>Verified Property</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-white"></span>
          <span>New Submission</span>
        </div>
        <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
          <Video className="w-3 h-3" />
          <span>Video Included</span>
        </div>
      </div>
    </div>
  );
};
