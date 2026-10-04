"use client";

import React, { useState } from "react";
import GreetingCardPreview, { CardStyleId } from "./GreetingCardPreview";
import Flower3DPreview from "./Flower3DPreview";

interface FullExperiencePreviewModalProps {
  receiverName: string;
  senderName: string;
  cardMessage: string;
  cardStyle: CardStyleId;
  photoUrl: string | null;
  photoPosition: { x: number; y: number };
  flowerType: string | null;
  flowerColor: string;
  onClose: () => void;
}

export default function FullExperiencePreviewModal({
  receiverName,
  senderName,
  cardMessage,
  cardStyle,
  photoUrl,
  photoPosition,
  flowerType,
  flowerColor,
  onClose,
}: FullExperiencePreviewModalProps) {
  const [activeView, setActiveView] = useState<"splash" | "card" | "flower">("splash");

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Top right close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
        aria-label="Close Preview"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {activeView === "splash" ? (
        <div className="relative text-center space-y-7 max-w-md w-full p-6 sm:p-8 rounded-[2.5rem] bg-slate-900/80 border border-white/10 shadow-2xl">
          {/* Glowing orb backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/15 to-pink-500/20 rounded-[2.5rem] blur-2xl pointer-events-none" />

          {/* Sparkle icon */}
          <div className="relative mx-auto w-20 h-20 rounded-full bg-fuchsia-400/15 border border-fuchsia-400/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(232,121,249,0.3)]">
            ✨
          </div>

          <div className="relative space-y-2">
            <h2 className="text-2xl sm:text-4xl font-serif text-white tracking-tight">
              Preview Your Surprise
            </h2>
            <p className="text-slate-300 font-serif italic text-sm sm:text-base leading-relaxed">
              See exactly how <span className="text-fuchsia-300 font-bold">{receiverName || "the receiver"}</span> will experience your magical birthday surprise.
            </p>
          </div>

          {/* Feature pills */}
          <div className="relative space-y-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-bold">
              Full Interactive Experience
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-300">
              <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10">🎈 Balloons</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10">🎂 3D Cake</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10">🎡 Wheel</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10">💌 Card</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10">🌸 3D Flower</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="relative flex flex-col gap-3 pt-2">
            <button
              onClick={() => setActiveView("card")}
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(217,70,239,0.4)] hover:shadow-[0_0_50px_rgba(217,70,239,0.6)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>▶</span> View Greeting Card
            </button>
            {flowerType && (
              <button
                onClick={() => setActiveView("flower")}
                className="w-full py-3.5 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🌸</span> View 3D Flower
              </button>
            )}
          </div>

          <p className="relative text-[10px] text-slate-500">
            You can close anytime and return to editing
          </p>
        </div>
      ) : activeView === "card" ? (
        <div className="w-full max-w-4xl flex flex-col items-center gap-4 my-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView("splash")}
              className="text-xs text-fuchsia-300 hover:text-white font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to menu
            </button>
            {flowerType && (
              <button
                onClick={() => setActiveView("flower")}
                className="text-xs text-amber-300 hover:text-white font-semibold underline flex items-center gap-1 cursor-pointer"
              >
                View 3D Flower →
              </button>
            )}
          </div>
          <GreetingCardPreview
            receiverName={receiverName}
            senderName={senderName}
            message={cardMessage}
            cardStyle={cardStyle}
            photoUrl={photoUrl}
            photoPosition={photoPosition}
            isEditable={false}
            device="desktop"
          />
        </div>
      ) : (
        <div className="w-full max-w-lg h-[460px] flex flex-col items-center gap-4 my-auto bg-slate-900/80 p-6 rounded-3xl border border-white/10 relative">
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setActiveView("splash")}
              className="text-xs text-fuchsia-300 hover:text-white font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to menu
            </button>
            <button
              onClick={() => setActiveView("card")}
              className="text-xs text-pink-300 hover:text-white font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              View Card →
            </button>
          </div>
          <div className="w-full h-full">
            <Flower3DPreview type={flowerType} color={flowerColor} />
          </div>
        </div>
      )}
    </div>
  );
}
