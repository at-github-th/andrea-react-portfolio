import React, { useMemo } from "react";
export default function MiniDonut({ value=70, label="", size=84 }){
  const v = Math.max(0, Math.min(100, value));
  const r = size*0.42, c = 2*Math.PI*r, dash = (v/100)*c;
  const title = `${label}: ${v}%`;
  const id = useMemo(()=>`mn-${Math.random().toString(36).slice(2)}`,[label]);
  return (
    <div className="flex flex-col items-center gap-2" title={title} aria-label={title}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-labelledby={id}>
        <title id={id}>{title}</title>
        <g transform={`translate(${size/2},${size/2})`}>
          <circle r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
          <circle r={r} fill="none" stroke="rgb(45 212 191)" strokeWidth="10"
                  strokeDasharray={`${dash} ${c-dash}`} strokeDashoffset="0"
                  transform="rotate(-90)"/>
        </g>
      </svg>
      <div className="text-[11px] leading-4 opacity-80 text-center">{label}</div>
    </div>
  );
}
