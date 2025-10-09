import React, { useEffect, useRef, useState } from "react";

export default function MiniRing({
  label,
  value = 0,          // 0–100
  size = 76,          // px
  stroke = 8,         // ring thickness
  color = "#2ee9c9",  // teal glow
}) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const target = Math.max(0, Math.min(100, value)) / 100;

  const [prog, setProg] = useState(0);
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const t0 = performance.now();
        const dur = 800;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          setProg(k * target);
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  const dash = C * prog;

  return (
    <div ref={host} className="ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="bg" cx={size/2} cy={size/2} r={r} strokeWidth={stroke}/>
        <circle
          className="fg"
          cx={size/2}
          cy={size/2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${C - dash}`}
        />
      </svg>
      <div className="label">
        <span>{label}</span>
        <span className="pct">{Math.round(prog * 100)}%</span>
      </div>
    </div>
  );
}
