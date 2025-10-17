import React, { useState } from "react";
import SunburstChart from "./SunburstChart.jsx";
import Modal from "./Modal.jsx";

// ✅ Simplified + enriched taxonomy
const sunburstData = [
  {
    name: "Management",
    value: 58,
    meta: {
      skills: ["Leadership", "Stakeholders", "Roadmapping"],
      upskilling: ["PM frameworks", "Strategic comms"],
    },
    children: [
      {
        name: "Client Management",
        value: 32,
        meta: { skills: ["Discovery", "Negotiation"], upskilling: ["Account Strategy"] },
      },
      {
        name: "Product Management",
        value: 26,
        meta: { skills: ["Roadmaps", "Prioritization"], upskilling: ["Metrics", "OKRs"] },
      },
    ],
  },
  {
    name: "Solutions",
    value: 34,
    meta: {
      skills: ["Integrations", "Presales"],
      upskilling: ["Systems Design", "APIs"],
    },
    children: [
      {
        name: "Integrations",
        value: 19,
        meta: { skills: ["OAuth", "Webhooks"], upskilling: ["Security", "Scalability"] },
      },
      {
        name: "Presales",
        value: 15,
        meta: { skills: ["Demos", "RFPs"], upskilling: ["Value mapping"] },
      },
    ],
  },
  {
    name: "Development",
    value: 28,
    meta: {
      skills: ["React", "Node", "Cloud"],
      upskilling: ["Architecture", "Testing"],
    },
    children: [
      {
        name: "Front End",
        value: 15,
        meta: { skills: ["React", "Three.js"], upskilling: ["Accessibility"] },
      },
      {
        name: "Back End",
        value: 13,
        meta: { skills: ["Node", "Python"], upskilling: ["Observability"] },
      },
    ],
  },
];

// 📌 Mapping metrics → chart slice paths
const SEE_CHART_PATHS = {
  exp: ["Management"],
  proj: ["Solutions"],
  clients: ["Management", "Client Management"],
  mtgs: ["Solutions", "Presales"],
};

const METRICS = [
  {
    id: "exp",
    value: "5+",
    label: "Years of Experience",
    bullets: [
      "Customer-facing presales & integrations.",
      "Full project lifecycle: discovery → delivery.",
      "Mentoring, enablement, and solution design.",
    ],
  },
  {
    id: "proj",
    value: "25+",
    label: "Projects Completed",
    bullets: [
      "PoCs & production rollouts across industries.",
      "Fast MVPs with clean handoff docs & demos.",
      "Strong bias for measurable outcomes.",
    ],
  },
  {
    id: "clients",
    value: "100+",
    label: "Clients/Portfolios",
    bullets: [
      "SMB to enterprise—mixed complexity.",
      "Stakeholder management & clear comms.",
      "Repeat wins through reliability.",
    ],
  },
  {
    id: "mtgs",
    value: "150+",
    label: "Meetings Done",
    bullets: [
      "Workshops, discovery, and solution reviews.",
      "Translate tech ↔ business clearly.",
      "Concise follow-ups and next steps.",
    ],
  },
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

export default function Stats() {
  const [active, setActive] = useState(null);
  const openMetric = METRICS.find((m) => m.id === active);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <Tile key={m.id} m={m} onOpen={setActive} />
        ))}
      </div>

      <div id="stats-chart">
        <SunburstChart
          title="Stats"
          subtitle="Click slices to drill; Reset to return"
          data={sunburstData}
        />
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} ariaLabel={openMetric ? `${openMetric.label} details` : "Metric details"}>
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
              {openMetric.bullets.map((b, i) => (
                <li key={i} className="list-disc list-inside">{b}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
