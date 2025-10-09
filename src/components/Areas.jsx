import React, { useState } from "react";
import MiniDonut from "./MiniDonut.jsx";

const DATA = [
  {
    title: "Client Management",
    items: [
      { label: "Workshops", value: 92 },
      { label: "Discovery", value: 88 },
      { label: "Stakeholders", value: 86 },
      { label: "Enablement", value: 84 },
      { label: "Success KPIs", value: 80 },
      { label: "Comms", value: 90 },
    ],
  },
  {
    title: "Solutions Engineering",
    items: [
      { label: "Integrations", value: 90 },
      { label: "APIs/SDKs", value: 88 },
      { label: "PoCs", value: 86 },
      { label: "Demos", value: 84 },
      { label: "Docs", value: 82 },
      { label: "Security", value: 78 },
    ],
  },
  {
    title: "Development",
    items: [
      { label: "Front End", value: 82 },
      { label: "Back End", value: 76 },
      { label: "Data", value: 72 },
      { label: "Testing", value: 78 },
      { label: "DevOps", value: 68 },
      { label: "Perf", value: 70 },
    ],
  },
];

export default function Areas(){
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {DATA.map((sec, i)=>(
        <div key={sec.title} className="card rounded-xl p-4">
          <button
            type="button"
            aria-expanded={open===i}
            onClick={()=>setOpen(open===i?null:i)}
            className="w-full flex items-center justify-between gap-3 text-left"
          >
            <span className="text-lg tracking-wider">{sec.title}</span>
            <span className="badge">{open===i? "−" : "+"}</span>
          </button>

          {open===i && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4 animate-in fade-in slide-in-from-top-2">
              {sec.items.map((it, idx)=>(
                <div style={{animationDelay:`${idx*40}ms`}} key={it.label}>
                  <MiniDonut value={it.value} label={it.label} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
