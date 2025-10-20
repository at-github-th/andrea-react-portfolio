import { useEffect, useRef } from "react";
export default function Particles({count=70}){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c) return; const ctx=c.getContext("2d");
    let w=c.width=c.offsetWidth, h=c.height=c.offsetHeight;
    const onR=()=>{ w=c.width=c.offsetWidth; h=c.height=c.offsetHeight; }; const R=()=>Math.random();
    const pts=[...Array(count)].map(()=>({x:R()*w,y:R()*h,vx:(R()-.5)*.4,vy:(R()-.5)*.4}));
    let raf; const tick=()=>{ ctx.clearRect(0,0,w,h); for(const p of pts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1; }
      for(let i=0;i<pts.length;i++){ for(let j=i+1;j<pts.length;j++){ const a=pts[i],b=pts[j]; const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy); if(d<120){ ctx.globalAlpha=(120-d)/300; ctx.strokeStyle="rgba(34,211,238,0.45)"; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } } }
      ctx.globalAlpha=1; for(const p of pts){ ctx.fillStyle="rgba(34,211,238,0.65)"; ctx.beginPath(); ctx.arc(p.x,p.y,1.2,0,Math.PI*2); ctx.fill(); }
      raf=requestAnimationFrame(tick);
    }; raf=requestAnimationFrame(tick); window.addEventListener("resize",onR,{passive:true}); return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",onR); };
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-40"></canvas>;
}
