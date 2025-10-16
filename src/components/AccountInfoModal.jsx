import React from "react";
import Modal from "./Modal.jsx";
export default function AccountInfoModal({open,onClose,account}){
  if(!open || !account) return null;
  return (
    <Modal open={open} onClose={onClose} title={account.name}>
      <div className="space-y-1">
        <div className="opacity-80 text-sm">{account.country}</div>
        <div className="opacity-80 text-sm"><em>{account.focus}</em></div>
      </div>
    </Modal>
  );
}
