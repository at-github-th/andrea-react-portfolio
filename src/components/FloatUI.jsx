import React from "react";
import { Home, Mail, Menu } from "lucide-react";

export default function FloatUI({ onMenu, onContact }) {
  return (
    <>
      <button
        title="Home"
        onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        className="fixed left-4 top-4 z-50 rounded-full p-2 border border-white/10 bg-slate-900/70 hover:bg-white/10 backdrop-blur shadow-lg"
      >
        <Home className="w-5 h-5" />
      </button>

      <button
        title="Menu"
        onClick={onMenu}
        className="fixed right-4 top-4 z-50 rounded-full p-2 border border-white/10 bg-slate-900/70 hover:bg-white/10 backdrop-blur shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <button
        title="Contact"
        onClick={onContact}
        className="fixed right-4 bottom-4 z-50 rounded-full px-3 py-2 border border-teal-400/30 bg-slate-900/70 hover:bg-teal-400/10 backdrop-blur shadow-lg"
      >
        <span className="inline-flex items-center gap-2">
          <Mail className="w-5 h-5" />
          <span className="text-sm tracking-widest">Contact</span>
        </span>
      </button>
    </>
  );
}
