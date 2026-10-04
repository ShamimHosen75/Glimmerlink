"use client";

import { useEffect, useState } from "react";

export default function Typewriter({ text, speed = 28 }: { text: string; speed?: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text.length);
      return;
    }
    setShown(0);
    const id = setInterval(() => {
      setShown((v) => {
        if (v >= text.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <p className="whitespace-pre-wrap text-lg leading-relaxed" aria-label={text}>
      <span aria-hidden>{text.slice(0, shown)}</span>
    </p>
  );
}
