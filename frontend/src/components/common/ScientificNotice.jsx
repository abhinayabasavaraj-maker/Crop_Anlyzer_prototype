import React, { useState } from 'react';
import { ShieldAlert, X, Scale } from 'lucide-react';

const ScientificNotice = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-900/10 via-slate-900/5 to-amber-900/10 border-l-4 border-emerald-600 rounded-r-xl p-3.5 shadow-sm text-xs text-slate-700 flex items-start justify-between gap-3 mb-5 transition-all">
      <div className="flex items-start gap-2.5">
        <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <div className="font-semibold text-slate-900 flex items-center gap-1.5 flex-wrap">
            <span>BMSCE Capstone Prototype (ECE + CSE)</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 text-[10px] font-mono">
              TRL 2 (Target TRL 3 by Aug 2027)
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono">
              Index Range: -1.0 to +1.0
            </span>
          </div>
          <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">
            The optical sensing arrangement uses a <strong>single BPW34 photodiode</strong> measuring sequential reflected flux from alternating <strong>660 nm RED</strong> and <strong>850 nm Near-Infrared</strong> LED illumination. 
            Raw 16-bit ADS1115 ADC counts are normalized on the ESP32. 
            The index <code className="bg-white/90 px-1 py-0.5 rounded border border-slate-200 font-mono text-[11px] font-semibold text-slate-800">(NIR - RED) / (NIR + RED)</code> has a theoretical range of -1 to +1. 
            All plant health and stress scores are illustrative indicators and are not yet experimentally validated against commercial spectrophotometers.
          </p>
        </div>
      </div>
      <button 
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors shrink-0"
        title="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ScientificNotice;
