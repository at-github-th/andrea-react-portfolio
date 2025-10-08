import React, { useRef, useState } from "react";

const SKILLS = ["JavaScript","Python","SQL","React","Node","Swift"];

export default function Cube(){
  const [active, setActive] = useState(0);
  const [rot, setRot] = useState({x:-15, y:20});
  const startRef = useRef(null);

  const snap = (idx)=>{
    setActive(idx);
    const snaps = [
      {x:0,   y:0},
      {x:0,   y:180},
      {x:0,   y:-90},
      {x:0,   y:90},
      {x:-90, y:0},
      {x:90,  y:0},
    ];
    setRot(snaps[idx]);
  };

  const onDown = (e)=>{
    startRef.current = { x:(e.touches?.[0]?.clientX ?? e.clientX), y:(e.touches?.[0]?.clientY ?? e.clientY), rot };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, {passive:false});
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
  };
  const onMove = (e)=>{
    if(!startRef.current) return;
    const cx = (e.touches?.[0]?.clientX ?? e.clientX);
    const cy = (e.touches?.[0]?.clientY ?? e.clientY);
    const dx = cx - startRef.current.x;
    const dy = cy - startRef.current.y;
    setRot({ x: startRef.current.rot.x + dy*0.3, y: startRef.current.rot.y + dx*0.4 });
  };
  const onUp = ()=>{
    startRef.current = null;
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("touchmove", onMove);
    window.removeEventListener("mouseup", onUp);
    window.removeEventListener("touchend", onUp);
  };

  return (
    <div className="space-y-4">
      <div className="perspective select-none" onMouseDown={onDown} onTouchStart={onDown}>
        <div className="cube" style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
          <Face z={110} label={SKILLS[0]} />
          <Face z={-110} ry={180} label={SKILLS[1]} />
          <Face z={110} ry={-90} label={SKILLS[2]} />
          <Face z={110} ry={90}  label={SKILLS[3]} />
          <Face z={110} rx={90}  label={SKILLS[4]} />
          <Face z={110} rx={-90} label={SKILLS[5]} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {SKILLS.map((s,i)=>(
          <button key={s} onClick={()=>snap(i)} className={`badge ${active===i ? 'border-[var(--accent)] text-[var(--accent)]' : ''}`}>
            {s}
          </button>
        ))}
      </div>
      <p className="text-center text-xs opacity-60">Drag to rotate · Click a label to focus</p>
    </div>
  );
}

function Face({ z, rx=0, ry=0, label }){
  return (
    <div className="cube-face" style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${z}px)` }}>
      <span className="tracking-[0.16em]">{label}</span>
    </div>
  );
}
