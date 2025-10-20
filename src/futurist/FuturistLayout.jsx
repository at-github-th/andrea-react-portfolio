import React, { useState } from "react";
import { useMode } from "../context/ModeContext.jsx";
import SkillOrbit from "../components/SkillOrbit.jsx";
import Palette from "./Palette.jsx";

export default function FuturistLayout() {
  const { compact, toggle } = useMode();
  const [selection, setSelection] = useState(null);

  if (!compact) return null;

  return (
    <div
      className="fixed inset-0 z-[12000] grid grid-rows-[auto,1fr] bg-gradient-to-b from-slate-950/95 to-slate-900/95 backdrop-blur"
      role="dialog"
      aria-label="System Map"
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="text-xs tracking-[0.25em] uppercase opacity-70">System Map</div>
        <button
          onClick={toggle}
          className="rounded-full px-3 py-1.5 text-sm border border-white/15 hover:bg-white/5"
          aria-label="Exit compact"
          title="Exit (Esc)"
        >
          Exit
        </button>
      </div>

      {/* content */}
      <div className="relative overflow-auto">
        <div className="mx-auto max-w-4xl p-6">
          {/* reuse your orbit as the interactive diagram */}
          <SkillOrbit />
          <div className="mt-6 text-center text-sm opacity-70">
            Click nodes to open the palette. Press <kbd>Esc</kbd> or “Exit” to return.
          </div>
        </div>

        {/* palette */}
        <Palette
          open={!!selection}
          selection={selection}
          onClose={() => setSelection(null)}
          onRun={(cmd) => {
            // do something with cmd+selection; for now, just close
            setSelection(null);
          }}
        />
      </div>
    </div>
  );
}
