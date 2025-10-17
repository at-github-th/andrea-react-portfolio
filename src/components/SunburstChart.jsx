import React, { useEffect, useMemo, useRef, useState } from "react";

const TAU = Math.PI * 2;
const polar = (cx, cy, r, a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
const arcPath = (cx, cy, r0, r1, a0, a1) => {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p0 = polar(cx, cy, r1, a0), p1 = polar(cx, cy, r1, a1);
  const q0 = polar(cx, cy, r0, a1), q1 = polar(cx, cy, r0, a0);
  return `M ${p0.x} ${p0.y} A ${r1} ${r1} 0 ${large} 1 ${p1.x} ${p1.y} L ${q0.x} ${q0.y} A ${r0} ${r0} 0 ${large} 0 ${q1.x} ${q1.y} Z`;
};
const maxCharsOnArc = (r, ang, w = 7.5) => Math.floor((r * ang) / w);

const C = {
  mgmt: "#7ea2f7",
  dev: "#5b6ee1",
  sol: "#b7e26b",
  bg: "#0b1220",
  ring: "rgba(255,255,255,0.08)",
  label: "rgba(255,255,255,0.9)",
  labelMuted: "rgba(255,255,255,0.6)",
  panel: "rgba(10,14,25,0.92)",
  panelBorder: "rgba(255,255,255,0.1)"
};

export default function SunburstChart({
  title = "Stats",
  subtitle = "Click slices to drill; Reset to return",
  data = [],
  unit = "projects",
}) {
  const [active, setActive] = useState(null);
  const wrapRef = useRef(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const parents = useMemo(() => {
    const safe = Array.isArray(data) ? data : [];
    return safe.map(p => {
      const kids = (p.children || []).map(k => ({ ...k, value: Number(k.value || 0) }));
      const pv = Number(p.value ?? kids.reduce((a, b) => a + b.value, 0));
      return { ...p, value: pv, children: kids };
    });
  }, [data]);

  const total = useMemo(() => parents.reduce((a, b) => a + b.value, 0), [parents]);

  const geom = useMemo(() => {
    const W = Math.max(320, box.w || 0);
    const H = Math.max(320, box.h || 0);
    const cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) * 0.42;
    const innerR = R * 0.38;
    const midR0 = innerR + 16;
    const midR1 = innerR + 68;
    const outR0 = midR1 + 10;
    const outR1 = R;

    let acc = 0;
    const parentArcs = parents.map(p => {
      const a0 = (acc / total) * TAU - Math.PI / 2;
      acc += p.value;
      const a1 = (acc / total) * TAU - Math.PI / 2;
      return { node: p, a0, a1, r0: midR0, r1: midR1 };
    });

    const childArcs = [];
    parentArcs.forEach(P => {
      const kidsTotal = P.node.children.reduce((a, b) => a + b.value, 0) || 1;
      let ak = 0;
      P.node.children.forEach(k => {
        const span = P.a1 - P.a0;
        const a0 = P.a0 + span * (ak / kidsTotal);
        ak += k.value;
        const a1 = P.a0 + span * (ak / kidsTotal);
        childArcs.push({ node: k, a0, a1, r0: outR0, r1: outR1, parent: P.node });
      });
    });

    return { W, H, cx, cy, innerR, parentArcs, childArcs };
  }, [parents, total, box]);

  useEffect(() => {
    const clear = () => setActive(null);
    window.addEventListener("stats-tooltip:hide", clear);
    return () => window.removeEventListener("stats-tooltip:hide", clear);
  }, []);

  useEffect(() => {
    const onFocus = e => {
      const path = e.detail?.path || [];
      if (!path.length) return;
      const [pL, cL] = path.map(s => String(s).toLowerCase());
      if (!cL) {
        const p = parents.find(x => x.name.toLowerCase() === pL);
        if (p) setActive({ name: p.name, value: p.value, meta: p.meta, level: "parent" });
      } else {
        parents.forEach(p => {
          if (p.name.toLowerCase() !== pL) return;
          const k = (p.children || []).find(c => c.name.toLowerCase() === cL);
          if (k) setActive({ name: k.name, value: k.value, meta: k.meta, level: "child", parent: p.name });
        });
      }
    };
    window.addEventListener("stats-chart:focus", onFocus);
    return () => window.removeEventListener("stats-chart:focus", onFocus);
  }, [parents]);

  const onSliceClick = (node, level, parent = null) =>
    setActive({ name: node.name, value: node.value, meta: node.meta || {}, level, parent: parent?.name });

  const Label = ({ cx, cy, r, a0, a1, text, muted = false }) => {
    const mid = (a0 + a1) / 2;
    const ang = a1 - a0;
    const max = maxCharsOnArc(r, ang);
    if (max < 4) return null;
    const s = text.length > max ? text.slice(0, Math.max(1, max - 1)) + "…" : text;
    const pt = polar(cx, cy, r, mid);
    const rot = (mid * 180) / Math.PI - 90;
    return (
      <g transform={`translate(${pt.x},${pt.y}) rotate(${rot})`}>
        <text textAnchor="middle" dominantBaseline="middle" style={{ fill: muted ? C.labelMuted : C.label, fontSize: 12, pointerEvents: "none" }}>{s}</text>
      </g>
    );
  };

  const Panel = () => {
    if (!active) return null;
    const lines = [
      active.parent ? `${active.parent} → ${active.name}` : active.name,
      `${active.value} ${active.meta?.unit || unit}`,
      active.meta?.skills?.length ? active.meta.skills.join(", ") : null,
      active.meta?.upskilling?.length ? `Next: ${active.meta.upskilling[0]}` : null
    ].filter(Boolean);
    return (
      <div className="absolute left-3 bottom-3 rounded-lg px-3 py-2" style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, color: "#fff", maxWidth: 320 }}>
        <div className="font-semibold">{lines[0]}</div>
        <div className="opacity-90 text-sm">{lines[1]}</div>
        {lines[2] && <div className="italic opacity-90 text-sm">{lines[2]}</div>}
        {lines[3] && <div className="opacity-80 text-xs">{lines[3]}</div>}
      </div>
    );
  };

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false;

  return (
    <div className="card rounded-xl p-4 relative" id="stats-chart" ref={wrapRef} style={{ height: isMobile ? 420 : 520 }}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="opacity-80 text-sm">{subtitle}</div>
        <div className="flex gap-2">
          <button
            className="btn"
            onClick={() => {
              const svg = wrapRef.current.querySelector("svg");
              if (!svg) return;
              const xml = new XMLSerializer().serializeToString(svg);
              const blob = new Blob([xml], { type: "image/svg+xml" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "chart.svg";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export SVG
          </button>
        </div>
      </div>

      <svg viewBox={`0 0 ${geom.W} ${geom.H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label={title}>
        <circle cx={geom.cx} cy={geom.cy} r={geom.innerR} fill={C.ring} />
        {geom.parentArcs.map((A, i) => (
          <g key={`p-${i}`} onClick={() => onSliceClick(A.node, "parent")} style={{ cursor: "pointer" }}>
            <path d={arcPath(geom.cx, geom.cy, A.r0, A.r1, A.a0, A.a1)} fill={i % 3 === 0 ? C.mgmt : i % 3 === 1 ? C.dev : C.sol} stroke={C.bg} strokeWidth={2} opacity={active && active.name !== A.node.name ? 0.6 : 1} />
            <Label cx={geom.cx} cy={geom.cy} r={(A.r0 + A.r1) / 2} a0={A.a0} a1={A.a1} text={A.node.name} />
          </g>
        ))}
        {geom.childArcs.map((A, i) => (
          <g key={`c-${i}`} onClick={() => onSliceClick(A.node, "child", A.parent)} style={{ cursor: "pointer" }}>
            <path d={arcPath(geom.cx, geom.cy, A.r0, A.r1, A.a0, A.a1)} fill={A.parent.name === "Management" ? C.mgmt : A.parent.name === "Development" ? C.dev : C.sol} stroke={C.bg} strokeWidth={2} opacity={active && active.name !== A.node.name ? 0.55 : 0.9} />
            <Label cx={geom.cx} cy={geom.cy} r={(A.r0 + A.r1) / 2} a0={A.a0} a1={A.a1} text={A.node.name} muted />
          </g>
        ))}
      </svg>

      <Panel />
    </div>
  );
}
