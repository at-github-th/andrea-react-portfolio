import { useMode } from "../context/ModeContext";
export default function FuturistToggle(){
  const { futurist, setFuturist } = useMode();
  return (
    <button
      onClick={()=>setFuturist(v=>!v)}
      aria-pressed={futurist}
      className={`fixed right-12 top-6 z-50 px-3 py-1 rounded-full border backdrop-blur ${futurist?"border-cyan-400 text-cyan-300":"border-slate-600 text-slate-300"} hover:shadow-neon transition`}
    >
      {futurist ? "Compact: ON" : "Compact: OFF"}
    </button>
  );
}
