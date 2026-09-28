import React, { useState } from 'react';
import { 
  Video, 
  UploadCloud, 
  CheckCircle2, 
  FileVideo, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  RefreshCw, 
  Film,
  Link,
  Sparkles
} from 'lucide-react';
import { SellFormData } from '../../types/property';

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface Step2VideoProps {
  formData: SellFormData;
  setFormData: React.Dispatch<React.SetStateAction<SellFormData>>;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Video: React.FC<Step2VideoProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [tab, setTab] = useState<'upload' | 'youtube'>(formData.youtubeUrlInput ? 'youtube' : 'upload');
  const [youtubeInput, setYoutubeInput] = useState(formData.youtubeUrlInput || (formData.youtubeId ? `https://www.youtube.com/watch?v=${formData.youtubeId}` : ''));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(formData.videoFileName ? 100 : 0);
  const [isCompleted, setIsCompleted] = useState(!!formData.videoFileName || !!formData.youtubeId);
  const [isDragOver, setIsDragOver] = useState(false);

  // Helper to extract YouTube ID
  const extractYoutubeId = (urlOrId: string): string => {
    if (!urlOrId) return 'HS-YT-' + Math.floor(1000 + Math.random() * 9000);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return match && match[2].length === 11 ? match[2] : urlOrId.trim();
  };

  const handleApplyYoutubeUrl = () => {
    if (!youtubeInput.trim()) return;
    const yId = extractYoutubeId(youtubeInput);
    const mockThumb = yId.length === 11 
      ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

    setFormData(prev => ({
      ...prev,
      youtubeId: yId,
      youtubeUrlInput: youtubeInput,
      videoFileName: `YouTube Video (${yId})`,
      videoFileSize: 'YouTube Cloud Stream',
      videoThumbnail: mockThumb,
    }));
    setIsCompleted(true);
  };

  const startSimulatedUpload = (filename = 'chennai-property-tour.mp4', size = '28.4 MB') => {
    setIsUploading(true);
    setIsCompleted(false);
    setUploadProgress(0);

    const generatedId = 'HS-YT-' + Math.floor(1000 + Math.random() * 9000);

    setFormData(prev => ({
      ...prev,
      videoFileName: filename,
      videoFileSize: size,
      videoThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      youtubeId: generatedId,
    }));

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        setIsCompleted(true);
      } else {
        setUploadProgress(current);
      }
    }, 150);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      startSimulatedUpload(file.name, sizeMb);
    } else {
      startSimulatedUpload();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      startSimulatedUpload(file.name, sizeMb);
    } else {
      startSimulatedUpload();
    }
  };

  return (
    <div className="flex-1 flex flex-col p-5 sm:p-8 max-w-2xl mx-auto w-full animate-fade-in overflow-y-auto">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-red-100">
          <Film className="w-3.5 h-3.5 text-red-600" />
          <span>Step 2 of 4 &bull; Video Tour</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Add Property Video Tour
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Buyers love video walkthroughs! Properties with video tours receive 4x more direct calls and inquiries.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-center p-1 bg-slate-100 rounded-2xl max-w-sm mx-auto mb-6 w-full">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            tab === 'upload'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-blue-600" />
          <span>Upload File</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('youtube')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            tab === 'youtube'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <YoutubeIcon className="w-4 h-4 text-red-600" />
          <span>Paste YouTube URL</span>
        </button>
      </div>

      {/* Tab 1: Upload Video */}
      {tab === 'upload' && (
        <>
          {!isCompleted && !isUploading ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
              className={`relative w-full border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all cursor-pointer ${
                isDragOver 
                  ? 'border-blue-600 bg-blue-50/50 scale-[1.01]' 
                  : 'border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50/60 shadow-xs'
              }`}
            >
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/mkv"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />

              <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  Drag &amp; drop video tour here
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  or <span className="text-blue-600 font-semibold underline underline-offset-2">browse files on your device</span>
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                  <span>MP4, MOV</span>
                  <span>&bull;</span>
                  <span>Max 500 MB</span>
                  <span>&bull;</span>
                  <span>Full HD / 4K</span>
                </div>

                <button
                  type="button"
                  onClick={() => startSimulatedUpload('luxury-chennai-villa.mp4', '32.1 MB')}
                  className="mt-5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Use Sample Video (Demo)</span>
                </button>
              </div>
            </div>
          ) : isUploading ? (
            /* Uploading state */
            <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse">
                  <FileVideo className="w-5 h-5" />
                </div>
                <div className="flex-1 truncate">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {formData.videoFileName || 'property-tour.mp4'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {formData.videoFileSize} &bull; Encoding to YouTube Cloud CDN...
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600">
                  {uploadProgress}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Optimizing for map stream playback...</span>
            </div>
          ) : (
            /* Uploaded Preview state */
            <div className="w-full bg-white border border-emerald-200 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      Video Ready
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate max-w-xs">
                      {formData.videoFileName}
                    </h5>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => startSimulatedUpload('alternate-walkthrough.mp4', '29.4 MB')}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-semibold"
                >
                  <RefreshCw className="w-3 h-3" />
                  Replace
                </button>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-3 group">
                <img
                  src={formData.videoThumbnail}
                  alt=""
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/95 text-red-600 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/75 rounded-md text-white text-[10px] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>1080p HD Walkthrough</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
                <span>Video ID: <strong className="text-slate-800 font-mono">{formData.youtubeId}</strong></span>
                <span>Size: <strong className="text-slate-800">{formData.videoFileSize}</strong></span>
                <span className="text-emerald-600 font-bold">✓ Ready</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab 2: YouTube URL Input */}
      {tab === 'youtube' && (
        <div className="space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs">
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <YoutubeIcon className="w-4 h-4 text-red-600" />
              Paste YouTube Video URL or Video ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or youtu.be/..."
                className="flex-1 px-3.5 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all font-mono"
              />
              <button
                type="button"
                onClick={handleApplyYoutubeUrl}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Apply
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Supports standard YouTube links, Shorts links, or direct 11-character YouTube video IDs.
            </p>
          </div>

          {/* Quick Demo YouTube Links */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Quick Presets:</span>
            <button
              type="button"
              onClick={() => {
                setYoutubeInput('https://www.youtube.com/watch?v=HS-YT-8821');
                setFormData(prev => ({
                  ...prev,
                  youtubeId: 'HS-YT-8821',
                  youtubeUrlInput: 'https://www.youtube.com/watch?v=HS-YT-8821',
                  videoFileName: 'Chennai Villa Tour (YouTube)',
                  videoFileSize: 'Cloud Stream',
                  videoThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                }));
                setIsCompleted(true);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors"
            >
              Villa Tour 1
            </button>
            <button
              type="button"
              onClick={() => {
                setYoutubeInput('https://www.youtube.com/watch?v=HS-YT-4412');
                setFormData(prev => ({
                  ...prev,
                  youtubeId: 'HS-YT-4412',
                  youtubeUrlInput: 'https://www.youtube.com/watch?v=HS-YT-4412',
                  videoFileName: 'OMR Penthouse Walkthrough (YouTube)',
                  videoFileSize: 'Cloud Stream',
                  videoThumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                }));
                setIsCompleted(true);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-lg text-[11px] font-semibold border border-slate-200 transition-colors"
            >
              Penthouse Tour 2
            </button>
          </div>

          {isCompleted && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
              <img
                src={formData.videoThumbnail}
                alt=""
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-md">
                YouTube ID: {formData.youtubeId}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between w-full mt-auto pt-6 border-t border-slate-200">
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
          onClick={() => {
            if (!isCompleted) {
              startSimulatedUpload();
            } else {
              onNext();
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
        >
          <span>{isCompleted ? 'Next: Details & Price' : 'Upload & Continue'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
