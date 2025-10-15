import React,{useMemo} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { accounts } from "../data/accounts.js";
function latLonToXYZ(lat,lon,r=1){const phi=(90-lat)*(Math.PI/180),theta=(lon+180)*(Math.PI/180);
  return new THREE.Vector3(-r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta));}
function Pins(){
  const pts=useMemo(()=>accounts.map(a=>({a,v:latLonToXYZ(a.lat,a.lon,1.01)})),[]);
  return(<group>{pts.map(({a,v},i)=>(
    <mesh key={i} position={v.toArray()} onClick={()=>{
      location.hash='#worldmap'; setTimeout(()=>document.querySelector('#worldmap')?.scrollIntoView({behavior:'smooth'}),100);
    }}>
      <sphereGeometry args={[0.01,8,8]} /><meshStandardMaterial color={a.status==='active'?'#34d399':a.status==='pilot'?'#60a5fa':'#f59e0b'} />
    </mesh>))}</group>);
}
export default function Globe(){
  const reduced=typeof window!=='undefined'&&window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(reduced) return null;
  return(<div className="w-full h-[360px] md:h-[460px] rounded-2xl border border-white/10 overflow-hidden">
    <Canvas camera={{position:[0,0,2.6],fov:50}}>
      <ambientLight intensity={0.6}/><directionalLight position={[3,3,3]} intensity={0.8}/>
      <mesh rotation={[0.35,0.8,0]}><sphereGeometry args={[1,64,64]}/><meshStandardMaterial color="#0f172a" wireframe/></mesh>
      <Pins/><OrbitControls enablePan={false} enableZoom={false}/>
    </Canvas>
  </div>);
}
