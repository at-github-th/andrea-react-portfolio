// src/components/SunburstChart.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/** ---------- small geometry helpers (no d3 needed) ---------- */
const TAU = Math.PI * 2;
const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
const polar = (cx, cy, r, a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
const arcPath = (cx, cy, r0, r1, a0, a1) => {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p0 = polar(cx, cy, r1, a0), p1 = polar(cx, cy, r1, a1);
  const q0 = polar(cx, cy, r0, a1), q1 = polar(cx, cy, r0, a0);
  return [
    `M ${p0.x} ${p0.y}`,
    `A ${r1} ${r1} 0 ${large} 1 ${p1.x} ${p1.y}`,
    `L ${q0.x} ${q0.y}`,
    `A ${r0} ${r0} 0 ${large} 0 ${q1.x} ${q1.y}`,
    "Z",
  ].join(" ");
};
/** approximate max characters that fit on an arc (safe, conservative) */
const maxCharsOnArc = (radius, arcAngle, pxPerChar = 7.5) =>
  Math.floor((radius * arcAngle) / pxPerChar);

/** palette (kept close to what you had) */
const C = {
  mgmt: "#7ea2f7",
  dev: "#5b6ee1",
  sol: "#b7e26b",
  tierA: "#8b9dc3",
  tierB: "#9aa5b1",
  bg: "#0b1220",
  ring: "rgba(255,255,255,0.08)",
  label: "rgba(255,255,255,0.85)",
  labelMuted: "rgba(255,255,255,0.55)",
  panel: "rgba(10,14,25,0.9)",
  panelBorder: "rgba(255,255,255,0.08)"
};

/** ---------- component ---------- */
export default function SunburstChart({
  title = "Stats",
  subtitle = "Click slices to drill; Reset to return",
  /** data format:
   * [
   *  { name, value, meta, children:[{name,value,meta}, ...] },
   *  ...
   * ]
   */
  data = [],
  unit = "projects",             // default unit
}) {
  /** tooltip/description panel state (fully controlled; not an overlay) */
  const [active, setActive] = useState(null);   // {name,value,meta,level,parent}
  const wrapRef = useRef(null);
  const [size, setSize] = useState({w: 0, h: 0});

  /** resize observer -> responsive SVG */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** normalize + totals */
  const parents = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];
    return safe.map(p => {
      const kids = (p.children || []).map(k => ({...k, value: Number(k.value||0)}));
      const pv = Number(p.value ?? kids.reduce((a,b)=>a+b.value, 0));
      return {...p, value: pv, children: kids};
    });
  }, [data]);

  const total = useMemo(() => parents.reduce((a,b)=>a+b.value,0), [parents]);

  /** compute rings geometry */
  const geom = useMemo(() => {
    const pad = 12;                           // outer padding
    const W = Math.max(280, size.w || 0);
    const H = Math.max(260, size.h || 0);
    const cx = W/2, cy = H/2;
    // radii (mobile tighter)
    const innerR = Math.min(W,H)*0.18;
    const midR0  = innerR + 26;
    const midR1  = innerR + 78;
    const outR0  = midR1 + 10;
    const outR1  = midR1 + 62;

    // parent arcs
    let acc = 0;
    const parentArcs = parents.map(p => {
      const a0 = (acc / total) * TAU - Math.PI/2;
      acc += p.value;
      const a1 = (acc / total) * TAU - Math.PI/2;
      return {node:p, a0, a1, r0: midR0, r1: midR1};
    });

    // child arcs follow parent span
    const childArcs = [];
    parentArcs.forEach(P => {
      const kidsTotal = P.node.children.reduce((a,b)=>a+b.value,0);
      let accK = 0;
      P.node.children.forEach(k => {
        const span = P.a1 - P.a0;
        const frac0 = accK / Math.max(1,kidsTotal);
        accK += k.value;
        const frac1 = accK / Math.max(1,kidsTotal);
        const a0 = P.a0 + span*frac0;
        const a1 = P.a0 + span*frac1;
        childArcs.push({node:k, a0, a1, r0: outR0, r1: outR1, parent:P.node});
      });
    });

    return {W,H,cx,cy, innerR, parentArcs, childArcs};
  }, [parents, total, size]);

  /** click-outside handler to clear selection */
  useEffect(() => {
    const clear = () => setActive(null);
    window.addEventListener("stats-tooltip:hide", clear);
    return () => window.removeEventListener("stats-tooltip:hide", clear);
  }, []);

  /** external deep-link focus (#chart=Management.Client Management) */
  useEffect(() => {
    const onFocus = (e) => {
      const path = e.detail?.path || [];
      if (!path.length) return;
      const [pLabel, cLabel] = path.map(s=>String(s).toLowerCase());
      if (!cLabel) {
        const p = parents.find(x=>x.name.toLowerCase()===pLabel);
        if (p) setActive({name:p.name, value:p.value, meta:p.meta, level:"parent"});
      } else {
        parents.forEach(p=>{
          if (p.name.toLowerCase()!==pLabel) return;
          const k = (p.children||[]).find(c=>c.name.toLowerCase()===cLabel);
          if (k) setActive({name:k.name, value:k.value, meta:k.meta, level:"child", parent:p.name});
        });
      }
    };
    window.addEventListener("stats-chart:focus", onFocus);
    return () => window.removeEventListener("stats-chart:focus", onFocus);
  }, [parents]);

  const onSliceClick = (node, level, parent=null) => {
    setActive({
      name: node.name,
      value: node.value,
      meta: node.meta || {},
      level,
      parent: parent ? parent.name : undefined
    });
  };

  /** label rendering with truncation that *never* spills */
  const Label = ({cx, cy, r, a0, a1, text, muted=false}) => {
    const mid = (a0+a1)/2;
    const angle = a1-a0;
    const maxChars = maxCharsOnArc(r, angle);
    if (maxChars < 4) return null;           // too small -> hide
    const s = text.length > maxChars ? text.slice(0, Math.max(1,maxChars-1)) + "…" : text;
    const pt = polar(cx, cy, r, mid);
    const rotate = (mid*180/Math.PI) - 90;   // tangential
    return (
      <g transform={`translate(${pt.x},${pt.y}) rotate(${rotate})`}>
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fill: muted ? C.labelMuted : C.label, fontSize: 12, pointerEvents:"none" }}
        >
          {s}
        </text>
      </g>
    );
  };

  /** description panel (inside chart; never overlays other sections) */
  const Panel = () => {
    if (!active) return null;
    const lines = [
      active.parent ? `${active.parent} → ${active.name}` : active.name,
      `${active.value} ${active.meta?.unit || unit}`,
      active.meta?.skills?.length ? (active.meta.skills.join(", ")) : null,
      active.meta?.upskilling?.length ? `Next: ${active.meta.upskilling[0]}` : null
    ].filter(Boolean);

    return (
      <div
        className="absolute left-3 bottom-3 rounded-lg px-3 py-2"
        style={{
          background: C.panel,
          border: `1px solid ${C.panelBorder}`,
          color: "#fff",
          maxWidth: 280
        }}
      >
        <div className="font-semibold">{lines[0]}</div>
        <div className="opacity-90 text-sm">{lines[1]}</div>
        {lines[2] && <div className="italic opacity-90 text-sm">{lines[2]}</div>}
        {lines[3] && <div className="opacity-80 text-xs">{lines[3]}</div>}
      </div>
    );
  };

  const isMobile = (typeof window!=="undefined") ? window.innerWidth < 640 : false;

  return (
    <div className="card rounded-xl p-4 relative" id="stats-chart" ref={wrapRef} style={{height:isMobile?420:520}}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="opacity-80 text-sm">{subtitle}</div>
        <div className="flex gap-2">
          {/* Export = download current SVG as file */}
          <button
            className="btn"
            onClick={()=>{
              const svg = wrapRef.current.querySelector("svg");
              if (!svg) return;
              const xml = new XMLSerializer().serializeToString(svg);
              const blob = new Blob([xml], {type:"image/svg+xml"});
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = "chart.svg"; a.click();
              URL.revokeObjectURL(url);
            }}
          >Export SVG</button>
        </div>
      </div>

      <svg width={geom.W} height={geom.H} role="img" aria-label={title}>
        {/* background ring to keep visual tidy */}
        <circle cx={geom.cx} cy={geom.cy} r={geom.innerR} fill={C.ring} />

        {/* parent ring */}
        {geom.parentArcs.map((A,i)=>(
          <g key={`p-${i}`} onClick={()=>onSliceClick(A.node,"parent")}>
            <path
              d={arcPath(geom.cx, geom.cy, A.r0, A.r1, A.a0, A.a1)}
              fill={i%3===0?C.mgmt:i%3===1?C.dev:C.sol}
              stroke={C.bg}
              strokeWidth={2}
              style={{ cursor:"pointer", opacity: active && active.name!==A.node.name ? 0.6 : 1 }}
            />
            <Label cx={geom.cx} cy={geom.cy} r={(A.r0+A.r1)/2} a0={A.a0} a1={A.a1} text={A.node.name}/>
          </g>
        ))}

        {/* child ring */}
        {geom.childArcs.map((A,i)=>(
          <g key={`c-${i}`} onClick={()=>onSliceClick(A.node,"child",A.parent)}>
            <path
              d={arcPath(geom.cx, geom.cy, A.r0, A.r1, A.a0, A.a1)}
              fill={A.parent.name==="Management"?C.mgmt: A.parent.name==="Development"?C.dev: C.sol}
              opacity={0.75}
              stroke={C.bg}
              strokeWidth={2}
              style={{ cursor:"pointer", opacity: active && active.name!==A.node.name ? 0.55 : 0.9 }}
            />
            <Label cx={geom.cx} cy={geom.cy} r={(A.r0+A.r1)/2} a0={A.a0} a1={A.a1} text={A.node.name} muted/>
          </g>
        ))}
      </svg>

      <Panel />
    </div>
  );
}
