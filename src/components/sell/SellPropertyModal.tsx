import React, { useState, useEffect } from 'react';
import { X, Building2, AlertTriangle, Sparkles } from 'lucide-react';
import { Stepper } from './Stepper';
import { Step1Location } from './Step1Location';
import { Step2Video } from './Step2Video';
import { Step3Details } from './Step3Details';
import { Step4Review } from './Step4Review';
import { Step5Success } from './Step5Success';
import { SellFormData, Property } from '../../types/property';
import { useProperties } from '../../context/PropertyContext';

const INITIAL_FORM_DATA: SellFormData = {
  latitude: 13.0827,
  longitude: 80.2707,
  locationName: 'Anna Nagar, Chennai',
  landmark: 'Near Tower Park',
  pincode: '600040',
  videoFile: null,
  videoFileName: 'chennai-property-tour.mp4',
  videoFileSize: '28.4 MB',
  videoThumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  youtubeId: 'HS-YT-8821',
  youtubeUrlInput: 'https://www.youtube.com/watch?v=HS-YT-8821',
  title: 'Contemporary 4 BHK Luxury Villa with Private Garden',
  category: 'Villa for Sale',
  priceValue: '1.95',
  priceUnit: 'Crore',
  negotiable: true,
  ownerName: 'Venkatesh Subramanian',
  contactNumber: '+91 98401 23456',
  description: 'Newly constructed contemporary 4 BHK architectural villa situated in a prime residential pocket. Features imported Italian marble, private elevator, landscaped terrace garden, and covered parking for 2 large SUVs.',
  areaSqFt: '3200',
  bhk: '4 BHK',
  bathrooms: 4,
  furnishing: 'Fully Furnished',
  facing: 'East',
  propertyThumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
};

export const SellPropertyModal: React.FC = () => {
  const { 
    isSellModalOpen, 
    setIsSellModalOpen, 
    addProperty, 
    setSelectedProperty, 
    setMapCenterAndZoom,
    pickedLocation,
    startSellFlow
  } = useProperties();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SellFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProperty, setSubmittedProperty] = useState<Property | null>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  // Sync formData with pickedLocation from main map
  useEffect(() => {
    if (pickedLocation && isSellModalOpen) {
      setFormData(prev => ({
        ...prev,
        latitude: pickedLocation.latitude,
        longitude: pickedLocation.longitude,
        locationName: pickedLocation.locationName || prev.locationName,
        landmark: pickedLocation.landmark || prev.landmark,
        pincode: pickedLocation.pincode || prev.pincode,
      }));
    }
  }, [pickedLocation, isSellModalOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSellModalOpen) {
        handleRequestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSellModalOpen, currentStep]);

  if (!isSellModalOpen) return null;

  const handleRequestClose = () => {
    if (currentStep > 1 && currentStep !== 5) {
      setShowConfirmClose(true);
    } else {
      handleForceClose();
    }
  };

  const handleForceClose = () => {
    setShowConfirmClose(false);
    setIsSellModalOpen(false);
    if (currentStep === 5) {
      setCurrentStep(1);
      setFormData(INITIAL_FORM_DATA);
      setSubmittedProperty(null);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      let amountInLakhs = parseFloat(formData.priceValue) || 100;
      if (formData.priceUnit === 'Crore') {
        amountInLakhs *= 100;
      } else if (formData.priceUnit === 'Thousand') {
        amountInLakhs /= 100;
      }

      const generatedId = `HS-2026-00${Math.floor(100 + Math.random() * 900)}`;

      const newProp: Property = {
        id: generatedId,
        title: formData.title,
        category: formData.category,
        price: `₹${formData.priceValue} ${formData.priceUnit === 'Crore' ? 'Cr' : formData.priceUnit}`,
        priceAmount: amountInLakhs,
        owner: formData.ownerName,
        phone: formData.contactNumber,
        location: formData.locationName,
        area: formData.locationName.split(',')[0].trim(),
        address: `${formData.landmark ? formData.landmark + ', ' : ''}${formData.locationName} - ${formData.pincode || '600001'}`,
        latitude: formData.latitude,
        longitude: formData.longitude,
        thumbnail: formData.propertyThumbnail,
        images: [
          formData.propertyThumbnail,
          formData.videoThumbnail,
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        ],
        videoId: formData.youtubeId,
        videoDuration: '3:10',
        videoTitle: `${formData.title} - Video Walkthrough Tour`,
        videoViews: '1.2K views',
        description: formData.description,
        specs: {
          bhk: formData.bhk || '3 BHK',
          bathrooms: formData.bathrooms || 4,
          areaSqFt: parseInt(formData.areaSqFt) || 2400,
          facing: formData.facing || 'East',
          furnishing: formData.furnishing || 'Fully Furnished',
          possession: 'Ready to Move',
          reraApproved: true,
        },
        status: 'Published',
        uploadedAt: new Date().toISOString(),
        isFeatured: true,
        isNew: true,
      };

      addProperty(newProp);
      setSubmittedProperty(newProp);
      setIsSubmitting(false);
      setCurrentStep(5);
    }, 700);
  };

  const handleViewOnMap = () => {
    if (submittedProperty) {
      setSelectedProperty(submittedProperty);
      setMapCenterAndZoom([submittedProperty.latitude, submittedProperty.longitude], 15);
    }
    handleForceClose();
  };

  const handleResetForNew = () => {
    setCurrentStep(1);
    setFormData(INITIAL_FORM_DATA);
    setSubmittedProperty(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden">
      
      {/* Dark Blurred Backdrop */}
      <div 
        onClick={handleRequestClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Main Studio Modal Window */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 z-10 animate-modal-pop flex flex-col h-[92vh] sm:h-[88vh] max-h-[840px]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200/80 text-slate-900 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-slate-900">
                  HiSpace Listing Studio
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Draft Autosaved
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Direct owner listing with video walkthrough &amp; pinpoint GPS coordinates
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {currentStep < 5 && (
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
                Step <strong className="text-slate-800">{currentStep}</strong> of 4
              </span>
            )}
            <button
              onClick={handleRequestClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar (Only visible during steps 1 to 4) */}
        {currentStep <= 4 && (
          <Stepper 
            currentStep={currentStep} 
            onStepClick={(s) => setCurrentStep(s)} 
          />
        )}

        {/* Content Body */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          {currentStep === 1 && (
            <Step1Location
              formData={formData}
              setFormData={setFormData}
              onNext={() => setCurrentStep(2)}
              onRepickOnMap={() => {
                setIsSellModalOpen(false);
                startSellFlow();
              }}
            />
          )}

          {currentStep === 2 && (
            <Step2Video
              formData={formData}
              setFormData={setFormData}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && (
            <Step3Details
              formData={formData}
              setFormData={setFormData}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && (
            <Step4Review
              formData={formData}
              onSubmit={handleSubmit}
              onBack={() => setCurrentStep(3)}
              onEditSection={(step) => setCurrentStep(step)}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 5 && submittedProperty && (
            <Step5Success
              property={submittedProperty}
              onViewOnMap={handleViewOnMap}
              onBackToProperties={handleForceClose}
              onReset={handleResetForNew}
            />
          )}
        </div>

        {/* Discard Confirmation Dialog overlay */}
        {showConfirmClose && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center animate-modal-pop">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3.5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Discard Listing Draft?
              </h4>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                You have unsaved details in your property draft. If you exit now, unsubmitted changes will be reset.
              </p>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowConfirmClose(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={handleForceClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                >
                  Discard &amp; Exit
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
