import React, { useEffect } from "react";

const LINKS = [
  { id: "profile",   label: "PROFILE" },
  { id: "areas",     label: "AREAS" },
  { id: "summary",   label: "SUMMARY" },
  { id: "globe",     label: "GLOBE" },
  { id: "skills",    label: "SKILLS" },
  { id: "projects",  label: "PROJECTS" },
  { id: "ai",        label: "AI / SYSTEMS ENGINEERING" },
  { id: "resume",    label: "RESUME" },
];

export default function NavOverlay({ open, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const go = (id) => {
    window.dispatchEvent(new Event("stats-tooltip:hide"));
    const el = document.getElementById(id);
    if (el) {
      if (!el.dataset.fixedHeightApplied) {
        el.classList.add("min-h-[80dvh]");
        el.dataset.fixedHeightApplied = "1";
      }
      el.style.scrollMarginTop = "84px";
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      <div
        className="card w-[92vw] max-w-md md:max-w-lg rounded-2xl p-5 md:p-6 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <div className="text-sm opacity-60 tracking-widest">MENU</div>
          <button
            className="float-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Centered navigation list */}
        <nav className="flex flex-col gap-2 w-full items-center text-center">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className="w-full text-center px-4 py-3 rounded-lg uppercase tracking-widest text-[13px] md:text-sm
                         transition border border-white/5
                         hover:bg-white/5 hover:shadow-glow focus:outline-none
                         focus:ring-2 focus:ring-teal-400/40"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
