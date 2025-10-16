// src/components/Globe3D.jsx
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { accounts } from "../data/accounts";

// ---------- helpers ----------
const toRad = (deg) => (deg * Math.PI) / 180;
function toCartesian(lat, lon, radius = 1) {
  const phi = toRad(90 - lat);
  const theta = toRad(lon + 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y =  radius * Math.cos(phi);
  const z =  radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}
const groupByCountry = (list) => {
  const m = new Map();
  list.forEach(a => {
    const key = a.country || "Unknown";
    if (!m.has(key)) m.set(key, []);
    m.get(key).push(a);
  });
  return m;
};

// ---------- UI bits ----------
function Badge({ status }) {
  const map = {
    active: "badge badge-active",
    pilot: "badge badge-pilot",
    poc: "badge badge-poc",
    paused: "badge badge-paused",
  };
  return <span className={map[status] || "badge"}>{status || "unknown"}</span>;
}

function CountryModal({ open, country, items, onClose, onSelect }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <strong>{country}</strong>
          <button className="xbtn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          {items.length === 0 && <div className="empty">No items.</div>}
          {items.map((a,i)=>(
            <button key={i} className="modal-row" onClick={()=>onSelect(a)}>
              <div className="modal-title">{a.name}</div>
              <div className="modal-sub"><Badge status={a.status}/> • {a.focus}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AccountSheet({ open, account, onClose }) {
  const [tab, setTab] = useState("overview");
  useEffect(()=>{ setTab("overview"); }, [account]);
  if (!open || !account) return null;
  return (
    <div className="modal-wrap" onClick={onClose}>
      <div className="modal-card wide" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <div className="row"><strong>{account.name}</strong><Badge status={account.status}/></div>
          <button className="xbtn" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="tabs">
          <button className={tab==="overview"?"tab on":"tab"} onClick={()=>setTab("overview")}>Overview</button>
          <button className={tab==="notes"?"tab on":"tab"} onClick={()=>setTab("notes")}>Notes</button>
          <button className={tab==="actions"?"tab on":"tab"} onClick={()=>setTab("actions")}>Actions</button>
        </div>
        <div className="modal-body">
          {tab==="overview" && (
            <div className="grid2">
              <div>
                <div className="label">Country</div><div className="value">{account.country}</div>
                <div className="label mt">Focus</div><div className="value">{account.focus}</div>
                <div className="label mt">Coordinates</div><div className="value">{account.lat}, {account.lon}</div>
              </div>
              <div>
                <div className="label">Status</div><div className="value"><Badge status={account.status}/></div>
                <div className="label mt">Tags</div>
                <div className="pills">{(account.tags||["integration","demo"]).map((t,i)=>(<span key={i} className="pill">{t}</span>))}</div>
              </div>
            </div>
          )}
          {tab==="notes" && (<div className="notes"><textarea defaultValue={account.notes||""} placeholder="Quick notes…" rows={8}/></div>)}
          {tab==="actions" && (
            <div className="actions">
              <button className="btn">Open in CRM</button>
              <button className="btn">Copy Link</button>
              <button className="btn btn-secondary">Mark as Follow-up</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Fallback globe core (simple shaded sphere)
function GlobeCore() {
  const mat = React.useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0b1220"),
    roughness: 0.55,
    metalness: 0.35,
    envMapIntensity: 0.9,
  }), []);
  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

// ---------- 3D parts (no R3F hooks!) ----------
function Atmosphere() {
  const mat = useMemo(()=>new THREE.MeshBasicMaterial({
    color: new THREE.Color("#5eead4"), transparent: true, opacity: 0.08,
    blending: THREE.AdditiveBlending, side: THREE.BackSide
  }), []);
  return (<mesh scale={1.18}><sphereGeometry args={[1.0,64,64]}/><primitive object={mat} attach="material"/></mesh>);
}
function GridLines() {
  const geo = useMemo(()=>new THREE.SphereGeometry(1.001, 64, 64), []);
  return (<mesh geometry={geo}><meshBasicMaterial wireframe opacity={0.12} transparent/></mesh>);
}
function Starfield() {
  // Static starfield (no useFrame)
  const stars = useMemo(()=>{
    const g = new THREE.BufferGeometry(), count = 1200;
    const positions = new Float32Array(count*3);
    for (let i=0;i<count;i++){
      const r = 28 + Math.random()*42, th = Math.random()*Math.PI*2, ph = Math.acos((Math.random()*2)-1);
      positions[i*3+0] = r * Math.sin(ph) * Math.cos(th);
      positions[i*3+1] = r * Math.cos(ph);
      positions[i*3+2] = r * Math.sin(ph) * Math.sin(th);
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  },[]);
  return (<points geometry={stars}><pointsMaterial size={0.14} sizeAttenuation/></points>);
}
function Pulse({ radius=0.02 }){
  // Light “breathing” via rAF on a local ref (no useFrame)
  const ref = useRef();
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = (now - start) / 1000;
      const s = 1 + Math.sin(t*3) * 0.25;
      if (ref.current) ref.current.scale.setScalar(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (<mesh ref={ref}><sphereGeometry args={[radius,16,16]} /><meshStandardMaterial emissiveIntensity={1} emissive="white" transparent opacity={0.85}/></mesh>);
}
function Pins({ data, onPick }) {
  const items = useMemo(()=>data.map((a,i)=>({ ...a, pos: toCartesian(a.lat, a.lon, 1.02), key: `${a.name}-${i}` })),[data]);
  const handleClick = useCallback((item,e)=>{ e.stopPropagation(); onPick(item); },[onPick]);
  return (
    <group>
      {items.map(item=>(
        <group position={item.pos} key={item.key}>
          <mesh onClick={(e)=>handleClick(item,e)}>
            <sphereGeometry args={[0.018,16,16]}/>
            <meshStandardMaterial
              color={ item.status==="active" ? "#34d399" : item.status==="pilot" ? "#60a5fa" : item.status==="poc" ? "#f59e0b" : "#a3a3a3" }
              roughness={0.5} metalness={0.2} emissiveIntensity={0.5}
              emissive={ item.status==="active" ? "#0ea5e9" : "#000000" }
            />
          </mesh>
          <Pulse radius={0.012}/>
        </group>
      ))}
    </group>
  );
}

// ---------- Main (no R3F hooks) ----------
export default function Globe3D() {
  const controlsRef = useRef();
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const [countryOpen, setCountryOpen] = useState(null);
  const [accountOpen, setAccountOpen] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const byCountry = useMemo(() => groupByCountry(accounts), []);
  const uniqueCountries = useMemo(() => Array.from(byCountry.keys()).sort(), [byCountry]);

  // reactive mobile flag
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(a => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || a.name.toLowerCase().includes(q) || (a.focus||"").toLowerCase().includes(q) || (a.country||"").toLowerCase().includes(q);
      const matchS = statusFilter === "all" || a.status === statusFilter;
      return matchQ && matchS;
    });
  }, [query, statusFilter]);

  // Smooth camera focus without R3F hooks (animate OrbitControls' camera directly)
  const tweenRef = useRef(null);
  const focusTo = useCallback((lat, lon) => {
    const targetPos = toCartesian(lat, lon, isMobile ? 3.8 : 3.2); // keep distance consistent with camera
    const cam = controlsRef.current?.object; // THREE.PerspectiveCamera
    if (!cam) return;

    setControlsEnabled(false);
    const from = cam.position.clone();
    const to = targetPos.clone();
    const start = performance.now();
    const dur = 900;

    if (tweenRef.current) cancelAnimationFrame(tweenRef.current.raf);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad
      cam.position.lerpVectors(from, to, ease);
      cam.lookAt(0, 0, 0);
      controlsRef.current?.update();
      if (t < 1) {
        tweenRef.current.raf = requestAnimationFrame(tick);
      }
    };
    tweenRef.current = { raf: requestAnimationFrame(tick) };
  }, [isMobile]);

  const focusOfCountry = useCallback((country) => {
    const arr = byCountry.get(country) || [];
    if (!arr.length) return null;
    const lat = arr.reduce((s,a)=>s+(a.lat||0),0) / arr.length;
    const lon = arr.reduce((s,a)=>s+(a.lon||0),0) / arr.length;
    return { lat, lon };
  }, [byCountry]);

  function onPinPick(item) {
    setCountryOpen(item.country);
    focusTo(item.lat, item.lon);
  }
  const handleCountrySelect = useCallback((country) => {
    if (!country) return;
    setCountryOpen(country);
    const focus = focusOfCountry(country);
    if (focus) focusTo(focus.lat, focus.lon);
  }, [focusOfCountry, focusTo]);

  useEffect(()=>{ if (!countryOpen && !accountOpen) setControlsEnabled(true); }, [countryOpen, accountOpen]);
  useEffect(()=>() => { if (tweenRef.current) cancelAnimationFrame(tweenRef.current.raf); }, []);

  const lights = (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1.1} position={[5, 5, 5]} />
      <spotLight intensity={0.45} position={[-3, -2, -1]} />
    </>
  );

  const countryPills = useMemo(
    () => uniqueCountries.map(c => ({ name: c, count: (byCountry.get(c) || []).length })),
    [uniqueCountries, byCountry]
  );

  return (
    <div className={`globe-card ${!controlsEnabled ? "modal-open" : ""}`}>
      {/* toolbar */}
      <div className="globe-toolbar">
        <input
          className="input"
          placeholder="Search accounts, focus, country…"
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />
        <select className="input" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pilot">Pilot</option>
          <option value="poc">POC</option>
          <option value="paused">Paused</option>
        </select>
        <select className="input" value={countryOpen||""} onChange={(e)=>handleCountrySelect(e.target.value||"")}>
          <option value="">Jump to country…</option>
          {uniqueCountries.map(c=>(<option key={c} value={c}>{c}</option>))}
        </select>
        <button className="btn" onClick={()=>{
          setQuery(""); setStatusFilter("all"); setCountryOpen(null); setAccountOpen(null);
          setControlsEnabled(true);
        }}>Reset</button>
      </div>

      {/* globe */}
      <Canvas
        camera={{ position: [0, 0, isMobile ? 3.8 : 3.2], fov: isMobile ? 47 : 45 }}
        gl={{ outputColorSpace: THREE.SRGBColorSpace }}
        dpr={[1, 2]}
      >
        <Starfield />
        {lights}
        <Atmosphere />
        <GlobeCore />
        <GridLines />
        <Pins data={filteredAccounts} onPick={onPinPick} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          enableRotate={controlsEnabled}
          autoRotate={controlsEnabled}
          autoRotateSpeed={0.5}
          dampingFactor={0.08}
        />
      </Canvas>

      {/* country pills row */}
      <div className="globe-pills">
        {countryPills.map(cp=>(
          <button
            key={cp.name}
            className="pill pill-btn"
            onClick={()=>handleCountrySelect(cp.name)}
            aria-pressed={countryOpen === cp.name ? "true" : "false"}
          >
            {cp.name} <span className="pill-count">{cp.count}</span>
          </button>
        ))}
      </div>

      {/* modals */}
      <CountryModal
        open={!!countryOpen}
        country={countryOpen || ""}
        items={countryOpen ? (byCountry.get(countryOpen) || []).filter(a => filteredAccounts.includes(a)) : []}
        onClose={()=>{ setCountryOpen(null); setControlsEnabled(true); }}
        onSelect={(a)=>{ setAccountOpen(a); }}
      />
      <AccountSheet open={!!accountOpen} account={accountOpen} onClose={()=>setAccountOpen(null)} />
    </div>
  );
}
