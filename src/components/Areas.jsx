import React, { useState } from "react";
import PieChart from "./PieChart.jsx"; // Basic SVG pie below

const items = [
  { title: "CLIENT MANAGEMENT", chart: { a:40, b:30, c:30 }},
  { title: "NETWORKING", chart: { a:55, b:25, c:20 }},
  { title: "WEB COMPETENCE", chart: { a:50, b:30, c:20 }},
  { title: "SYSTEMS", chart: { a:35, b:35, c:30 }},
];

export default function Areas(){
  const [openIdx, setOpenIdx] = useState(null); // collapsed by default
  return (
    <div className="space-y-2">
      {items.map((it, i)=>(
        <div key={it.title} className="card">
          <button
            className="w-full text-left px-4 py-3 flex items-center justify-between"
            onClick={()=>setOpenIdx(openIdx===i? null : i)}
          >
            <span className="tracking-[0.22em] text-sm">{it.title}</span>
            <span className="opacity-70">{openIdx===i? "−" : "+"}</span>
          </button>

          {openIdx===i && (
            <div className="px-4 pb-4">
              <PieChart data={it.chart} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
