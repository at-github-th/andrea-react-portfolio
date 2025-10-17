// src/components/TechGrid.jsx
import React, { useState, useEffect } from "react";

const TECH = [
  {
    id: "js",
    name: "JavaScript",
    blurb: "UI behavior, data viz, and client integrations.",
    tags: ["ES202x", "Charts", "Integrations"],
    details: [
      "Interactive UI states and component logic.",
      "Small data-viz (SVG/Canvas) and dashboard glue code.",
      "Browser SDKs & embed scripts for analytics/payments.",
    ],
  },
  {
    id: "py",
    name: "Python",
    blurb: "APIs, ETL, dashboards, and quick POCs.",
    tags: ["FastAPI", "Pandas", "CLI"],
    details: [
      "FastAPI services and simple workers/cron jobs.",
      "ETL: CSV/JSON ingestion → SQLite/Postgres.",
      "One-off scripts/CLIs to explore data & ship POCs fast.",
    ],
  },
  {
    id: "sql",
    name: "SQL",
    blurb: "Reporting, Looker models, and operational queries.",
    tags: ["Postgres", "SQLite", "Looker"],
    details: [
      "Analytical queries & KPI views, indexed for speed.",
      "SQLite for portable POCs; Postgres in production.",
      "Modeling for BI tools, reconciliation & ops checks.",
    ],
  },
  {
    id: "react",
    name: "React",
    blurb: "Component systems, routing, charts, and forms.",
    tags: ["Hooks", "Vite", "R3F"],
    details: [
      "Design-system components & state via hooks/context.",
      "Routing, form flows, validation, and accessibility.",
      "Charts and small 3D previews (R3F) for demos.",
    ],
  },
  {
    id: "node",
    name: "Node",
    blurb: "Contact mailers, proxies, and rate-limited endpoints.",
    tags: ["Express", "SSR", "Queues"],
    details: [
      "Thin API gateways & server-side helpers/SSR.",
      "Webhook relays, auth middleware, and rate limits.",
      "Mailers, task queues, and integration shims.",
    ],
  },
  {
    id: "swift",
    name: "Swift",
    blurb: "Prototyped native UI + Bluetooth/RFID demos.",
    tags: ["SwiftUI", "BLE", "Prototyping"],
    details: [
      "SwiftUI prototypes with clean, responsive layouts.",
      "BLE/RFID scanning demos, simple device control.",
      "Showcase apps for field trials & stakeholder demos.",
    ],
  },
];

export default function TechGrid() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="section">
      {/* 🔥 Strictly narrower than AI */}
      <div className="mx-auto w-full max-w-[500px] lg:max-w-[500px]">
        <h2>SOFTWARE</h2>
        <p className="opacity-70 mb-6">
          Core programming languages and frameworks I use to build, integrate, and ship solutions.
        </p>

        <div className="grid grid-auto gap-5">
          {TECH.map((t) => (
            <button
              key={t.id}
              onClick={() => setOpen(t)}
              className="card p-6 text-left rounded-xl transition hover:translate-y-[-2px] min-h-[112px] focus:outline-none focus:ring-2 focus:ring-teal-400/40"
              aria-label={`Open details for ${t.name}`}
            >
              <div className="text-lg font-semibold">{t.name}</div>
              <div className="mt-2 text-sm opacity-80">{t.blurb}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                {t.tags.map((tag, i) => (
                  <span key={i} className="badge">
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${open.name} usage details`}
        >
          <div
            className="card p-6 w-[92vw] max-w-xl rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xl font-semibold">{open.name}</div>
                <p className="opacity-80 text-sm mt-1">{open.blurb}</p>
              </div>
              <button className="btn" onClick={() => setOpen(null)} aria-label="Close">
                Close
              </button>
            </div>

            <div className="mt-4">
              <div className="text-sm opacity-80 mb-2">Where I use it</div>
              <ul className="space-y-2 list-disc pl-5">
                {open.details.map((d, i) => (
                  <li key={i} className="opacity-90">
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {open.tags.map((t, i) => (
                <span key={i} className="badge">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
