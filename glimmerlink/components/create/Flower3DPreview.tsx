"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface FlowerModelProps {
  type: string | null;
  color: string;
}

// ── STEM & LEAVES ──────────────────────────────────────────────────────────
function StemAndLeaves() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.3, 0),
        new THREE.Vector3(0.04, -0.6, 0),
        new THREE.Vector3(-0.04, 0.1, 0),
        new THREE.Vector3(0, 0.7, 0),
      ]),
    []
  );

  return (
    <group>
      {/* Stem Tube */}
      <mesh>
        <tubeGeometry args={[curve, 20, 0.045, 12, false]} />
        <meshStandardMaterial color="#2d7a32" roughness={0.6} />
      </mesh>
      {/* Lower Leaf */}
      <mesh position={[-0.15, -0.3, 0]} rotation={[0.4, 0.2, 0.9]} scale={[1, 1, 0.6]}>
        <coneGeometry args={[0.1, 0.45, 5]} />
        <meshStandardMaterial color="#388e3c" roughness={0.7} />
      </mesh>
      {/* Upper Leaf */}
      <mesh position={[0.18, 0.25, 0]} rotation={[-0.4, -0.2, -0.9]} scale={[1, 1, 0.6]}>
        <coneGeometry args={[0.09, 0.4, 5]} />
        <meshStandardMaterial color="#388e3c" roughness={0.7} />
      </mesh>
    </group>
  );
}

// ── ROSE HEAD ──────────────────────────────────────────────────────────────
function RoseHead({ color }: { color: string }) {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.3,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  const petals = useMemo(() => {
    const list: { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }[] = [];
    // Outer ring
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI * 2) / 8;
      list.push({
        position: [Math.sin(a) * 0.22, 0.02, Math.cos(a) * 0.22],
        rotation: [0.55, -a, 0.3],
        scale: [0.38, 0.16, 0.38],
      });
    }
    // Mid ring
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6 + 0.5;
      list.push({
        position: [Math.sin(a) * 0.14, 0.08, Math.cos(a) * 0.14],
        rotation: [0.85, -a, 0.5],
        scale: [0.3, 0.13, 0.3],
      });
    }
    // Inner ring
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI * 2) / 4;
      list.push({
        position: [Math.sin(a) * 0.06, 0.14, Math.cos(a) * 0.06],
        rotation: [1.15, -a, 0.7],
        scale: [0.22, 0.11, 0.22],
      });
    }
    return list;
  }, []);

  return (
    <group position={[0, 0.7, 0]}>
      {petals.map((p, idx) => (
        <mesh key={idx} position={p.position} rotation={p.rotation} scale={p.scale} material={mat}>
          <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      ))}
      {/* Center bud */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
    </group>
  );
}

// ── TULIP HEAD ─────────────────────────────────────────────────────────────
function TulipHead({ color }: { color: string }) {
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: 0.25,
        clearcoat: 0.2,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  const petals = useMemo(() => {
    const list: { position: [number, number, number]; rotation: [number, number, number]; scale: [number, number, number] }[] = [];
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      list.push({
        position: [Math.sin(a) * 0.12, 0.05, Math.cos(a) * 0.12],
        rotation: [0.38, -a, 0.1],
        scale: [0.22, 0.48, 0.22],
      });
    }
    return list;
  }, []);

  return (
    <group position={[0, 0.7, 0]}>
      {petals.map((p, idx) => (
        <mesh key={idx} position={p.position} rotation={p.rotation} scale={p.scale} material={mat}>
          <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      ))}
    </group>
  );
}

// ── SUNFLOWER HEAD ─────────────────────────────────────────────────────────
function SunflowerHead({ color }: { color: string }) {
  const petalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color || "#f59e0b"),
        roughness: 0.35,
        clearcoat: 0.2,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  const petals = useMemo(() => {
    const list: number[] = [];
    for (let i = 0; i < 16; i++) list.push((i * Math.PI * 2) / 16);
    return list;
  }, []);

  return (
    <group position={[0, 0.7, 0]}>
      {/* Outer yellow petals */}
      {petals.map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 0.28, 0, Math.cos(angle) * 0.28]}
          rotation={[0.06, -angle, 0]}
          scale={[0.1, 0.42, 0.04]}
          material={petalMat}
        >
          <sphereGeometry args={[0.8, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
      ))}
      {/* Central seed disc */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.35]}>
        <sphereGeometry args={[0.18, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3e1f00" roughness={0.95} />
      </mesh>
    </group>
  );
}

// ── DAISY HEAD ─────────────────────────────────────────────────────────────
function DaisyHead({ color }: { color: string }) {
  const petalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color || "#ffffff"),
        roughness: 0.25,
        clearcoat: 0.4,
        side: THREE.DoubleSide,
      }),
    [color]
  );

  const petals = useMemo(() => {
    const list: { angle: number; tilt: number }[] = [];
    for (let i = 0; i < 18; i++) {
      list.push({
        angle: (i * Math.PI * 2) / 18,
        tilt: i % 2 === 0 ? 0.06 : -0.03,
      });
    }
    return list;
  }, []);

  return (
    <group position={[0, 0.7, 0]}>
      {petals.map((p, i) => (
        <mesh
          key={i}
          position={[Math.sin(p.angle) * 0.22, p.tilt * 0.5, Math.cos(p.angle) * 0.22]}
          rotation={[0.12 + p.tilt, -p.angle, 0]}
          scale={[0.06, 0.4, 0.03]}
          material={petalMat}
        >
          <sphereGeometry args={[0.8, 10, 12, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        </mesh>
      ))}
      {/* Center yellow disc */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 0.55]}>
        <sphereGeometry args={[0.13, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#fbbf24" roughness={0.5} clearcoat={0.6} />
      </mesh>
    </group>
  );
}

// ── FLOATING PARTICLES ─────────────────────────────────────────────────────
function SparkleParticles({ color }: { color: string }) {
  const count = 28;
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 1.8,
        y: (Math.random() - 0.5) * 2.2 + 0.3,
        z: (Math.random() - 0.5) * 1.4,
        speed: 0.5 + Math.random() * 1.2,
        offset: Math.random() * Math.PI * 2,
        size: 0.012 + Math.random() * 0.018,
      });
    }
    return arr;
  }, [count]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      if (child && p) {
        child.position.y = p.y + Math.sin(t * p.speed + p.offset) * 0.12;
        child.position.x = p.x + Math.cos(t * (p.speed * 0.6) + p.offset) * 0.08;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color={color || "#ff7ac6"} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}

// ── MAIN ANIMATED FLOWER SCENE ─────────────────────────────────────────────
function FlowerScene({ type, color }: FlowerModelProps) {
  const flowerRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Responsive scale factor for mobile devices
  const responsiveScale = useMemo(() => {
    // When viewport.width is narrower (e.g. mobile portrait), scale down slightly
    // so petals and head never touch or crop against canvas borders
    return Math.min(1.0, Math.max(0.75, viewport.width / 2.6));
  }, [viewport.width]);

  useFrame(({ clock }) => {
    if (!flowerRef.current) return;
    const t = clock.getElapsedTime();
    flowerRef.current.position.y = -0.38 + Math.sin(t * 1.5) * 0.035;
    flowerRef.current.rotation.y = t * 0.35;
  });

  return (
    <group ref={flowerRef} position={[0, -0.38, 0]} scale={responsiveScale}>
      <StemAndLeaves />
      {type === "rose" && <RoseHead color={color} />}
      {type === "tulip" && <TulipHead color={color} />}
      {type === "sunflower" && <SunflowerHead color={color} />}
      {type === "daisy" && <DaisyHead color={color} />}
      <SparkleParticles color={color} />
    </group>
  );
}

// ── COMPONENT EXPORT ───────────────────────────────────────────────────────
export default function Flower3DPreview({
  type = "rose",
  color = "#ff3388",
}: {
  type?: string | null;
  color?: string;
}) {
  if (!type) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 space-y-2 select-none">
        <span className="text-4xl animate-bounce">🍃</span>
        <p className="text-slate-400 text-xs font-serif italic max-w-[200px]">
          No flower selected. Senders will skip directly to the celebration page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0.05, 2.75], fov: 46 }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[2, 4, 3]} intensity={1.8} />
        <pointLight position={[-2, 2, 2]} intensity={1.2} color="#ffffff" />
        <pointLight position={[0, -1, -2]} intensity={0.5} />
        <FlowerScene type={type} color={color} />
      </Canvas>

      {/* Floating Badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] uppercase tracking-widest text-amber-300 font-bold border border-white/10 pointer-events-none select-none">
        INTERACTIVE 3D PREVIEW
      </div>
    </div>
  );
}
