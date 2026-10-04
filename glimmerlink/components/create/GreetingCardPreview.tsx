"use client";

import React, { useRef, useState, useEffect } from "react";

export type CardStyleId = "luxury" | "cute" | "minimal" | "floral" | "romantic";

interface CardTheme {
  cardBg: string;
  paperBgStart: string;
  paperBgEnd: string;
  headingColor: string;
  textColor: string;
  scriptGradientStart: string;
  scriptGradientEnd: string;
  standColor: string;
  cakeIcing: string;
  quoteBg: string;
  quoteBorder: string;
  heartColor: string;
}

const CARD_THEMES: Record<CardStyleId, CardTheme> = {
  luxury: {
    cardBg: "#FFF8F3",
    paperBgStart: "#FFFDFB",
    paperBgEnd: "#FFF6EF",
    headingColor: "#3D2B24",
    textColor: "#56463E",
    scriptGradientStart: "#FF7A8A",
    scriptGradientEnd: "#F45C84",
    standColor: "#D8A23B",
    cakeIcing: "#F89FB6",
    quoteBg: "rgba(255,192,203,0.15)",
    quoteBorder: "rgba(255,182,193,0.25)",
    heartColor: "#FF7A8A",
  },
  cute: {
    cardBg: "#FFF0F5",
    paperBgStart: "#FFF5F8",
    paperBgEnd: "#FFE6EC",
    headingColor: "#5C3A40",
    textColor: "#704A50",
    scriptGradientStart: "#FF9A9E",
    scriptGradientEnd: "#FECFEF",
    standColor: "#FFB7B2",
    cakeIcing: "#FFD1DC",
    quoteBg: "rgba(255,182,193,0.15)",
    quoteBorder: "rgba(255,182,193,0.3)",
    heartColor: "#FF9A9E",
  },
  minimal: {
    cardBg: "#FFFFFF",
    paperBgStart: "#FCFCFC",
    paperBgEnd: "#F6F6F6",
    headingColor: "#1A1A1A",
    textColor: "#333333",
    scriptGradientStart: "#4D4D4D",
    scriptGradientEnd: "#1A1A1A",
    standColor: "#CCCCCC",
    cakeIcing: "#EAEAEA",
    quoteBg: "rgba(0,0,0,0.03)",
    quoteBorder: "rgba(0,0,0,0.08)",
    heartColor: "#666666",
  },
  floral: {
    cardBg: "#F4F7F4",
    paperBgStart: "#FAFAFA",
    paperBgEnd: "#EEF2EE",
    headingColor: "#2E3A2F",
    textColor: "#4A5A4B",
    scriptGradientStart: "#8FBC8F",
    scriptGradientEnd: "#556B2F",
    standColor: "#BC8F8F",
    cakeIcing: "#D8BFD8",
    quoteBg: "rgba(143,188,143,0.15)",
    quoteBorder: "rgba(143,188,143,0.25)",
    heartColor: "#8FBC8F",
  },
  romantic: {
    cardBg: "#FFF2F2",
    paperBgStart: "#FFFDFD",
    paperBgEnd: "#FFE6E6",
    headingColor: "#4A1515",
    textColor: "#5A2525",
    scriptGradientStart: "#E52D27",
    scriptGradientEnd: "#B31217",
    standColor: "#C5A059",
    cakeIcing: "#FF4D4D",
    quoteBg: "rgba(229,45,39,0.08)",
    quoteBorder: "rgba(229,45,39,0.18)",
    heartColor: "#E52D27",
  },
};

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1000&auto=format&fit=crop&q=80";

export default function GreetingCardPreview({
  receiverName,
  senderName,
  message,
  photoUrl,
  cardStyle = "luxury",
  photoPosition = { x: 50, y: 50 },
  onPhotoPositionChange,
  isEditable = true,
  device = "desktop",
}: {
  receiverName: string;
  senderName: string;
  message: string;
  photoUrl?: string | null;
  cardStyle?: CardStyleId;
  photoPosition?: { x: number; y: number };
  onPhotoPositionChange?: (pos: { x: number; y: number }) => void;
  isEditable?: boolean;
  device?: "desktop" | "tablet" | "mobile";
}) {
  const theme = CARD_THEMES[cardStyle] || CARD_THEMES.luxury;
  const imageRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 50, posY: 50 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: photoPosition.x,
      posY: photoPosition.y,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isEditable || !e.touches[0]) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      posX: photoPosition.x,
      posY: photoPosition.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const newX = Math.max(0, Math.min(100, dragStart.current.posX - (dx / rect.width) * 100));
      const newY = Math.max(0, Math.min(100, dragStart.current.posY - (dy / rect.height) * 100));
      onPhotoPositionChange?.({ x: Math.round(newX), y: Math.round(newY) });
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!imageRef.current || !e.touches[0]) return;
      const rect = imageRef.current.getBoundingClientRect();
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      const newX = Math.max(0, Math.min(100, dragStart.current.posX - (dx / rect.width) * 100));
      const newY = Math.max(0, Math.min(100, dragStart.current.posY - (dy / rect.height) * 100));
      onPhotoPositionChange?.({ x: Math.round(newX), y: Math.round(newY) });
    };

    const onMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [isDragging, onPhotoPositionChange]);

  const activePhoto = photoUrl || DEFAULT_PHOTO;

  // Highlight romantic/festive words
  const highlightWords = (text: string) => {
    const keywords = ["endless joy", "beautiful moments", "love", "joy", "happiness", "magical moments", "special"];
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (keywords.some((k) => k.toLowerCase() === part.toLowerCase())) {
        return (
          <span
            key={i}
            className="font-bold"
            style={{
              background: `linear-gradient(to right, ${theme.scriptGradientStart}, ${theme.scriptGradientEnd})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const containerWidthClass =
    device === "mobile" ? "max-w-[340px]" : device === "tablet" ? "max-w-[580px]" : "max-w-[820px]";

  return (
    <div className={`w-full ${containerWidthClass} mx-auto select-none transition-all duration-300`}>
      <div
        className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.45)] flex flex-col md:flex-row relative z-10 border"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.quoteBorder }}
      >
        {/* LEFT PAGE OF CARD */}
        <div
          className="w-full md:w-[50%] p-6 sm:p-7 md:p-8 flex flex-col justify-between relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${theme.paperBgStart}, ${theme.paperBgEnd})`,
          }}
        >
          {/* Subtle paper grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />

          {/* Decorative floating hearts/stars */}
          <div className="absolute top-4 right-5 text-sm opacity-35" style={{ color: theme.heartColor }}>
            ♥
          </div>
          <div className="absolute top-10 left-5 text-xs opacity-25" style={{ color: theme.standColor }}>
            ✦
          </div>

          {/* Card Header */}
          <div className="relative z-10 space-y-0.5">
            <h1
              className="font-playfair text-[26px] sm:text-[32px] md:text-[38px] leading-tight"
              style={{ color: theme.headingColor }}
            >
              Happy
            </h1>
            <h2
              className="font-vibes text-[44px] sm:text-[54px] md:text-[66px] leading-[0.85] bg-clip-text text-transparent py-1 pl-1"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${theme.scriptGradientStart}, ${theme.scriptGradientEnd})`,
              }}
            >
              Birthday!
            </h2>
            <div
              className="w-12 h-[1.5px] mt-2.5 rounded-full"
              style={{ backgroundColor: `${theme.standColor}55` }}
            />
          </div>

          {/* Message body */}
          <div className="relative z-10 py-4 my-auto">
            <p
              className="font-cormorant text-[15px] sm:text-[16px] md:text-[18px] leading-relaxed"
              style={{ color: theme.textColor }}
            >
              {message ? highlightWords(message) : "Wishing you a day filled with endless joy and love."}
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              <span
                className="font-handwritten text-[20px] sm:text-[24px] leading-none"
                style={{
                  background: `linear-gradient(to right, ${theme.scriptGradientStart}, ${theme.scriptGradientEnd})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                You&apos;re truly special!
              </span>
              <span style={{ color: theme.heartColor }} className="text-xs">
                ♥
              </span>
            </div>
          </div>

          {/* Card Cake + Quote Illustration */}
          <div className="relative z-10 flex items-center justify-between gap-3 pt-2">
            {/* Mini Cake Vector */}
            <div className="w-[70px] h-[75px] shrink-0">
              <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-sm">
                <path d="M30 115 h60 v3 h-60 z" fill={theme.standColor} />
                <path d="M45 118 h30 l-6 12 h-18 z" fill={theme.standColor} opacity="0.9" />
                <ellipse cx="60" cy="112" rx="40" ry="6" fill={theme.standColor} />
                <rect x="30" y="80" width="60" height="30" rx="4" fill={theme.cakeIcing} />
                <path
                  d="M30 84 c5 3, 10 3, 15 0 c5-3, 10-3, 15 0 c5 3, 10 3, 15 0 c5-3, 10-3, 15 0 v8 h-60 z"
                  fill={theme.cakeIcing}
                  opacity="0.95"
                />
                <rect x="40" y="52" width="40" height="28" rx="3" fill={theme.cardBg} />
                <path
                  d="M40 56 c3.3 2, 6.6 2, 10 0 c3.3-2, 6.6-2, 10 0 c3.3 2, 6.6 2, 10 0 c3.3-2, 6.6-2, 10 0 v6 h-40 z"
                  fill={theme.cakeIcing}
                />
                <rect x="60" y="34" width="2" height="18" fill={theme.headingColor} opacity="0.8" />
                <path d="M61 27 c-1.5 1.5, 1.5 5, 0 6 c-1.5-1, 1.5-4.5, 0-6 z" fill={theme.standColor} />
              </svg>
            </div>

            {/* Quote box */}
            <div
              className="rounded-xl p-2.5 sm:p-3 text-center border text-xs"
              style={{ backgroundColor: theme.quoteBg, borderColor: theme.quoteBorder }}
            >
              <p className="font-playfair italic leading-snug" style={{ color: theme.headingColor }}>
                Enjoy your day to the fullest!
              </p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-4 pt-3 border-t flex items-center justify-between relative z-10" style={{ borderColor: `${theme.standColor}33` }}>
            <span className="font-handwritten text-[18px] sm:text-[20px]" style={{ color: `${theme.headingColor}cc` }}>
              With lots of love
            </span>
            <span className="font-playfair text-xs font-bold tracking-wide" style={{ color: theme.headingColor }}>
              {receiverName || "You"}
            </span>
          </div>
        </div>

        {/* RIGHT PAGE OF CARD (PHOTO) */}
        <div
          ref={imageRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`w-full md:w-[50%] h-[260px] md:h-auto min-h-[280px] relative overflow-hidden flex-shrink-0 group/img ${
            isEditable ? "cursor-grab active:cursor-grabbing select-none" : ""
          }`}
          style={{ backgroundColor: "#1e1528" }}
        >
          <img
            src={activePhoto}
            alt={`Birthday greeting portrait for ${receiverName}`}
            className="w-full h-full object-cover transition-all"
            style={{ objectPosition: `${photoPosition.x}% ${photoPosition.y}%` }}
          />

          {isEditable && (
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
                </svg>
                Drag photo to position
              </div>
            </div>
          )}

          {/* Subtle border shadow over photo */}
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10" />
        </div>
      </div>
    </div>
  );
}
