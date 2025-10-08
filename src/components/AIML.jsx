
import React, {useState} from 'react'

const CARDS = [
  {
    title:"AI/ML — Anomaly Detection",
    bullets:[
      "Streaming metrics → z-score & EWMA thresholds",
      "Outlier surfacing for ops/finance KPIs",
      "Report generator for exec readouts"
    ]
  },
  {
    title:"Data Pipelines — Ingestion → FTS",
    bullets:[
      "CSV/JSON ingestion to SQLite with FTS indexes",
      "Search UI for RFP/Confluence/Slack (stubs)",
      "Schedule-able CLI to refresh datasets"
    ]
  },
  {
    title:"Biomechanics & Robotics",
    bullets:[
      "Pose/kinematics basics; sensor fusion concepts",
      "Control loop simulations & dashboards",
      "Safety/telemetry visualisation"
    ]
  }
]

export default function AIML(){
  const [sel,setSel]=useState(null)
  return (
    <section className="section">
      <h2>AI / ML / DATA — PLUS BIOMECHANICS & ROBOTICS</h2>
      <p className="opacity-70 mb-6">Concept demos you can speak to; click a card for details.</p>
      <div className="grid grid-auto gap-5">
        {CARDS.map(c=>(
          <button key={c.title} onClick={()=>setSel(c)} className="card p-6 text-left hover:shadow-glow transition">
            <div className="text-xl font-semibold">{c.title}</div>
            <div className="mt-2 text-sm opacity-80">Hover to preview, click to dive deeper.</div>
          </button>
        ))}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50" onClick={()=>setSel(null)}>
          <div className="card p-6 w-[92vw] max-w-xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="tracking-widest font-semibold">{sel.title}</h3>
              <button className="btn" onClick={()=>setSel(null)}>Close</button>
            </div>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              {sel.bullets.map((b,i)=>(<li key={i} className="opacity-90">{b}</li>))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
