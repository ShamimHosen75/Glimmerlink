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
  accentColor: string;
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
    heartColor: "#E11D48",
    accentColor: "#E11D48",
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
    heartColor: "#F43F5E",
    accentColor: "#F43F5E",
  },
  minimal: {
    cardBg: "#FFFFFF",
    paperBgStart: "#FFFFFF",
    paperBgEnd: "#F8FAFC",
    headingColor: "#0F172A",
    textColor: "#334155",
    scriptGradientStart: "#0F172A",
    scriptGradientEnd: "#334155",
    standColor: "#94A3B8",
    cakeIcing: "#FDA4AF",
    quoteBg: "rgba(15,23,42,0.03)",
    quoteBorder: "rgba(15,23,42,0.08)",
    heartColor: "#E11D48",
    accentColor: "#E11D48",
  },
  floral: {
    cardBg: "#F4F7F4",
    paperBgStart: "#FAFAFA",
    paperBgEnd: "#EEF2EE",
    headingColor: "#1B3B2B",
    textColor: "#2E4738",
    scriptGradientStart: "#15803D",
    scriptGradientEnd: "#047857",
    standColor: "#BC8F8F",
    cakeIcing: "#A7F3D0",
    quoteBg: "rgba(21,128,61,0.08)",
    quoteBorder: "rgba(21,128,61,0.2)",
    heartColor: "#15803D",
    accentColor: "#15803D",
  },
  romantic: {
    cardBg: "#FFF2F2",
    paperBgStart: "#FFFDFD",
    paperBgEnd: "#FFE6E6",
    headingColor: "#4A1515",
    textColor: "#5A2525",
    scriptGradientStart: "#BE123C",
    scriptGradientEnd: "#E11D48",
    standColor: "#C5A059",
    cakeIcing: "#FF4D4D",
    quoteBg: "rgba(229,45,39,0.08)",
    quoteBorder: "rgba(229,45,39,0.18)",
    heartColor: "#E11D48",
    accentColor: "#E11D48",
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
  occasion = "birthday",
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
  occasion?: "birthday" | "anniversary";
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
    const keywords = ["endless joy", "beautiful moments", "love", "joy", "happiness", "magical moments", "special", "rock", "everything", "favorite adventure", "home"];
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (keywords.some((k) => k.toLowerCase() === part.toLowerCase())) {
        return (
          <span
            key={i}
            className="font-bold inline-block"
            style={{ color: theme.accentColor }}
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
        className="w-full rounded-[20px] sm:rounded-[28px] md:rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative z-10 border"
        style={{ backgroundColor: theme.cardBg, borderColor: theme.quoteBorder }}
      >
        {/* LEFT PAGE OF CARD */}
        <div
          className="w-full md:w-[50%] p-3.5 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-between relative overflow-hidden"
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
          <div className="absolute top-3.5 right-4 sm:top-4 sm:right-5 text-sm opacity-35" style={{ color: theme.heartColor }}>
            ♥
          </div>
          <div className="absolute top-8 left-4 sm:top-10 sm:left-5 text-xs opacity-25" style={{ color: theme.standColor }}>
            ✦
          </div>

          {/* Card Header */}
          <div className="relative z-10 space-y-0.5">
            <h1
              className="font-playfair text-[20px] sm:text-[26px] md:text-[32px] leading-tight"
              style={{ color: theme.headingColor }}
            >
              Happy
            </h1>
            <h2
              className={`font-vibes ${
                occasion === "anniversary"
                  ? "text-[28px] xs:text-[34px] sm:text-[40px] md:text-[44px] lg:text-[48px]"
                  : "text-[32px] xs:text-[38px] sm:text-[46px] md:text-[52px] lg:text-[56px]"
              } leading-[0.95] py-0.5 tracking-tight whitespace-nowrap`}
              style={{
                color: theme.accentColor,
              }}
            >
              {occasion === "anniversary" ? "Anniversary!" : "Birthday!"}
            </h2>
            <div
              className="w-10 sm:w-12 h-[1.5px] mt-2 rounded-full"
              style={{ backgroundColor: `${theme.standColor}55` }}
            />
          </div>

          {/* Message body */}
          <div className="relative z-10 py-3 sm:py-4 my-auto">
            <p
              className="font-cormorant text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed"
              style={{ color: theme.textColor }}
            >
              {message
                ? highlightWords(message)
                : occasion === "anniversary"
                ? "Wishing you endless love, joy, and magical years together."
                : "Wishing you a day filled with endless joy and love."}
            </p>

            <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 flex-wrap">
              <span
                className="font-handwritten text-[18px] sm:text-[22px] md:text-[24px] leading-none font-semibold inline-block"
                style={{ color: theme.accentColor }}
              >
                {occasion === "anniversary" ? "Celebrating our love!" : "You're truly special!"}
              </span>
              <span style={{ color: theme.heartColor }} className="text-xs">
                ♥
              </span>
            </div>
          </div>

          {/* Card Cake + Quote Illustration */}
          <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-3 pt-2">
            {/* Mini Cake Vector */}
            <div className="w-[56px] sm:w-[68px] h-[60px] sm:h-[72px] shrink-0">
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
              className="rounded-xl p-2 sm:p-2.5 text-center border text-[11px] sm:text-xs flex-1"
              style={{ backgroundColor: theme.quoteBg, borderColor: theme.quoteBorder }}
            >
              <p className="font-playfair italic leading-snug" style={{ color: theme.headingColor }}>
                {occasion === "anniversary" ? "Cherishing every moment together." : "Enjoy your day to the fullest!"}
              </p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t flex items-center justify-between relative z-10" style={{ borderColor: `${theme.standColor}33` }}>
            <span className="font-handwritten text-[16px] sm:text-[19px]" style={{ color: `${theme.headingColor}cc` }}>
              {occasion === "anniversary" ? "With all my heart" : "With lots of love"}
            </span>
            <span className="font-playfair text-[11px] sm:text-xs font-bold tracking-wide" style={{ color: theme.headingColor }}>
              {receiverName || "You"}
            </span>
          </div>
        </div>

        {/* RIGHT PAGE OF CARD (PHOTO) */}
        <div
          ref={imageRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`w-full md:w-[50%] h-[210px] sm:h-[260px] md:h-auto min-h-[210px] sm:min-h-[280px] relative overflow-hidden flex-shrink-0 group/img ${
            isEditable ? "cursor-grab active:cursor-grabbing select-none" : ""
          }`}
          style={{ backgroundColor: "#1e1528", touchAction: isEditable ? "none" : "auto" }}
        >
          <img
            src={activePhoto}
            alt={occasion === "anniversary" ? `Anniversary greeting portrait for ${receiverName}` : `Birthday greeting portrait for ${receiverName}`}
            className="w-full h-full object-cover transition-all"
            style={{ objectPosition: `${photoPosition.x}% ${photoPosition.y}%` }}
          />

          {isEditable && (
            <div className="absolute inset-0 bg-black/25 opacity-75 sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5 border border-white/20 shadow-lg">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
