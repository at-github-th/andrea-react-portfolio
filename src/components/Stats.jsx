
import React, {useState} from 'react'

const ITEMS = [
  {k:'5+', v:'Years of Experience', detail:`Hands-on Solutions Engineering, Presales, and Product/Delivery collaboration across Media, AdTech, and SaaS.`},
  {k:'25+', v:'Projects Completed', detail:`Proofs of Concept, middleware, dashboards, integration adapters, and demo apps shipped to unblock sales.`},
  {k:'100+', v:'Clients/Portfolios', detail:`Enterprise and SMB engagements; tailored demos, success criteria mapping, and stakeholder alignment.`},
  {k:'150+', v:'Meetings Done', detail:`Discovery, demos, playback, objection handling, commercial alignment, and handover ceremonies.`},
]

export default function Stats(){
  const [sel, setSel] = useState(null)
  return (
    <section className="section" id="summary">
      <h2>SUMMARY</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {ITEMS.map((it)=>(
          <button key={it.v} className="card p-6 text-center hover:shadow-glow transition" onClick={()=>setSel(it)}>
            <div className="text-3xl md:text-4xl font-bold text-ink-glow">{it.k}</div>
            <div className="mt-1 text-sm opacity-80 tracking-widest">{it.v}</div>
          </button>
        ))}
      </div>

      {sel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50" onClick={()=>setSel(null)}>
          <div className="card p-6 max-w-xl w-[92vw]" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="tracking-widest font-semibold">{sel.v}</h3>
              <button className="btn" onClick={()=>setSel(null)}>Close</button>
            </div>
            <p className="mt-4 opacity-90 leading-relaxed">{sel.detail}</p>
          </div>
        </div>
      )}
    </section>
  )
}
