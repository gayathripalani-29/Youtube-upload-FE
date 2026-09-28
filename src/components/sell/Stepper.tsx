import React from 'react';
import { Check, MapPin, Video, FileText, CheckSquare, Sparkles } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, title: 'Location', desc: 'Pin on map', icon: MapPin },
  { step: 2, title: 'Property Video', desc: 'Upload tour', icon: Video },
  { step: 3, title: 'Property Details', desc: 'Pricing & specs', icon: FileText },
  { step: 4, title: 'Review', desc: 'Final check', icon: CheckSquare },
  { step: 5, title: 'Submitted', desc: 'Published', icon: Sparkles },
];

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          
          {/* Connector Line behind steps */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-slate-200 -z-0 hidden sm:block" />
          
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const Icon = s.icon;

            return (
              <div
                key={s.step}
                onClick={() => {
                  if (onStepClick && s.step < currentStep && currentStep !== 5) {
                    onStepClick(s.step);
                  }
                }}
                className={`relative z-10 flex items-center sm:flex-col gap-2.5 sm:gap-1.5 transition-all ${
                  s.step < currentStep && currentStep !== 5 ? 'cursor-pointer group' : ''
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : isCurrent
                      ? 'bg-slate-900 text-white ring-4 ring-blue-500/20 shadow-md'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                {/* Step Labels */}
                <div className="text-left sm:text-center">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-blue-600'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    {s.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
