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
  ExternalLink,
  Sparkles,
  Check
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

const PRESET_WALKTHROUGHS = [
  {
    title: 'Chennai Architectural Villa Walkthrough',
    id: 'HS-YT-8821',
    url: 'https://www.youtube.com/watch?v=HS-YT-8821',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    duration: '3:15',
  },
  {
    title: 'Modern OMR Sea-Facing Penthouse Tour',
    id: 'HS-YT-4412',
    url: 'https://www.youtube.com/watch?v=HS-YT-4412',
    thumb: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    duration: '2:45',
  },
  {
    title: 'ECR Beachfront Luxury Haven Tour',
    id: 'HS-YT-1082',
    url: 'https://www.youtube.com/watch?v=HS-YT-1082',
    thumb: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    duration: '4:10',
  }
];

export const Step2Video: React.FC<Step2VideoProps> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [tab, setTab] = useState<'youtube' | 'upload'>(
    formData.youtubeUrlInput || !formData.videoFile ? 'youtube' : 'upload'
  );
  const [youtubeInput, setYoutubeInput] = useState(
    formData.youtubeUrlInput || (formData.youtubeId ? `https://www.youtube.com/watch?v=${formData.youtubeId}` : '')
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(formData.videoFileName ? 100 : 0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Extract YouTube ID from link or raw input
  const extractYoutubeId = (urlOrId: string): string => {
    if (!urlOrId) return 'HS-YT-8821';
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
      videoFileName: `YouTube Walkthrough (${yId})`,
      videoFileSize: 'Cloud Stream',
      videoThumbnail: mockThumb,
    }));
  };

  const handleSelectPreset = (preset: typeof PRESET_WALKTHROUGHS[0]) => {
    setYoutubeInput(preset.url);
    setFormData(prev => ({
      ...prev,
      youtubeId: preset.id,
      youtubeUrlInput: preset.url,
      videoFileName: preset.title,
      videoFileSize: 'Cloud Stream',
      videoThumbnail: preset.thumb,
    }));
  };

  const startSimulatedUpload = (filename = 'property-walkthrough.mp4', size = '34.2 MB') => {
    setIsUploading(true);
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
      } else {
        setUploadProgress(current);
      }
    }, 120);
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

  const isVideoConfigured = !!formData.youtubeId || !!formData.videoFileName;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      
      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100/80">
              <Film className="w-3.5 h-3.5 text-blue-600" />
              <span>Step 2 &bull; Video Walkthrough</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Add Property Video Tour
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              HiSpace streams video tours directly inside interactive map markers. Paste a YouTube link or upload a video file for seamless streaming playback.
            </p>
          </div>

          {/* Segmented Switcher Tabs */}
          <div className="flex p-1 bg-slate-200/70 rounded-xl max-w-md">
            <button
              type="button"
              onClick={() => setTab('youtube')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                tab === 'youtube'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <YoutubeIcon className="w-4 h-4 text-red-600" />
              <span>YouTube Video</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                tab === 'upload'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Upload Video File</span>
            </button>
          </div>

          {/* YouTube Mode */}
          {tab === 'youtube' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    YouTube URL or Video Link
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <YoutubeIcon className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={youtubeInput}
                        onChange={(e) => setYoutubeInput(e.target.value)}
                        onBlur={handleApplyYoutubeUrl}
                        placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyYoutubeUrl}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Attach
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Supports standard YouTube video URLs, YouTube Shorts, or 11-digit video IDs.
                  </p>
                </div>

                {/* Preset Walkthroughs */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    Select a Verified Chennai Walkthrough:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PRESET_WALKTHROUGHS.map((item) => {
                      const isSelected = formData.youtubeId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectPreset(item)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/15'
                              : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-blue-700">{item.duration}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
                          </div>
                          <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {item.title}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Video Preview Card */}
              {isVideoConfigured && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Stream Configured &bull; Map Ready
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      ID: {formData.youtubeId}
                    </span>
                  </div>

                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 group">
                    <img
                      src={formData.videoThumbnail}
                      alt="Walkthrough preview"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/95 text-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-black/80 backdrop-blur-xs rounded-lg text-white text-[11px] font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span>1080p Interactive Walkthrough</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Upload File Mode */}
          {tab === 'upload' && (
            <div className="space-y-4">
              {!isUploading && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleFileDrop}
                  className={`relative w-full border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
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
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      Choose video file or drag here
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      MP4 or MOV format, up to 500 MB
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Full HD 1080p / 4K</span>
                      <span>&bull;</span>
                      <span>Optimized for Map Streaming</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploading progress card */}
              {isUploading && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <FileVideo className="w-4 h-4 text-blue-600 animate-pulse" />
                      <span>{formData.videoFileName}</span>
                    </div>
                    <span className="font-mono text-blue-600 font-bold">{uploadProgress}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Transcoding video stream for high-speed map playback...
                  </p>
                </div>
              )}

              {/* Uploaded card */}
              {!isUploading && formData.videoFileName && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{formData.videoFileName}</p>
                      <p className="text-[11px] text-slate-400">{formData.videoFileSize} &bull; Ready</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => startSimulatedUpload()}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Replace
                  </button>
                </div>
              )}
            </div>
          )}

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
          onClick={() => {
            if (!isVideoConfigured) {
              handleApplyYoutubeUrl();
            }
            onNext();
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 hover:shadow-md transition-all"
        >
          <span>Next: Pricing &amp; Details</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
