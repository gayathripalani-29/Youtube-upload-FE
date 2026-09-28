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
  AlertCircle,
  Sparkles,
  Home,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { SellFormData, PropertyCategory, PriceUnit } from '../../types/property';

interface Step3DetailsProps {
  formData: SellFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellFormData>>;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES: { label: PropertyCategory; icon: string }[] = [
  { label: 'Villa for Sale', icon: '🏰' },
  { label: 'Flat for Sale', icon: '🏢' },
  { label: 'House for Sale', icon: '🏡' },
  { label: 'Gated Apartment', icon: '🏘️' },
  { label: 'Plot for Sale', icon: '📐' },
  { label: 'Commercial Property', icon: '🏬' },
  { label: 'Land for Sale', icon: '🌳' },
  { label: 'Land for Development', icon: '🏗️' },
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
  { label: 'Luxury Villa', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Apartment', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Independent House', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Commercial Space', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
];

const QUICK_FEATURE_TAGS = [
  'Ready to Move',
  '100% Vastu Compliant',
  'Covered Car Parking',
  'Private Elevator',
  'Italian Marble Flooring',
  '24/7 Security & CCTV',
  'Near Metro Station',
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
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Seller/Owner name is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact phone number is required';
    if (!formData.priceValue.trim() || isNaN(Number(formData.priceValue))) {
      newErrors.priceValue = 'Valid price is required';
    }
    if (!formData.description.trim()) newErrors.description = 'Property description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onNext();
    }
  };

  // Calculate price per sq.ft helper
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
    <div className="flex-1 flex flex-col p-5 sm:p-8 max-w-4xl mx-auto w-full animate-fade-in overflow-y-auto">
      
      {/* Step Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-blue-100">
          <FileText className="w-3.5 h-3.5" />
          <span>Step 3 of 4 &bull; Pricing &amp; Values</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Enter Property Values &amp; Specifications
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Provide accurate pricing, dimensions, and specifications to attract qualified buyers.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
        
        {/* Section 1: Property Category */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-blue-600" />
            Property Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = formData.category === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.label }))}
                  className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-600 text-blue-800 ring-2 ring-blue-500/20 shadow-xs font-bold'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Property Title */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Property Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Contemporary 4 BHK Luxury Villa with Private Garden"
            className={`w-full px-4 py-2.5 text-xs text-slate-800 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
              errors.title ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
            }`}
          />
          {errors.title && (
            <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.title}
            </span>
          )}
        </div>

        {/* Section 3: Pricing & Values */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
              Property Price &amp; Unit *
            </label>
            {formData.priceValue && !errors.priceValue && (
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                ₹{formData.priceValue} {formData.priceUnit} {ratePerSqFt ? `(${ratePerSqFt}/sq.ft)` : ''}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            {/* Price Value Input */}
            <div className="sm:col-span-2 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ₹
              </span>
              <input
                type="text"
                value={formData.priceValue}
                onChange={(e) => setFormData(prev => ({ ...prev, priceValue: e.target.value }))}
                placeholder="e.g. 1.95"
                className={`w-full pl-8 pr-4 py-2.5 text-sm font-bold text-slate-900 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                  errors.priceValue ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                }`}
              />
            </div>

            {/* Price Unit Dropdown */}
            <div>
              <select
                value={formData.priceUnit}
                onChange={(e) => setFormData(prev => ({ ...prev, priceUnit: e.target.value as PriceUnit }))}
                className="w-full px-4 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-bold"
              >
                {PRICE_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Negotiable Checkbox */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              id="negotiable-toggle"
              checked={formData.negotiable ?? true}
              onChange={(e) => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="negotiable-toggle" className="text-xs text-slate-600 cursor-pointer font-medium">
              Price is negotiable for immediate buyers
            </label>
          </div>

          {errors.priceValue && (
            <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.priceValue}
            </span>
          )}
        </div>

        {/* Section 4: Specifications (BHK, Area, Bathrooms, Furnishing, Facing) */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Property Specifications
          </span>

          {/* BHK Configuration Chips */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-2">
              Configuration / BHK
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
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Super Built-up Area (Sq.Ft)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.areaSqFt}
                  onChange={(e) => setFormData(prev => ({ ...prev, areaSqFt: e.target.value }))}
                  placeholder="e.g. 3200"
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                  sq.ft
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
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
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
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
                      className={`flex-1 py-1.5 px-1 text-center rounded-xl text-[11px] font-semibold border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {f.replace('Furnished', '') || 'Full'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
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
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
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

        {/* Section 5: Property Thumbnail Images */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2.5 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            Cover Image Thumbnail
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {THUMBNAIL_PRESETS.map((preset) => {
              const isSelected = formData.propertyThumbnail === preset.url;
              return (
                <div
                  key={preset.label}
                  onClick={() => setFormData(prev => ({ ...prev, propertyThumbnail: preset.url }))}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all aspect-video group ${
                    isSelected ? 'border-blue-600 ring-4 ring-blue-500/20 scale-[1.02]' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={preset.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
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

        {/* Section 6: Seller Contact Details */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
            Seller / Owner Contact Info
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Seller / Owner Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                placeholder="e.g. Venkatesh Subramanian"
                className={`w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all ${
                  errors.ownerName ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                }`}
              />
              {errors.ownerName && (
                <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-semibold">
                  <AlertCircle className="w-3 h-3" /> {errors.ownerName}
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                Contact Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="+91 98401 23456"
                className={`w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all font-mono ${
                  errors.contactNumber ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
                }`}
              />
              {errors.contactNumber && (
                <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-semibold">
                  <AlertCircle className="w-3 h-3" /> {errors.contactNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 7: Description & Quick Feature Tags */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-xs">
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
            placeholder="Highlight architecture, road width, ventilation, private terrace, parking, and nearby schools/metro..."
            className={`w-full p-3.5 text-xs text-slate-800 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none transition-all resize-none ${
              errors.description ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
            }`}
          />

          {/* Quick Feature Chips */}
          <div className="mt-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Click to Add Quick Highlights:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_FEATURE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addFeatureTag(tag)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-semibold border border-slate-200 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {errors.description && (
            <span className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.description}
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </form>

    </div>
  );
};
