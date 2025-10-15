import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { accounts } from "../data/accounts";

const R = 1.6;
const toVec3 = (lat, lon, r = R) => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  const x = -r * Math.sin(phi) * Math.cos(theta);
  const z =  r * Math.sin(phi) * Math.sin(theta);
  const y =  r * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

function GlobeCore({ onReady }) {
  const group = useRef();
  const [auto, setAuto] = useState(true);

  useFrame((_, dt) => {
    if (auto && group.current) group.current.rotation.y += dt * 0.12;
  });

  useEffect(() => { onReady?.(group.current, setAuto); }, [onReady]);

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial color="#0c2a3a" metalness={0.2} roughness={0.9} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R+0.002, 64, 64]} />
        <meshStandardMaterial color="#0a1e2a" wireframe opacity={0.25} transparent />
      </mesh>
    </group>
  );
}

function Markers({ onPick }) {
  const mesh = useRef();
  const data = useMemo(() => accounts.map(a => ({
    ...a, pos: toVec3(a.lat, a.lon, R+0.02)
  })), []);

  return (
    <group ref={mesh}>
      {data.map((a, i) => (
        <mesh
          key={i}
          position={a.pos}
          onClick={(e) => { e.stopPropagation(); onPick?.(a); }}
        >
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color={a.status === "active" ? "#34d399" : a.status === "pilot" ? "#60a5fa" : "#f59e0b"}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Globe3D() {
  const prefersReduce = typeof window !== "undefined" &&
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tooSmall = typeof window !== "undefined" && window.innerWidth < 900;

  if (prefersReduce || tooSmall) return null;

  const controlsRef = useRef();
  const globeRef = useRef(null);
  const setAutoRef = useRef(() => {});
  const [ready, setReady] = useState(false);

  const onReady = (group, setAuto) => {
    globeRef.current = group;
    setAutoRef.current = setAuto;
    setReady(true);
  };

  useEffect(() => {
    if (!ready) return;
    const handler = (ev) => {
      const country = ev.detail?.country;
      if (!country || !globeRef.current) return;
      const first = accounts.find(a => a.country === country);
      if (!first) return;

      setAutoRef.current(false);

      const target = toVec3(first.lat, first.lon, R).normalize();
      const front = new THREE.Vector3(0, 0, 1);
      const q = new THREE.Quaternion().setFromUnitVectors(target, front);

      const g = globeRef.current;
      const qStart = g.quaternion.clone();
      const qEnd = q;
      let t = 0;
      const dur = 600;
      let last = performance.now();

      const anim = () => {
        const now = performance.now();
        t += (now - last) / dur;
        last = now;
        g.quaternion.slerpQuaternions(qStart, qEnd, Math.min(t, 1));
        controlsRef.current?.update();
        if (t < 1) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    };
    window.addEventListener("focus-country", handler);
    return () => window.removeEventListener("focus-country", handler);
  }, [ready]);

  return (
    <div className="card p-0 overflow-hidden" style={{ height: 460 }}>
      <Canvas camera={{ position: [0, 0, 4.8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight intensity={0.8} position={[5, 5, 5]} />
        <GlobeCore onReady={onReady} />
        <Markers onPick={(a) => {
          window.dispatchEvent(new CustomEvent("focus-country", { detail: { country: a.country } }));
        }} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={3.6}
          maxDistance={7}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
