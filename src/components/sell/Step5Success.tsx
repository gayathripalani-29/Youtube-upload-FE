import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Eye, 
  Sparkles,
  PlusCircle,
  X,
  ExternalLink,
  Copy
} from 'lucide-react';
import { Property } from '../../types/property';
import { useProperties } from '../../context/PropertyContext';

interface Step5SuccessProps {
  property: Property;
  onViewOnMap: () => void;
  onBackToProperties: () => void;
  onReset?: () => void;
}

export const Step5Success: React.FC<Step5SuccessProps> = ({
  property,
  onViewOnMap,
  onBackToProperties,
  onReset,
}) => {
  const { addToast } = useProperties();

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#2563eb', '#38bdf8', '#10b981', '#f59e0b']
      });
    } catch {
      // Safe fallback
    }
  }, []);

  const copyPropertyId = () => {
    navigator.clipboard?.writeText(property.id);
    addToast({
      type: 'info',
      title: 'Copied ID',
      message: `${property.id} copied to clipboard`
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 max-w-xl mx-auto w-full text-center animate-fade-in my-auto overflow-y-auto">
      
      {/* Animated Success Badge */}
      <div className="relative mb-5">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 ring-8 ring-emerald-500/10">
          <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10 stroke-[2.5]" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1.5 bg-blue-600 text-white rounded-xl shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h3 className="text-2xl font-black text-slate-900 tracking-tight">
        Property Published Live!
      </h3>
      <p className="text-xs text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
        Your property has been successfully verified and added to the HiSpace interactive map. The video tour is now live for buyers.
      </p>

      {/* Property Details Card */}
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs my-6 text-left space-y-3.5">
        
        <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Listing ID
            </span>
            <button
              onClick={copyPropertyId}
              className="text-xs font-mono font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-0.5"
              title="Click to copy ID"
            >
              <span>{property.id}</span>
              <Copy className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Status
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live on Map
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Location
            </span>
            <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
              {property.area || property.location.split(',')[0] || 'Chennai'}
            </span>
          </div>
        </div>

        {/* Thumbnail & Title snippet */}
        <div className="flex items-center gap-3 py-1">
          <img
            src={property.thumbnail}
            alt=""
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="flex-1 truncate">
            <span className="text-xs font-extrabold text-blue-600 block">
              {property.price}
            </span>
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {property.title}
            </h4>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-blue-600" />
              {property.location}
            </p>
          </div>
        </div>

        {/* Coordinates readout */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Live Coordinates:
          </span>
          <span className="font-mono font-bold text-slate-800 text-[11px]">
            {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
        <button
          type="button"
          onClick={onViewOnMap}
          className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
        >
          <Eye className="w-4 h-4" />
          <span>View Live on Map</span>
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-slate-500" />
            <span>Post Another</span>
          </button>
        )}

        <button
          type="button"
          onClick={onBackToProperties}
          className="w-full sm:w-auto px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          Close
        </button>
      </div>

    </div>
  );
};
