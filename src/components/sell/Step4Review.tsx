import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Edit3, 
  MapPin, 
  Compass, 
  Play, 
  User, 
  Phone, 
  Building, 
  IndianRupee, 
  FileText,
  ShieldCheck,
  Send
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
    <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-4xl mx-auto w-full animate-fade-in">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Step 4 &bull; Final Verification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Review Your Property
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Please verify all details before submitting. Once approved, your property will be visible on the HiSpace interactive map.
        </p>
      </div>

      <div className="space-y-6">

        {/* Section 1: Overview & Thumbnail */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overview &amp; Imagery
            </span>
            <button
              onClick={() => onEditSection(3)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="relative w-full sm:w-48 h-36 rounded-2xl overflow-hidden bg-slate-900 flex-shrink-0">
              <img
                src={formData.propertyThumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold rounded-md">
                Main Thumbnail
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                  {formData.category}
                </span>
                <span className="text-lg font-extrabold text-blue-600">
                  {formattedPrice}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {formData.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {formData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Location & GPS Coordinates */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Map Location &amp; Coordinates
            </span>
            <button
              onClick={() => onEditSection(1)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-1 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Area / City
              </span>
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                {formData.locationName}
              </span>
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
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              YouTube Video Tour
            </span>
            <button
              onClick={() => onEditSection(2)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                <img src={formData.videoThumbnail} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-white fill-current" />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{formData.videoFileName}</h4>
                <p className="text-[11px] text-slate-400">
                  {formData.videoFileSize} &bull; YouTube ID: {formData.youtubeId}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
              ✓ Ready
            </span>
          </div>
        </div>

        {/* Section 4: Owner & Contact */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Owner Information
            </span>
            <button
              onClick={() => onEditSection(3)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {formData.ownerName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Listed By</span>
                <span className="font-bold text-slate-800">{formData.ownerName}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Phone Number</span>
                <span className="font-bold text-slate-800">{formData.contactNumber}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-8 border-t border-slate-200 mt-8">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <span>Publishing to Map...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Property</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
