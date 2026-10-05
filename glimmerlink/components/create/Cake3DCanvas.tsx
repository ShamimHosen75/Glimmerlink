"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface Cake3DCanvasProps {
  style: string;
  flavor: string;
  candles: number;
  receiverName: string;
  occasion?: "birthday" | "anniversary";
}

export const FLAVOR_PALETTES: Record<
  string,
  {
    cake: string;
    frosting: string;
    accent: string;
  }
> = {
  chocolate: {
    cake: "#3D2010",
    frosting: "#221107",
    accent: "#FDE68A",
  },
  vanilla: {
    cake: "#FBF3E4",
    frosting: "#FFFDF9",
    accent: "#F59E0B",
  },
  strawberry: {
    cake: "#F472B6",
    frosting: "#FCE7F3",
    accent: "#E11D48",
  },
  red_velvet: {
    cake: "#7F1D1D",
    frosting: "#FFFDF0",
    accent: "#991B1B",
  },
  lemon: {
    cake: "#FBBF24",
    frosting: "#FEF9C3",
    accent: "#D97706",
  },
  mint: {
    cake: "#34D399",
    frosting: "#D1FAE5",
    accent: "#059669",
  },
  blueberry: {
    cake: "#3B82F6",
    frosting: "#DBEAFE",
    accent: "#1D4ED8",
  },
  caramel: {
    cake: "#D97706",
    frosting: "#FEF3C7",
    accent: "#B45309",
  },
  coffee: {
    cake: "#54382B",
    frosting: "#EFEBE9",
    accent: "#3E2723",
  },
  pistachio: {
    cake: "#84CC16",
    frosting: "#ECFCCB",
    accent: "#4D7C0F",
  },
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
function CakeShape({
  style,
  palette,
}: {
  style: string;
  palette: { cake: string; frosting: string; accent: string };
}) {
  // Decorative border cream pearls
  const pearls = useMemo(() => {
    const list: [number, number, number][] = [];
    const count = 14;
    const radius = style === "modern" || style === "tiered_square" ? 0.95 : 1.15;
    for (let i = 0; i < count; i++) {
      const a = (i * Math.PI * 2) / count;
      list.push([Math.cos(a) * radius, 0.48, Math.sin(a) * radius]);
    }
    return list;
  }, [style]);

  return (
    <group>
      {/* Platter Pedestal */}
      <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.08, 48]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.25} metalness={0.75} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.4, 0.7, 0.35, 32]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Main Cake Geometries per style */}
      {style === "modern" ? (
        <group>
          {/* Square single tier */}
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.85, 1.8]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          {/* Top glaze */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <boxGeometry args={[1.82, 0.04, 1.82]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      ) : style === "hexagon" ? (
        <group>
          {/* Hexagon tier */}
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.25, 1.25, 0.85, 6]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[1.27, 1.27, 0.04, 6]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      ) : style === "tiered_square" ? (
        <group>
          {/* Tier 1 */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.9, 0.45, 1.9]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.92, 0.03, 1.92]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Tier 2 */}
          <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.45, 1.3]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.91, 0]}>
            <boxGeometry args={[1.32, 0.03, 1.32]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      ) : style === "grand" ? (
        <group>
          {/* Bottom tier */}
          <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.3, 1.3, 0.45, 48]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[1.32, 1.32, 0.04, 48]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Top tier */}
          <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.92, 0.92, 0.4, 48]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.94, 0.94, 0.04, 48]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      ) : style === "tower" ? (
        <group>
          {/* Tier 1 (Base) */}
          <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.32, 1.32, 0.36, 48]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.37, 0]}>
            <cylinderGeometry args={[1.34, 1.34, 0.03, 48]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Tier 2 (Middle) */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 0.95, 0.36, 48]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.74, 0]}>
            <cylinderGeometry args={[0.97, 0.97, 0.03, 48]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
          {/* Tier 3 (Top) */}
          <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.62, 0.62, 0.34, 48]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.64, 0.64, 0.04, 48]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      ) : style === "bundt" ? (
        <group position={[0, 0.45, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <torusGeometry args={[0.72, 0.38, 24, 48]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          {/* Glaze drizzle on bundt */}
          <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.72, 0.12, 16, 48]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.15} />
          </mesh>
        </group>
      ) : style === "heart" ? (
        <group position={[0, 0.42, 0]}>
          {/* Romantic Heart using intersecting curved lobes & center */}
          <mesh position={[-0.45, 0, 0.2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.85, 36]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0.45, 0, 0.2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.85, 36]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0, -0.28]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.92, 0.85, 0.92]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          {/* Top heart glaze */}
          <mesh position={[-0.45, 0.43, 0.2]}>
            <cylinderGeometry args={[0.66, 0.66, 0.03, 36]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} />
          </mesh>
          <mesh position={[0.45, 0.43, 0.2]}>
            <cylinderGeometry args={[0.66, 0.66, 0.03, 36]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} />
          </mesh>
        </group>
      ) : style === "sphere" ? (
        <group position={[0, 0.45, 0]}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.95, 36, 36, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          {/* Top glaze cap */}
          <mesh position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.96, 36, 36, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.2} metalness={0.15} />
          </mesh>
        </group>
      ) : style === "pillow" ? (
        <group position={[0, 0.42, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.7, 0.75, 1.7]} />
            <meshStandardMaterial color={palette.cake} roughness={0.5} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.39, 0]}>
            <boxGeometry args={[1.72, 0.04, 1.72]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      ) : (
        /* Classic cylinder default */
        <group>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.2, 1.2, 0.85, 48]} />
            <meshStandardMaterial color={palette.cake} roughness={0.4} metalness={0.05} />
          </mesh>
          {/* Top frosting layer */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[1.22, 1.22, 0.04, 48]} />
            <meshStandardMaterial color={palette.frosting} roughness={0.25} metalness={0.1} />
          </mesh>
        </group>
      )}

      {/* Decorative cream pearls around top */}
      {pearls.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={palette.accent} roughness={0.3} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

// ── NAME BANNER BEHIND CAKE ────────────────────────────────────────────────
function BirthdayBanner({
  receiverName,
  occasion = "birthday",
}: {
  receiverName: string;
  occasion?: "birthday" | "anniversary";
}) {
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

      if (occasion === "anniversary") {
        ctx.fillStyle = "#ffd54f";
        ctx.font = "italic 16px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("✦ Happy ✦", 256, 36);

        ctx.font = "italic bold 23px Georgia, serif";
        ctx.fillText("Anniversary", 256, 64);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px sans-serif";
        const displayName = receiverName ? receiverName.toUpperCase() : "SHAIRA";
        ctx.fillText(displayName, 256, 102);
      } else {
        ctx.fillStyle = "#ffd54f";
        ctx.font = "italic bold 22px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("✦ Happy Birthday ✦", 256, 48);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px sans-serif";
        ctx.fillText((receiverName || "YOU").toUpperCase(), 256, 95);
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [receiverName, occasion]);

  if (!canvasTexture) return null;

  return (
    <mesh position={[0, 1.6, -2.4]} rotation={[0, 0, 0]}>
      <planeGeometry args={[3.2, 0.9]} />
      <meshBasicMaterial map={canvasTexture} />
    </mesh>
  );
}

// ── SCENE ROTATING CAKE ────────────────────────────────────────────────────
function CakeScene({ style, flavor, candles, receiverName, occasion }: Cake3DCanvasProps) {
  const palette = FLAVOR_PALETTES[flavor] || FLAVOR_PALETTES.chocolate;
  const cakeGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cakeGroup.current) {
      cakeGroup.current.rotation.y += delta * 0.25;
    }
  });

  // Top height calculation so candles stay right on top surface
  const candleY = useMemo(() => {
    if (style === "tower") return 1.12;
    if (style === "grand") return 0.87;
    if (style === "tiered_square") return 0.93;
    if (style === "sphere") return 0.98;
    return 0.87;
  }, [style]);

  const candleList = useMemo(() => {
    const list: [number, number, number][] = [];
    const count = Math.min(Math.max(1, candles), 5);
    for (let i = 0; i < count; i++) {
      const x = (i - (count - 1) / 2) * 0.24;
      list.push([x, candleY, 0]);
    }
    return list;
  }, [candles, candleY]);

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
        <CakeShape style={style} palette={palette} />
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
      <BirthdayBanner receiverName={receiverName} occasion={occasion} />
    </group>
  );
}

export default function Cake3DCanvas(props: Cake3DCanvasProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas
        key={`${props.style}-${props.flavor}-${props.occasion || "birthday"}`}
        camera={{ position: [0, 0.9, 4.2], fov: 46 }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%", touchAction: "none" }}
      >
        <ambientLight intensity={1.1} color="#fff6eb" />
        <directionalLight position={[4, 6, 4]} intensity={1.5} color="#fff8e7" castShadow />
        <pointLight position={[-3, 2, 2]} intensity={0.7} color="#f472b6" />
        <pointLight position={[3, 2, 2]} intensity={0.7} color="#fbbf24" />
        <CakeScene {...props} />
      </Canvas>
    </div>
  );
}
