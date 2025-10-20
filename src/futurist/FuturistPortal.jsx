import React, { lazy, Suspense } from "react";
import { useMode } from "../context/ModeContext.jsx";
const FuturistLayout = lazy(() => import("./FuturistLayout.jsx"));

export default function FuturistPortal() {
  const { futurist } = useMode();
  if (!futurist) return null;
  return (
    <div className="fixed inset-0 z-[12000] bg-slate-950/90 backdrop-blur">
      <div className="absolute inset-0 overflow-auto p-4 sm:p-6">
        <Suspense fallback={<div className="text-slate-300">Loading…</div>}>
          <FuturistLayout />
        </Suspense>
      </div>
    </div>
  );
}
