import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Share2, 
  Eye, 
  Sparkles,
  Building,
  CheckCircle2
} from 'lucide-react';
import { Property } from '../../types/property';

interface Step5SuccessProps {
  property: Property;
  onViewOnMap: () => void;
  onBackToProperties: () => void;
}

export const Step5Success: React.FC<Step5SuccessProps> = ({
  property,
  onViewOnMap,
  onBackToProperties,
}) => {
  useEffect(() => {
    // Fire festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#10b981', '#f59e0b']
      });
    } catch {
      // safe fallback if confetti fails
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto w-full text-center animate-fade-in my-auto">
      
      {/* Animated Success Badge */}
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 ring-8 ring-emerald-500/10">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
        </div>
        <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Property Submitted Successfully
      </h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
        Your property has been added to HiSpace. The video tour and location marker are now active.
      </p>

      {/* Property Details Card */}
      <div className="w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-card my-8 text-left space-y-4">
        
        <div className="grid grid-cols-3 gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Property ID
            </span>
            <span className="text-sm font-mono font-bold text-blue-600">
              {property.id}
            </span>
          </div>

          <div className="text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {property.status}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Location
            </span>
            <span className="text-xs font-bold text-slate-800 truncate block mt-0.5" title={property.location}>
              {property.area || property.location.split(',')[0] || 'Chennai'}
            </span>
          </div>
        </div>

        {/* Thumbnail & Title snippet */}
        <div className="flex items-center gap-4 py-1">
          <img
            src={property.thumbnail}
            alt=""
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div>
            <span className="text-xs font-extrabold text-blue-600 block">
              {property.price}
            </span>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {property.title}
            </h4>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              {property.location}
            </p>
          </div>
        </div>

        {/* Coordinates */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Live Map Location:
          </span>
          <span className="font-mono font-bold text-slate-800">
            {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:max-w-md mx-auto">
        <button
          type="button"
          onClick={onViewOnMap}
          className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
        >
          <Eye className="w-4 h-4" />
          <span>View on Map</span>
        </button>

        <button
          type="button"
          onClick={onBackToProperties}
          className="w-full sm:w-auto px-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span>Back to Properties</span>
        </button>
      </div>

    </div>
  );
};
