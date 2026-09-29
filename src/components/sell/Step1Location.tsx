import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  ArrowRight, 
  Compass, 
  Maximize2,
  Navigation,
  CheckCircle2,
  Building,
  Sparkles
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const initialLat = formData.latitude || 13.0827;
  const initialLng = formData.longitude || 80.2707;

  // Initialize interactive preview map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      zoomControl: false,
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Human-crafted Pin Icon with pulsing ring
    const pinHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
        <div class="w-10 h-10 rounded-full bg-blue-600 border-3 border-white shadow-xl flex items-center justify-center text-white ring-4 ring-blue-500/25">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="absolute -bottom-1 w-2.5 h-2.5 bg-blue-600 rotate-45 border-r border-b border-white"></div>
      </div>
    `;

    const pinIcon = L.divIcon({
      html: pinHtml,
      className: '',
      iconSize: [40, 48],
      iconAnchor: [20, 48],
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

    const timer1 = setTimeout(() => map.invalidateSize(), 200);
    const timer2 = setTimeout(() => map.invalidateSize(), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSelectHotspot = (hotspot: typeof CHENNAI_HOTSPOTS[0]) => {
    const locName = `${hotspot.name}, Chennai`;
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

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.locationName?.trim()) {
      newErrors.locationName = 'Locality or neighborhood is required';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100/80">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Step 1 &bull; Location Confirmation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Confirm Property Location &amp; Address
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Your map pin is locked. Verify the street address and neighborhood details so prospective buyers can discover your listing in map search.
            </p>
          </div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Form: Address Details (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
              
              {/* Quick Area Switcher */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Popular Chennai Neighborhoods
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CHENNAI_HOTSPOTS.slice(1, 8).map((hotspot) => {
                    const isSelected = formData.locationName.toLowerCase().includes(hotspot.name.toLowerCase());
                    return (
                      <button
                        key={hotspot.name}
                        type="button"
                        onClick={() => handleSelectHotspot(hotspot)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                        }`}
                      >
                        {hotspot.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Locality Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Locality / Neighborhood <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                    placeholder="e.g. Anna Nagar, Chennai"
                    className={`w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                      errors.locationName 
                        ? 'border-rose-400 ring-2 ring-rose-500/10' 
                        : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                    }`}
                  />
                </div>
                {errors.locationName && (
                  <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.locationName}</p>
                )}
              </div>

              {/* Landmark & Street Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Landmark / Street Reference
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="e.g. Near Tower Park, 2nd Avenue"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Postal Pincode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                    placeholder="600040"
                    className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Precision Tip Banner */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Buyers use map navigation to drive directly to your property. Drag the blue pin on the preview card if you need to fine-tune the exact gate or entrance coordinates.
                </p>
              </div>

            </div>

            {/* Right Card: Interactive Pin Preview (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-800">Pinpoint Map Preview</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Draggable
                </span>
              </div>

              {/* Leaflet Mini Map Container */}
              <div className="relative aspect-4/3 sm:aspect-16/10 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                <div ref={mapContainerRef} className="w-full h-full z-0" />
                
                {/* Floating GPS badge */}
                <div className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-700 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>{formData.latitude?.toFixed(5)}, {formData.longitude?.toFixed(5)}</span>
                </div>
              </div>

              {/* Coordinates & Accuracy Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Latitude
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {formData.latitude?.toFixed(6) || '13.082700'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Longitude
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {formData.longitude?.toFixed(6) || '80.270700'}
                  </span>
                </div>
              </div>

              {/* Re-adjust on Full Map Shortcut */}
              {onRepickOnMap && (
                <button
                  type="button"
                  onClick={onRepickOnMap}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Adjust on Full Screen Map</span>
                </button>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* Sticky Bottom Navigation Footer */}
      <div className="bg-white border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-end z-10">
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
        >
          <span>Continue to Video Walkthrough</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
