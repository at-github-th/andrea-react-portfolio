import React from "react";
export default function MiniDonut({ label, percent = 60 }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (percent/100) * c;
  return (
    <div className="donut">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="12" fill="none"/>
        <circle className="ring" cx="48" cy="48" r={r} stroke="#4df7de" strokeWidth="12" fill="none"
          strokeDasharray={`${dash} ${c-dash}`} strokeLinecap="round" transform="rotate(-90 48 48)"/>
      </svg>
      <div className="text-xs mt-1 text-center opacity-80">{label} • {percent}%</div>
    </div>
  );
}
