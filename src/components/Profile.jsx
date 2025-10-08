
import React, {useState} from 'react'

export default function Profile(){
  const [open, setOpen] = useState(false)
  return (
    <section className="section">
      <h2>PROFILE</h2>
      <p className="opacity-70 mb-6">Expand this section for more details.</p>
      <div className={"card overflow-hidden transition-all " + (open ? "p-6" : "p-4")}>
        <div className="flex items-center justify-between">
          <button className="btn" onClick={()=>setOpen(!open)}>{open ? "−" : "+"} Discover</button>
          <div className="text-sm opacity-70 tracking-widest">PROFILE</div>
        </div>
        {open && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <p className="opacity-80 leading-relaxed">
              I graduated in Biomechanics and moved into Product and Solutions Engineering across Media & SaaS.
              My focus: <strong>SE & Presales</strong>, integration design, SSAI/AdTech, analytics, and clean UI/UX demos.
              I translate complex systems into clear customer value and outcomes.
            </p>
            <p className="opacity-80 leading-relaxed">
              Multilingual, hands-on, and outcome-driven, I build POCs, middleware, and dashboards that close deals
              and de-risk delivery. Comfortable across discovery, solution shaping, and handover to success teams.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
