import { useEffect } from "react";
import { useMode } from "../context/ModeContext.jsx";

export default function FuturistToggle() {
  const { compact, toggle } = useMode();

  // ESC closes compact
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && compact) toggle(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compact, toggle]);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle compact mode"
      className={"fixed z-[10001] left-4 bottom-4 md:left-6 md:bottom-6 grid place-items-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-800/90 border border-white/15 backdrop-blur shadow-lg hover:bg-slate-800/80"}
    >
      <span className="sr-only">Compact mode</span>
      {/* simple equal/close glyph */}
      <div className="w-5 h-5 relative">
        <span className="absolute inset-x-0 top-1/3 h-[2px] bg-white/90 rounded" />
        <span className="absolute inset-x-0 bottom-1/3 h-[2px] bg-white/90 rounded" />
      </div>
    </button>
  );
}
