// src/components/Globe3D.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { accounts } from "../data/accounts";

// ---- helpers ----
function toCartesian(lat, lon, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y =  radius * Math.cos(phi);
  const z =  radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function CountryModal({ open, country, items, onClose, onSelect }) {
  if (!open) return null;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <strong>{country}</strong>
          <button className="xbtn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {items.map((a,i)=>(
            <button key={i} className="modal-row" onClick={()=>onSelect(a)}>
              <div className="modal-title">{a.name}</div>
              <div className="modal-sub">{a.focus}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountSheet({ open, account, onClose }) {
  if (!open || !account) return null;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal-card small" onClick={e=>e.stopPropagation()}>
        <div className="modal-head">
          <strong>{account.name}</strong>
          <button className="xbtn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-sub">{account.country}</div>
          <div className="modal-sub">{account.focus}</div>
          <p className="opacity-70 text-sm mt-2">
            (More project notes can go here.)
          </p>
        </div>
      </div>
    </div>
  );
}

// ---- 3D parts ----
function GlobeMesh() {
  // base sphere
  const mat = useMemo(()=>{
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0f172a"),
      roughness: 0.9,
      metalness: 0.0,
      transparent: true,
      opacity: 0.95
    });
    return m;
  }, []);

  // subtle radial “day/night” vignette
  const grad = useMemo(()=>{
    const g = new THREE.SphereGeometry(1.01, 64, 64);
    const m = new THREE.MeshBasicMaterial({
      color: "#0b1222",
      transparent: true,
      opacity: 0.4
    });
    return <mesh geometry={g} material={m} />;
  }, []);

  // graticule (lat/lon wireframe)
  const wire = useMemo(()=>{
    const geo = new THREE.SphereGeometry(1.001, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: "#3b3b59",
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    return <mesh geometry={geo} material={mat} />;
  }, []);

  return (
    <group>
      <mesh geometry={new THREE.SphereGeometry(1, 64, 64)} material={mat} />
      {grad}
      {wire}
    </group>
  );
}

function Pins({ data, onPick }) {
  const group = useRef();
  const items = useMemo(()=>data.map((a, i) => {
    const p = toCartesian(a.lat, a.lon, 1.02);
    return { ...a, pos: p, key: `${a.name}-${i}` };
  }), [data]);

  return (
    <group ref={group}>
      {items.map(item => (
        <mesh
          key={item.key}
          position={item.pos}
          onClick={(e)=>{ e.stopPropagation(); onPick(item); }}
        >
          <sphereGeometry args={[0.02, 16, 16]} />
          <meshStandardMaterial
            color={ item.status==="active" ? "#34d399" :
                    item.status==="pilot"  ? "#60a5fa" :
                    item.status==="poc"    ? "#f59e0b" : "#a3a3a3" }
            emissive="#000000"
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// main component
export default function Globe3D(){
  // filter/map data to unique countries map
  const byCountry = useMemo(()=>{
    const m = new Map();
    for (const a of accounts) {
      if (!m.has(a.country)) m.set(a.country, []);
      m.get(a.country).push(a);
    }
    return m;
  }, []);

  const [countryOpen, setCountryOpen] = useState(null); // string | null
  const [accountOpen, setAccountOpen] = useState(null); // object | null
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const controlsRef = useRef();

  // listen for “focus-country” from pills
  useEffect(()=>{
    const handler = (ev)=>{
      const c = ev.detail?.country;
      if (!c || !byCountry.has(c)) return;
      // compute average lat/lon for country to rotate towards
      const list = byCountry.get(c);
      const lat = list.reduce((s,a)=>s + a.lat, 0) / list.length;
      const lon = list.reduce((s,a)=>s + a.lon, 0) / list.length;

      // rotate: we point the controls target to origin and compute a quaternion
      const v = toCartesian(lat, lon, 1);
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0,1,0), // “top” towards +Y
        v.clone().normalize()
      );
      // animate a short slerp
      const start = controlsRef.current?.object.quaternion.clone();
      const end   = q;
      if (!start || !end) return;

      let t = 0;
      const id = setInterval(()=>{
        t += 0.06;
        if (t >= 1) { t = 1; clearInterval(id); setCountryOpen(c); setControlsEnabled(false); }
        controlsRef.current.object.quaternion.slerpQuaternions(start, end, t);
      }, 16);
    };
    window.addEventListener("focus-country", handler);
    return ()=>window.removeEventListener("focus-country", handler);
  }, [byCountry]);

  // when any modal opens, freeze controls to avoid stutter
  useEffect(()=>{
    const open = countryOpen || accountOpen;
    setControlsEnabled(!open);
  }, [countryOpen, accountOpen]);

  const onPinPick = (item)=>{
    setAccountOpen(item);
  };

  const lights = (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight intensity={0.9} position={[3, 2, 2]} />
      <directionalLight intensity={0.5} position={[-3, -2, -1]} />
    </>
  );

  return (
    <div className={`globe-card ${!controlsEnabled ? "modal-open" : ""}`}>
      <Canvas camera={{ position: [0, 0, 2.4], fov: 45 }}>
        {lights}
        <GlobeMesh />
        <Pins data={accounts} onPick={onPinPick} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          enableRotate={controlsEnabled}
          autoRotate={controlsEnabled}
          autoRotateSpeed={0.45}
          dampingFactor={0.08}
        />
      </Canvas>

      <CountryModal
        open={!!countryOpen}
        country={countryOpen || ""}
        items={countryOpen ? byCountry.get(countryOpen) || [] : []}
        onClose={()=>{ setCountryOpen(null); setControlsEnabled(true); }}
        onSelect={(a)=>{ setAccountOpen(a); }}
      />

      <AccountSheet
        open={!!accountOpen}
        account={accountOpen}
        onClose={()=>setAccountOpen(null)}
      />
    </div>
  );
}
