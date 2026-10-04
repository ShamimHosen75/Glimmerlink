"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import type { PublicSurprise } from "@/lib/types";
import { THEMES } from "@/lib/themes";
import { playChime, playPop, unlockAudio } from "@/lib/audio";
import { useBlowDetector } from "./useBlowDetector";
import WishWheel from "./WishWheel";
import Typewriter from "./Typewriter";

// three.js only runs in the browser, and loading it lazily keeps the first screen fast.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

type Stage = "gift" | "balloons" | "cake" | "wheel" | "message" | "end";
const BALLOONS = 7;

const btn = "rounded-full px-6 py-3 font-extrabold";

export default function Experience({ surprise }: { surprise: PublicSurprise }) {
  const theme = THEMES[surprise.theme];
  const [stage, setStage] = useState<Stage>("gift");
  const [popped, setPopped] = useState(0);
  const [candles, setCandles] = useState<boolean[]>(() => Array(surprise.candleCount).fill(true));
  const allOut = candles.every((c) => !c);

  const blowOne = useCallback(() => {
    setCandles((cs) => {
      const i = cs.findIndex(Boolean);
      if (i === -1) return cs;
      const next = [...cs];
      next[i] = false;
      return next;
    });
  }, []);
  const blow = useBlowDetector(blowOne);

  // Balloons -> cake once all are popped.
  useEffect(() => {
    if (stage === "balloons" && popped >= BALLOONS) {
      const t = setTimeout(() => setStage("cake"), 700);
      return () => clearTimeout(t);
    }
  }, [stage, popped]);

  // Candles out -> celebrate -> wheel.
  useEffect(() => {
    if (stage !== "cake" || !allOut) return;
    blow.stop();
    playChime();
    confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 }, colors: [...theme.balloons] });
    const t = setTimeout(() => setStage("wheel"), 2200);
    return () => clearTimeout(t);
  }, [stage, allOut, blow, theme.balloons]);

  function restart() {
    setPopped(0);
    setCandles(Array(surprise.candleCount).fill(true));
    setStage("balloons");
  }

  const sceneMode = stage === "balloons" ? "balloons" : stage === "cake" ? "cake" : "idle";

  return (
    <main className="fixed inset-0 overflow-hidden" style={{ background: theme.bg }}>
      {stage !== "gift" && (
        <div className="absolute inset-0">
          <Scene
            theme={surprise.theme}
            mode={sceneMode}
            balloonCount={BALLOONS}
            onPop={() => {
              playPop();
              setPopped((p) => p + 1);
            }}
            candles={candles}
            onCandleTap={(i) => setCandles((cs) => cs.map((c, j) => (j === i ? false : c)))}
          />
        </div>
      )}

      {stage === "gift" && (
        <button
          type="button"
          onClick={() => {
            unlockAudio(); // must happen inside a tap, or browsers block sound
            setStage("balloons");
          }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <span aria-hidden className="relative mb-10 block h-40 w-44">
            <span className="absolute bottom-0 h-28 w-44 rounded-xl" style={{ background: theme.balloons[1] }} />
            <span className="absolute bottom-24 left-[-8px] h-10 w-[11.5rem] rounded-lg" style={{ background: theme.balloons[0] }} />
            <span className="absolute bottom-0 left-1/2 h-[8.5rem] w-6 -translate-x-1/2" style={{ background: theme.balloons[2] }} />
          </span>
          <span className="font-display text-4xl sm:text-5xl">{surprise.recipientName}, someone made you something</span>
          {surprise.senderName && <span className="mt-3 text-lg opacity-80">from {surprise.senderName}</span>}
          <span className={`${btn} mt-10 bg-lantern text-lg text-dusk`}>Tap to open</span>
          <span className="mt-4 text-sm opacity-60">Turn your sound on</span>
        </button>
      )}

      {stage === "balloons" && (
        <Overlay>
          <p className="font-display text-3xl">Pop the balloons</p>
          <p className="mt-1 opacity-80" aria-live="polite">
            {Math.min(popped, BALLOONS)} of {BALLOONS}
          </p>
          <BottomBar>
            <button onClick={() => setStage("cake")} className="text-sm underline opacity-70">
              Skip
            </button>
          </BottomBar>
        </Overlay>
      )}

      {stage === "cake" && (
        <Overlay>
          <p className="font-display text-3xl sm:text-4xl">Happy birthday, {surprise.recipientName}</p>
          {!allOut && (
            <BottomBar>
              {blow.status === "listening" ? (
                <p className="font-bold">Blow on your phone to put out the candles</p>
              ) : blow.status === "denied" || blow.status === "unsupported" ? (
                <p className="font-bold">Tap each candle to blow it out</p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <button onClick={blow.start} className={`${btn} bg-lantern text-dusk`}>
                    {blow.status === "starting" ? "Starting microphone…" : "Blow with the microphone"}
                  </button>
                  <span className="text-sm opacity-70">or tap the candles</span>
                </div>
              )}
            </BottomBar>
          )}
          {allOut && <p className="mt-2 text-xl font-bold">Make a wish</p>}
        </Overlay>
      )}

      {stage === "wheel" && (
        <Panel>
          <h2 className="mb-6 text-center font-display text-3xl">Spin for a wish</h2>
          <WishWheel wishes={surprise.wishes} colors={theme.balloons} />
          <button onClick={() => setStage("message")} className={`${btn} mt-4 bg-cream text-dusk`}>
            Read your message
          </button>
        </Panel>
      )}

      {stage === "message" && (
        <Panel>
          <div className="w-full max-w-lg rounded-3xl bg-black/25 p-6 backdrop-blur-sm">
            {surprise.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={surprise.photoUrl} alt="" className="mx-auto mb-6 max-h-64 rounded-2xl border-4 border-cream object-cover" />
            )}
            <Typewriter text={surprise.message} />
            {surprise.senderName && <p className="mt-4 text-right font-extrabold">{surprise.senderName}</p>}
            {surprise.voiceUrl && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-bold opacity-80">A voice note for you</p>
                <audio controls src={surprise.voiceUrl} className="w-full" />
              </div>
            )}
          </div>
          <button onClick={() => setStage("end")} className={`${btn} mt-6 bg-lantern text-dusk`}>
            Finish
          </button>
        </Panel>
      )}

      {stage === "end" && (
        <Panel>
          <p className="text-center font-display text-4xl">Happy birthday, {surprise.recipientName}</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <button onClick={restart} className={`${btn} bg-cream text-dusk`}>
              Watch again
            </button>
            <Link href="/create" className={`${btn} bg-lantern text-dusk`}>
              Make one for someone you love
            </Link>
          </div>
        </Panel>
      )}
    </main>
  );
}

// pointer-events-none lets taps pass through to the 3D scene; children re-enable them.
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center px-6 pt-10 text-center [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
      {children}
    </div>
  );
}

function BottomBar({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-x-0 bottom-0 flex justify-center px-6 pb-[max(2rem,env(safe-area-inset-bottom))]">{children}</div>;
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto px-6 py-10">{children}</div>
  );
}
