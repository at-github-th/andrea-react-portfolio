// src/components/Stats.jsx
import React, { useState } from "react";
import SunburstChart from "./SunburstChart.jsx";
import Modal from "./Modal.jsx";

const sunburstData = [
  {
    name: "Management",
    value: 58,
    meta: { unit: "projects", skills: ["Leadership","Stakeholders","Roadmapping"], upskilling:["PM frameworks","Strategic comms"] },
    children: [
      { name: "Client Management", value: 32, meta: { unit:"projects", skills:["Discovery","Negotiation"], upskilling:["Account Strategy"] } },
      { name: "Product Management", value: 26, meta: { unit:"projects", skills:["Roadmaps","Prioritization"], upskilling:["Metrics/OKRs"] } },
    ],
  },
  {
    name: "Solutions",
    value: 34,
    meta: { unit:"projects", skills:["Integrations","Presales"], upskilling:["Systems Design","APIs"] },
    children: [
      { name: "Integrations", value: 19, meta: { unit:"projects", skills:["OAuth","Webhooks"], upskilling:["Security"] } },
      { name: "Presales", value: 15, meta: { unit:"projects", skills:["Demos","RFPs"], upskilling:["Value mapping"] } },
    ],
  },
  {
    name: "Development",
    value: 28,
    meta: { unit:"projects", skills:["React","Node","Cloud"], upskilling:["Architecture","Testing"] },
    children: [
      { name: "Front End", value: 15, meta: { unit:"projects", skills:["React","Three.js"], upskilling:["Accessibility"] } },
      { name: "Back End", value: 13, meta: { unit:"projects", skills:["Node","Python"], upskilling:["Observability"] } },
    ],
  },
];

const SEE_CHART_PATHS = {
  exp: ["Management"],
  proj: ["Solutions"],
  clients: ["Management","Client Management"],
  mtgs: ["Solutions","Presales"],
};

const METRICS = [
  { id:"exp",     value:"5+",   label:"Years of Experience", bullets:[
    "Customer-facing presales & integrations.",
    "Full project lifecycle: discovery → delivery.",
    "Mentoring, enablement, and solution design.",
  ]},
  { id:"proj",    value:"25+",  label:"Projects Completed", bullets:[
    "PoCs & production rollouts across industries.",
    "Fast MVPs with clean handoff docs & demos.",
    "Strong bias for measurable outcomes.",
  ]},
  { id:"clients", value:"100+", label:"Clients/Portfolios", bullets:[
    "SMB to enterprise—mixed complexity.",
    "Stakeholder management & clear comms.",
    "Repeat wins through reliability.",
  ]},
  { id:"mtgs",    value:"150+", label:"Meetings Done", bullets:[
    "Workshops, discovery, and solution reviews.",
    "Translate tech ↔ business clearly.",
    "Concise follow-ups and next steps.",
  ]},
];

function Tile({ m, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(m.id)}
      className="card p-4 text-center rounded-xl transition focus:outline-none focus:ring-2 focus:ring-teal-400/40"
    >
      <div className="text-[clamp(22px,6vw,32px)] font-semibold text-teal-300 leading-tight">
        {m.value}
      </div>
      <div className="opacity-70 text-xs mt-1">{m.label}</div>
    </button>
  );
}

export default function Stats() {
  const [active, setActive] = useState(null);
  const openMetric = METRICS.find(m => m.id === active);

  const seeChart = () => {
    const path = SEE_CHART_PATHS[active] || [];
    window.dispatchEvent(new CustomEvent("stats-chart:focus", { detail: { path } }));
    if (path.length) {
      const hash = "#chart=" + encodeURIComponent(path.join("."));
      history.replaceState(null, "", hash);
    }
    const el = document.getElementById("stats-chart");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setActive(null);
  };

  const onOpenModal = (id) => {
    window.dispatchEvent(new Event("stats-tooltip:hide"));
    setActive(id);
  };

  return (
    // ⬅️ Persistent top spacing so tiles never touch the section header (even after modal open/close)
    <div className="space-y-6 pt-4 md:pt-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map(m => <Tile key={m.id} m={m} onOpen={onOpenModal} />)}
      </div>

      {/* Keep a stable anchor for “See chart” scroll-to */}
      <div id="stats-chart">
        <SunburstChart
          title="Stats"
          subtitle="Click slices to drill; Reset to return"
          data={sunburstData}
          unit="projects"
        />
      </div>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        ariaLabel={openMetric ? `${openMetric.label} details` : "Metric details"}
      >
        {openMetric && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="text-teal-300 font-semibold leading-tight min-w-0 break-words">
                <span className="text-[clamp(22px,6vw,32px)]">{openMetric.value}</span>
                <span className="text-[clamp(12px,3.5vw,16px)] opacity-70 ml-2 align-middle">
                  {openMetric.label}
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button className="btn" onClick={seeChart}>See chart</button>
                <button className="btn" onClick={() => setActive(null)} aria-label="Close">Close</button>
              </div>
            </div>
            <ul className="mt-2 space-y-1 text-sm opacity-90">
              {openMetric.bullets.map((b,i)=><li key={i} className="list-disc list-inside">{b}</li>)}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
