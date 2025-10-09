import React, { useEffect, useMemo, useState } from "react";
import Modal from "./Modal.jsx";
const FACES=[{key:"javascript",title:"JavaScript",summary:"Interactive apps, UI glue, tooling."},{key:"python",title:"Python",summary:"Data work, quick tools, automation."},{key:"react",title:"React",summary:"Modern front-ends, SPA patterns."},{key:"node",title:"Node",summary:"APIs, CLIs, integrations."},{key:"java",title:"Java",summary:"Enterprise adapters, JVM stacks."},{key:"swift",title:"Swift",summary:"iOS prototypes, SDK evaluations."}];
function useMQ(q){const[s,setS]=useState(false);useEffect(()=>{const m=window.matchMedia(q);const h=e=>setS(e.matches);setS(m.matches);m.addEventListener("change",h);return()=>m.removeEventListener("change",h)},[q]);return s;}
export default function Cube(){const narrow=useMQ("(max-width:1023px)");const[active,setActive]=useState(0);const[open,setOpen]=useState(false);
  const rot=useMemo(()=>{switch(active){case 0:return"rotateX(-18deg) rotateY(32deg)";case 1:return"rotateY(180deg) rotateX(-18deg) rotateY(32deg)";case 2:return"rotateY(90deg) rotateX(-18deg) rotateY(32deg)";case 3:return"rotateY(-90deg) rotateX(-18deg) rotateY(32deg)";case 4:return"rotateX(-90deg) rotateY(32deg)";case 5:return"rotateX(90deg) rotateY(32deg)";default:return"rotateX(-18deg) rotateY(32deg)" }},[active]);
  if(narrow){return(<div className="skills-fallback">{FACES.map((f,i)=>(<button key={f.key} className="skill-card" onClick={()=>{setActive(i);setOpen(true);}}><div className="skill-title">{f.title}</div><div className="skill-sub">{f.summary}</div></button>))}<Modal open={open} onClose={()=>setOpen(false)} title={FACES[active]?.title}><p>{FACES[active]?.summary}</p><p className="mt-2 opacity-80">Ask me for examples; I can link repos, PoCs, or demos.</p></Modal></div>);}
  return(<div className="cube-wrap"><div className="perspective"><div className="cube" style={{transform:rot}}>
    <button className="cube-face cube-front"  onClick={()=>setOpen(true)} aria-label={FACES[0].title}><span>{FACES[0].title}</span></button>
    <button className="cube-face cube-back"   onClick={()=>{setActive(1);setOpen(true);}} aria-label={FACES[1].title}><span>{FACES[1].title}</span></button>
    <button className="cube-face cube-left"   onClick={()=>{setActive(2);setOpen(true);}} aria-label={FACES[2].title}><span>{FACES[2].title}</span></button>
    <button className="cube-face cube-right"  onClick={()=>{setActive(3);setOpen(true);}} aria-label={FACES[3].title}><span>{FACES[3].title}</span></button>
    <button className="cube-face cube-top"    onClick={()=>{setActive(4);setOpen(true);}} aria-label={FACES[4].title}><span>{FACES[4].title}</span></button>
    <button className="cube-face cube-bottom" onClick={()=>{setActive(5);setOpen(true);}} aria-label={FACES[5].title}><span>{FACES[5].title}</span></button>
  </div></div>
  <div className="cube-legend"><span className="hint">Click to focus a face</span><div className="legend-row">
    {FACES.map((f,i)=>(<button key={f.key} className={`legend-pill ${active===i?"active":""}`} onClick={()=>setActive(i)}>{f.title}</button>))}
  </div></div>
  <Modal open={open} onClose={()=>setOpen(false)} title={FACES[active]?.title}><p>{FACES[active]?.summary}</p><ul className="list"><li>What I’ve built: dashboards, APIs, adapters, PoCs.</li><li>Where I used it: client demos, presales, integrations.</li><li>Ask for a quick 2-min walkthrough.</li></ul></Modal></div>);
}
