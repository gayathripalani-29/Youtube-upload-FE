import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building, 
  Compass, 
  FileText, 
  Image as ImageIcon, 
  IndianRupee, 
  Phone, 
  User,
  Check,
  AlertCircle
} from 'lucide-react';
import { SellFormData, PropertyCategory, PriceUnit } from '../../types/property';

interface Step3DetailsProps {
  formData: SellFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES: PropertyCategory[] = [
  'House for Sale',
  'Land for Sale',
  'Land for Development',
  'Flat for Sale',
  'Villa for Sale',
  'Commercial Property',
  'Plot for Sale',
  'Gated Apartment',
];

const PRICE_UNITS: PriceUnit[] = ['Thousand', 'Lakh', 'Crore'];

const THUMBNAIL_PRESETS = [
  { label: 'Luxury Villa', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Apartment', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Independent House', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Commercial Office', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
];

export const Step3Details: React.FC<Step3DetailsProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Property title is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.priceValue.trim() || isNaN(Number(formData.priceValue))) {
      newErrors.priceValue = 'Valid price is required';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-4xl mx-auto w-full animate-fade-in">
      
      {/* Step Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Step 3 &bull; Property Information</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Enter Property Details
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Provide accurate pricing, specifications, and owner details for verification.
        </p>
      </div>

      {/* Main Two-Column Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
        
        {/* Selected Coordinates Readout Badge */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Location Fixed at Step 1
              </span>
              <h4 className="text-xs font-bold text-slate-900">{formData.locationName}</h4>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
              Lat: <strong className="text-blue-600">{formData.latitude?.toFixed(6)}</strong>
            </span>
            <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
              Lng: <strong className="text-blue-600">{formData.longitude?.toFixed(6)}</strong>
            </span>
          </div>
        </div>

        {/* Thumbnail Selector */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            Property Thumbnail Image
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THUMBNAIL_PRESETS.map((preset) => {
              const isSelected = formData.propertyThumbnail === preset.url;
              return (
                <div
                  key={preset.label}
                  onClick={() => setFormData(prev => ({ ...prev, propertyThumbnail: preset.url }))}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group aspect-video ${
                    isSelected ? 'border-blue-600 ring-4 ring-blue-500/20 scale-[1.02]' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={preset.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-bold text-white truncate">{preset.label}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Fields: Two Columns on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Property Title */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Property Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Modern Luxury 4 BHK Villa with Garden"
              className={`w-full px-4 py-2.5 text-xs text-slate-800 bg-white border rounded-xl focus:outline-none transition-all ${
                errors.title ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
              }`}
            />
            {errors.title && (
              <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.title}
              </span>
            )}
          </div>

          {/* Owner / Client Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Owner / Client Name *
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
              placeholder="e.g. Arun Kumar"
              className={`w-full px-4 py-2.5 text-xs text-slate-800 bg-white border rounded-xl focus:outline-none transition-all ${
                errors.ownerName ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
              }`}
            />
            {errors.ownerName && (
              <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.ownerName}
              </span>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-2.5 text-xs text-slate-800 bg-white border rounded-xl focus:outline-none transition-all ${
                errors.contactNumber ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
              }`}
            />
            {errors.contactNumber && (
              <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.contactNumber}
              </span>
            )}
          </div>

          {/* Property Category */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              Property Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as PropertyCategory }))}
              className="w-full px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Property Price & Unit */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
              Property Price &amp; Unit *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.priceValue}
                onChange={(e) => setFormData(prev => ({ ...prev, priceValue: e.target.value }))}
                placeholder="e.g. 1.85"
                className={`flex-1 px-4 py-2.5 text-xs text-slate-800 bg-white border rounded-xl focus:outline-none transition-all ${
                  errors.priceValue ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                }`}
              />
              <select
                value={formData.priceUnit}
                onChange={(e) => setFormData(prev => ({ ...prev, priceUnit: e.target.value as PriceUnit }))}
                className="w-32 px-3 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all font-semibold"
              >
                {PRICE_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            {errors.priceValue && (
              <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.priceValue}
              </span>
            )}
          </div>

          {/* Additional details: Area and BHK */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Super Built-up Area (Sq. Ft)
            </label>
            <input
              type="text"
              value={formData.areaSqFt}
              onChange={(e) => setFormData(prev => ({ ...prev, areaSqFt: e.target.value }))}
              placeholder="e.g. 2400"
              className="w-full px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Bedrooms / Configuration
            </label>
            <input
              type="text"
              value={formData.bhk}
              onChange={(e) => setFormData(prev => ({ ...prev, bhk: e.target.value }))}
              placeholder="e.g. 3 BHK or 4 BHK"
              className="w-full px-4 py-2.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Description (with character counter 0 / 500) */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Property Description *
              </label>
              <span className={`text-[11px] font-mono ${
                formData.description.length > 500 ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}>
                {formData.description.length} / 500 characters
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Highlight key advantages, ventilation, road width, nearby landmarks and possession status..."
              className={`w-full p-4 text-xs text-slate-800 bg-white border rounded-xl focus:outline-none transition-all resize-none ${
                errors.description ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
              }`}
            />
            {errors.description && (
              <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </span>
            )}
          </div>

        </div>

        {/* Bottom Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
