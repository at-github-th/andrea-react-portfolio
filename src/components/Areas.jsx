import React, { useState } from "react";
import MiniDonut from "./MiniDonut.jsx";

const sections = [
  {
    title: "Client Management",
    metrics: [
      { label: "Discovery", percent: 85 },
      { label: "Workshops", percent: 80 },
      { label: "Stakeholders", percent: 78 }
    ]
  },
  {
    title: "Networking",
    metrics: [
      { label: "Infra", percent: 70 },
      { label: "Security", percent: 65 },
      { label: "SRE", percent: 60 }
    ]
  },
  {
    title: "Web Competence",
    metrics: [
      { label: "React", percent: 75 },
      { label: "Node", percent: 70 },
      { label: "APIs", percent: 72 },
      { label: "Vite", percent: 68 }
    ]
  },
  {
    title: "Systems",
    metrics: [
      { label: "macOS", percent: 90 },
      { label: "Windows", percent: 80 },
      { label: "Linux", percent: 80 },
      { label: "iOS", percent: 60 },
      { label: "Android", percent: 60 }
    ]
  }
];

export default function Areas(){
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {sections.map((s, i) => (
        <div key={s.title} className="card">
          <button
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={()=>setOpen(open===i?null:i)}
          >
            <span className="tracking-widest">{s.title.toUpperCase()}</span>
            <span className="opacity-70">{open===i ? "–" : "+"}</span>
          </button>
          {open===i && (
            <div className="px-4 pb-4">
              <div className="donut-grid">
                {s.metrics.map(m => <MiniDonut key={m.label} label={m.label} percent={m.percent} />)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
