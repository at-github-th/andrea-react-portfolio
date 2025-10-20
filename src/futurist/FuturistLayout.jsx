import { useMemo, useState, useEffect } from "react";
import { useMode } from "../context/ModeContext";
import Particles from "./Particles.jsx";
import { SECTION_CONTENT, QUICK_HINTS, PHRASE_ROUTER } from "./content";

const DOMAINS=[{key:"profile",label:"Profile"},{key:"architecture",label:"Architecture"},{key:"product",label:"Product"},{key:"core",label:"Core Computing"},{key:"engineering",label:"Engineering"},{key:"sales",label:"Sales"},{key:"stats",label:"Stats"}];

function openClassicOnly(id){
  if(!id) return;
  const secs=[...document.querySelectorAll("[data-section]")];
  secs.forEach(s=>{ const btn=s.querySelector("[data-toggle]"); if(!btn) return;
    const isTarget=s.getAttribute("data-section")===id;
    const open=btn.getAttribute("aria-expanded")==="true";
    if(isTarget && !open) btn.click();
    if(!isTarget && open) btn.click();
  });
  const target=document.querySelector(`[data-section="${id}"]`);
  if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
}

function parseCommand(input, active){
  const t=(input||"").trim();
  if(!t) return {text:'Commands: open <section> • classic [section] • summarize <section> • suggest • reset • help'};
  for(const r of PHRASE_ROUTER){ if(r.rx.test(t)) return {action:"focus", target:r.target, text:r.cmd}; }
  const low=t.toLowerCase(); const key=(x)=>x.replace(/\s+/g,'-');
  if(low==="help") return {text:'open <section> • classic [section] • summarize <section> • suggest • reset'};
  if(low==="reset") return {action:"reset"};
  if(low==="suggest") return {text:`Try: ${QUICK_HINTS[active||"profile"].join(" · ")}`};
  if(low==="classic") return {action:"classic", target:active||"profile"};
  const mOpen=/^(open|go)\s+([a-z \-]+)$/.exec(low); if(mOpen) return {action:"focus", target:key(mOpen[2])};
  const mClassic=/^(classic|open classic)\s+([a-z \-]+)$/.exec(low); if(mClassic) return {action:"classic", target:key(mClassic[2])};
  const mSum=/^summarize\s+([a-z \-]+)$/.exec(low); if(mSum){ const k=key(mSum[1]); const c=SECTION_CONTENT[k]; return {text:c?`${k.toUpperCase()} — Strategy: ${c.strategy}\nStory: ${c.story}`:"No summary."}; }
  if(DOMAINS.some(d=>d.key===low)) return {action:"focus", target:low};
  return {text:`Unknown. ${QUICK_HINTS[active||"profile"].join(" · ")}`};
}

export default function FuturistLayout(){
  const { setFuturist } = useMode();
  const [active,setActive]=useState(null);
  const [dim,setDim]=useState({w:980,h:560});
  const [paletteOpen,setPaletteOpen]=useState(false);
  const [query,setQuery]=useState('');
  const [result,setResult]=useState('');

  useEffect(()=>{ const onK=e=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){ e.preventDefault(); setPaletteOpen(v=>!v);} }; window.addEventListener("keydown",onK); return ()=>window.removeEventListener("keydown",onK); },[]);
  useEffect(()=>{ const r=()=>{ const w=Math.min(1200, Math.max(360, document.body.clientWidth-120)); const h=Math.round(w*0.57); setDim({w,h}); }; r(); window.addEventListener("resize",r,{passive:true}); return()=>window.removeEventListener("resize",r); },[]);
  const cx=dim.w/2, cy=dim.h/2, R=Math.min(dim.w,dim.h)*0.34;
  const nodes=useMemo(()=>DOMAINS.map((d,i)=>{ const a=(i/DOMAINS.length)*Math.PI*2-Math.PI/2; return {...d,x:cx+R*Math.cos(a),y:cy+R*Math.sin(a)}; }),[dim]);

  const runCmd=(str)=>{ const res=parseCommand(str, active||'profile'); setResult(res.text||'');
    if(res.action==="reset"){ setActive(null); return; }
    if(res.action==="focus" && res.target){ setActive(res.target); return; }
    if(res.action==="classic" && res.target){ setFuturist(false); openClassicOnly(res.target); return; }
  };

  const content = SECTION_CONTENT[active||"profile"];
  const hint = active ? "Click center to go Back • ⌘K for palette • 'classic' opens exact accordion" :
    "Click a node to focus • ⌘K for palette • Type 'ROI storytelling' or 'schema design'";

  return (
    <div className="relative fx-panel shadow-neon p-5 md:p-7 mx-auto max-w-6xl overflow-hidden">
      <Particles />
      <div className="w-full overflow-hidden rounded-2xl border border-cyan-400/25 p-4 relative">
        <svg viewBox={`0 0 ${dim.w} ${dim.h}`} className="w-full h-auto select-none">
          <defs>
            <radialGradient id="halo" cx="50%" cy="50%"><stop offset="0%" stopColor="rgba(34,211,238,.18)"/><stop offset="100%" stopColor="rgba(34,211,238,0)"/></radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={R+18} fill="url(#halo)"/>
          <circle cx={cx} cy={cy} r={R+10} className="ring-rotate" fill="none" stroke="rgba(34,211,238,0.22)" strokeDasharray="12 14"/>
          <g onClick={()=>setActive(null)} style={{cursor:"pointer"}}>
            <circle cx={cx} cy={cy} r={R*0.26} className="node-pulse" fill="rgba(30,41,59,0.9)" stroke="rgba(148,163,184,0.4)"/>
            <text x={cx} y={cy+4} textAnchor="middle" className="fill-slate-200 text-sm">{active ? "Back" : "Andrea"}</text>
          </g>
          {nodes.map((n,i)=>(<line key={"spoke"+i} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke={active===n.key?"rgba(34,211,238,0.45)":"rgba(100,116,139,0.35)"} />))}
          {nodes.map((n)=>(
            <g key={n.key} onClick={()=>setActive(n.key)} style={{cursor:"pointer"}}>
              <circle cx={n.x} cy={n.y} r={active===n.key?26:22}
                fill={active===n.key?"rgba(34,211,238,0.22)":"rgba(15,23,42,0.92)"} stroke={active===n.key?"rgba(34,211,238,0.85)":"rgba(148,163,184,0.45)"} />
              <text x={n.x} y={n.y+5} textAnchor="middle" className="fill-slate-200 text-[12px]">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="text-cyan-200 text-sm">{active? "Focused":"Default"}</div>
        <div className="text-slate-100 text-xl md:text-2xl font-semibold capitalize">{active? active.replace("-"," "):"Overview"}</div>
        <div className="ml-auto flex gap-2">
          <button onClick={()=>setPaletteOpen(true)} className="px-3 py-1.5 rounded-lg border border-cyan-400 text-cyan-200">Open palette (⌘K)</button>
          {active && <button onClick={()=>{ setFuturist(false); openClassicOnly(active); }} className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300">Open in classic</button>}
        </div>
      </div>
      <div className="text-slate-300 mb-2">{hint}</div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-700/60 p-4 bg-slate-900/40">
          <div className="text-cyan-200 mb-1">Strategy</div>
          <div className="text-slate-200">{content.strategy}</div>
        </div>
        <div className="rounded-xl border border-slate-700/60 p-4 bg-slate-900/40">
          <div className="text-cyan-200 mb-1">Story</div>
          <div className="text-slate-200">{content.story}</div>
        </div>
        <div className="rounded-xl border border-slate-700/60 p-4 bg-slate-900/40">
          <div className="text-cyan-200 mb-1">Math</div>
          <div className="text-slate-200">{content.math}</div>
        </div>
        <div className="rounded-xl border border-slate-700/60 p-4 bg-slate-900/40">
          <div className="text-cyan-200 mb-1">Tech</div>
          <div className="text-slate-200">{content.tech}</div>
        </div>
      </div>

      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4" onClick={()=>setPaletteOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-cyan-400/40 bg-[rgba(2,6,23,.92)] shadow-neon p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="text-slate-200 mb-2">Command/AI Palette</div>
            <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={(e)=>{ if(e.key==="Enter"){ runCmd(query); } }} placeholder={`Try: ${QUICK_HINTS[active||"profile"].join(" · ")}`} className="w-full mb-3 px-3 py-2 rounded-md bg-slate-900/70 border border-slate-600 text-slate-200 outline-none"/>
            <div className="flex gap-2">
              <button onClick={()=>runCmd(query)} className="px-3 py-1.5 rounded-lg border border-cyan-400 text-cyan-200">Run</button>
              <button onClick={()=>setPaletteOpen(false)} className="px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300">Close</button>
            </div>
            {result && (<pre className="mt-3 whitespace-pre-wrap text-slate-300 text-sm bg-slate-900/60 rounded-md p-3 border border-slate-700">{result}</pre>)}
          </div>
        </div>
      )}
    </div>
  );
}
