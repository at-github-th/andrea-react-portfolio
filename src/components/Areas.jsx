// src/components/Areas.jsx
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
    title: "Architecture",
    metrics: [
      { label: "Integration Maps", value: 78 },
      { label: "Event-Driven", value: 74 },
      { label: "Boundary Design", value: 72 },
      { label: "Security by Design", value: 73 },
      { label: "Scalability", value: 70 },
      { label: "Resilience", value: 69 },
    ],
  },
  {
    title: "Core Computing",
    metrics: [
      { label: "Service Mesh", value: 78 },
      { label: "API Gateways", value: 74 },
      { label: "Identity & IAM", value: 72 },
      { label: "Observability", value: 71 },
      { label: "Infra as Code", value: 69 },
      { label: "Edge & IoT", value: 66 },
    ],
  },
  {
    title: "Product",
    metrics: [
      { label: "Roadmaps", value: 82 },
      { label: "Discovery → MVP", value: 80 },
      { label: "GTM Alignment", value: 76 },
      { label: "Analytics / OKRs", value: 74 },
      { label: "Enablement Docs", value: 72 },
      { label: "Feedback Loops", value: 70 },
    ],
  },
];

export default function Areas() {
  const [open, setOpen] = useState(null);

  return (
    <div id="areas-accordion" className="space-y-3 flex flex-col items-center">
      {AREAS.map((a, idx) => {
        const expanded = open === idx;
        return (
          <div key={a.title} className="card overflow-hidden w-full max-w-2xl">
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : idx)}
            >
              <span className="tracking-widest text-center">{a.title}</span>
              <span className="badge ml-2">{expanded ? "–" : "+"}</span>
            </button>

            {expanded && (
              <div className="px-4 pb-5 flex justify-center">
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
