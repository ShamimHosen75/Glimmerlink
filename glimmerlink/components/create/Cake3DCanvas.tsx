"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Cake3DCanvasProps {
  style: string;
  flavor: string;
  candles: number;
  receiverName: string;
}

const FLAVOR_COLORS: Record<string, string> = {
  vanilla: "#FDF4E3",
  chocolate: "#5D4037",
  strawberry: "#F472B6",
  red_velvet: "#991B1B",
  lemon: "#FEF08A",
  mint: "#4ADE80",
  blueberry: "#1D4ED8",
  caramel: "#D97706",
  coffee: "#6F4E37",
  pistachio: "#84CC16",
};

// ── CANDLE WITH FLICKERING FLAME ───────────────────────────────────────────
function Candle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flicker = Math.sin(t * 18) * 0.08 + Math.cos(t * 26) * 0.05;
    if (flameRef.current) {
      flameRef.current.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
      flameRef.current.rotation.z = Math.sin(t * 8) * 0.06;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.4 + flicker * 0.6;
    }
  });

  return (
    <group position={position}>
      {/* Candle stick */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 16]} />
        <meshStandardMaterial color="#fff4e6" roughness={0.4} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.05, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Flame */}
      <group ref={flameRef} position={[0, 0.6, 0]}>
        <mesh>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#ffa933" />
        </mesh>
        <pointLight ref={lightRef} color="#ff8800" intensity={1.5} distance={3} decay={2} />
      </group>
    </group>
  );
}

// ── CAKE MESH BASED ON STYLE ───────────────────────────────────────────────
function CakeShape({ style, flavorColor }: { style: string; flavorColor: string }) {
  const frostingMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(flavorColor),
        roughness: 0.5,
        clearcoat: 0.15,
        clearcoatRoughness: 0.3,
      }),
    [flavorColor]
  );

  const whiteCreamMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.6,
      }),
    []
  );

  // Decorative border cream pearls
  const pearls = useMemo(() => {
    const list: [number, number, number][] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const a = (i * Math.PI * 2) / count;
      list.push([Math.cos(a) * 1.15, 0.48, Math.sin(a) * 1.15]);
    }
    return list;
  }, []);

  return (
    <group>
      {/* Platter */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.08, 40]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.4, 0.7, 0.35, 24]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Main Cake Body */}
      {style === "modern" ? (
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.85, 1.8]} />
          <primitive object={frostingMat} attach="material" />
        </mesh>
      ) : style === "hexagon" ? (
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 1.25, 0.85, 6]} />
          <primitive object={frostingMat} attach="material" />
        </mesh>
      ) : style === "tiered_square" ? (
        <group>
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.45, 1.9]} />
            <primitive object={frostingMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.45, 1.3]} />
            <primitive object={frostingMat} attach="material" />
          </mesh>
        </group>
      ) : style === "grand" || style === "tower" ? (
        <group>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.25, 1.25, 0.4, 36]} />
            <primitive object={frostingMat} attach="material" />
          </mesh>
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.9, 0.9, 0.4, 36]} />
            <primitive object={frostingMat} attach="material" />
          </mesh>
          {style === "tower" && (
            <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.35, 32]} />
              <primitive object={frostingMat} attach="material" />
            </mesh>
          )}
        </group>
      ) : style === "bundt" ? (
        <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.7, 0.35, 16, 40]} />
          <primitive object={frostingMat} attach="material" />
        </mesh>
      ) : (
        /* Classic cylinder */
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.85, 40]} />
          <primitive object={frostingMat} attach="material" />
        </mesh>
      )}

      {/* Decorative cream pearls around top */}
      {pearls.map((pos, idx) => (
        <mesh key={idx} position={pos} material={whiteCreamMat}>
          <sphereGeometry args={[0.07, 10, 10]} />
        </mesh>
      ))}
    </group>
  );
}

// ── NAME BANNER BEHIND CAKE ────────────────────────────────────────────────
function BirthdayBanner({ receiverName }: { receiverName: string }) {
  const canvasTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1e0b24";
      ctx.fillRect(0, 0, 512, 140);
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, 496, 124);

      // Dots around border
      ctx.fillStyle = "#ffd54f";
      for (let x = 18; x < 494; x += 18) {
        ctx.fillRect(x, 14, 4, 4);
        ctx.fillRect(x, 122, 4, 4);
      }

      ctx.fillStyle = "#ffd54f";
      ctx.font = "italic bold 22px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("✦ Happy Birthday ✦", 256, 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText((receiverName || "YOU").toUpperCase(), 256, 95);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [receiverName]);

  if (!canvasTexture) return null;

  return (
    <mesh position={[0, 1.6, -2.4]} rotation={[0, 0, 0]}>
      <planeGeometry args={[3.2, 0.9]} />
      <meshBasicMaterial map={canvasTexture} />
    </mesh>
  );
}

// ── SCENE ROTATING CAKE ────────────────────────────────────────────────────
function CakeScene({ style, flavor, candles, receiverName }: Cake3DCanvasProps) {
  const flavorColor = FLAVOR_COLORS[flavor] || FLAVOR_COLORS.vanilla;
  const cakeGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cakeGroup.current) {
      cakeGroup.current.rotation.y += delta * 0.25;
    }
  });

  const candleList = useMemo(() => {
    const list: [number, number, number][] = [];
    const count = Math.min(Math.max(1, candles), 5);
    for (let i = 0; i < count; i++) {
      const x = (i - (count - 1) / 2) * 0.25;
      list.push([x, 0.85, 0]);
    }
    return list;
  }, [candles]);

  return (
    <group position={[0, -0.3, 0]}>
      {/* Table top */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[6.5, 0.15, 3.8]} />
        <meshStandardMaterial color="#4a2511" roughness={0.6} />
      </mesh>
      {/* Table legs */}
      <mesh position={[-2.4, -1.3, 1.2]}>
        <cylinderGeometry args={[0.07, 0.05, 1.3, 12]} />
        <meshStandardMaterial color="#3a1a08" roughness={0.7} />
      </mesh>
      <mesh position={[2.4, -1.3, 1.2]}>
        <cylinderGeometry args={[0.07, 0.05, 1.3, 12]} />
        <meshStandardMaterial color="#3a1a08" roughness={0.7} />
      </mesh>

      {/* Rotating Cake Group */}
      <group ref={cakeGroup} position={[0, -0.5, 0]}>
        <CakeShape style={style} flavorColor={flavorColor} />
        {candleList.map((pos, idx) => (
          <Candle key={idx} position={pos} />
        ))}
      </group>

      {/* Decorative table props */}
      {/* Gift box left */}
      <mesh position={[-2.0, -0.35, 0.4]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.55, 0.4, 0.55]} />
        <meshStandardMaterial color="#ec4899" roughness={0.3} />
      </mesh>
      {/* Gift box right */}
      <mesh position={[2.1, -0.38, 0.3]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.65, 0.35, 0.65]} />
        <meshStandardMaterial color="#a855f7" roughness={0.3} />
      </mesh>

      {/* Background Banner */}
      <BirthdayBanner receiverName={receiverName} />
    </group>
  );
}

export default function Cake3DCanvas(props: Cake3DCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0.9, 4.2], fov: 46 }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
      >
        <ambientLight intensity={1.0} color="#fff6eb" />
        <directionalLight position={[4, 6, 4]} intensity={1.4} color="#fff8e7" castShadow />
        <pointLight position={[-3, 2, 2]} intensity={0.6} color="#f472b6" />
        <pointLight position={[3, 2, 2]} intensity={0.6} color="#fbbf24" />
        <CakeScene {...props} />
      </Canvas>
    </div>
  );
}
