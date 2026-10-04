"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type BlowStatus = "idle" | "starting" | "listening" | "denied" | "unsupported";

// Listens to the microphone and calls onBlow() each time a sustained loud breath is detected.
// Tuning: raise THRESHOLD if background noise blows candles out; lower it if blowing doesn't register.
const THRESHOLD = 0.12; // RMS volume, 0..1
const SUSTAIN_MS = 220;
const COOLDOWN_MS = 350;

export function useBlowDetector(onBlow: () => void) {
  const [status, setStatus] = useState<BlowStatus>("idle");
  const cb = useRef(onBlow);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    cb.current = onBlow;
  }, [onBlow]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      let loud = 0;
      let last = performance.now();
      let cooldownUntil = 0;
      let raf = 0;

      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length);
        const now = performance.now();
        const dt = now - last;
        last = now;
        loud = rms > THRESHOLD ? loud + dt : Math.max(0, loud - dt * 2);
        if (loud > SUSTAIN_MS && now > cooldownUntil) {
          cb.current();
          cooldownUntil = now + COOLDOWN_MS;
          loud = 0;
        }
        raf = requestAnimationFrame(tick);
      };
      tick();
      setStatus("listening");

      stopRef.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        ctx.close().catch(() => {});
      };
    } catch {
      setStatus("denied");
    }
  }, []);

  const stop = useCallback(() => {
    stopRef.current();
    stopRef.current = () => {};
    setStatus((s) => (s === "listening" ? "idle" : s));
  }, []);

  useEffect(() => () => stopRef.current(), []);

  return { status, start, stop };
}
