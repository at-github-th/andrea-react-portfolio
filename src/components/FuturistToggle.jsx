import { useMode } from "../context/ModeContext";
export default function FuturistToggle(){
  const { futurist, setFuturist } = useMode();
  return (
    <button
      onClick={()=>setFuturist(v=>!v)}
      className={`fixed right-4 top-4 z-50 px-3 py-1 rounded-full border backdrop-blur ${futurist ? "border-cyan-400 text-cyan-300 shadow-neon" : "border-slate-600 text-slate-300"} hover:shadow-neon transition`}
      aria-pressed={futurist}
      title="Toggle Futurist Mode"
    >
      {futurist ? "Futurist: ON" : "Futurist: OFF"}
    </button>
  );
}
