import React from "react";
import { useMode } from "../context/ModeContext";
import { Mail, Home, Menu, Minimize2 } from "lucide-react";
const Btn = ({ onClick, href, children, aria }) => {
  const C = href ? "a" : "button";
  const props = href ? { href } : { onClick };
  return (
    <C
      {...props}
      aria-label={aria}
      className="corner-btn grid place-items-center w-12 h-12 rounded-full border border-white/15 bg-slate-900/80 backdrop-blur shadow-lg hover:bg-slate-800/80 focus:outline-none"
    >
      {children}
    </C>
  );
};
export default function CornerButtons() {
  const { compact, toggle } = useMode();
  return (
    <div className="fixed left-4 bottom-4 z-[10000] flex flex-col gap-3 sm:left-6 sm:bottom-6">
      <Btn aria="Home" href="#top"><Home size={20} /></Btn>
      <Btn aria="Menu" href="#menu"><Menu size={20} /></Btn>
      <Btn aria="Contact" href="#contact"><Mail size={20} /></Btn>
      <Btn aria="Toggle compact" onClick={toggle}><Minimize2 size={20} /></Btn>
    </div>
  );
}
