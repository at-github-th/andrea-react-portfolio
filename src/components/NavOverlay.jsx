import React from "react";

const links = [
  { id:"profile", label:"ABOUT" },
  { id:"projects", label:"WORK" },
  { id:"skills", label:"SKILLS" },
  { id:"resume", label:"RESUME" },
  { id:"ai", label:"DEVELOPMENT" },
  { id:"summary", label:"SUMMARY" },
];

export default function NavOverlay({ open, onClose }){
  if(!open) return null;
  const go = (id)=>{
    onClose?.();
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior:"smooth", block:"start" });
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <button className="absolute right-6 top-6 text-white/70 hover:text-white" onClick={onClose}>✕</button>
      <nav className="text-center space-y-6">
        {links.map(l=>(
          <button
            key={l.id}
            onClick={()=>go(l.id)}
            className="block w-full text-2xl md:text-4xl tracking-[0.18em] hover:text-[var(--accent)] transition"
          >
            {l.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
