
import React, {useState} from 'react'

const PROJECTS = [
  {
    title: "Earthquake Alert Dashboard",
    summary: "Python + APIs to ingest seismic data and render live alerts with map clusters & thresholds.",
    details: [
      "Ingestion from public USGS feeds; de-dupe & severity bucketing",
      "Map clusters with recent quakes, filters by magnitude & time",
      "Email/SMS hooks for >M5.0 threshold (stubbed)"
    ],
    tech: ["Python","Leaflet","REST","SQLite"],
    demo: "A shimmering card animation simulates live updates."
  },
  {
    title: "Python Automation Toolkit (GPT-assisted)",
    summary: "CLI utilities to parse logs, transform CSVs, and generate quick dashboards for POCs.",
    details: [
      "CSV → SQLite loaders with FTS search",
      "Log parsers to extract metrics and error stats",
      "Quick-report HTML generator for exec readouts"
    ],
    tech: ["Python","CLI","SQLite","HTML"],
    demo: "Flip-card interaction shows inputs/outputs."
  },
  {
    title: "ROLLER Middleware PoCs",
    summary: "Adapters for catalog/search, pricing, and content ops; purpose-built to unblock presales.",
    details: [
      "Catalog App: product/feature catalog with status chips and deep links",
      "RFP Search: FTS across docs/slack/confluence (stub connectors)",
      "CFDI 4.0: validation & payload middleware (Mexico)"
    ],
    tech: ["Node","SQLite FTS","Express","SSR"],
    demo: "Cards animate with status glow on hover."
  },
  {
    title: "Aerial Inventory Dashboard",
    summary: "RFID inventory POC with simple floor map and live tag scans.",
    details: [
      "Floor plan view with section counts",
      "Tag scan list and simple filters",
      "Export CSV of deltas by zone"
    ],
    tech: ["React","Vite","RFID"],
    demo: "Subtle shimmer hints at live updates."
  }
]

export default function Projects(){
  const [sel, setSel] = useState(null)
  return (
    <section id="projects" className="section">
      <h2>PROJECTS & VIDEOS</h2>
      <p className="opacity-70 mb-6">Portfolio POCs and tools. Click a card to learn more.</p>
      <div className="grid grid-auto gap-5">
        {PROJECTS.map((p,i)=>(
          <button key={i} onClick={()=>setSel(p)} className="card p-4 text-left group relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none"
                 style={{background:"linear-gradient(120deg, transparent 0%, rgba(88,243,222,.15) 30%, transparent 60%)", transform:"skewX(-15deg)"}}/>
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p className="text-sm opacity-80 mt-1">{p.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tech?.map(t=> <span key={t} className="badge">{t}</span>)}
            </div>
            <div className="mt-3 text-xs opacity-70">{p.demo}</div>
          </button>
        ))}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50" onClick={()=>setSel(null)}>
          <div className="card p-6 max-w-2xl w-[92vw]" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="tracking-widest font-semibold">{sel.title}</h3>
              <button className="btn" onClick={()=>setSel(null)}>Close</button>
            </div>
            <p className="mt-3 opacity-90">{sel.summary}</p>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              {sel.details.map((d,idx)=>(<li key={idx} className="opacity-90">{d}</li>))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {sel.tech.map(t => <span key={t} className="badge">{t}</span>)}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
