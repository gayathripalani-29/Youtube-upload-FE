import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  Building,
  Home,
  Store,
  Trees,
  Hammer,
  Maximize2,
  Compass, 
  FileText, 
  Image as ImageIcon, 
  IndianRupee, 
  Phone, 
  User,
  Check,
  AlertCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { SellFormData, PropertyCategory, PriceUnit } from '../../types/property';

interface Step3DetailsProps {
  formData: SellFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORY_DEFINITIONS: { label: PropertyCategory; icon: React.FC<{ className?: string }> }[] = [
  { label: 'Villa for Sale', icon: Sparkles },
  { label: 'Flat for Sale', icon: Building2 },
  { label: 'House for Sale', icon: Home },
  { label: 'Gated Apartment', icon: Building },
  { label: 'Plot for Sale', icon: Maximize2 },
  { label: 'Commercial Property', icon: Store },
  { label: 'Land for Sale', icon: Trees },
  { label: 'Land for Development', icon: Hammer },
];

const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Plot'];
const BATHROOM_OPTIONS = [1, 2, 3, 4, 5];
const FURNISHING_OPTIONS: ('Unfurnished' | 'Semi-Furnished' | 'Fully Furnished')[] = [
  'Unfurnished',
  'Semi-Furnished',
  'Fully Furnished',
];
const FACING_OPTIONS = ['East', 'North', 'West', 'South', 'North-East'];
const PRICE_UNITS: PriceUnit[] = ['Crore', 'Lakh', 'Thousand'];

const THUMBNAIL_PRESETS = [
  { label: 'Luxury Villa Exterior', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern High-Rise Penthouse', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Architectural Residence', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Contemporary Commercial Hub', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
];

const QUICK_FEATURE_TAGS = [
  'Ready to Move',
  '100% Vastu Compliant',
  'Covered Car Parking',
  'Private Elevator',
  'Italian Marble Flooring',
  '24/7 Security & CCTV',
  'Near Metro Station',
  'Private Garden',
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
    if (!formData.title?.trim()) newErrors.title = 'Listing title is required';
    if (!formData.ownerName?.trim()) newErrors.ownerName = 'Seller/Owner name is required';
    if (!formData.contactNumber?.trim()) newErrors.contactNumber = 'Contact phone number is required';
    if (!formData.priceValue?.trim() || isNaN(Number(formData.priceValue))) {
      newErrors.priceValue = 'Valid price is required';
    }
    if (!formData.description?.trim()) newErrors.description = 'Property description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext();
    }
  };

  // Real-time Rate Per Sq.Ft calculation
  const calculateRatePerSqFt = () => {
    const price = parseFloat(formData.priceValue);
    const sqFt = parseFloat(formData.areaSqFt);
    if (!price || !sqFt || sqFt <= 0) return null;

    let priceInRupees = price;
    if (formData.priceUnit === 'Crore') priceInRupees *= 10000000;
    else if (formData.priceUnit === 'Lakh') priceInRupees *= 100000;
    else if (formData.priceUnit === 'Thousand') priceInRupees *= 1000;

    const rate = Math.round(priceInRupees / sqFt);
    return rate > 0 ? `₹${rate.toLocaleString('en-IN')}` : null;
  };

  const addFeatureTag = (tag: string) => {
    if (formData.description.includes(tag)) return;
    const separator = formData.description.trim() ? ' • ' : '';
    setFormData(prev => ({
      ...prev,
      description: (prev.description + separator + tag).slice(0, 500),
    }));
  };

  const ratePerSqFt = calculateRatePerSqFt();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      
      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100/80">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Step 3 &bull; Pricing &amp; Specifications</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Property Values &amp; Specifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Define the price, dimensions, and highlights. Accurate information guarantees higher discovery in buyer search queries.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-5">
            
            {/* 1. Property Category Selector */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-800 block">
                Select Property Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CATEGORY_DEFINITIONS.map((cat) => {
                  const isSelected = formData.category === cat.label;
                  const Icon = cat.icon;

                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.label }))}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-600 text-blue-900 ring-2 ring-blue-500/15 font-bold shadow-xs'
                          : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300 font-medium'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Listing Title */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Listing Headline / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Contemporary 4 BHK Luxury Villa with Private Garden"
                className={`w-full px-4 py-2.5 text-xs text-slate-900 bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                  errors.title ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                }`}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* 3. Pricing & Financials */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                  <span>Expected Price &amp; Denomination</span> <span className="text-rose-500">*</span>
                </label>
                {ratePerSqFt && (
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                    Calculated: {ratePerSqFt} / sq.ft
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Price input (8 cols) */}
                <div className="sm:col-span-8 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={formData.priceValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, priceValue: e.target.value }))}
                    placeholder="1.95"
                    className={`w-full pl-8 pr-4 py-2.5 text-base font-bold text-slate-900 bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                      errors.priceValue ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                    }`}
                  />
                </div>

                {/* Price Unit Switcher (4 cols) */}
                <div className="sm:col-span-4 flex p-1 bg-slate-100 rounded-xl">
                  {PRICE_UNITS.map((unit) => (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priceUnit: unit }))}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg transition-all ${
                        formData.priceUnit === unit
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Negotiable Switch */}
              <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.negotiable ?? true}
                  onChange={(e) => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 font-medium">
                  Price is open to reasonable negotiation with verified buyers
                </span>
              </label>

              {errors.priceValue && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.priceValue}
                </p>
              )}
            </div>

            {/* 4. Specifications Grid */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-800 block">
                Property Dimensions &amp; Specifications
              </span>

              {/* BHK Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-2">
                  Configuration (BHK)
                </label>
                <div className="flex flex-wrap gap-2">
                  {BHK_OPTIONS.map((opt) => {
                    const isSelected = formData.bhk === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bhk: opt }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Area & Bathrooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    Super Built-up Area
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.areaSqFt}
                      onChange={(e) => setFormData(prev => ({ ...prev, areaSqFt: e.target.value }))}
                      placeholder="3200"
                      className="w-full px-3.5 py-2 text-xs text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      sq.ft
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    Bathrooms
                  </label>
                  <div className="flex gap-2">
                    {BATHROOM_OPTIONS.map((num) => {
                      const isSelected = (formData.bathrooms || 4) === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, bathrooms: num }))}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Furnishing & Facing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    Furnishing Status
                  </label>
                  <div className="flex gap-1.5">
                    {FURNISHING_OPTIONS.map((f) => {
                      const isSelected = (formData.furnishing || 'Fully Furnished') === f;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, furnishing: f }))}
                          className={`flex-1 py-1.5 px-2 text-center rounded-xl text-[11px] font-semibold border transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5">
                    Facing Direction
                  </label>
                  <div className="flex gap-1.5">
                    {FACING_OPTIONS.map((dir) => {
                      const isSelected = (formData.facing || 'East') === dir;
                      return (
                        <button
                          key={dir}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, facing: dir }))}
                          className={`flex-1 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                          }`}
                        >
                          {dir}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Primary Cover Photo Selection */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Primary Listing Cover Photo</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {THUMBNAIL_PRESETS.map((preset) => {
                  const isSelected = formData.propertyThumbnail === preset.url;
                  return (
                    <div
                      key={preset.label}
                      onClick={() => setFormData(prev => ({ ...prev, propertyThumbnail: preset.url }))}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-video group ${
                        isSelected 
                          ? 'border-blue-600 ring-4 ring-blue-500/20 scale-[1.02]' 
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-bold text-white truncate">{preset.label}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Seller / Owner Contact */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
              <span className="text-xs font-bold text-slate-800 block">
                Seller &amp; Owner Profile
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>Owner / Representative Name</span> <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    placeholder="e.g. Venkatesh Subramanian"
                    className={`w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                      errors.ownerName ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                    }`}
                  />
                  {errors.ownerName && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.ownerName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Direct Contact Mobile</span> <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                    placeholder="+91 98401 23456"
                    className={`w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none transition-all font-mono ${
                      errors.contactNumber ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                    }`}
                  />
                  {errors.contactNumber && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.contactNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 7. Description & Quick Feature Chips */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Property Highlights &amp; Description <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[11px] font-mono ${
                  formData.description.length > 500 ? 'text-rose-500 font-bold' : 'text-slate-400'
                }`}>
                  {formData.description.length} / 500
                </span>
              </div>

              <textarea
                rows={3}
                maxLength={500}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Highlight layout, road width, private lift, ventilation, parking, and proximity to schools/metro..."
                className={`w-full p-3 text-xs text-slate-900 bg-slate-50/70 border rounded-xl focus:bg-white focus:outline-none transition-all resize-none ${
                  errors.description ? 'border-rose-400 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                }`}
              />

              {/* Quick Feature Chips */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Click to add highlights:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_FEATURE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addFeatureTag(tag)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium border border-slate-200/70 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {errors.description && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.description}
                </p>
              )}
            </div>

          </form>

        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="bg-white border-t border-slate-200/80 px-6 py-3.5 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
        >
          <span>Continue to Final Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
