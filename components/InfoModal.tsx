// components/InfoModal.tsx
// 📚 Reusable educational tooltip/modal component
'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';

interface InfoModalProps {
  title: string;
  children: React.ReactNode;
  iconClassName?: string;
}

export default function InfoModal({ title, children, iconClassName = '' }: InfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${iconClassName}`}
        aria-label={`Learn more about ${title}`}
      >
        <Info className="w-4 h-4 text-slate-400 hover:text-slate-600" />
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal Content - Bottom Sheet on mobile, centered on desktop */}
          <div 
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl overflow-hidden shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Info className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">{title}</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="text-slate-600 text-sm leading-relaxed">
                {children}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// ============================================
// PRE-BUILT INFO CONTENT COMPONENTS
// ============================================

export function BolehScoreInfo() {
  return (
    <InfoModal title="Understanding Your Boleh Score">
      <div className="space-y-4">
        <p>
          Your daily score starts at <span className="font-bold text-teal-600">70 points</span> and adjusts based on your food choices and health readings.
        </p>
        
        <div className="bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="font-semibold text-red-700 text-xs uppercase tracking-wide mb-1">📉 We Deduct Points For:</p>
          <ul className="text-red-600 text-xs space-y-1">
            <li>• Deep-fried foods (-3 pts each)</li>
            <li>• Hawker/Fast food meals (-3 pts each)</li>
            <li>• High sugar drinks (-5 pts)</li>
            <li>• High glucose readings (-10 pts)</li>
          </ul>
        </div>
        
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <p className="font-semibold text-green-700 text-xs uppercase tracking-wide mb-1">📈 We Add Bonuses For:</p>
          <ul className="text-green-600 text-xs space-y-1">
            <li>• Steamed/Grilled meals (+5 pts)</li>
            <li>• Consistent logging (+2 pts per meal)</li>
            <li>• Healthy glucose levels (+5 pts)</li>
          </ul>
        </div>
        
        <div className="bg-teal-50 rounded-xl p-3 border border-teal-100">
          <p className="text-teal-700 font-medium text-sm">
            🎯 <span className="font-bold">Goal:</span> Keep your score above 80 for optimal health!
          </p>
        </div>
      </div>
    </InfoModal>
  );
}

export function RiskCorrelationInfo() {
  return (
    <InfoModal title="How Risk Correlation Works">
      <div className="space-y-4">
        <p>
          This chart connects your <span className="font-bold text-orange-500">meals</span> to your <span className="font-bold text-blue-500">vital readings</span> on a timeline.
        </p>
        
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-4 h-4 rounded-full bg-orange-400"></div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">Orange Dots = Your Meals</p>
            <p className="text-slate-500 text-xs">Hover to see what you ate</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-8 h-1 bg-blue-400 rounded-full"></div>
          <div>
            <p className="font-semibold text-slate-700 text-sm">Blue Line = Glucose/BP</p>
            <p className="text-slate-500 text-xs">Your vital readings over time</p>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
          <p className="text-amber-700 text-sm">
            💡 <span className="font-bold">Pro Tip:</span> Look for spikes in the blue line 2 hours after a meal. That's the food causing your sugar or BP to rise!
          </p>
        </div>
        
        <p className="text-slate-500 text-xs">
          Use this insight to identify which foods to avoid and which are safe for you.
        </p>
      </div>
    </InfoModal>
  );
}

