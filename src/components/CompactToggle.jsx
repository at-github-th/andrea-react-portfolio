import React, { useEffect } from "react";
import { useMode } from "../context/ModeContext";
export default function CompactToggle() {
  const { compact, toggle } = useMode();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && compact) toggle(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compact, toggle]);
  return (
    <button
      type="button"
      aria-pressed={compact}
      aria-label="Toggle compact mode"
      title={compact ? "Exit compact (Esc)" : "Enter compact (Esc)"}
      onClick={toggle}
      className={
        "fixed z-[10000] right-3 top-3 md:right-4 md:top-4 corner-fab " +
        "grid place-items-center rounded-full p-2 border bg-slate-900/80 " +
        "border-white/15 backdrop-blur hover:bg-slate-800/80 shadow-lg"
      }
    >
      <span className="sr-only">Compact mode</span>
      <div className="w-5 h-5 relative">
        {compact ? (
          <>
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/90 rounded" />
            <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-white/90 rounded" />
          </>
        ) : (
          <>
            <span className="absolute left-0 right-0 top-0 h-[2px] rotate-45 origin-center bg-white/90 rounded" />
            <span className="absolute left-0 right-0 top-0 h-[2px] -rotate-45 origin-center bg-white/90 rounded" />
          </>
        )}
      </div>
    </button>
  );
}
