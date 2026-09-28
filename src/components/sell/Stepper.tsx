import React from 'react';
import { Check, MapPin, Video, FileText, CheckSquare, Sparkles } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, title: 'Location', desc: 'Pin on map', icon: MapPin },
  { step: 2, title: 'Video Tour', desc: 'Upload or YouTube', icon: Video },
  { step: 3, title: 'Details & Price', desc: 'Specs & values', icon: FileText },
  { step: 4, title: 'Review', desc: 'Final check', icon: CheckSquare },
  { step: 5, title: 'Published', desc: 'Live on map', icon: Sparkles },
];

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  const progressPercent = Math.min(100, Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100));

  return (
    <div className="w-full bg-slate-50/90 border-b border-slate-200/80 px-4 sm:px-6 py-3.5 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Bar Header */}
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-2.5">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Step {Math.min(currentStep, 4)} of 4: <strong className="text-slate-900">{STEPS[currentStep - 1]?.title}</strong>
          </span>
          <span className="font-mono text-blue-600 font-bold">{progressPercent}% Completed</span>
        </div>

        {/* Progress Line */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Items */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
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
                className={`flex-1 flex items-center gap-2 p-1.5 sm:p-2 rounded-xl transition-all text-left ${
                  isClickable 
                    ? 'hover:bg-white hover:shadow-xs cursor-pointer group' 
                    : 'cursor-default'
                } ${isCurrent ? 'bg-white shadow-xs border border-blue-200/80 ring-1 ring-blue-500/10' : ''}`}
              >
                {/* Step Icon Badge */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-slate-200/80 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Step Text (Hidden on very small screens, visible on sm+) */}
                <div className="hidden md:block truncate">
                  <span
                    className={`block text-[11px] font-bold leading-tight truncate ${
                      isCurrent
                        ? 'text-blue-700'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {s.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
