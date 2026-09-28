import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Edit3, 
  MapPin, 
  Play, 
  User, 
  Phone, 
  Building, 
  IndianRupee, 
  FileText,
  ShieldCheck,
  Send,
  Compass,
  Check
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
  const formattedPrice = `₹${formData.priceValue} ${formData.priceUnit}`;

  return (
    <div className="flex-1 flex flex-col p-5 sm:p-8 max-w-4xl mx-auto w-full animate-fade-in overflow-y-auto">
      
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-100">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Step 4 of 4 &bull; Final Verification</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Review Your Property Listing
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Review all information below before publishing. Once confirmed, your property will be visible on the interactive map.
        </p>
      </div>

      <div className="space-y-4">

        {/* Section 1: Overview & Imagery */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Overview &amp; Imagery
            </span>
            <button
              onClick={() => onEditSection(3)}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-44 h-32 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
              <img
                src={formData.propertyThumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 text-white text-[10px] font-bold rounded-md">
                Cover Photo
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                  {formData.category}
                </span>
                <span className="text-base font-extrabold text-blue-600">
                  {formattedPrice} {formData.negotiable ? '(Negotiable)' : ''}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">
                {formData.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {formData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Location & GPS */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Map Location &amp; Address
            </span>
            <button
              onClick={() => onEditSection(1)}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Area &amp; Landmark
              </span>
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                {formData.locationName}
              </span>
              {formData.landmark && (
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {formData.landmark} {formData.pincode ? `- ${formData.pincode}` : ''}
                </span>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Latitude
              </span>
              <span className="font-mono font-bold text-slate-800">
                {formData.latitude?.toFixed(6)}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Longitude
              </span>
              <span className="font-mono font-bold text-slate-800">
                {formData.longitude?.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Video Tour */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Video Walkthrough Tour
            </span>
            <button
              onClick={() => onEditSection(2)}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                <img src={formData.videoThumbnail} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-white fill-current" />
                </div>
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">{formData.videoFileName}</h5>
                <p className="text-[11px] text-slate-400">
                  YouTube ID: <span className="font-mono font-semibold text-slate-700">{formData.youtubeId}</span>
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Ready
            </span>
          </div>
        </div>

        {/* Section 4: Specifications & Seller */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Specifications &amp; Seller
            </span>
            <button
              onClick={() => onEditSection(3)}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-3">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">BHK</span>
              <span className="font-bold text-slate-800">{formData.bhk || '3 BHK'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Area</span>
              <span className="font-bold text-slate-800">{formData.areaSqFt} sq.ft</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Furnishing</span>
              <span className="font-bold text-slate-800">{formData.furnishing || 'Fully Furnished'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Facing</span>
              <span className="font-bold text-slate-800">{formData.facing || 'East'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                {formData.ownerName.charAt(0) || 'U'}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Listed By</span>
                <span className="text-xs font-bold text-slate-800">{formData.ownerName}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>{formData.contactNumber}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Submit Action */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
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
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Publishing to Map...</span>
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Publish Property Live</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
