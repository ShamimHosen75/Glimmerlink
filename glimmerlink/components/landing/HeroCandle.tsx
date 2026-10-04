"use client";

import { useEffect, useState } from "react";

// The landing page's one interactive moment: blow out a candle, it relights.
export default function HeroCandle() {
  const [lit, setLit] = useState(true);

  useEffect(() => {
    if (lit) return;
    const t = setTimeout(() => setLit(true), 2600);
    return () => clearTimeout(t);
  }, [lit]);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setLit(false)}
        aria-label={lit ? "Blow out the candle" : "Candle is out"}
        className="group relative flex h-[22rem] w-44 items-end justify-center"
      >
        {/* glow */}
        <span
          aria-hidden
          className={`absolute left-1/2 top-6 h-48 w-48 -translate-x-1/2 rounded-full bg-lantern/25 blur-3xl transition-opacity duration-700 ${lit ? "opacity-100" : "opacity-0"}`}
        />
        {/* flame */}
        {lit ? (
          <span
            aria-hidden
            className="flame absolute left-1/2 top-[4.2rem] h-16 w-9 rounded-[50%_50%_45%_45%/60%_60%_40%_40%] bg-gradient-to-t from-[#FF8A3D] via-lantern to-[#FFF4C2] shadow-[0_0_40px_10px_rgba(246,196,83,0.45)]"
          />
        ) : (
          <span aria-hidden className="smoke absolute left-1/2 top-[6.5rem] h-8 w-8 rounded-full bg-cream/40 blur-md" />
        )}
        {/* wick */}
        <span aria-hidden className="absolute left-1/2 top-[8.1rem] h-4 w-1 -translate-x-1/2 rounded bg-[#4a3328]" />
        {/* candle body with stripes */}
        <span
          aria-hidden
          className="relative h-52 w-24 rounded-t-xl rounded-b-md bg-[repeating-linear-gradient(-35deg,#8FE3C9_0_18px,#FFF6EC_18px_30px)] shadow-[inset_-10px_0_0_rgba(0,0,0,0.12)]"
        />
      </button>
      <p className="mt-4 text-sm text-cream/70" aria-live="polite">
        {lit ? "Tap the candle" : "Make a wish…"}
      </p>
    </div>
  );
}
