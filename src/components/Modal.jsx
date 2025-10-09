import React, { useEffect } from "react";
export default function Modal({ open, onClose, title, children }) {
  useEffect(()=>{ if(!open)return; const k=e=>e.key==="Escape"&&onClose?.(); window.addEventListener("keydown",k); return()=>window.removeEventListener("keydown",k); },[open,onClose]);
  if(!open) return null;
  return (
    <div className="modal-overlay" onClick={(e)=>{ if(e.target===e.currentTarget) onClose?.(); }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-label={title||"Details"}>
        <div className="modal-head"><h3>{title}</h3><button className="modal-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
