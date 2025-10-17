// src/components/NavOverlay.jsx
import React, { useEffect } from "react";

export default function NavOverlay({ open, onClose }) {
  // Order matches the new button sections
  const items = [
    { id: "profile",     label: "PROFILE" },
    { id: "stats",       label: "STATS" },
    { id: "sales",       label: "SALES" },
    { id: "skills",      label: "SKILLS" },
    { id: "engineering", label: "ENGINEERING" },
    { id: "finance",     label: "FINANCE" },
    { id: "software",    label: "SOFTWARE" },
    { id: "resume",      label: "RESUME" },
  ];

  const go = (id) => {
    onClose?.();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Esc to close (only when open)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // lock/unlock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 transition
                  ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      aria-hidden={!open}
    >
      {open && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity opacity-100"
            onClick={onClose}
            aria-label="Close menu"
          />
          {/* Dialog */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[90vw] max-w-lg rounded-2xl border border-white/10
                       bg-[#0b1220]/90 shadow-[0_0_120px_#1eead522] scale-100 opacity-100"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}  /* keep clicks from closing */
          >
            <div className="p-5 border-b border-white/10 relative">
              <div className="text-xs tracking-[0.35em] opacity-70 text-center">MENU</div>
              <button
                onClick={onClose}
                className="absolute right-3 top-3 w-8 h-8 rounded-lg border border-white/10
                           hover:bg-white/10 transition"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-4 flex flex-col items-center gap-3">
              {items.map((it) => (
                <button
                  key={it.id}
                  onClick={() => go(it.id)}
                  className="w-full max-w-md px-5 py-4 rounded-xl border border-white/10
                             bg-white/[0.02] hover:bg-white/[0.06] hover:shadow-glow
                             transition text-center tracking-widest text-sm"
                >
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
