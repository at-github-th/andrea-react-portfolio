
import React, {useState} from 'react'

const OPS = [
  {id:'backend', title:'BACK END', sub:'MANIPULATING DATA', content:`
CONTENT:
Granular access control · RESTful API design · Error handling · Ease-of-use
OPERATIONS:
Account/Player/Playlist management · Webhooks · Audit
SECURITY:
Data protection · URL signing · Anti-replay · AuthN/AuthZ
TOOLS:
VSCode · Postman · SQLite · GitHub · Jira
OUTPUT:
Python · JSON · XML · PHP
`},
  {id:'frontend', title:'FRONT END', sub:'USER INTERFACE', content:`
SPA wiring with React · Tailwind UI kits · Accessible components ·
Data viz for execs (charts, KPIs) · Context & hooks for small apps.
`},
  {id:'support', title:'SUPPORT', sub:'TECHNICAL SUPPORT', content:`
Solution troubleshooting, runbooks, handover, and live debug.
`},
  {id:'sdh', title:'SDH', sub:'APPLICATION DEVELOPMENT', content:`
Internal tools (Catalog, RFP Search) to speed SE/AE workflows.
`},
  {id:'ads', title:'ADVERTISING', sub:'ADVERTISING PERFORMANCE', content:`
SSAI, ad servers, content targeting, QA & metrics.
`},
  {id:'analytics', title:'ANALYTICS', sub:'ANALYTICS PERFORMANCE', content:`
Looker dashboards, revenue reconciliation, funnels, and ops KPIs.
`},
  {id:'presales', title:'PRE SALES', sub:'TECHNOLOGY ADOPTION', content:`
Discovery → value mapping → demo builds → objections handling.
`},
  {id:'postsales', title:'POST SALES', sub:'OPERATIONAL PROCESSES', content:`
Implementation tracking, success metrics, and feedback loops.
`},
]

export default function OpsGrid(){
  const [sel, setSel] = useState(null)
  return (
    <section className="section">
      <h2>MY SKILLS</h2>
      <p className="opacity-70 mb-6">Hover to flip; click to open details.</p>
      <div className="grid grid-auto gap-5">
        {OPS.map(op=>(
          <button key={op.id} onClick={()=>setSel(op)} className="relative h-40 [perspective:1000px]">
            <div className="card absolute inset-0 [transform-style:preserve-3d] transition-transform duration-500 group hover:[transform:rotateY(180deg)] focus:[transform:rotateY(180deg)]">
              <div className="absolute inset-0 p-6 grid content-between [backface-visibility:hidden]">
                <div className="text-sm opacity-75">{op.sub}</div>
                <div className="text-xl tracking-[0.25em]">{op.title}</div>
              </div>
              <div className="absolute inset-0 p-6 grid content-between [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div className="text-sm opacity-80">Summary</div>
                <div className="text-xs opacity-70 line-clamp-3 whitespace-pre-wrap">{op.content.trim()}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50" onClick={()=>setSel(null)}>
          <div className="card p-6 w-[92vw] max-w-2xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="tracking-widest font-semibold">{sel.title}</h3>
              <button className="btn" onClick={()=>setSel(null)}>Close</button>
            </div>
            <pre className="mt-4 whitespace-pre-wrap text-sm opacity-90">{sel.content.trim()}</pre>
          </div>
        </div>
      )}
    </section>
  )
}
