import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  Plus, 
  MapPin, 
  Shield, 
  Building2,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { CHENNAI_HOTSPOTS } from '../data/mockProperties';
import whiteLogo from '../assets/white-logo.png';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    searchQuery, 
    setSearchQuery, 
    isFilterOpen, 
    setIsFilterOpen, 
    activeFilterCount, 
    setMapCenterAndZoom,
    filteredProperties,
    isPickingLocation,
    startSellFlow,
    cancelLocationPicker 
  } = useProperties();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const isSellPage = location.pathname.startsWith('/sell');
  const isAdminPage = location.pathname.startsWith('/admin');

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectHotspot = (hotspot: typeof CHENNAI_HOTSPOTS[0]) => {
    if (hotspot.name === 'All Locations') {
      setSearchQuery('');
    } else {
      setSearchQuery(hotspot.name);
    }
    setMapCenterAndZoom([hotspot.lat, hotspot.lng], hotspot.zoom);
    setIsSearchFocused(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Left: Brand Logo & Wordmark */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="h-10 px-2.5 py-1 bg-slate-950/90 hover:bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex items-center justify-center transition-all group-hover:border-amber-500/40 group-hover:scale-105">
              <img src={whiteLogo} alt="VJM Logo" className="h-7 w-auto object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                  VJM <span className="text-blue-600">Properties</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                  MAP
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 -mt-1 hidden sm:inline">
                Verified Video Properties
              </span>
            </div>
          </div>

          {/* Center: Search Bar with Autocomplete Dropdown (Hidden on Sell flow) */}
          {!isSellPage && (
            <div ref={searchContainerRef} className="relative flex-1 max-w-lg hidden md:block">
              <div className={`relative flex items-center w-full transition-all duration-200 rounded-xl border bg-slate-50/80 ${
                isSearchFocused 
                  ? 'bg-white border-blue-500 ring-2 ring-blue-500/10 shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}>
                <Search className="w-4 h-4 text-slate-400 ml-3.5 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search location, area or property..."
                  className="w-full py-2.5 pl-2.5 pr-8 text-sm text-slate-800 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions Popup */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden z-50 animate-fade-in">
                  <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-blue-600" />
                      Popular Chennai Hubs
                    </span>
                    <span>{filteredProperties.length} active listings</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1.5 divide-y divide-slate-50">
                    {CHENNAI_HOTSPOTS.map((hotspot) => (
                      <button
                        key={hotspot.name}
                        onClick={() => handleSelectHotspot(hotspot)}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                          <span>{hotspot.name}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Filter Button (on Map page) */}
            {!isSellPage && !isAdminPage && (
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isFilterOpen || activeFilterCount > 0
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
                title="Filter Properties"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full shadow-sm">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin Portal Toggle */}
            <button
              onClick={() => navigate(isAdminPage ? '/' : '/admin/properties')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isAdminPage
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200'
              }`}
              title="Admin Portal"
            >
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="hidden md:inline">{isAdminPage ? 'View Map' : 'Admin'}</span>
            </button>

            {/* Sell Your Property CTA Trigger */}
            {isPickingLocation ? (
              <button
                onClick={cancelLocationPicker}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-md shadow-amber-500/25 transition-all cursor-pointer animate-pulse"
                title="Click to cancel location selection"
              >
                <MapPin className="w-4 h-4 stroke-[2.5]" />
                <span>Marking on Map... (Cancel)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (location.pathname !== '/') {
                    navigate('/');
                  }
                  startSellFlow();
                }}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Sell Property</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Row (When on map) */}
        {!isSellPage && (
          <div className="pb-3 md:hidden">
            <div className="relative flex items-center w-full rounded-xl border border-slate-200 bg-slate-50">
              <Search className="w-4 h-4 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location, area or property..."
                className="w-full py-2 pl-2 pr-8 text-xs text-slate-800 placeholder-slate-400 bg-transparent rounded-xl focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
