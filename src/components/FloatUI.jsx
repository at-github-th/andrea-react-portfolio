import React from "react";
import { Home, Mail, Menu } from "lucide-react";

export default function FloatUI({ onOpenMenu, onOpenContact }){
  return (
    <>
      <button
        aria-label="Home"
        onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        className="float-btn fixed left-3 top-3 z-50 p-2"
      >
        <Home className="w-5 h-5" />
      </button>

      <button
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="float-btn fixed right-3 top-3 z-50 p-2"
      >
        <Menu className="w-5 h-5" />
      </button>

      <button
        aria-label="Open contact"
        onClick={onOpenContact}
        className="float-btn fixed right-3 bottom-3 z-50 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          <span className="text-sm">Contact</span>
        </div>
      </button>
    </>
  );
}
