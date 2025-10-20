import { useMemo, useState, useEffect } from "react";

const DOMAINS=[
  { key:"architecture", label:"Architecture", subs:["System Design","APIs","Integrations"] },
  { key:"product",      label:"Product",      subs:["Discovery","Roadmap","UX Collab"] },
  { key:"core",         label:"Core Computing", subs:["Perf","Security","Data"] },
  { key:"engineering",  label:"Engineering",  subs:["FE/BE","DevOps","Data"] },
  { key:"stats",        label:"Stats",        subs:["KPIs","Funnels","Benchmarks"] },
  { key:"sales",        label:"Sales",        subs:["Discovery","Enablement","ROI"] },
];

function openSection(id){
  const sec = document.querySelector(`[data-section="${id}"]`);
  if(!sec) return;
  const btn = sec.querySelector("[data-toggle]");
  if(btn && btn.getAttribute("aria-expanded")==="false") btn.click();
  sec.scrollIntoView({ behavior:"smooth", block:"start" });
}

export default function SkillOrbit(){
  const [active,setActive]=useState(null);
  const [dim,setDim]=useState({w:440,h:320});
  useEffect(()=>{ const r=()=>{ const w=Math.min(600, Math.max(320, document.body.clientWidth-120)); const h=Math.round(w*0.72); setDim({w,h}); }; r(); window.addEventListener("resize", r, {passive:true}); return ()=>window.removeEventListener("resize", r); },[]);
  const cx = dim.w/2, cy = dim.h/2, R = Math.min(dim.w,dim.h)*0.35;
  const nodes = useMemo(()=> DOMAINS.map((d,i)=>{ const a=(i/DOMAINS.length)*Math.PI*2 - Math.PI/2; return { ...d, x: cx + R*Math.cos(a), y: cy + R*Math.sin(a) }; }),[dim]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <svg viewBox={`0 0 ${dim.w} ${dim.h}`} className="w-full h-auto select-none">
        <circle cx={cx} cy={cy} r={R+2} fill="none" stroke="rgba(148,163,184,0.25)" strokeDasharray="6 10"/>
        <g><circle cx={cx} cy={cy} r={R*0.26} fill="rgba(30,41,59,0.9)" stroke="rgba(148,163,184,0.4)"/><text x={cx} y={cy+4} textAnchor="middle" className="fill-slate-200 text-sm">Andrea</text></g>
        {nodes.map((n,i)=>(<line key={"spoke"+i} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke="rgba(100,116,139,0.35)"/>))}
        {nodes.map((n)=>(
          <g key={n.key} onMouseEnter={()=>setActive(n.key)} onMouseLeave={()=>setActive(a=>a===n.key?null:a)} onClick={()=>openSection(n.key)} style={{cursor:"pointer"}}>
            <circle cx={n.x} cy={n.y} r="22" fill={active===n.key?"rgba(34,211,238,0.18)":"rgba(15,23,42,0.9)"} stroke={active===n.key?"rgba(34,211,238,0.7)":"rgba(148,163,184,0.45)"} />
            <text x={n.x} y={n.y+5} textAnchor="middle" className="fill-slate-200 text-[12px]">{n.label}</text>
            {active===n.key && n.subs.map((s,si)=>{ const r=Math.max(R-36,60); const a=(si/n.subs.length)*Math.PI*2; const sx=cx+r*Math.cos(a), sy=cy+r*Math.sin(a); return (<g key={s}><line x1={n.x} y1={n.y} x2={sx} y2={sy} stroke="rgba(34,211,238,0.35)" strokeWidth="0.8"/><circle cx={sx} cy={sy} r="10" fill="rgba(2,6,23,0.9)" stroke="rgba(34,211,238,0.6)"/><text x={sx} y={sy-14} textAnchor="middle" className="fill-slate-300 text-[10px]">{s}</text></g>); })}
          </g>
        ))}
      </svg>
    </div>
  );
}
