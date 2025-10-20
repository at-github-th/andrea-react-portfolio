import React, { useMemo, useState } from "react";

/**
 * SpatialNavigationGrid
 * - Desktop: radial “system map” with glowing connections
 * - Mobile: simple 2-column buttons
 * - Clicking a node scrolls to the relevant section
 */
export default function SpatialGrid() {
  const [hover, setHover] = useState(null);

  // Central + orbit nodes (angles in degrees around the circle)
  const nodes = useMemo(
    () => [
      { id: "core", label: "SYSTEMS VIEW", r: 0, a: 0, href: "#profile" },
      { id: "architecture", label: "Architecture", r: 210, a: -20, href: "#profile" },
      { id: "product",      label: "Product",      r: 210, a: 40,  href: "#profile" },
      { id: "corecomp",     label: "Core Computing", r: 210, a: 100, href: "#profile" },
      { id: "engineering",  label: "Engineering",  r: 210, a: 160, href: "#engineering" },
      { id: "sales",        label: "Sales",        r: 210, a: -140, href: "#sales" },
      { id: "stats",        label: "Stats",        r: 210, a: -80, href: "#stats" },
    ],
    []
  );

  // edges: which nodes connect
  const edges = useMemo(
    () => [
      ["architecture", "product"],
      ["architecture", "corecomp"],
      ["product", "corecomp"],
      // spokes to impact sections
      ["architecture", "engineering"],
      ["corecomp", "engineering"],
      ["product", "sales"],
      ["sales", "stats"],
      ["engineering", "stats"],
      // hub accent
      ["core", "architecture"],
      ["core", "product"],
      ["core", "corecomp"],
    ],
    []
  );

  const size = 560;                 // svg viewbox size
  const cx = size / 2, cy = size / 2;

  const pos = (n) => {
    if (n.r === 0) return { x: cx, y: cy };
    const rad = (n.a * Math.PI) / 180;
    return { x: cx + n.r * Math.cos(rad), y: cy + n.r * Math.sin(rad) };
  };

  const getNode = (id) => nodes.find((n) => n.id === id);

  const scrollTo = (hash) => {
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="section" aria-label="Spatial navigation grid">
      {/* Desktop radial map */}
      <div className="hidden md:block">
        <div className="relative mx-auto max-w-5xl">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full rounded-2xl bg-[rgba(255,255,255,0.02)] ring-1 ring-white/5"
          >
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#1eead5" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#1eead5" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1eead5" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1eead5" stopOpacity="0.0" />
                <stop offset="50%" stopColor="#1eead5" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1eead5" stopOpacity="0.0" />
              </linearGradient>
              <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* faint rings */}
            {[120, 210, 280].map((r) => (
              <circle key={r} cx={cx} cy={cy} r={r} className="fill-none stroke-white/5" />
            ))}

            {/* edges */}
            {edges.map(([a, b], i) => {
              const A = pos(getNode(a));
              const B = pos(getNode(b));
              const active =
                !hover || hover === a || hover === b || (hover === "core" && (a === "core" || b === "core"));
              return (
                <line
                  key={i}
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  stroke="url(#edgeGlow)"
                  strokeWidth={active ? 2.5 : 1.2}
                  opacity={active ? 0.9 : 0.25}
                  filter="url(#soft)"
                />
              );
            })}

            {/* nodes */}
            {nodes.map((n) => {
              const { x, y } = pos(n);
              const isHub = n.id === "core";
              const active = !hover || hover === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${x}, ${y})`}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => scrollTo(n.href)}
                  className="cursor-pointer select-none"
                >
                  {/* glow */}
                  <circle r={isHub ? 30 : 16} fill="url(#nodeGlow)" opacity={active ? 0.65 : 0.25} />
                  <circle
                    r={isHub ? 18 : 12}
                    className={`${
                      active ? "fill-teal-300/30 stroke-teal-300/60" : "fill-white/10 stroke-white/30"
                    }`}
                    strokeWidth="1.5"
                  />
                  {/* label */}
                  <foreignObject
                    x={-90}
                    y={isHub ? 24 : 18}
                    width={180}
                    height={42}
                    style={{ pointerEvents: "none" }}
                  >
                    <div
                      className={`text-center text-[11px] tracking-wide ${
                        active ? "text-teal-200" : "text-white/60"
                      }`}
                    >
                      {n.label}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          {/* subtle star field overlay */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(30,234,213,.07),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(30,234,213,.05),transparent_45%)]" />
        </div>
      </div>

      {/* Mobile fallback: clean grid buttons */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        {nodes
          .filter((n) => n.id !== "core")
          .map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.href)}
              className="card p-4 rounded-xl text-center hover:bg-white/[0.06] transition"
            >
              <div className="text-xs opacity-70">Go to</div>
              <div className="text-sm tracking-widest">{n.label}</div>
            </button>
          ))}
      </div>
    </section>
  );
}
