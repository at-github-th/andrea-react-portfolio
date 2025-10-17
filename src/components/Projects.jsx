// src/components/Projects.jsx
import React, { useState } from "react";

const GITHUB = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.78-1.34-1.78-1.1-.76.08-.75.08-.75 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.32 3.52 1.01.11-.79.42-1.32.76-1.62-2.67-.3-5.48-1.34-5.48-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.51.12-3.15 0 0 1.01-.32 3.3 1.23a11.48 11.48 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.64.25 2.85.12 3.15.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z"/>
  </svg>
);

const PROJECTS = [
  {
    id: "eq-alert",
    title: "Earthquake Alert Dashboard",
    blurb:
      "Python + APIs to ingest seismic data and render live alerts with map clusters & thresholds.",
    tags: ["Python", "Leaflet", "REST", "SQLite"],
    repo: "https://github.com/andreatempestini/earthquake-alert-dashboard",
  },
  {
    id: "python-toolkit",
    title: "Python Automation Toolkit (GPT-assisted)",
    blurb:
      "CLI utilities to parse logs, transform CSVs, and generate quick dashboards for POCs.",
    tags: ["Python", "CLI", "SQLite", "HTML"],
    repo: "https://github.com/andreatempestini/python-automation-toolkit",
  },
  {
    id: "roller-mw",
    title: "ROLLER Middleware PoCs",
    blurb:
      "Adapters for catalog/search, pricing, and content ops; purpose-built to unblock presales.",
    tags: ["Node", "SQLite FTS", "Express", "SSR"],
    repo: "https://github.com/andreatempestini/roller-middleware-pocs",
  },
  {
    id: "aerial-inventory",
    title: "Aerial Inventory Dashboard",
    blurb: "RFID inventory POC with a floor map and live tag scans.",
    tags: ["React", "Vite", "RFID"],
    repo: "https://github.com/andreatempestini/aerial-inventory-dashboard",
  },
];

export default function Projects() {
  const [open, setOpen] = useState(null);

  return (
    <section className="section" id="projects">
      <h2>FINANCIAL PROJECTS</h2>
      <p className="opacity-70 mb-6">Portfolio POCs and tools. Click a card to learn more.</p>

      <div className="grid grid-auto gap-5">
        {PROJECTS.map((p) => (
          <button
            key={p.id}
            onClick={() => setOpen(p)}
            className="card p-4 text-left rounded-xl transition hover:translate-y-[-2px]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{p.title}</div>
                <p className="opacity-80 text-sm mt-1">{p.blurb}</p>
              </div>
              <span className="float-btn px-2 py-1 text-xs opacity-80">Open</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {p.tags.map((t, i) => (
                <span key={i} className="badge">{t}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50"
          onClick={() => setOpen(null)}
        >
          <div
            className="card p-6 w-[92vw] max-w-2xl rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xl font-semibold">{open.title}</div>
                <p className="opacity-80 text-sm mt-1">{open.blurb}</p>
              </div>
              <a
                href={open.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn flex items-center gap-2"
                title="View on GitHub"
              >
                <GITHUB />
                <span className="text-sm">GitHub</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {open.tags.map((t, i) => (
                <span key={i} className="badge">{t}</span>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button className="btn" onClick={() => setOpen(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
