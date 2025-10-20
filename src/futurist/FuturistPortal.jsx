import React from "react";
import { useMode } from "../context/ModeContext.jsx";
import FuturistLayout from "./FuturistLayout.jsx";

export default function FuturistPortal() {
  const { futurist } = useMode();
  if (!futurist) return null;
  return (
    <div className="fixed inset-0 z-[12000] bg-slate-950/90 backdrop-blur">
      <div className="absolute inset-0 overflow-auto p-4 sm:p-6">
        <FuturistLayout />
      </div>
    </div>
  );
}
