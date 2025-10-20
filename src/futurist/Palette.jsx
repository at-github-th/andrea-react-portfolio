import React from "react";

export default function Palette({ open, selection, onClose, onRun }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[13000] grid place-items-center bg-black/40">
      <div className="w-[min(92vw,560px)] rounded-2xl border border-white/15 bg-slate-900/95 shadow-2xl">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="text-sm opacity-80">Command Palette</div>
          <button onClick={onClose} className="px-2 py-1 rounded hover:bg-white/5">Close</button>
        </div>
        <div className="p-4 space-y-3">
          <div className="text-xs opacity-70">Selection: {String(selection || "node")}</div>
          <div className="grid gap-2">
            <button onClick={() => onRun("summarize")} className="text-left px-3 py-2 rounded border border-white/10 hover:bg-white/5">Summarize</button>
            <button onClick={() => onRun("breakdown")} className="text-left px-3 py-2 rounded border border-white/10 hover:bg-white/5">Break down tasks</button>
            <button onClick={() => onRun("risks")} className="text-left px-3 py-2 rounded border border-white/10 hover:bg-white/5">Surface risks</button>
          </div>
        </div>
      </div>
    </div>
  );
}
