"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { THEMES, type ThemeId } from "@/lib/themes";

export type SceneMode = "balloons" | "cake" | "idle";

type Props = {
  theme: ThemeId;
  mode: SceneMode;
  balloonCount: number;
  onPop: () => void;
  candles: boolean[];
  onCandleTap: (i: number) => void;
  cakeFlavor?: string;
};

export default function Scene(props: Props) {
  const t = THEMES[props.theme];
  return (
    <Canvas
      dpr={[1, 1.5]} // cap pixel ratio: big win on low-end phones
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={[t.bg]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} />
      <Sparkles count={60} scale={[10, 8, 4]} size={2.5} speed={0.3} color={t.balloons[0]} />
      {props.mode === "balloons" && <Balloons {...props} colors={t.balloons} />}
      {props.mode === "cake" && <Cake candles={props.candles} onCandleTap={props.onCandleTap} theme={props.theme} cakeFlavor={props.cakeFlavor} />}
    </Canvas>
  );
}

/* ----------------------------- Balloons ----------------------------- */

function Balloons({ balloonCount, onPop, colors }: Props & { colors: readonly string[] }) {
  const configs = useMemo(
    () =>
      Array.from({ length: balloonCount }, (_, i) => ({
        slot: balloonCount === 1 ? 0.5 : i / (balloonCount - 1),
        targetY: -0.6 + Math.random() * 2.2,
        z: -0.8 + Math.random() * 1.2,
        delay: i * 0.25 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      })),
    [balloonCount, colors],
  );
  return (
    <>
      {configs.map((c, i) => (
        <Balloon key={i} {...c} onPop={onPop} />
      ))}
    </>
  );
}

type BalloonCfg = { slot: number; targetY: number; z: number; delay: number; phase: number; color: string };

function Balloon({ slot, targetY, z, delay, phase, color, onPop }: BalloonCfg & { onPop: () => void }) {
  const group = useRef<THREE.Group>(null);
  const [popped, setPopped] = useState<THREE.Vector3 | null>(null);
  const start = useRef<number | null>(null);
  const viewport = useThree((s) => s.viewport);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const time = clock.getElapsedTime();
    if (start.current === null) start.current = time;
    const age = Math.max(0, time - start.current - delay);
    // Spread across the visible width so balloons stay on screen in portrait mode.
    const x = (slot - 0.5) * Math.min(viewport.width * 0.8, 6);
    const rise = targetY + (-5 - targetY) * Math.exp(-age * 1.1);
    g.position.set(x + Math.sin(time * 0.8 + phase) * 0.15, rise + Math.sin(time * 1.3 + phase) * 0.12, z);
    g.rotation.z = Math.sin(time * 0.9 + phase) * 0.08;
  });

  function pop(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    if (popped || !group.current) return;
    setPopped(group.current.position.clone());
    onPop();
  }

  if (popped) return <Burst position={popped} color={color} />;

  return (
    <group ref={group} position={[0, -5, z]}>
      <mesh scale={[1, 1.18, 1]} onPointerDown={pop}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.62, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.12, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, -1.15, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1, 4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Burst({ position, color }: { position: THREE.Vector3; color: string }) {
  const pieces = useMemo(
    () => Array.from({ length: 14 }, () => new THREE.Vector3().randomDirection().multiplyScalar(0.8 + Math.random())),
    [],
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const born = useRef<number | null>(null);
  const [done, setDone] = useState(false);

  useFrame(({ clock }) => {
    if (done) return;
    const time = clock.getElapsedTime();
    if (born.current === null) born.current = time;
    const p = (time - born.current) / 0.6;
    if (p >= 1) {
      setDone(true);
      return;
    }
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.copy(pieces[i]).multiplyScalar(p * 1.4);
      m.position.y -= p * p * 0.8;
      m.scale.setScalar(1 - p);
    });
  });

  if (done) return null;
  return (
    <group position={position}>
      {pieces.map((_, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <boxGeometry args={[0.09, 0.09, 0.02]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------- Cake ------------------------------- */

const FLAVOR_PALETTES: Record<string, { cake: string; frosting: string; plate: string }> = {
  vanilla: { cake: "#F7EBD4", frosting: "#FFFDF5", plate: "#EAE0D5" },
  chocolate: { cake: "#452B1E", frosting: "#301B11", plate: "#D7CCC8" },
  strawberry: { cake: "#F48FB1", frosting: "#FFE4E9", plate: "#F8BBD0" },
  red_velvet: { cake: "#7F1D1D", frosting: "#FFFBF0", plate: "#E0E0E0" },
  lemon: { cake: "#FEF08A", frosting: "#FFFDE7", plate: "#FEF9C3" },
  mint: { cake: "#86EFAC", frosting: "#ECFDF5", plate: "#A7F3D0" },
  blueberry: { cake: "#60A5FA", frosting: "#EFF6FF", plate: "#BFDBFE" },
  caramel: { cake: "#D97706", frosting: "#FEF3C7", plate: "#FDE68A" },
  coffee: { cake: "#5D4037", frosting: "#D7CCC8", plate: "#EFEBE9" },
  pistachio: { cake: "#A3E635", frosting: "#F7FEE7", plate: "#D9F99D" },
};

function Cake({
  candles,
  onCandleTap,
  theme,
  cakeFlavor,
}: {
  candles: boolean[];
  onCandleTap: (i: number) => void;
  theme: ThemeId;
  cakeFlavor?: string;
}) {
  const t = THEMES[theme];
  const flavorTheme = cakeFlavor ? FLAVOR_PALETTES[cakeFlavor] : undefined;
  const cakeColor = flavorTheme?.cake || t.cake;
  const frostingColor = flavorTheme?.frosting || t.frosting;
  const plateColor = flavorTheme?.plate || t.plate;

  const viewport = useThree((s) => s.viewport);
  const scale = Math.min(1, viewport.width / 3.8);
  const group = useRef<THREE.Group>(null);
  const litCount = candles.filter(Boolean).length;

  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.25;
  });

  const positions = candles.map((_, i) => {
    if (candles.length === 1) return [0, 0] as const;
    const a = (i / candles.length) * Math.PI * 2;
    return [Math.cos(a) * 0.6, Math.sin(a) * 0.6] as const;
  });

  return (
    <group ref={group} position={[0, -1.1, 0]} rotation={[0.35, 0, 0]} scale={scale}>
      <pointLight position={[0, 2.2, 0]} intensity={litCount * 0.6} distance={6} color="#FFB347" />
      {/* plate */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.75, 1.75, 0.08, 48]} />
        <meshStandardMaterial color={plateColor} roughness={0.4} />
      </mesh>
      {/* bottom tier */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.3, 1.3, 0.8, 48]} />
        <meshStandardMaterial color={cakeColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[1.33, 1.33, 0.1, 48]} />
        <meshStandardMaterial color={frostingColor} roughness={0.5} />
      </mesh>
      {/* top tier */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.6, 48]} />
        <meshStandardMaterial color={cakeColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.47, 0]}>
        <cylinderGeometry args={[0.98, 0.98, 0.08, 48]} />
        <meshStandardMaterial color={frostingColor} roughness={0.5} />
      </mesh>
      {candles.map((lit, i) => (
        <Candle key={i} x={positions[i][0]} z={positions[i][1]} lit={lit} color={t.candle} onTap={() => onCandleTap(i)} />
      ))}
    </group>
  );
}

function Candle({ x, z, lit, color, onTap }: { x: number; z: number; lit: boolean; color: string; onTap: () => void }) {
  const flame = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 10, []);

  useFrame(({ clock }) => {
    if (!flame.current) return;
    const time = clock.getElapsedTime() * 9 + seed;
    flame.current.scale.set(1 + Math.sin(time) * 0.08, 1 + Math.sin(time * 1.7) * 0.15, 1);
  });

  return (
    <group
      position={[x, 1.51, z]}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (lit) onTap();
      }}
    >
      {/* invisible, larger hit area so small candles are easy to tap */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.9, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.07, 4]} />
        <meshBasicMaterial color="#3b2a20" />
      </mesh>
      {lit && (
        <mesh ref={flame} position={[0, 0.66, 0]} scale={[1, 1, 1]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#FFD27A" />
        </mesh>
      )}
    </group>
  );
}
