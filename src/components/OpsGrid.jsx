// src/components/Skills.jsx
import React, { useState } from 'react'

const OPS = [
  {
    id: 'backend',
    title: 'BACKEND',
    sub: 'BACKEND & DATA ENGINEERING',
    content: `
APIs & Integrations:
REST/GraphQL design · versioning · pagination · resilient error contracts
Data Workflows:
ETL/ELT · webhooks/events · idempotency · retries · observability
Security:
OAuth2/OIDC · JWT/HMAC · RBAC/ABAC · rate limits
Tooling:
Node.js · Python · Postman · SQLite/Postgres · GitHub Actions
Output:
JSON/CSV · SDKs · integration playbooks
`.trim()
  },
  {
    id: 'frontend',
    title: 'FRONT END',
    sub: 'FRONTEND & UI ENGINEERING',
    content: `
Apps:
React SPA wiring · state via hooks/context · clean component APIs
UI Systems:
Tailwind · accessibility · responsive layouts · modal/dialog UX
Data Viz:
Executive dashboards · charts/KPIs · narrative metrics
Demo Craft:
Click-path storyboards · PoC scaffolds · product-like polish
`.trim()
  },
  {
    id: 'solutions',
    title: 'ARCHITECTURE',
    sub: 'SOLUTIONS ARCHITECTURE & PRESALES',
    content: `
Discovery → Value:
Stakeholder goals → blueprint → ROI narrative
Integration Design:
Contract-first · boundary maps · interoperability
Proof & Adoption:
PoCs that de-risk delivery · enablement · runbooks · handover
`.trim()
  },
  {
    id: 'analytics',
    title: 'ANALYTICS',
    sub: 'ANALYTICS & DECISION SUPPORT',
    content: `
Metrics:
Funnels · cohorts · revenue/ops reconciliation · SLAs
Dashboards:
Exec-ready visuals · drill-downs · “why it matters” notes
Data Health:
Schema discipline · validation · lineage · alerts
`.trim()
  },
  {
    id: 'monetization',
    title: 'EXPERIMENTS',
    sub: 'MONETIZATION & EXPERIMENTATION',
    content: `
Experiment Design:
A/B frameworks · guardrails · uplift measurement
Optimization:
Targeting · pacing · QA · performance instrumentation
Commercial Fit:
Value mapping · outcome tracking · feedback loops
`.trim()
  },
  {
    id: 'internal',
    title: 'AUTOMATION',
    sub: 'INTERNAL TOOLS & AUTOMATION',
    content: `
Ops Acceleration:
RFP search · catalogs · integration scaffolds · CLI helpers
Automation:
Scripts · workflow runners · CI jobs · “one-click” demo reset
DX:
Templates · docs · golden paths
`.trim()
  },
  {
    id: 'robotics',
    title: 'ROBOTICS',
    sub: 'ROBOTICS & BIOMECHANICS',
    content: `
Foundations:
Human–machine systems · kinematics · control & sensing
Applied Skills:
Signal processing · time-series · feedback loops
Transfer:
Modeling rigor → robust SaaS architecture & data design
`.trim()
  },
  {
    id: 'ops',
    title: 'SUPPORT',
    sub: 'TECHNICAL OPERATIONS & SUPPORT',
    content: `
Runbooks & Handover:
Triage trees · incident notes · reproducible steps
Live Debug:
Logs/traces · error budgets · smoke tests · rollback
Reliability:
SLOs/SLIs · post-mortems · continuous hardening
`.trim()
  },
  {
    id: 'leadership',
    title: 'LEADERSHIP',
    sub: 'LEADERSHIP & PROJECT OWNERSHIP',
    content: `
Ownership:
Discovery → design → build → adoption → scale
Stakeholders:
Clear comms · expectation setting · decision logs
Mentorship:
Enablement · pairing · elevating team velocity & standards
`.trim()
  }
]

export default function OpsGrid() {
  const [sel, setSel] = useState(null)
  return (
    <section className="section" id="skills">
      <h2>MY SKILLS</h2>
      <p className="opacity-70 mb-6">Hover to flip; click to open details.</p>
      <div className="grid grid-auto gap-5">
        {OPS.map(op => (
          <button
            key={op.id}
            onClick={() => setSel(op)}
            className="relative h-40 [perspective:1000px]"
          >
            <div className="card absolute inset-0 [transform-style:preserve-3d] transition-transform duration-500 group hover:[transform:rotateY(180deg)] focus:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 p-6 grid content-between [backface-visibility:hidden]">
                <div className="text-sm opacity-75">{op.sub}</div>
                <div className="text-xl tracking-[0.25em]">{op.title}</div>
              </div>
              <div className="absolute inset-0 p-6 grid content-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div className="text-sm opacity-80">Summary</div>
                <div className="text-xs opacity-70 line-clamp-3 whitespace-pre-wrap">{op.content}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {sel && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50"
          onClick={() => setSel(null)}
        >
          <div className="card p-6 w-[92vw] max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="tracking-widest font-semibold">{sel.sub}</h3>
              <button className="btn" onClick={() => setSel(null)}>Close</button>
            </div>
            <pre className="mt-4 whitespace-pre-wrap text-sm opacity-90">{sel.content}</pre>
          </div>
        </div>
      )}
    </section>
  )
}
