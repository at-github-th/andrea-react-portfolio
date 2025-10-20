import React from "react";
import SpatialGrid from "./SpatialGrid.jsx";
export default function SystemMap(){
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="absolute inset-0 opacity-60">
        <SpatialGrid />
      </div>
      <div className="relative grid grid-cols-3 gap-6 py-16">
        <div className="col-span-3 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-slate-900/70 backdrop-blur">System Map</div>
        </div>
        <div className="justify-self-start self-start px-3 py-2 rounded-lg border border-white/15 bg-slate-900/70">Data</div>
        <div className="justify-self-center self-start px-3 py-2 rounded-lg border border-white/15 bg-slate-900/70">Compute</div>
        <div className="justify-self-end self-start px-3 py-2 rounded-lg border border-white/15 bg-slate-900/70">UX</div>
        <div className="col-span-3 justify-self-center px-3 py-2 rounded-lg border border-white/15 bg-slate-900/70">Integration</div>
      </div>
    </div>
  );
}
