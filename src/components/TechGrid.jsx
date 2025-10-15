import React, { useState } from "react";
import Modal from "./Modal.jsx"; // uses your existing modal

const techs = [
  {
    key: "js",
    name: "JavaScript",
    blurb: "UI behavior, data viz, and client integrations.",
    bullets: [
      "Built interactive charts, maps, and accordions.",
      "Wired SDKs and browser-side auth flows.",
      "Optimized bundles and HMR dev flow."
    ],
    snippet: `export function sum(a,b){ return a + b }`
  },
  {
    key: "py",
    name: "Python",
    blurb: "APIs, ETL, dashboards, and quick POCs.",
    bullets: [
      "Fast Flask/FastAPI services for POCs.",
      "CSV → SQLite/Parquet ingestion tooling.",
      "Automations for client demos and alerts."
    ],
    snippet: `from fastapi import FastAPI\napp = FastAPI()\n@app.get("/ping")\ndef ping():\n    return {"ok": True}`
  },
  {
    key: "sql",
    name: "SQL",
    blurb: "Reporting, Looker models, and operational queries.",
    bullets: [
      "Modeled marts and KPI rollups.",
      "Wrote parameterized analytics queries.",
      "Helped clients trace performance issues."
    ],
    snippet: `SELECT date_trunc('day', ts) d, count(*) c\nFROM events\nGROUP BY 1\nORDER BY 1;`
  },
  {
    key: "react",
    name: "React",
    blurb: "Component systems, routing, charts, and forms.",
    bullets: [
      "Built reusable cards, accordions, and modals.",
      "Integrated ECharts/Leaflet/Recharts.",
      "Clean Tailwind + accessible interactions."
    ],
    snippet: `export default function Badge({children}){\n  return <span className="px-2 py-1 rounded bg-white/10">{children}</span>\n}`
  },
  {
    key: "node",
    name: "Node",
    blurb: "Contact mailers, proxies, and rate-limited endpoints.",
    bullets: [
      "Express + zod validation + helmet/cors.",
      "Nodemailer SMTP integrations (app passwords).",
      "Token verification for anti-bot gates."
    ],
    snippet: `app.post("/contact", validate(schema), async (req,res)=>{ /* ... */ })`
  },
  {
    key: "swift",
    name: "Swift",
    blurb: "Prototyped native UI + Bluetooth/RFID demos.",
    bullets: [
      "Built small iOS utilities for field tests.",
      "Bridged REST/JSON to device APIs.",
      "Handoff flows between web and native."
    ],
    snippet: `struct Hello: View { var body: some View { Text("Hi!") } }`
  }
];

export default function TechGrid(){
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);

  const openModal = (t)=>{ setSel(t); setOpen(true); };
  const closeModal = ()=>{ setOpen(false); setSel(null); };

  return (
    <div className="space-y-4">
      <div className="tech-grid">
        {techs.map(t=>(
          <button
            key={t.key}
            type="button"
            onClick={()=>openModal(t)}
            className="tech-card"
            aria-label={`Open details for ${t.name}`}
          >
            <div className="tech-title">{t.name}</div>
            <div className="tech-blurb">{t.blurb}</div>
          </button>
        ))}
      </div>

      <Modal open={open} onClose={closeModal} title={sel?.name || "Details"}>
        {sel && (
          <div className="space-y-4">
            <p className="opacity-80">{sel.blurb}</p>
            <ul className="list-disc pl-5 space-y-1">
              {sel.bullets.map((b,i)=><li key={i}>{b}</li>)}
            </ul>
            {sel.snippet && (
              <pre className="mt-3 p-3 rounded bg-white/5 overflow-x-auto text-xs">
{sel.snippet}
              </pre>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
