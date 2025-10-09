import React, { useState } from "react";

const FACES = [
  { id:"js",     label:"JavaScript", rot:[0,   0]   },
  { id:"py",     label:"Python",     rot:[0, 180]   },
  { id:"react",  label:"React",      rot:[0, -90]   },
  { id:"node",   label:"Node",       rot:[0,  90]   },
  { id:"java",   label:"Java",       rot:[90,  0]   },
  { id:"swift",  label:"Swift",      rot:[-90, 0]   },
];

export default function Cube(){
  const [active, setActive] = useState("js");
  const [rx, ry] = FACES.find(f=>f.id===active)?.rot || [0,0];

  return (
    <div className="grid md:grid-cols-[420px_1fr] gap-6 items-center">
      <div className="perspective h-[240px] md:h-[320px]">
        <div className="cube" style={{ transform:`rotateX(${rx}deg) rotateY(${ry}deg)` }}>
          <Face pos="front">JavaScript</Face>
          <Face pos="back">Python</Face>
          <Face pos="left">React</Face>
          <Face pos="right">Node</Face>
          <Face pos="top">Java</Face>
          <Face pos="bottom">Swift</Face>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm opacity-70">Click to focus a face</div>
        <div className="flex flex-wrap gap-2">
          {FACES.map(f=>(
            <button key={f.id}
              className={`btn ${active===f.id?"border-teal-400/50":""}`}
              onClick={()=>setActive(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Face({ pos, children }){
  const base = "cube-face bg-white/5";
  const style = {
    front:  { transform:"translateZ(112px)" },
    back:   { transform:"rotateY(180deg) translateZ(112px)" },
    left:   { transform:"rotateY(-90deg) translateZ(112px)" },
    right:  { transform:"rotateY(90deg) translateZ(112px)" },
    top:    { transform:"rotateX(90deg) translateZ(112px)" },
    bottom: { transform:"rotateX(-90deg) translateZ(112px)" },
  }[pos];
  return <div className={base} style={style}><span className="text-lg">{children}</span></div>;
}
