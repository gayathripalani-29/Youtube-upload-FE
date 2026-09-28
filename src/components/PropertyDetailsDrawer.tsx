import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Play, 
  User, 
  Phone, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  Compass, 
  Maximize2,
  Calendar,
  MessageCircle,
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const PropertyDetailsDrawer: React.FC = () => {
  const { 
    selectedProperty, 
    setSelectedProperty, 
    setActiveVideoProperty, 
    addToast 
  } = useProperties();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (!selectedProperty) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Property listing link copied to clipboard'
    });
  };

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText(`${selectedProperty.latitude}, ${selectedProperty.longitude}`);
    addToast({
      type: 'info',
      title: 'Coordinates Copied',
      message: `${selectedProperty.latitude}, ${selectedProperty.longitude}`
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200/80 animate-slide-in-right overflow-hidden">
      
      {/* Top Bar with actions */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <span className="pointer-events-auto px-3 py-1 bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
          {selectedProperty.category}
        </span>
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => {
              setIsSaved(!isSaved);
              addToast({
                type: 'success',
                title: isSaved ? 'Removed from Saved' : 'Property Saved',
                message: isSaved ? 'Listing removed from your bookmarks' : 'Saved to your shortlist'
              });
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isSaved 
                ? 'bg-rose-500 text-white' 
                : 'bg-slate-900/60 text-white hover:bg-slate-900/80'
            }`}
            title="Save Property"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full backdrop-blur-md transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedProperty(null)}
            className="p-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full backdrop-blur-md transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative w-full h-72 sm:h-80 bg-slate-900 flex-shrink-0 group">
        <img
          src={selectedProperty.images[activeImageIndex] || selectedProperty.thumbnail}
          alt={selectedProperty.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Thumbnail carousel selector (if multiple images) */}
        {selectedProperty.images.length > 1 && (
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 overflow-x-auto pb-1">
            {selectedProperty.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-blue-400 scale-105 shadow-md' : 'border-white/50 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* YouTube Video Tour Button Overlay on Image */}
        <button
          onClick={() => setActiveVideoProperty(selectedProperty)}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all font-semibold text-xs uppercase tracking-wider group-hover:ring-4 group-hover:ring-red-500/20"
        >
          <div className="w-6 h-6 rounded-full bg-white text-red-600 flex items-center justify-center">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
          <span>Watch Video Tour</span>
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Title & Price Header */}
        <div>
          <div className="flex items-baseline justify-between gap-4 mb-1.5">
            <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
              {selectedProperty.price}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Listing
            </span>
          </div>
          
          <h1 className="text-xl font-bold text-slate-900 leading-snug">
            {selectedProperty.title}
          </h1>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>{selectedProperty.address || selectedProperty.location}</span>
          </div>
        </div>

        {/* Key Specs Pills Grid */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
          {selectedProperty.specs.bhk && (
            <div className="p-1">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Bedrooms</span>
              <span className="text-sm font-bold text-slate-800">{selectedProperty.specs.bhk}</span>
            </div>
          )}
          <div className="p-1">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Super Built-up</span>
            <span className="text-sm font-bold text-slate-800">{selectedProperty.specs.areaSqFt} sq.ft</span>
          </div>
          <div className="p-1">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Facing</span>
            <span className="text-sm font-bold text-slate-800">{selectedProperty.specs.facing || 'East'}</span>
          </div>
        </div>

        {/* Video Preview Callout Card */}
        <div 
          onClick={() => setActiveVideoProperty(selectedProperty)}
          className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white cursor-pointer group hover:shadow-lg transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded-md tracking-wider">
                YouTube
              </span>
              <span className="text-xs text-slate-300 font-medium">{selectedProperty.videoDuration} Full HD Tour</span>
            </div>
            <span className="text-xs text-blue-400 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
              Watch <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <p className="text-sm font-semibold text-white/90 line-clamp-1">
            {selectedProperty.videoTitle}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Hosted on YouTube • ID: {selectedProperty.videoId}
          </p>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            About Property
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {selectedProperty.description}
          </p>
        </div>

        {/* Map Coordinates & Location Info */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              GPS Coordinates
            </span>
            <button
              onClick={handleCopyCoords}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Latitude</span>
              <span className="font-mono font-bold text-slate-800">{selectedProperty.latitude.toFixed(6)}</span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Longitude</span>
              <span className="font-mono font-bold text-slate-800">{selectedProperty.longitude.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Owner / Contact Card */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                {selectedProperty.owner.charAt(0)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedProperty.owner}</h3>
                <span className="text-xs text-slate-400">Property Owner / Listed Direct</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-md border border-blue-100">
              Direct
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <a
              href={`tel:${selectedProperty.phone}`}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>Call Owner</span>
            </a>
            <a
              href={`https://wa.me/${selectedProperty.phone.replace(/\D/g, '')}?text=Hi,%20I%20am%20interested%20in%20your%20property%20listing:%20${encodeURIComponent(selectedProperty.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
        <button
          onClick={() => setSelectedProperty(null)}
          className="py-3 px-5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Close
        </button>
        <button
          onClick={() => setActiveVideoProperty(selectedProperty)}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>View Property Video</span>
        </button>
      </div>

    </div>
  );
};
