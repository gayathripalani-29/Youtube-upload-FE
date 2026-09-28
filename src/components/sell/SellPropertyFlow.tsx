import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from './Stepper';
import { Step1Location } from './Step1Location';
import { Step2Video } from './Step2Video';
import { Step3Details } from './Step3Details';
import { Step4Review } from './Step4Review';
import { Step5Success } from './Step5Success';
import { SellFormData, Property, PropertyCategory, PriceUnit } from '../../types/property';
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
  title: 'Contemporary 4 BHK Luxury Villa',
  category: 'Villa for Sale',
  priceValue: '1.95',
  priceUnit: 'Crore',
  ownerName: 'Venkatesh Subramanian',
  contactNumber: '+91 98401 23456',
  description: 'Newly constructed contemporary 4 BHK architectural villa situated in a prime residential pocket. Features imported Italian marble, private elevator, landscaped terrace garden, and covered parking for 2 large SUVs.',
  areaSqFt: '3200',
  bhk: '4 BHK',
  propertyThumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
};

export const SellPropertyFlow: React.FC = () => {
  const navigate = useNavigate();
  const { addProperty, setSelectedProperty, setMapCenterAndZoom } = useProperties();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SellFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProperty, setSubmittedProperty] = useState<Property | null>(null);

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate quick server submission
    setTimeout(() => {
      // Calculate priceAmount in Lakhs
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
          bathrooms: 4,
          areaSqFt: parseInt(formData.areaSqFt) || 2400,
          facing: 'East',
          furnishing: 'Fully Furnished',
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
    navigate('/');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Step Progress Tracker */}
      <Stepper 
        currentStep={currentStep} 
        onStepClick={(s) => setCurrentStep(s)} 
      />

      {/* Current Step Screen */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {currentStep === 1 && (
          <Step1Location
            formData={formData}
            setFormData={setFormData}
            onNext={() => setCurrentStep(2)}
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
            onBackToProperties={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
};
