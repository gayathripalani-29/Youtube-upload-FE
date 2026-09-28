import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Check, 
  SlidersHorizontal, 
  IndianRupee, 
  Calendar, 
  Phone, 
  Building
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCategory, UploadedTimeframe } from '../types/property';

const ALL_CATEGORIES: PropertyCategory[] = [
  'House for Sale',
  'Land for Sale',
  'Land for Development',
  'Flat for Sale',
  'Villa for Sale',
  'Commercial Property',
  'Plot for Sale',
  'Gated Apartment',
];

const TIMEFRAMES: UploadedTimeframe[] = ['All', '1 Week', '1 Month', '6 Months'];

export const FilterPanel: React.FC = () => {
  const { 
    isFilterOpen, 
    setIsFilterOpen, 
    filterState, 
    setFilterState, 
    resetFilters,
    addToast,
    filteredProperties 
  } = useProperties();

  // Local draft state so user can tweak without immediate refilter until "Apply"
  const [localCategories, setLocalCategories] = useState<PropertyCategory[]>(filterState.categories);
  const [localMinPrice, setLocalMinPrice] = useState<number>(filterState.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(filterState.maxPrice);
  const [localTimeframe, setLocalTimeframe] = useState<UploadedTimeframe>(filterState.uploadedWithin);
  const [localMobile, setLocalMobile] = useState<string>(filterState.searchMobile);

  // Sync draft when opened
  React.useEffect(() => {
    if (isFilterOpen) {
      setLocalCategories(filterState.categories);
      setLocalMinPrice(filterState.minPrice);
      setLocalMaxPrice(filterState.maxPrice);
      setLocalTimeframe(filterState.uploadedWithin);
      setLocalMobile(filterState.searchMobile);
    }
  }, [isFilterOpen, filterState]);

  if (!isFilterOpen) return null;

  const toggleCategory = (cat: PropertyCategory) => {
    if (localCategories.includes(cat)) {
      setLocalCategories(localCategories.filter(c => c !== cat));
    } else {
      setLocalCategories([...localCategories, cat]);
    }
  };

  const handleApply = () => {
    setFilterState({
      categories: localCategories,
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
      uploadedWithin: localTimeframe,
      searchMobile: localMobile,
    });
    setIsFilterOpen(false);
    addToast({
      type: 'success',
      title: 'Filters Applied',
      message: `Showing matching property listings`
    });
  };

  const handleReset = () => {
    setLocalCategories([]);
    setLocalMinPrice(1);
    setLocalMaxPrice(10000);
    setLocalTimeframe('All');
    setLocalMobile('');
    resetFilters();
  };

  // Price formatting helper
  const formatPriceLabel = (amountInLakhs: number) => {
    if (amountInLakhs < 1) return `₹${amountInLakhs * 100}K`;
    if (amountInLakhs < 100) return `₹${amountInLakhs} Lakh`;
    const inCr = (amountInLakhs / 100).toFixed(amountInLakhs % 100 === 0 ? 0 : 2);
    return `₹${inCr} Cr`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={() => setIsFilterOpen(false)}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-in-right overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Filter Properties</h2>
              <p className="text-xs text-slate-500">Refine Chennai real estate map</p>
            </div>
          </div>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Section 1: Property Type */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                Property Type
              </label>
              {localCategories.length > 0 && (
                <span className="text-xs font-semibold text-blue-600">
                  {localCategories.length} selected
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_CATEGORIES.map((category) => {
                const isSelected = localCategories.includes(category);
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 text-blue-700 shadow-sm font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate mr-1">{category}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Price Range Dual Slider */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                Price Range
              </label>
              <span className="text-xs font-semibold text-slate-700">
                ₹1.0K ──────── ₹100 Cr
              </span>
            </div>

            {/* Price readout badges */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">Minimum Price</span>
                <span className="text-sm font-bold text-slate-900">{formatPriceLabel(localMinPrice)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Maximum Price</span>
                <span className="text-sm font-bold text-blue-600">{formatPriceLabel(localMaxPrice)}</span>
              </div>
            </div>

            {/* Interactive Sliders */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Min Price Slider</span>
                  <span>{formatPriceLabel(localMinPrice)}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  step="5"
                  value={localMinPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val <= localMaxPrice) setLocalMinPrice(val);
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Max Price Slider</span>
                  <span>{formatPriceLabel(localMaxPrice)}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={localMaxPrice}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= localMinPrice) setLocalMaxPrice(val);
                  }}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Uploaded Within */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Uploaded Within
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIMEFRAMES.map((timeframe) => {
                const isSelected = localTimeframe === timeframe;
                return (
                  <button
                    key={timeframe}
                    type="button"
                    onClick={() => setLocalTimeframe(timeframe)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {timeframe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Listed By / Mobile Number */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Listed By / Mobile
            </label>
            <div className="relative">
              <input
                type="text"
                value={localMobile}
                onChange={(e) => setLocalMobile(e.target.value)}
                placeholder="Search mobile number (e.g. 98765)"
                className="w-full py-2.5 px-3.5 text-xs text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              />
              {localMobile && (
                <button
                  onClick={() => setLocalMobile('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-2 flex items-center justify-center gap-1.5 py-2.5 px-6 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all shadow-sm shadow-blue-500/20"
          >
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};
