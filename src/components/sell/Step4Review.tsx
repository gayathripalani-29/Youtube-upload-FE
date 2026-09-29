import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Play, 
  Phone, 
  ShieldCheck, 
  Send, 
  Edit2,
  CheckCircle2,
  Compass,
  Video,
  FileText
} from 'lucide-react';
import { SellFormData } from '../../types/property';

interface Step4ReviewProps {
  formData: SellFormData;
  onSubmit: () => void;
  onBack: () => void;
  onEditSection: (step: number) => void;
  isSubmitting?: boolean;
}

export const Step4Review: React.FC<Step4ReviewProps> = ({
  formData,
  onSubmit,
  onBack,
  onEditSection,
  isSubmitting = false,
}) => {
  const formattedPrice = `₹${formData.priceValue} ${formData.priceUnit === 'Crore' ? 'Cr' : formData.priceUnit}`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-100/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Step 4 &bull; Final Verification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Review &amp; Publish Listing
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Verify how your property appears to buyers. Once published, your listing and video tour become instantly accessible on the map.
            </p>
          </div>

          {/* Authentic Live Listing Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-800">Live Marketplace Card Preview</span>
              </div>
              <button
                type="button"
                onClick={() => onEditSection(3)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Details</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
              {/* Thumbnail with video tour chip */}
              <div className="relative w-full sm:w-64 aspect-16/10 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 shadow-xs">
                <img
                  src={formData.propertyThumbnail}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold">
                  {formData.category}
                </div>
                {formData.youtubeId && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-md bg-red-600/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Video Tour</span>
                  </div>
                )}
              </div>

              {/* Details Column */}
              <div className="flex-1 space-y-2.5 w-full">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {formattedPrice}
                  </span>
                  {formData.negotiable && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      Negotiable
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {formData.title}
                </h3>

                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{formData.landmark ? `${formData.landmark}, ` : ''}{formData.locationName}</span>
                </p>

                {/* Specs Chips Bar */}
                <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-slate-700">
                  <span className="px-2.5 py-1 bg-slate-100 rounded-lg">{formData.bhk}</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-lg">{formData.areaSqFt} sq.ft</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-lg">{formData.bathrooms || 4} Baths</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-lg">{formData.furnishing || 'Furnished'}</span>
                  <span className="px-2.5 py-1 bg-slate-100 rounded-lg">{formData.facing || 'East'} Facing</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2x2 Breakdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Box 1: Location & Coordinates */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Map Location &amp; GPS</span>
                </span>
                <button
                  type="button"
                  onClick={() => onEditSection(1)}
                  className="text-xs text-slate-400 hover:text-blue-600 font-semibold"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-900">{formData.locationName}</p>
                <p className="text-slate-500">{formData.landmark} {formData.pincode ? `- ${formData.pincode}` : ''}</p>
                <div className="p-2 bg-slate-50 rounded-xl font-mono text-[11px] text-slate-700 mt-2 flex items-center justify-between">
                  <span>GPS: {formData.latitude?.toFixed(6)}, {formData.longitude?.toFixed(6)}</span>
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                </div>
              </div>
            </div>

            {/* Box 2: Video Walkthrough */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-600" />
                  <span>Video Walkthrough</span>
                </span>
                <button
                  type="button"
                  onClick={() => onEditSection(2)}
                  className="text-xs text-slate-400 hover:text-blue-600 font-semibold"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-bold text-slate-900 truncate">{formData.videoFileName || 'YouTube Walkthrough'}</p>
                <p className="text-slate-500 font-mono text-[11px]">Stream ID: {formData.youtubeId}</p>
                <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-700 mt-2 flex items-center justify-between">
                  <span>Stream Quality: 1080p HD</span>
                  <span className="text-emerald-600 font-bold">✓ Ready</span>
                </div>
              </div>
            </div>

            {/* Box 3: Seller Contact */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Owner Contact</span>
                </span>
                <button
                  type="button"
                  onClick={() => onEditSection(3)}
                  className="text-xs text-slate-400 hover:text-blue-600 font-semibold"
                >
                  Edit
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-900">{formData.ownerName}</p>
                <p className="text-slate-700 font-mono font-semibold">{formData.contactNumber}</p>
                <p className="text-[11px] text-slate-400">Direct inquiries from verified map buyers</p>
              </div>
            </div>

            {/* Box 4: Description Highlights */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Listing Description</span>
                </span>
                <button
                  type="button"
                  onClick={() => onEditSection(3)}
                  className="text-xs text-slate-400 hover:text-blue-600 font-semibold"
                >
                  Edit
                </button>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {formData.description}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="bg-white border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Publishing to Map...</span>
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Publish Listing Live to Map</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
