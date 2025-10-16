import React, { useState } from "react";
import SunburstChart from "./SunburstChart.jsx";
import Modal from "./Modal.jsx";

const sunburstData = [
  { name: "Management", value: 100, children: [
    { name: "Client Management", value: 56 },
    { name: "Product Management", value: 44 }
  ]},
  { name: "Solutions", value: 39, children: [
    { name: "Integrations", value: 20 },
    { name: "Presales", value: 19 }
  ]},
  { name: "Development", value: 24, children: [
    { name: "Front End", value: 12 },
    { name: "Back End", value: 12 }
  ]},
  { name: "Science", value: 16, children: [
    { name: "Biomechanics", value: 8 },
    { name: "Robotics", value: 8 }
  ]}
];

// Map each metric to a chart slice "path" (outer→inner)
const SEE_CHART_PATHS = {
  exp:      ["Management"],
  proj:     ["Solutions"],
  clients:  ["Management", "Client Management"],
  mtgs:     ["Solutions", "Presales"],
};

const METRICS = [
  {
    id: "exp",
    value: "5+",
    label: "Years of Experience",
    bullets: [
      "Customer-facing presales & integrations.",
      "Full project lifecycle: discovery → delivery.",
      "Mentoring, enablement, and solution design."
    ]
  },
  {
    id: "proj",
    value: "25+",
    label: "Projects Completed",
    bullets: [
      "PoCs & production rollouts across industries.",
      "Fast MVPs with clean handoff docs & demos.",
      "Strong bias for measurable outcomes."
    ]
  },
  {
    id: "clients",
    value: "100+",
    label: "Clients/Portfolios",
    bullets: [
      "SMB to enterprise—mixed complexity.",
      "Stakeholder management & clear comms.",
      "Repeat wins through reliability."
    ]
  },
  {
    id: "mtgs",
    value: "150+",
    label: "Meetings Done",
    bullets: [
      "Workshops, discovery, and solution reviews.",
      "Translate tech ↔ business clearly.",
      "Concise follow-ups and next steps."
    ]
  }
];

function Tile({ m, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(m.id)}
      className="card p-4 text-center rounded-xl transition focus:outline-none focus:ring-2 focus:ring-teal-400/40"
    >
      <div className="text-3xl font-semibold text-teal-300">{m.value}</div>
      <div className="opacity-70 text-xs mt-1">{m.label}</div>
    </button>
  );
}

export default function Stats(){
  const [active, setActive] = useState(null);
  const openMetric = METRICS.find(m => m.id === active);

  const seeChart = () => {
    // derive path for the currently open metric
    const path = SEE_CHART_PATHS[active] || [];
    // tell chart to drill
    window.dispatchEvent(new CustomEvent("stats-chart:focus", { detail: { path } }));
    // deep-link (optional)
    if (path.length) {
      const hash = "#chart=" + encodeURIComponent(path.join("."));
      history.replaceState(null, "", hash);
    }
    // scroll to chart then close modal
    const el = document.getElementById("summary-chart")
           || document.querySelector("#summary svg, #summary canvas");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setActive(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map(m => <Tile key={m.id} m={m} onOpen={setActive} />)}
      </div>

      {/* Central chart with an anchor for 'See chart' */}
      <div id="summary-chart">
        <SunburstChart
          title="Stats"
          subtitle="Click slices to drill; Reset to return"
          data={sunburstData}
        />
      </div>

      {/* Modal details */}
      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        ariaLabel={openMetric ? `${openMetric.label} details` : "Metric details"}
      >
        {openMetric && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="text-2xl font-semibold text-teal-300">
                {openMetric.value}
                <span className="text-base opacity-70 ml-2">{openMetric.label}</span>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button className="btn" onClick={seeChart}>See chart</button>
                <button className="btn" onClick={() => setActive(null)} aria-label="Close">Close</button>
              </div>
            </div>
            <ul className="mt-2 space-y-1 text-sm opacity-90">
              {openMetric.bullets.map((b,i)=>(<li key={i} className="list-disc list-inside">{b}</li>))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
