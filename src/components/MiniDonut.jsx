import React from "react";
export default function MiniDonut({ value=70, size=84, stroke=10, label="" }) {
  const r=(size-stroke)/2, c=2*Math.PI*r, v=Math.max(0,Math.min(100,value)), dash=(v/100)*c;
  return (
    <div className="mini-donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${label} ${v}%`}>
        <g transform={`translate(${size/2},${size/2})`}>
          <circle r={r} className="mini-donut-track" strokeWidth={stroke} fill="none" />
          <circle r={r} className="mini-donut-ring" strokeWidth={stroke} fill="none"
                  strokeDasharray={`${dash} ${c-dash}`} strokeDashoffset="0" />
          <text textAnchor="middle" dominantBaseline="central" className="mini-donut-text">{v}%</text>
        </g>
      </svg>
      {label ? <div className="mini-donut-label">{label}</div> : null}
    </div>
  );
}
