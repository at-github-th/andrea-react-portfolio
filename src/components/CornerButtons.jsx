import React from "react";
import { useMode } from "../context/ModeContext";
import { Mail, Home, Menu, Minimize2 } from "lucide-react";

const Btn = ({ onClick, href, aria, children }) => {
  const C = href ? "a" : "button";
  const props = href ? { href } : { onClick };
  return (
    <C
      {...props}
      aria-label={aria}
      className="corner-btn grid place-items-center rounded-full border border-white/15 bg-slate-900/80 backdrop-blur shadow-lg hover:bg-slate-800/80 focus:outline-none w-10 h-10 sm:w-11 sm:h-11"
    >
      {children}
    </C>
  );
};

export default function CornerButtons() {
  const m = useMode?.() || {};
  const t = m.toggleCompact || m.toggle || (() => {});
  return (
    <div className="corner-group fixed left-4 bottom-4 sm:left-6 sm:bottom-6 z-[10000] flex flex-col gap-3">
      <Btn aria="Home" href="#top"><Home size={18} /></Btn>
      <Btn aria="Menu" href="#menu"><Menu size={18} /></Btn>
      <Btn aria="Contact" href="#contact"><Mail size={18} /></Btn>
      <Btn aria="Toggle compact" onClick={t}><Minimize2 size={18} /></Btn>
    </div>
  );
}
