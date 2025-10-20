import React from "react";
import { Home, Mail, Menu } from "lucide-react";

export default function FloatUI({ onOpenMenu, onMenu, onOpenContact, onContact }) {
  const openMenu = onOpenMenu || onMenu || (() => {});
  const openContact = onOpenContact || onContact || (() => {});
  return (
    <>
      {/* Home – top-left */}
      <button
        title="Home"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed left-3 top-3 z-[10000] rounded-full p-2 border border-white/10 bg-slate-900/70 hover:bg-white/10 backdrop-blur shadow-lg"
      >
        <Home className="w-5 h-5" />
      </button>

      {/* Menu – top-right */}
      <button
        title="Menu"
        onClick={openMenu}
        className="fixed right-3 top-3 z-[10000] rounded-full p-2 border border-white/10 bg-slate-900/70 hover:bg-white/10 backdrop-blur shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Contact – bottom-right */}
      <button
        title="Contact"
        onClick={openContact}
        className="fixed right-3 bottom-3 z-[11000] rounded-full p-2 border border-teal-400/40 bg-slate-900/80 hover:bg-slate-900/70 backdrop-blur shadow-lg"
      >
        <div className="grid place-items-center w-5 h-5"><Mail className="w-5 h-5" /></div>
      </button>
    </>
  );
}
