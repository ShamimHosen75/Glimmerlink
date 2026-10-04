"use client";

import { useEffect, useRef, useState } from "react";
import { LIMITS } from "@/lib/themes";

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return options.find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
}

export default function VoiceRecorder({ value, onChange }: { value: Blob | null; onChange: (b: Blob | null) => void }) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!value) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(value);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [value]);

  useEffect(() => () => stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  function stop() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    setRecording(false);
  }

  async function start() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser can't record audio. Upload an audio file instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMime();
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
        if (blob.size > LIMITS.voiceBytes) {
          setError("That recording is too large. Keep it under a minute.");
          return;
        }
        onChange(blob);
      };
      recRef.current = rec;
      rec.start();
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= LIMITS.voiceSeconds) stop();
          return s + 1;
        });
      }, 1000);
    } catch {
      setError("Microphone access was blocked. Allow it in your browser settings, or upload an audio file.");
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > LIMITS.voiceBytes) {
      setError("That audio file is larger than 1.5 MB.");
      return;
    }
    setError(null);
    onChange(file);
  }

  return (
    <div className="space-y-3">
      {!value && (
        <div className="flex flex-wrap items-center gap-3">
          {recording ? (
            <button type="button" onClick={stop} className="rounded-full bg-frosting px-5 py-3 font-extrabold text-dusk">
              Stop recording ({LIMITS.voiceSeconds - seconds}s left)
            </button>
          ) : (
            <button type="button" onClick={start} className="rounded-full bg-cream px-5 py-3 font-extrabold text-dusk">
              Record a voice note
            </button>
          )}
          {!recording && (
            <label className="cursor-pointer font-semibold text-cream/80 underline underline-offset-4">
              or upload audio
              <input type="file" accept="audio/*" className="sr-only" onChange={onFile} />
            </label>
          )}
        </div>
      )}
      {recording && (
        <p className="flex items-center gap-2 text-frosting" aria-live="polite">
          <span className="h-3 w-3 animate-pulse rounded-full bg-frosting" /> Recording… {seconds}s
        </p>
      )}
      {url && (
        <div className="flex flex-wrap items-center gap-3">
          <audio controls src={url} className="max-w-full" />
          <button type="button" onClick={() => onChange(null)} className="font-semibold text-frosting underline">
            Remove
          </button>
        </div>
      )}
      {error && <p className="text-frosting">{error}</p>}
    </div>
  );
}
