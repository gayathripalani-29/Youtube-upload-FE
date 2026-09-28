import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Search, 
  ArrowRight, 
  Compass, 
  Crosshair,
  Building,
  Check
} from 'lucide-react';
import { SellFormData } from '../../types/property';
import { CHENNAI_HOTSPOTS } from '../../data/mockProperties';

interface Step1LocationProps {
  formData: SellFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellFormData>>;
  onNext: () => void;
  onRepickOnMap?: () => void;
}

export const Step1Location: React.FC<Step1LocationProps> = ({
  formData,
  setFormData,
  onNext,
  onRepickOnMap,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState(formData.locationName || 'Anna Nagar, Chennai');

  // Initialize interactive picker map
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
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draggable Pin Icon
    const pinHtml = `
      <div class="custom-picker-pin group">
        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xl border-2 border-white whitespace-nowrap animate-bounce">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Selected Location</span>
        </div>
        <div class="w-3.5 h-3.5 bg-blue-600 rotate-45 -mt-1.5 border-r-2 border-b-2 border-white shadow-md"></div>
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

    // Invalidate map size after modal animation completes
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSelectHotspot = (hotspot: typeof CHENNAI_HOTSPOTS[0]) => {
    const locName = `${hotspot.name}, Chennai`;
    setSelectedLocality(locName);
    setFormData(prev => ({
      ...prev,
      latitude: Number(hotspot.lat.toFixed(6)),
      longitude: Number(hotspot.lng.toFixed(6)),
      locationName: locName,
    }));

    if (mapInstanceRef.current && pinMarkerRef.current) {
      mapInstanceRef.current.flyTo([hotspot.lat, hotspot.lng], 15, { duration: 0.8 });
      pinMarkerRef.current.setLatLng([hotspot.lat, hotspot.lng]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = CHENNAI_HOTSPOTS.find(h => 
      h.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      handleSelectHotspot(match);
    } else {
      const randomLat = 13.0827 + (Math.random() - 0.5) * 0.04;
      const randomLng = 80.2707 + (Math.random() - 0.5) * 0.04;
      const name = `${searchQuery}, Chennai`;
      setSelectedLocality(name);
      setFormData(prev => ({
        ...prev,
        latitude: Number(randomLat.toFixed(6)),
        longitude: Number(randomLng.toFixed(6)),
        locationName: name,
      }));
      if (mapInstanceRef.current && pinMarkerRef.current) {
        mapInstanceRef.current.flyTo([randomLat, randomLng], 15, { duration: 0.8 });
        pinMarkerRef.current.setLatLng([randomLat, randomLng]);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
      
      {/* Left Form Controls */}
      <div className="w-full lg:w-[380px] xl:w-[400px] bg-white border-r border-slate-200/80 p-5 sm:p-6 overflow-y-auto flex flex-col flex-shrink-0">
        
        {/* Step Title */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
              Step 1 of 4
            </span>
            <span className="text-xs text-slate-400 font-medium">Pin Exact Location</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Where is your property located?
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Select the exact pin on the interactive map so buyers can navigate straight to your property.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Search Locality / Area
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Anna Nagar, OMR, Velachery, ECR..."
              className="w-full pl-8 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-colors"
            >
              Locate
            </button>
          </div>
        </form>

        {/* Quick Chennai Locality Pills */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Popular Chennai Hubs
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CHENNAI_HOTSPOTS.slice(1, 8).map((hotspot) => {
              const isSelected = selectedLocality.toLowerCase().includes(hotspot.name.toLowerCase());
              return (
                <button
                  key={hotspot.name}
                  type="button"
                  onClick={() => handleSelectHotspot(hotspot)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80'
                  }`}
                >
                  {hotspot.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Address Inputs */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Locality / City *
            </label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => {
                setSelectedLocality(e.target.value);
                setFormData(prev => ({ ...prev, locationName: e.target.value }));
              }}
              placeholder="e.g. Anna Nagar, Chennai"
              className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Landmark / Street
              </label>
              <input
                type="text"
                value={formData.landmark}
                onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                placeholder="Near Tower Park"
                className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                placeholder="600040"
                className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Live GPS Coordinates Card */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              Pin GPS Coordinates
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Pin
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-white p-2 rounded-xl border border-blue-100">
              <span className="text-[10px] text-slate-400 block font-sans">Lat</span>
              <span className="font-bold text-slate-900">{formData.latitude?.toFixed(6) || '13.082700'}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-blue-100">
              <span className="text-[10px] text-slate-400 block font-sans">Lng</span>
              <span className="font-bold text-slate-900">{formData.longitude?.toFixed(6) || '80.270700'}</span>
            </div>
          </div>

          {onRepickOnMap && (
            <button
              type="button"
              onClick={onRepickOnMap}
              className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 shadow-xs transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Re-adjust Point on Main Map</span>
            </button>
          )}
        </div>

        {/* Next Action Button */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
          >
            <span>Next: Upload Video</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Right Interactive Selection Map */}
      <div className="relative flex-1 min-h-[300px] lg:min-h-full bg-slate-100 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Instruction Banner on Map */}
        <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 z-10 flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200/90 text-xs font-semibold text-slate-700">
          <Crosshair className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 animate-pulse" />
          <span>Click map or drag the blue pin to position precisely</span>
        </div>
      </div>

    </div>
  );
};
