import React from "react";

export default function PieChart({ data }){
  const vals = Object.values(data || {});
  const total = vals.reduce((a,b)=>a+b,0) || 1;
  const parts = vals.map(v=>v/total);
  const size = 140, r=50, cx=70, cy=70, circ = 2*Math.PI*r;

  let acc = 0;
  const colors = ["#66f2d5","#8ab6ff","#ffd166","#f48fb1","#b39ddb"];

  return (
    <svg width={size} height={size} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="16"/>
      {parts.map((p,i)=>{
        const len = circ * p;
        const dasharray = `${len} ${circ-len}`;
        const dashoffset = circ * (1 - acc);
        acc += p;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                  stroke={colors[i % colors.length]}
                  strokeWidth="16" strokeLinecap="butt"
                  strokeDasharray={dasharray} strokeDashoffset={dashoffset}/>
        );
      })}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#e2e8f0">
        {Math.round((vals[0]||0)/total*100)}%
      </text>
    </svg>
  );
}
