import React from 'react';

const ThresholdBadge = ({ status, indexValue, showProvisional = false }) => {
  let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotStyles = 'bg-slate-400';

  if (status === 'Healthy' || (typeof indexValue === 'number' && indexValue >= 0.45)) {
    badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotStyles = 'bg-emerald-500';
  } else if (status === 'Moderate Stress' || (typeof indexValue === 'number' && indexValue >= 0.20)) {
    badgeStyles = 'bg-amber-50 text-amber-800 border-amber-200';
    dotStyles = 'bg-amber-500';
  } else if (status === 'Severe Stress' || (typeof indexValue === 'number' && indexValue < 0.20)) {
    badgeStyles = 'bg-rose-50 text-rose-800 border-rose-200';
    dotStyles = 'bg-rose-500';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`}></span>
      <span>{status || 'Unknown'}</span>
      {typeof indexValue === 'number' && (
        <span className="font-mono text-[11px] opacity-80">({indexValue.toFixed(2)})</span>
      )}
      {showProvisional && (
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">prov.</span>
      )}
    </span>
  );
};

export default ThresholdBadge;
