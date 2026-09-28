import React, { useState, useEffect } from 'react';
import { 
  Video, 
  UploadCloud, 
  CheckCircle2, 
  FileVideo, 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Sparkles,
  RefreshCw,
  Film
} from 'lucide-react';
import { SellFormData } from '../../types/property';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(formData.videoFileName ? 100 : 0);
  const [isCompleted, setIsCompleted] = useState(!!formData.videoFileName);
  const [isDragOver, setIsDragOver] = useState(false);

  // Trigger realistic simulated upload when user picks or drags
  const startSimulatedUpload = (filename = 'chennai-property-tour.mp4', size = '28.4 MB') => {
    setIsUploading(true);
    setIsCompleted(false);
    setUploadProgress(0);

    setFormData(prev => ({
      ...prev,
      videoFileName: filename,
      videoFileSize: size,
      videoThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      youtubeId: 'HS-YT-' + Math.floor(1000 + Math.random() * 9000),
    }));

    // Realistic multi-stage progress
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 18) + 12;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setIsUploading(false);
        setIsCompleted(true);
      } else {
        setUploadProgress(current);
      }
    }, 180);
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
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-3xl mx-auto w-full animate-fade-in">
      
      {/* Step Header */}
      <div className="text-center max-w-md mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Film className="w-3.5 h-3.5" />
          <span>Step 2 &bull; Property Video</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Upload Property Video
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Add a video that showcases your property. Visual tours generate 4x more buyer inquiries.
        </p>
      </div>

      {/* Main Upload Area / Progress Card */}
      {!isCompleted && !isUploading ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleFileDrop}
          className={`relative w-full border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            isDragOver 
              ? 'border-blue-600 bg-blue-50/50 scale-[1.01]' 
              : 'border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50/60 shadow-subtle'
          }`}
        >
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/mkv"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />

          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-1">
              Drag &amp; drop your video here
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              or <span className="text-blue-600 font-semibold underline underline-offset-2">browse from your device</span>
            </p>

            <div className="flex items-center gap-3 text-[11px] text-slate-400 border-t border-slate-100 pt-4 w-full justify-center">
              <span>MP4, MOV supported</span>
              <span>&bull;</span>
              <span>Max size: 500 MB</span>
              <span>&bull;</span>
              <span>1080p / 4K</span>
            </div>

            {/* Demo Quick Sample Trigger */}
            <button
              type="button"
              onClick={() => startSimulatedUpload()}
              className="mt-6 px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
            >
              Use Sample Demo Walkthrough (property-tour.mp4)
            </button>
          </div>
        </div>
      ) : isUploading ? (
        /* Uploading Progress State */
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-card max-w-xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 animate-pulse">
              <FileVideo className="w-6 h-6" />
            </div>
            <div className="flex-1 truncate">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {formData.videoFileName || 'property-tour.mp4'}
              </h4>
              <p className="text-xs text-slate-400">
                {formData.videoFileSize || '24.5 MB'} &bull; Uploading to HiSpace YouTube CDN...
              </p>
            </div>
            <span className="text-sm font-mono font-bold text-blue-600">
              {uploadProgress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Uploading...</span>
            <span className="font-mono">████████████████░░░░ {uploadProgress}%</span>
          </div>
        </div>
      ) : (
        /* Video Uploaded Successfully State */
        <div className="w-full bg-white border border-emerald-200/80 rounded-3xl p-6 sm:p-8 shadow-card max-w-xl mx-auto animate-fade-in">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 block">
                  ✓ Video uploaded successfully
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate max-w-xs">
                  {formData.videoFileName}
                </h4>
              </div>
            </div>
            <button
              onClick={() => startSimulatedUpload('villa-alternate-tour.mp4', '34.2 MB')}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Replace
            </button>
          </div>

          {/* Video Preview Snapshot */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 mb-4 group">
            <img
              src={formData.videoThumbnail}
              alt=""
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 text-red-600 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>YouTube Video Tour Ready</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex items-center justify-between">
            <span>Video ID: <strong className="text-slate-800 font-mono">{formData.youtubeId}</strong></span>
            <span>Size: <strong className="text-slate-800">{formData.videoFileSize}</strong></span>
            <span className="text-emerald-600 font-semibold">Ready for Review</span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between w-full max-w-xl mx-auto mt-8 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
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
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
        >
          <span>{isCompleted ? 'Continue to Details' : 'Upload & Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
