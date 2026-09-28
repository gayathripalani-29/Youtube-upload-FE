import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useProperties();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-elevated border border-slate-200/80 text-slate-800 animate-slide-up transition-all"
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {isWarning && <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900 leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
