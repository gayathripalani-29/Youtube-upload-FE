import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Eye, 
  PlusCircle, 
  Copy,
  Check,
  Building2,
  ExternalLink
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#ab2c30', '#fbaf2e', '#10b981', '#f59e0b', '#74191c']
      });
    } catch {
      // Safe fallback
    }
  }, []);

  const copyPropertyId = () => {
    navigator.clipboard?.writeText(property.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      type: 'info',
      title: 'Copied Listing ID',
      message: `${property.id} copied to clipboard`
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 max-w-xl mx-auto w-full text-center overflow-y-auto">
      
      {/* Success Animated Badge */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-500/10 shadow-sm">
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
      </div>

      {/* Main Title & Subtitle */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Property Published Live!
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
        Your property has been indexed on the interactive map. Buyers searching in <strong className="text-slate-700">{property.location}</strong> can now view the listing and play the video tour.
      </p>

      {/* Published Summary Card */}
      <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs my-6 text-left space-y-4">
        
        {/* Top Reference Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Listing Reference
            </span>
            <button
              type="button"
              onClick={copyPropertyId}
              className="text-xs font-mono font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 mt-0.5"
            >
              <span>{property.id}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live on Map</span>
          </div>
        </div>

        {/* Thumbnail & Property Snippet */}
        <div className="flex items-center gap-3.5">
          <img
            src={property.thumbnail}
            alt={property.title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-extrabold text-slate-900 block leading-tight">
              {property.price}
            </span>
            <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
              {property.title}
            </p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>
        </div>

        {/* Coordinates Readout */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between text-slate-600 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-600 font-sans" />
            <span>GPS Pin:</span>
          </span>
          <span className="font-bold text-slate-800">
            {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
        <button
          type="button"
          onClick={onViewOnMap}
          className="w-full flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
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
            <span>List Another</span>
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
