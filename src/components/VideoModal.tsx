import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Share2, 
  ExternalLink,
  MapPin,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import whiteLogo from '../assets/white-logo.png';

export const VideoModal: React.FC = () => {
  const { activeVideoProperty, setActiveVideoProperty, addToast } = useProperties();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(42);

  if (!activeVideoProperty) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Video walkthrough link copied to clipboard'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark Backdrop */}
      <div 
        onClick={() => setActiveVideoProperty(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 z-10 animate-fade-in flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded-md tracking-wider">
              YouTube
            </span>
            <div className="truncate max-w-md">
              <h2 className="text-sm font-bold text-white truncate">
                {activeVideoProperty.videoTitle}
              </h2>
              <span className="text-[11px] text-slate-400">
                Hosted on YouTube &bull; ID: {activeVideoProperty.videoId} &bull; {activeVideoProperty.videoViews || 'Verified HD Tour'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveVideoProperty(null)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden group select-none">
          {/* Mock Video Frame */}
          <img
            src={activeVideoProperty.thumbnail}
            alt={activeVideoProperty.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />

          {/* Video Shade Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Center Play/Pause Indicator (when paused) */}
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-20 group-hover:ring-8 group-hover:ring-red-600/30"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          )}

          {/* Watermark Logo (Top Right) */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/75 backdrop-blur-md rounded-xl border border-white/15 text-white text-xs font-semibold shadow-lg">
            <img src={whiteLogo} alt="VJM" className="h-5 w-auto object-contain" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>VJM Verified Tour</span>
          </div>

          {/* Player Custom Controls Overlay (Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent z-20 flex flex-col gap-2">
            
            {/* Scrubber Bar */}
            <div className="relative w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full cursor-pointer transition-all group/scrub">
              <div 
                className="h-full bg-red-600 rounded-full relative" 
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/scrub:scale-100 transition-transform"></div>
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white text-xs pt-1">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-red-500 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-red-500 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <span className="font-mono text-slate-300 text-[11px]">
                  01:14 / {activeVideoProperty.videoDuration}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] uppercase font-bold tracking-wider">
                  1080p HD
                </span>
                <button 
                  onClick={handleShare}
                  className="hover:text-red-500 transition-colors" 
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const videoArea = document.querySelector('.aspect-video');
                    videoArea?.requestFullscreen?.();
                  }}
                  className="hover:text-red-500 transition-colors" 
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Recap Bottom Bar */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={activeVideoProperty.thumbnail}
              alt=""
              className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-blue-400">
                  {activeVideoProperty.price}
                </span>
                <span className="text-xs text-slate-400">&bull; {activeVideoProperty.category}</span>
              </div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {activeVideoProperty.title}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {activeVideoProperty.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={`tel:${activeVideoProperty.phone}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Owner ({activeVideoProperty.owner})</span>
            </a>
            <button
              onClick={() => setActiveVideoProperty(null)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
