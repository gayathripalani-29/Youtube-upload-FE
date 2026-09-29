import React from 'react';
import { Check, MapPin, Video, FileText, CheckCircle2 } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, title: 'Location', subtitle: 'GPS Pin & Address', icon: MapPin },
  { step: 2, title: 'Video Tour', subtitle: 'YouTube or Upload', icon: Video },
  { step: 3, title: 'Pricing & Specs', subtitle: 'Values & Details', icon: FileText },
  { step: 4, title: 'Review', subtitle: 'Verify & Publish', icon: CheckCircle2 },
];

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Segments */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 items-center">
          {STEPS.map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const isClickable = onStepClick && s.step < currentStep && currentStep !== 5;
            const Icon = s.icon;

            return (
              <button
                key={s.step}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(s.step)}
                className={`group text-left transition-all relative flex flex-col ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {/* Segment indicator bar */}
                <div className="w-full h-1 rounded-full overflow-hidden bg-slate-100 mb-2.5">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-600 w-full'
                        : isCurrent
                        ? 'bg-blue-600 w-full'
                        : 'w-0'
                    }`}
                  />
                </div>

                {/* Step Content */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all flex-shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/15'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      <span>{s.step}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold leading-tight truncate transition-colors ${
                        isCurrent
                          ? 'text-slate-900'
                          : isCompleted
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate hidden sm:block">
                      {s.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
