import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { accounts } from "../data/accounts";

const STATUS_COLOR = { active: "#34d399", pilot: "#60a5fa", poc: "#f59e0b" };

function latLonToVec3(lat, lon, r=1){
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function GridMeridians({ radius=1.005 }){
  const group = useRef();
  const material = useMemo(()=>new THREE.LineBasicMaterial({ color:"#1f2937", transparent:true, opacity:0.6 }),[]);
  const geoCircle = (r)=>new THREE.CircleGeometry(r, 128).toNonIndexed();
  const geo = useMemo(()=>{
    const g = new THREE.BufferGeometry();
    const circles = [];
    for(let i=15;i<90;i+=15){
      const c = geoCircle(radius*Math.sin(THREE.MathUtils.degToRad(i)));
      circles.push(c);
    }
    const merged = THREE.BufferGeometryUtils?.mergeGeometries
      ? THREE.BufferGeometryUtils.mergeGeometries(circles)
      : circles[0];
    return merged;
  },[radius]);
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#0b1220" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh scale={1.003}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial wireframe wireframeLinewidth={1} color="#1f2a3a" transparent opacity={0.35}/>
      </mesh>
    </group>
  );
}

function Markers({ onPick }){
  const pts = useMemo(()=>accounts.map(a=>{
    const p = latLonToVec3(a.lat, a.lon, 1.02);
    return { ...a, pos:p, color: STATUS_COLOR[a.status] || "#a3a3a3" };
  }),[]);
  return (
    <group>
      {pts.map((a,i)=>(
        <mesh key={i} position={a.pos} onClick={(e)=>{ e.stopPropagation(); onPick(a); }}>
          <sphereGeometry args={[0.018, 20, 20]} />
          <meshStandardMaterial color={a.color} emissive={a.color} emissiveIntensity={0.2}/>
        </mesh>
      ))}
    </group>
  );
}

function Scene({ onPick, focusReq }){
  const group = useRef();
  const controls = useRef();
  const targetQuat = useRef(new THREE.Quaternion());
  const tmpQ = new THREE.Quaternion();

  useEffect(()=>{
    if(!focusReq) return;
    const { lat, lon } = focusReq;
    const v = latLonToVec3(lat, lon, 1);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), v.clone().normalize());
    targetQuat.current.copy(q);
  },[focusReq]);

  useFrame((_,dt)=>{
    if(group.current){
      group.current.quaternion.slerp(targetQuat.current, Math.min(1, dt*2.5));
    }
  });

  return (
    <>
      <ambientLight intensity={0.6}/>
      <directionalLight position={[3,4,2]} intensity={1}/>
      <directionalLight position={[-3,-2,-4]} intensity={0.3}/>
      <pointLight position={[0,-3,0]} intensity={0.5}/>
      <group ref={group} rotation={[0.25, 0.9, 0]}>
        <GridMeridians radius={1}/>
        <Markers onPick={onPick}/>
      </group>
      <OrbitControls ref={controls} enablePan={false} enableZoom={false} minPolarAngle={0.6} maxPolarAngle={2.5} dampingFactor={0.08} enableDamping />
    </>
  );
}

export default function Globe3D(){
  const [detail, setDetail] = useState(null);
  const [focusReq, setFocusReq] = useState(null);

  useEffect(()=>{
    const onFocusCountry = (ev)=>{
      const country = ev.detail?.country;
      if(!country) return;
      const subset = accounts.filter(a=>a.country===country);
      if(!subset.length) return;
      const c = subset[0];
      setFocusReq({ lat:c.lat, lon:c.lon });
      setTimeout(()=>setDetail(c), 350);
    };
    window.addEventListener("focus-country", onFocusCountry);
    return ()=>window.removeEventListener("focus-country", onFocusCountry);
  },[]);

  return (
    <section id="globe" className="section">
      <div className="card globe-wrap">
        <div className="globe-canvas">
          <Canvas camera={{ position:[0,0,3.2], fov:40 }} gl={{ antialias:true }}>
            <Scene onPick={setDetail} focusReq={focusReq}/>
          </Canvas>
        </div>
        {detail && (
          <div className="globe-modal">
            <div className="globe-modal-inner">
              <div className="globe-title">{detail.name}</div>
              <div className="globe-sub">{detail.country}</div>
              <div className="globe-focus"><em>{detail.focus}</em></div>
              <button className="btn mt-2" onClick={()=>setDetail(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
