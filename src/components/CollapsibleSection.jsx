// src/components/CollapsibleSection.jsx
import React, { useState, useEffect } from "react";

export default function CollapsibleSection({ id, title, defaultOpen = false, children }) {
  const key = `sect:${id}:open`;
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const saved = sessionStorage.getItem(key);
    if (saved !== null) setOpen(saved === "1");
  }, [key]);

  const toggle = () => {
    const v = !open;
    setOpen(v);
    sessionStorage.setItem(key, v ? "1" : "0");
  };

  return (
    <section id={id} className="section">
      <button
        type="button"
        onClick={toggle}
        className="relative w-full px-5 py-4 rounded-xl border border-white/10
                   bg-white/0 hover:bg-white/5 transition hover:shadow-glow
                   focus:outline-none focus:ring-2 focus:ring-teal-400/40"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
      >
        <span className="block w-full text-center uppercase tracking-widest text-sm md:text-base">
          {title}
        </span>
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center
                     w-8 h-8 rounded-lg border border-white/10 bg-white/0 hover:bg-white/10 transition"
          aria-hidden="true"
        >
          {open ? "–" : "+"}
        </span>
      </button>

      <div
        id={`${id}-panel`}
        data-open={open ? "1" : "0"}
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-out
                   [grid-template-rows:0fr] data-[open='1']:[grid-template-rows:1fr]"
      >
        <div className="overflow-hidden">
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </section>
  );
}
