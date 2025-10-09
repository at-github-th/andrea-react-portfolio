import React, { useState } from "react";
import MiniRing from "./MiniRing.jsx";

const AREAS = [
  {
    title: "Client Management",
    metrics: [
      { label: "Discovery", value: 85 },
      { label: "Workshops", value: 80 },
      { label: "Roadmaps", value: 72 },
      { label: "Success", value: 88 },
      { label: "Enablement", value: 76 },
      { label: "Contracts", value: 64 },
    ],
  },
  {
    title: "Networking",
    metrics: [
      { label: "Routing", value: 70 },
      { label: "Security", value: 65 },
      { label: "Cloud", value: 60 },
      { label: "CDN", value: 55 },
      { label: "DNS", value: 75 },
      { label: "SASE", value: 58 },
    ],
  },
  {
    title: "Web Competence",
    metrics: [
      { label: "React", value: 78 },
      { label: "Node", value: 72 },
      { label: "SQL", value: 68 },
      { label: "APIs", value: 74 },
      { label: "Testing", value: 62 },
      { label: "DevOps", value: 59 },
    ],
  },
  {
    title: "Systems",
    metrics: [
      { label: "macOS", value: 90 },
      { label: "Linux", value: 80 },
      { label: "Windows", value: 78 },
      { label: "iOS", value: 60 },
      { label: "Android", value: 60 },
      { label: "RFID", value: 55 },
    ],
  },
];

export default function Areas() {
  const [open, setOpen] = useState(null);

  return (
    <div id="areas-accordion" className="space-y-3">
      {AREAS.map((a, idx) => {
        const expanded = open === idx;
        return (
          <div key={a.title} className="card overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : idx)}
            >
              <span className="tracking-widest">{a.title}</span>
              <span className="badge">{expanded ? "–" : "+"}</span>
            </button>

            {expanded && (
              <div className="px-4 pb-5">
                <div className="areas-grid">
                  {a.metrics.map((m) => (
                    <MiniRing key={m.label} label={m.label} value={m.value} />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
