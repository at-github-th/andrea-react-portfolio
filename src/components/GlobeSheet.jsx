import React, { useEffect } from "react";

export default function GlobeSheet({open, country, items, onClose, onPick}){
  useEffect(()=>{
    const onKey=(e)=>{ if(e.key==='Escape') onClose?.() };
    if(open) window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[open,onClose]);

  if(!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/45"
         onClick={(e)=>{ if(e.target===e.currentTarget) onClose?.() }}>
      <div className="card w-[92vw] md:w-[720px] max-h-[72vh] overflow-auto p-0 border border-white/10 bg-white/6 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-white/8">
          <div className="font-medium">{country}</div>
          <button className="btn btn-sm" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="p-3 md:p-4 space-y-3">
          {items.map((a,i)=>(
            <button key={i}
              className="w-full text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-4 py-3"
              onClick={()=>onPick?.(a)}>
              <div className="font-medium">{a.name}</div>
              <div className="text-xs opacity-75">{a.focus}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
