import React from "react";
import Modal from "./Modal.jsx";
export default function AccountListModal({open,onClose,country,items}){
  if(!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={country}>
      <div className="space-y-2">
        {items.map((a,i)=>(
          <button key={i} className="card w-full text-left p-3"
            onClick={()=>{ window.dispatchEvent(new CustomEvent("focus-account",{detail:{ name:a.name }})); onClose(); }}>
            <div className="font-semibold">{a.name}</div>
            <div className="opacity-70 text-xs">{a.focus}</div>
          </button>
        ))}
      </div>
    </Modal>
  );
}
