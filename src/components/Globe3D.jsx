import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { accounts } from "../data/accounts";
import AccountListModal from "./AccountListModal.jsx";

const STATUS = { active:"#34d399", pilot:"#60a5fa", poc:"#f59e0b" };

function latLngToVec3(lat, lon, r=1){
  const phi = (90-lat) * Math.PI/180;
  const theta = (lon+180) * Math.PI/180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  ];
}

function Graticule({step=15, radius=1.001, opacity=.1}){
  const lines=[];
  for(let lon=-180; lon<=180; lon+=step){
    const pts=[];
    for(let lat=-90; lat<=90; lat+=3) pts.push(latLngToVec3(lat,lon,radius));
    lines.push(pts);
  }
  for(let lat=-60; lat<=60; lat+=step){
    const pts=[];
    for(let lon=-180; lon<=180; lon+=3) pts.push(latLngToVec3(lat,lon,radius));
    lines.push(pts);
  }
  return lines.map((pts,i)=>(
    <group key={i}>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            count={pts.length}
            array={new Float32Array(pts.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="white" opacity={opacity} transparent />
      </line>
    </group>
  ));
}

function Pins({data, onPick, radius=1.02}){
  const ref = useRef();
  useEffect(()=>{ ref.current && ref.current.children.forEach(m=>m.lookAt(0,0,0)); },[data]);
  return (
    <group ref={ref}>
      {data.map((a,i)=>{
        const [x,y,z]=latLngToVec3(a.lat,a.lon,radius);
        const c = STATUS[a.status] || "#9ca3af";
        return (
          <mesh key={i} position={[x,y,z]} onClick={(e)=>{ e.stopPropagation(); onPick(a); }}>
            <sphereGeometry args={[0.018,16,16]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.25} />
          </mesh>
        );
      })}
    </group>
  );
}

function GlobeInner({onPick, spinTo}){
  const group = useRef();
  useFrame(()=>{ group.current.rotation.y += 0.0005; });
  useEffect(()=>{
    if(!spinTo) return;
    const {lat,lon} = spinTo;
    const targetY = -((lon+180)*Math.PI/180);
    const targetX = (lat-0)*Math.PI/180;
    let t=0; const startY = group.current.rotation.y; const startX = group.current.rotation.x;
    const anim = ()=>{ t=Math.min(1,t+0.04); group.current.rotation.y = startY + (targetY-startY)*t; group.current.rotation.x = startX + (targetX-startX)*t; if(t<1) requestAnimationFrame(anim); };
    anim();
  },[spinTo]);

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial color="#07141b" metalness={0.1} roughness={0.9} />
      </mesh>
      <Graticule />
      <Pins data={accounts} onPick={onPick} />
    </group>
  );
}

export default function Globe3D(){
  const [modal,setModal]=useState({open:false,country:"",items:[]});
  const [spinTo,setSpinTo]=useState(null);
  const countryMap = useMemo(()=>{
    const m = new Map();
    accounts.forEach(a=>{ const k=a.country; if(!m.has(k)) m.set(k,[]); m.get(k).push(a); });
    return m;
  },[]);
  useEffect(()=>{
    const onPill = (ev)=>{
      const country=ev.detail?.country; if(!country) return;
      const arr = countryMap.get(country)||[];
      if(arr.length<=1){
        const a = arr[0]; if(!a) return;
        setSpinTo({lat:a.lat,lon:a.lon});
        window.dispatchEvent(new CustomEvent("focus-account",{detail:{name:a.name}}));
      }else{
        setModal({open:true,country,items:arr});
      }
    };
    window.addEventListener("focus-country", onPill);
    return ()=>window.removeEventListener("focus-country", onPill);
  },[countryMap]);

  useEffect(()=>{
    const onFocusAcc = (ev)=>{
      const name = ev.detail?.name;
      const a = accounts.find(x=>x.name===name);
      if(a) setSpinTo({lat:a.lat,lon:a.lon});
    };
    window.addEventListener("focus-account", onFocusAcc);
    return ()=>window.removeEventListener("focus-account", onFocusAcc);
  },[]);

  const onPick = (a)=>{
    window.dispatchEvent(new CustomEvent("open-account-modal",{detail:{account:a}}));
  };

  return (
    <div className="card p-3 md:p-6">
      <div className="w-full h-[420px] md:h-[560px]">
        <Canvas camera={{position:[0,0,2.3], fov:45}}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[2,1,2]} intensity={1.2} />
          <directionalLight position={[-2,-1,-2]} intensity={0.2} />
          <GlobeInner onPick={onPick} spinTo={spinTo} />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>
      <AccountListModal open={modal.open} onClose={()=>setModal(v=>({...v,open:false}))} country={modal.country} items={modal.items} />
    </div>
  );
}
