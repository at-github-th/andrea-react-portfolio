import { useMode } from "../context/ModeContext";

export default function FuturistToggle(){
  const { futurist, setFuturist } = useMode();
  return (
    <button
      onClick={()=>setFuturist(v=>!v)}
      aria-pressed={futurist}
      title={futurist ? "Compact: ON — click to exit" : "Compact: OFF — click to enter"}
      className={`fixed left-6 bottom-6 z-[60] group w-11 h-11 rounded-full flex items-center justify-center
        border backdrop-blur-sm transition will-change-transform
        ${futurist
          ? "border-cyan-400/70 text-cyan-300 shadow-neon hover:scale-105"
          : "border-slate-600 text-slate-300 hover:border-cyan-300/60 hover:text-cyan-200 hover:scale-105"
        }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
           className={`${futurist ? "opacity-100" : "opacity-80"}`}>
        <circle cx="12" cy="12" r="8" fill={futurist ? "rgba(34,211,238,0.18)" : "none"}
                stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="3" fill="currentColor" className={`${futurist ? "animate-pulse" : ""}`}/>
      </svg>
      <span className="pointer-events-none absolute -top-7 py-0.5 px-1.5 rounded-md
                       border border-slate-600 bg-slate-900/80 text-slate-200 text-[10px]
                       opacity-0 group-hover:opacity-100 transition">
        Compact {futurist ? "ON" : "OFF"}
      </span>
    </button>
  );
}
