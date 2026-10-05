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
import GreetingCardPreview, { CardStyleId } from "@/components/create/GreetingCardPreview";
import Flower3DPreview from "@/components/create/Flower3DPreview";

// three.js only runs in the browser, and loading it lazily keeps the first screen fast.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

type Stage = "gift" | "balloons" | "cake" | "wheel" | "card" | "flower" | "end";
const BALLOONS = 7;

const btn = "rounded-full px-6 py-3 font-extrabold cursor-pointer transition-transform hover:scale-105 active:scale-95";

export default function Experience({ surprise }: { surprise: PublicSurprise }) {
  const theme = THEMES[surprise.theme] || THEMES.dusk;
  const [stage, setStage] = useState<Stage>("gift");
  const [popped, setPopped] = useState(0);
  const [candles, setCandles] = useState<boolean[]>(() => Array(surprise.candleCount || 1).fill(true));
  const allOut = candles.every((c) => !c);
  const hasFlower = Boolean(surprise.flowerType && surprise.flowerType !== "null" && surprise.flowerType !== "none");

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
    setCandles(Array(surprise.candleCount || 1).fill(true));
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
            cakeFlavor={surprise.cakeFlavor}
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
          <span aria-hidden className="relative mb-10 block h-40 w-44 animate-bounce">
            <span className="absolute bottom-0 h-28 w-44 rounded-2xl shadow-[0_0_50px_rgba(255,200,100,0.3)]" style={{ background: theme.balloons[1] }} />
            <span className="absolute bottom-24 left-[-8px] h-10 w-[11.5rem] rounded-xl" style={{ background: theme.balloons[0] }} />
            <span className="absolute bottom-0 left-1/2 h-[8.5rem] w-6 -translate-x-1/2" style={{ background: theme.balloons[2] }} />
          </span>
          <span className="font-display text-4xl sm:text-5xl text-white drop-shadow-md">
            {surprise.recipientName}, someone made you something
          </span>
          {surprise.senderName && <span className="mt-3 text-lg text-pink-200 opacity-90">from {surprise.senderName} ❤️</span>}
          <span className={`${btn} mt-10 bg-lantern text-lg text-dusk shadow-xl`}>Tap to open ✨</span>
          <span className="mt-4 text-sm text-slate-300 opacity-80">Turn your sound on 🔊</span>
        </button>
      )}

      {stage === "balloons" && (
        <Overlay>
          <p className="font-display text-3xl text-white">Pop the balloons 🎈</p>
          <p className="mt-1 text-pink-200" aria-live="polite">
            {Math.min(popped, BALLOONS)} of {BALLOONS} popped
          </p>
          <BottomBar>
            <button onClick={() => setStage("cake")} className="text-sm underline text-white/70 hover:text-white">
              Skip to Cake 🍰
            </button>
          </BottomBar>
        </Overlay>
      )}

      {stage === "cake" && (
        <Overlay>
          <p className="font-display text-3xl sm:text-4xl text-white">
            Happy {surprise.occasion === "anniversary" ? "Anniversary" : "birthday"},{" "}
            {surprise.recipientName}!
          </p>
          {!allOut && (
            <BottomBar>
              {blow.status === "listening" ? (
                <p className="font-bold text-amber-200 animate-pulse">Blow on your phone to put out the candles 🌬️</p>
              ) : blow.status === "denied" || blow.status === "unsupported" ? (
                <p className="font-bold text-amber-200">Tap each candle to blow it out 🕯️</p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <button onClick={blow.start} className={`${btn} bg-lantern text-dusk`}>
                    {blow.status === "starting" ? "Starting microphone…" : "Blow with the microphone 🎤"}
                  </button>
                  <span className="text-sm text-white/80">or tap each candle</span>
                </div>
              )}
            </BottomBar>
          )}
          {allOut && <p className="mt-2 text-xl font-bold text-amber-300 animate-bounce">Make a wish! ✨</p>}
        </Overlay>
      )}

      {stage === "wheel" && (
        <Panel>
          <h2 className="mb-6 text-center font-display text-3xl text-white">Spin for a wish 🎡</h2>
          <WishWheel wishes={surprise.wishes} colors={theme.balloons} />
          <button onClick={() => setStage("card")} className={`${btn} mt-6 bg-cream text-dusk shadow-xl text-base`}>
            Open Your {surprise.occasion === "anniversary" ? "Anniversary" : "Birthday"} Card 💌
          </button>
        </Panel>
      )}

      {stage === "card" && (
        <Panel>
          <div className="w-full max-w-xl mx-auto my-auto animate-fade-in space-y-4 sm:space-y-5 px-1 sm:px-2">
            <GreetingCardPreview
              receiverName={surprise.recipientName}
              senderName={surprise.senderName}
              message={surprise.cardMessage || surprise.message}
              cardStyle={(surprise.cardStyle as CardStyleId) || "luxury"}
              photoUrl={surprise.photoUrl}
              photoPosition={surprise.photoPosition || { x: 50, y: 50 }}
              isEditable={false}
              occasion={surprise.occasion}
            />

            {surprise.voiceUrl && (
              <div className="rounded-2xl bg-black/50 border border-white/15 p-3.5 sm:p-4 backdrop-blur-md shadow-lg">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-pink-300 mb-2 flex items-center gap-2">
                  <span>🎙️</span> Personal Voice Note from {surprise.senderName || (surprise.occasion === "anniversary" ? "your partner" : "your friend")}
                </p>
                <audio controls src={surprise.voiceUrl} className="w-full accent-pink-500" />
              </div>
            )}

            <div className="text-center pt-1 sm:pt-2">
              {hasFlower ? (
                <button
                  onClick={() => setStage("flower")}
                  className="rounded-full px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Receive Your {surprise.occasion === "anniversary" ? "Anniversary" : "Birthday"} Flower 🌸
                </button>
              ) : (
                <button
                  onClick={() => {
                    confetti({ particleCount: 140, spread: 80, origin: { y: 0.5 } });
                    setStage("end");
                  }}
                  className="rounded-full px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Celebrate! 🎉
                </button>
              )}
            </div>
          </div>
        </Panel>
      )}

      {stage === "flower" && (
        <Panel>
          <div className="w-full max-w-lg mx-auto text-center animate-fade-in space-y-4 sm:space-y-5 px-2 sm:px-4">
            <div className="inline-block px-3.5 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              A Gift From {surprise.senderName || (surprise.occasion === "anniversary" ? "Your Love" : "Someone Special")}
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif text-white">
              {surprise.occasion === "anniversary" ? "An Anniversary" : "A Birthday"} Flower for {surprise.recipientName} 🌸
            </h2>
            <div className="h-[280px] sm:h-[380px] max-h-[50vh] w-full rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-white/10 overflow-hidden relative shadow-2xl">
              <Flower3DPreview type={surprise.flowerType} color={surprise.flowerColor || "#ff3388"} />
            </div>
            {surprise.personalNote && (
              <p className="font-serif italic text-sm sm:text-lg text-pink-200/90 max-w-md mx-auto">
                &ldquo;{surprise.personalNote}&rdquo;
              </p>
            )}
            <button
              onClick={() => {
                confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 } });
                setStage("end");
              }}
              className="rounded-full px-7 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-[0_0_30px_rgba(251,191,36,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Celebrate! 🎉
            </button>
          </div>
        </Panel>
      )}

      {stage === "end" && (
        <Panel>
          <div className="max-w-md w-full text-center space-y-5 sm:space-y-6 animate-fade-in px-3 sm:px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400/20 to-pink-500/20 border border-amber-300/40 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              {surprise.occasion === "anniversary" ? "💍" : "🎂"}
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
                Happy {surprise.occasion === "anniversary" ? "Anniversary" : "Birthday"},{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300">
                  {surprise.recipientName}
                </span>!
              </h1>
              <p className="text-pink-200 font-serif italic text-base sm:text-lg">
                {surprise.finalMessage || (surprise.occasion === "anniversary" ? "Wishing you endless years of happiness, laughter, and romance!" : "May all your birthday dreams and wishes come true!")}
              </p>
              {surprise.senderName && (
                <p className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide pt-1">
                  Made with love by {surprise.senderName} ❤️
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center pt-2 sm:pt-4">
              <button
                onClick={restart}
                className="rounded-full px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer"
              >
                Watch Again 🔄
              </button>
              <Link
                href="/create"
                className="rounded-full px-6 py-3 sm:py-3.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Create a Surprise Link ✨
              </Link>
            </div>
          </div>
        </Panel>
      )}
    </main>
  );
}

// pointer-events-none lets taps pass through to the 3D scene; children re-enable them.
function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center px-4 sm:px-6 pt-6 sm:pt-10 text-center [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
      {children}
    </div>
  );
}

function BottomBar({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 sm:px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">{children}</div>;
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto px-3 sm:px-6 py-6 sm:py-10">{children}</div>
  );
}
