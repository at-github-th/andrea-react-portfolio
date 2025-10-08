import React, { useEffect } from "react";

export default function NavOverlay({ open, onClose }) {
  if (!open) return null;

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  return (
    <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative max-w-md w-[90vw] rounded-2xl bg-slate-900/90 border border-white/10 p-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full px-2 leading-none text-xl border border-white/10 hover:bg-white/10"
        >
          ×
        </button>

        <nav className="space-y-3 text-lg tracking-widest">
          <a href="#profile" onClick={onClose} className="block hover:opacity-80">Profile</a>
          <a href="#areas" onClick={onClose} className="block hover:opacity-80">Areas</a>
          <a href="#summary" onClick={onClose} className="block hover:opacity-80">Summary</a>
          <a href="#projects" onClick={onClose} className="block hover:opacity-80">Projects</a>
          <a href="#skills" onClick={onClose} className="block hover:opacity-80">Skills</a>
          <a href="#ai" onClick={onClose} className="block hover:opacity-80">AI / ML / Data</a>
          <a href="#resume" onClick={onClose} className="block hover:opacity-80">Resume</a>
        </nav>
      </div>
    </div>
  );
}
