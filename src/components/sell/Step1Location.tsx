import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Search, 
  Navigation, 
  ArrowRight, 
  Compass, 
  Check, 
  Crosshair,
  Building2
} from 'lucide-react';
import { SellFormData } from '../../types/property';
import { CHENNAI_HOTSPOTS } from '../../data/mockProperties';

interface Step1LocationProps {
  formData: SellFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellFormData>>;
  onNext: () => void;
}

export const Step1Location: React.FC<Step1LocationProps> = ({
  formData,
  setFormData,
  onNext,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [selectedAreaName, setSelectedAreaName] = useState(formData.locationName || 'Anna Nagar, Chennai');

  // Initialize isolated picker map (No existing property markers)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = formData.latitude || 13.0827;
    const initialLng = formData.longitude || 80.2707;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; World Street Map',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draggable Pin Icon
    const pinHtml = `
      <div class="custom-picker-pin group">
        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-2xl border-2 border-white whitespace-nowrap animate-bounce">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Selected Location</span>
        </div>
        <div class="w-4 h-4 bg-blue-600 rotate-45 -mt-2 border-r-2 border-b-2 border-white shadow-md"></div>
      </div>
    `;

    const pinIcon = L.divIcon({
      html: pinHtml,
      className: '',
      iconSize: [120, 50],
      iconAnchor: [60, 48],
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: pinIcon,
      draggable: true,
    }).addTo(map);

    // Marker drag event
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setFormData(prev => ({
        ...prev,
        latitude: Number(pos.lat.toFixed(6)),
        longitude: Number(pos.lng.toFixed(6)),
      }));
    });

    // Map click event
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setFormData(prev => ({
        ...prev,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
      }));
    });

    pinMarkerRef.current = marker;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSelectPreset = (hotspot: typeof CHENNAI_HOTSPOTS[0]) => {
    setSelectedAreaName(`${hotspot.name}, Chennai`);
    setFormData(prev => ({
      ...prev,
      latitude: Number(hotspot.lat.toFixed(6)),
      longitude: Number(hotspot.lng.toFixed(6)),
      locationName: `${hotspot.name}, Chennai`,
    }));

    if (mapInstanceRef.current && pinMarkerRef.current) {
      mapInstanceRef.current.flyTo([hotspot.lat, hotspot.lng], 15, { duration: 1 });
      pinMarkerRef.current.setLatLng([hotspot.lat, hotspot.lng]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocationQuery.trim()) return;

    // Simulated geocoding lookup
    const match = CHENNAI_HOTSPOTS.find(h => 
      h.name.toLowerCase().includes(searchLocationQuery.toLowerCase())
    );

    if (match) {
      handleSelectPreset(match);
    } else {
      // Simulate random offset in central Chennai
      const randomLat = 13.0827 + (Math.random() - 0.5) * 0.05;
      const randomLng = 80.2707 + (Math.random() - 0.5) * 0.05;
      setSelectedAreaName(`${searchLocationQuery}, Chennai`);
      setFormData(prev => ({
        ...prev,
        latitude: Number(randomLat.toFixed(6)),
        longitude: Number(randomLng.toFixed(6)),
        locationName: `${searchLocationQuery}, Chennai`,
      }));
      if (mapInstanceRef.current && pinMarkerRef.current) {
        mapInstanceRef.current.flyTo([randomLat, randomLng], 15, { duration: 1 });
        pinMarkerRef.current.setLatLng([randomLat, randomLng]);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
      
      {/* Left Panel: Location Selection Controls */}
      <div className="w-full lg:w-96 xl:w-[420px] bg-white border-r border-slate-200/80 flex flex-col p-6 overflow-y-auto shadow-subtle z-10 flex-shrink-0">
        
        {/* Title & Instruction */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs">
              1
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 1 of 4</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Select Property Location
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Move the map or search for your location, then place the pin at the exact property location.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="mb-5">
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Search for your property location
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchLocationQuery}
              onChange={(e) => setSearchLocationQuery(e.target.value)}
              placeholder="e.g. Anna Nagar, OMR, Adyar..."
              className="w-full pl-9 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
            >
              Locate
            </button>
          </div>
        </form>

        {/* Quick Chennai Hotspots */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Chennai Localities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CHENNAI_HOTSPOTS.slice(1, 7).map((hotspot) => (
              <button
                key={hotspot.name}
                type="button"
                onClick={() => handleSelectPreset(hotspot)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                {hotspot.name}
              </button>
            ))}
          </div>
        </div>

        {/* Coordinates Readout Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Live Pin Coordinates
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Precise GPS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Latitude</span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {formData.latitude?.toFixed(6) || '13.082700'}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-medium">Longitude</span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {formData.longitude?.toFixed(6) || '80.270700'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Selected Location Card */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 mb-6">
          <div className="p-2 bg-blue-600 text-white rounded-xl flex-shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Selected Property Location
            </span>
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {formData.locationName || selectedAreaName}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tamil Nadu, India &bull; Exact pin ready for listing
            </p>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
          >
            <span>Next: Upload Video</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Right/Main Area: Large Interactive Selection Map */}
      <div className="relative flex-1 h-[450px] lg:h-full bg-slate-100 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Instruction Banner on Map */}
        <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 z-10 flex items-center gap-2 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-elevated border border-slate-200/80 text-xs font-semibold text-slate-700">
          <Crosshair className="w-4 h-4 text-blue-600 flex-shrink-0 animate-pulse" />
          <span>Click anywhere on the map or drag the pin to set exact coordinates</span>
        </div>
      </div>

    </div>
  );
};
