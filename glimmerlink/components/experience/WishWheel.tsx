"use client";

import { useState } from "react";

const SPIN_MS = 4200;

function point(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return [100 + r * Math.sin(a), 100 - r * Math.cos(a)] as const;
}

export default function WishWheel({
  wishes,
  colors,
  onResult,
}: {
  wishes: string[];
  colors: readonly string[];
  onResult?: (wish: string) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const n = wishes.length;
  const seg = 360 / n;

  function spin() {
    if (spinning) return;
    const i = Math.floor(Math.random() * n);
    // Rotate so the centre of segment i ends under the pointer at the top.
    const target = (360 - (i + 0.5) * seg) % 360;
    const delta = (target - (rotation % 360) + 360) % 360;
    setRotation(rotation + 360 * 5 + delta);
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      setSpinning(false);
      setResult(wishes[i]);
      onResult?.(wishes[i]);
    }, SPIN_MS);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[min(78vw,340px)]">
        <svg viewBox="0 0 200 200" className="w-full drop-shadow-xl" style={{
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${SPIN_MS}ms cubic-bezier(.17,.67,.21,1)`,
        }} aria-hidden>
          {n === 1 ? (
            <circle cx="100" cy="100" r="95" fill={colors[0]} />
          ) : (
            wishes.map((w, i) => {
              const [x0, y0] = point(i * seg, 95);
              const [x1, y1] = point((i + 1) * seg, 95);
              const large = seg > 180 ? 1 : 0;
              const mid = (i + 0.5) * seg;
              return (
                <g key={i}>
                  <path d={`M100,100 L${x0},${y0} A95,95 0 ${large} 1 ${x1},${y1} Z`} fill={colors[i % colors.length]} stroke="#2A1838" strokeWidth="1.5" />
                  <text x="100" y="40" transform={`rotate(${mid} 100 100)`} textAnchor="middle" fontSize="8" fontWeight="800" fill="#2A1838">
                    {w.length > 16 ? `${w.slice(0, 15)}…` : w}
                  </text>
                </g>
              );
            })
          )}
          <circle cx="100" cy="100" r="12" fill="#FFF6EC" />
        </svg>
        <div aria-hidden className="absolute left-1/2 top-[-6px] h-0 w-0 -translate-x-1/2 border-x-[12px] border-t-[22px] border-x-transparent border-t-cream" />
      </div>
      <p className="mt-6 min-h-[3.5rem] max-w-xs text-center text-xl font-extrabold" aria-live="polite">
        {result ? `Your wish: ${result}` : spinning ? "Spinning…" : ""}
      </p>
      {!result && (
        <button onClick={spin} disabled={spinning} className="rounded-full bg-lantern px-7 py-3 text-lg font-extrabold text-dusk disabled:opacity-50">
          Spin the wheel
        </button>
      )}
    </div>
  );
}
