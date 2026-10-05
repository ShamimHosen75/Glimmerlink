"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BRAND } from "@/lib/config";
import { compressImage } from "@/lib/image";
import Cake3DCanvas from "@/components/create/Cake3DCanvas";
import GreetingCardPreview, { CardStyleId } from "@/components/create/GreetingCardPreview";
import Flower3DPreview from "@/components/create/Flower3DPreview";
import FullExperiencePreviewModal from "@/components/create/FullExperiencePreviewModal";
import confetti from "canvas-confetti";
import { playChime } from "@/lib/audio";

/* ─── Balloons Backdrop ─────────────────────────────────────────────── */
/* ─── Balloons Backdrop (Matched to 3D Atmospheric Screenshot) ─────── */
interface BalloonData {
  id: number;
  color: string;
  size: number;
  x: string;
  cls: string;
  tilt?: number;
  depth?: number;
}

const BALLOONS: BalloonData[] = [
  // 1. Hero Mauve-Pink (foreground right, matching the dominant balloon in screenshot)
  { id: 1, color: "#c0366b", size: 125, x: "78%", cls: "balloon-rise-1", tilt: 10, depth: 1.25 },
  // 2. Deep Emerald Green (foreground left, like the big green balloon in screenshot)
  { id: 2, color: "#165028", size: 110, x: "4%", cls: "balloon-rise-2", tilt: -6, depth: 1.2 },
  // 3. Golden Amber / Mustard (upper left, like the gold balloon in screenshot)
  { id: 3, color: "#cca022", size: 90, x: "12%", cls: "balloon-rise-3", tilt: -8, depth: 1.1 },
  // 4. Vibrant Oceanic Teal (mid center, like screenshot)
  { id: 4, color: "#196a84", size: 85, x: "32%", cls: "balloon-rise-4", tilt: 4, depth: 1.0 },
  // 5. Deep Royal Purple (upper center-left, like screenshot)
  { id: 5, color: "#692982", size: 80, x: "28%", cls: "balloon-rise-5", tilt: -9, depth: 0.95 },
  // 6. Terracotta Crimson (upper right, behind pink, like screenshot)
  { id: 6, color: "#af4024", size: 75, x: "70%", cls: "balloon-rise-6", tilt: -5, depth: 0.85 },
  // 7. Small Forest Green (background mid, like screenshot)
  { id: 7, color: "#1a5e2f", size: 52, x: "48%", cls: "balloon-rise-7", tilt: 6, depth: 0.65 },
  // 8. Soft Sky Teal (behind big green, like screenshot)
  { id: 8, color: "#1d758f", size: 56, x: "17%", cls: "balloon-rise-8", tilt: 8, depth: 0.7 },
  // 9. Deep Plum Violet (lower center, like screenshot)
  { id: 9, color: "#4f2263", size: 76, x: "24%", cls: "balloon-rise-9", tilt: 5, depth: 0.9 },
  // 10. Warm Olive Brown (lower mid-left, like screenshot)
  { id: 10, color: "#6b581c", size: 66, x: "20%", cls: "balloon-rise-10", tilt: -4, depth: 0.75 },
  // 11. Midnight Indigo (background depth, like screenshot)
  { id: 11, color: "#282054", size: 68, x: "42%", cls: "balloon-rise-11", tilt: -7, depth: 0.6 },
  // 12. Lavender Violet (right edge, like screenshot)
  { id: 12, color: "#7a3782", size: 86, x: "92%", cls: "balloon-rise-12", tilt: 7, depth: 1.05 },
];

function Balloon({
  color,
  size,
  tilt = 0,
  depth = 1,
}: {
  color: string;
  size: number;
  tilt?: number;
  depth?: number;
}) {
  const w = size * 0.9;
  const h = size * 2.3;
  const gradId = `balloon-grad-${color.replace(/[^a-zA-Z0-9]/g, "")}-${size}-${Math.round(depth * 10)}`;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 240"
      className="overflow-visible pointer-events-none"
      style={{
        transform: `rotate(${tilt}deg)`,
        opacity: depth < 0.7 ? 0.55 : depth < 1 ? 0.8 : 0.96,
        filter: depth > 1 ? "drop-shadow(0 15px 25px rgba(0,0,0,0.65))" : "drop-shadow(0 8px 15px rgba(0,0,0,0.45))",
      }}
      aria-hidden
    >
      <defs>
        {/* Realistic 3D sphere lighting from top-right matching screenshot */}
        <radialGradient id={gradId} cx="68%" cy="25%" r="72%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="12%" stopColor={color} stopOpacity="1" />
          <stop offset="65%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#08020e" stopOpacity="0.95" />
        </radialGradient>
      </defs>

      {/* Long thin string dangling down under balloon (matching screenshot) */}
      <path
        d="M 50,96 Q 48,145 52,190 T 49,235"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
      />

      {/* Balloon Knot (little cone pointing down) */}
      <polygon points="46,92 54,92 50,97" fill={color} opacity="0.95" />

      {/* 3D Balloon Body: Ellipsoid shape, perfectly rounded dome, zero crop */}
      <ellipse cx="50" cy="50" rx="38" ry="44" fill={`url(#${gradId})`} />

      {/* Specular light spot on top-right (matching screenshot) */}
      <circle cx="68" cy="24" r="3.8" fill="#fffbe8" opacity="0.75" />
      <circle cx="68" cy="24" r="1.6" fill="#ffffff" opacity="0.95" />
    </svg>
  );
}

/* ─── Cake Options ──────────────────────────────────────────────────── */
const CAKE_STYLES = [
  {
    id: "classic",
    label: "Classic",
    subtitle: "Timeless elegance",
    glow: "glow-pink",
    icon: (
      <svg width="22" height="24" viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-pink-300 mb-2 opacity-85">
        <rect x="2" y="2" width="16" height="20" rx="3" />
        <polygon points="10,6 15,12 10,18 5,12" strokeDasharray="1.5 1.5" />
      </svg>
    ),
  },
  {
    id: "modern",
    label: "Modern",
    subtitle: "Clean & minimal",
    glow: "glow-blue",
    icon: (
      <svg width="22" height="24" viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-sky-300 mb-2 opacity-85">
        <rect x="2" y="2" width="16" height="20" rx="3" />
        <line x1="6" y1="7" x2="14" y2="7" />
        <line x1="6" y1="12" x2="14" y2="12" />
        <line x1="6" y1="17" x2="11" y2="17" />
      </svg>
    ),
  },
  {
    id: "grand",
    label: "Grand",
    subtitle: "Majestic presence",
    glow: "glow-rose",
    icon: (
      <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-pink-400 mb-2 opacity-85">
        <polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" />
      </svg>
    ),
  },
  {
    id: "heart",
    label: "Heart",
    subtitle: "Romantic design",
    glow: "glow-rose",
    icon: (
      <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-rose-400 mb-2 opacity-85">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    id: "hexagon",
    label: "Hexagon",
    subtitle: "Geometric symmetry",
    glow: "glow-purple",
    icon: (
      <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-purple-400 mb-2 opacity-85">
        <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
      </svg>
    ),
  },
  {
    id: "tiered_square",
    label: "Tiered Sq.",
    subtitle: "Bold layers",
    glow: "glow-gold",
    icon: (
      <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-amber-400 mb-2 opacity-85">
        <rect x="8" y="2" width="8" height="5" rx="1" />
        <rect x="5" y="8" width="14" height="6" rx="1" />
        <rect x="2" y="15" width="20" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "bundt",
    label: "Bundt",
    subtitle: "Artisanal shape",
    glow: "glow-purple",
    icon: (
      <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-purple-400 mb-2 opacity-85">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.5" />
        <line x1="12" y1="3" x2="12" y2="8" />
        <line x1="12" y1="16" x2="12" y2="21" />
        <line x1="3" y1="12" x2="8" y2="12" />
        <line x1="16" y1="12" x2="21" y2="12" />
      </svg>
    ),
  },
  {
    id: "pillow",
    label: "Pillow",
    subtitle: "Soft contours",
    glow: "glow-purple",
    icon: (
      <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-purple-300 mb-2 opacity-85">
        <rect x="3" y="3" width="18" height="18" rx="6" />
        <rect x="6" y="6" width="12" height="12" rx="3" strokeDasharray="1.5 1.5" />
      </svg>
    ),
  },
  {
    id: "sphere",
    label: "Sphere",
    subtitle: "Perfect curves",
    glow: "glow-blue",
    icon: (
      <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-teal-300 mb-2 opacity-85">
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    id: "tower",
    label: "Tower",
    subtitle: "Grand celebration",
    glow: "glow-gold",
    icon: (
      <svg width="22" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-amber-300 mb-2 opacity-85">
        <polygon points="12,2 18,22 6,22" />
      </svg>
    ),
  },
];

const CAKE_FLAVORS = [
  { id: "vanilla", label: "Vanilla", subtitle: "Sweet orchid bean", glow: "glow-gold" },
  { id: "chocolate", label: "Chocolate", subtitle: "Rich cocoa velvet", glow: "glow-gold" },
  { id: "strawberry", label: "Strawberry", subtitle: "Fresh summer berry", glow: "glow-rose" },
  { id: "red_velvet", label: "Red Velvet", subtitle: "Royal crimson", glow: "glow-rose" },
  { id: "lemon", label: "Lemon", subtitle: "Zesty citrus spark", glow: "glow-gold" },
  { id: "mint", label: "Mint", subtitle: "Cool garden breeze", glow: "glow-blue" },
  { id: "blueberry", label: "Blueberry", subtitle: "Wild indigo nectar", glow: "glow-blue" },
  { id: "caramel", label: "Caramel", subtitle: "Warm buttery drizzle", glow: "glow-gold" },
  { id: "coffee", label: "Coffee", subtitle: "Robust espresso", glow: "glow-gold" },
  { id: "pistachio", label: "Pistachio", subtitle: "Earthy roasted nut", glow: "glow-blue" },
];

/* ─── Greeting Card Suggestions ─────────────────────────────────────── */
const BIRTHDAY_CARD_SUGGESTIONS = {
  sweet: [
    "Wishing you a day filled with endless joy, beautiful moments, and all the love your heart can hold.",
    "Happy Birthday! Hope your special day brings you as much happiness as you bring to everyone around you.",
    "Wishing you a spectacular year ahead filled with love, laughter, and incredible success!",
  ],
  emotional: [
    "Through all the laughs and tears, you've been my rock. I'm so incredibly grateful to have you in my life. Have the most beautiful birthday!",
    "You deserve the absolute best today and every day. Thank you for being such an inspiring and loving presence in my world.",
    "On your special day, I just want to remind you of how much you mean to me. You are a true blessing in my life.",
  ],
  funny: [
    "Happy Birthday! You're not getting older... just more distinguished (and possibly a bit more forgetful)!",
    "Another year of surviving my jokes. You deserve a medal... or at least a really big slice of cake!",
    "Happy Birthday! Let's eat cake, make memories, and celebrate you being another year wiser!",
  ],
  blessing: [
    "May this year bring you wisdom, good health, and peace of mind. Wishing you abundant blessings on your birthday.",
    "May the road ahead be paved with happiness and success. Wishing you the warmest blessings on this special day.",
    "Praying that your day is as bright and wonderful as your spirit. Happy Birthday and many blessings!",
  ],
};

const CARD_SUGGESTIONS = BIRTHDAY_CARD_SUGGESTIONS;

const ANNIVERSARY_CARD_SUGGESTIONS = {
  sweet: [
    "Another beautiful year of loving you, laughing with you, and making cherished memories together. Happy Anniversary!",
    "Wishing you endless joy, beautiful memories, and a lifetime of love on your anniversary.",
    "To the love of my life: thank you for making every single day feel magical and full of wonder.",
  ],
  emotional: [
    "Every day by your side is my favorite adventure. Thank you for being my home, my rock, and my everything.",
    "Growing older with you is my favorite dream come true. Here's to forever and all our tomorrows.",
    "Loving you is the easiest, sweetest, and greatest decision I've ever made. Happy Anniversary, my heart.",
  ],
  funny: [
    "Happy Anniversary! I love you even more than pizza, morning coffee, and sleeping in!",
    "Another year of surviving each other's quirks! We definitely deserve an award... and more cake!",
    "Still loving you after all this time — we must be doing something wonderfully right!",
  ],
  blessing: [
    "May God continue to bless your marriage with endless joy, deep peace, and unconditional love.",
    "Wishing you many more blessed years together filled with grace, harmony, and steadfast joy.",
    "May your love continue to grow deeper and more beautiful with each passing year. Happy Anniversary!",
  ],
};

function CreateContent() {
  const searchParams = useSearchParams();
  const initialSender = searchParams.get("sender") || searchParams.get("from") || searchParams.get("name") || "";
  const initialReceiver = searchParams.get("receiver") || searchParams.get("to") || "";
  const initialOccasionParam = searchParams.get("occasion") || searchParams.get("type");
  const initialOccasion: "birthday" | "anniversary" =
    initialOccasionParam === "anniversary" ? "anniversary" : "birthday";

  const [occasion, setOccasion] = useState<"birthday" | "anniversary">(initialOccasion);
  const [anniversaryTarget, setAnniversaryTarget] = useState<"partner" | "couple">("partner");
  const [partnerName, setPartnerName] = useState(initialReceiver);
  const [firstRecipientName, setFirstRecipientName] = useState("");
  const [secondRecipientName, setSecondRecipientName] = useState("");
  const [yearsTogether, setYearsTogether] = useState("");

  const [step, setStep] = useState(1); // 1 to 7
  const [receiverName, setReceiverName] = useState(initialReceiver);
  const [senderName, setSenderName] = useState(initialSender);

  // Step 2: Cake
  const [cakeStyle, setCakeStyle] = useState("classic");
  const [cakeFlavor, setCakeFlavor] = useState("chocolate");
  const [candleCount, setCandleCount] = useState(1);

  // Step 3: Wheel of Wishes (5 grants)
  const [wheelOptions, setWheelOptions] = useState<string[]>([
    "A big warm hug 🔮",
    "Dinner is on me 🍕",
    "Movie night 🎬",
    "A coffee date ☕",
    "Your favorite dessert 🍦",
  ]);

  // Step 4: Greeting Card
  const [cardMessage, setCardMessage] = useState(
    "Wishing you a day filled with endless joy, beautiful moments, and all the love your heart can hold."
  );
  const [cardCategory, setCardCategory] = useState<keyof typeof BIRTHDAY_CARD_SUGGESTIONS>("sweet");
  const [cardStyle, setCardStyle] = useState<CardStyleId>("luxury");
  const [cardPhoto, setCardPhoto] = useState<Blob | null>(null);
  const [cardPhotoUrl, setCardPhotoUrl] = useState<string | null>(null);
  const [photoPosition, setPhotoPosition] = useState({ x: 50, y: 50 });
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Step 5: Pour heart into words
  const [introMessage, setIntroMessage] = useState("Take a deep breath and open your gift...");
  const [personalNote, setPersonalNote] = useState("I'm so grateful for you.");
  const [finalMessage, setFinalMessage] = useState("Friendship is the best gift!");

  // Step 6: Sound of Magic
  const [soundTab, setSoundTab] = useState<"voice" | "song">("voice");
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Step 7: Birthday / Anniversary Flower
  const [recipientGender, setRecipientGender] = useState<"male" | "female">("male");
  const [flowerType, setFlowerType] = useState<string | null>("rose");
  const [flowerColor, setFlowerColor] = useState("#ff3388");
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Submission state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Switch occasion handler
  const handleSwitchOccasion = (next: "birthday" | "anniversary") => {
    setOccasion(next);
    setError(null);
    if (next === "anniversary") {
      const name =
        anniversaryTarget === "partner"
          ? partnerName
          : firstRecipientName && secondRecipientName
          ? `${firstRecipientName} & ${secondRecipientName}`
          : firstRecipientName || secondRecipientName;
      if (name) setReceiverName(name);
      setCardMessage(
        "Wishing you endless joy, beautiful memories, and a lifetime of love on your anniversary."
      );
      setWheelOptions([
        "Romantic candlelit dinner 🍷",
        "Weekend getaway trip ✈️",
        "Breakfast in bed together 🥐",
        "A slow dance under stars 🎶",
        "A lifetime of laughter & love 💖",
      ]);
      setIntroMessage("Here's to celebrating our beautiful love story...");
      setPersonalNote("Loving you is the easiest and best thing I've ever done.");
      setFinalMessage("Happy Anniversary! Forever and always ❤️");
    } else {
      if (initialReceiver) setReceiverName(initialReceiver);
      setCardMessage(
        "Wishing you a day filled with endless joy, beautiful moments, and all the love your heart can hold."
      );
      setWheelOptions([
        "A big warm hug 🔮",
        "Dinner is on me 🍕",
        "Movie night 🎬",
        "A coffee date ☕",
        "Your favorite dessert 🍦",
      ]);
      setIntroMessage("Take a deep breath and open your gift...");
      setPersonalNote("I'm so grateful for you.");
      setFinalMessage("Friendship is the best gift!");
    }
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setVoiceBlob(blob);
        setVoiceUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((sec) => {
          if (sec >= 59) {
            stopRecording();
            return 60;
          }
          return sec + 1;
        });
      }, 1000);
    } catch {
      setError("Could not access microphone. Please enable microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const removeVoiceNote = () => {
    setVoiceBlob(null);
    if (voiceUrl) URL.revokeObjectURL(voiceUrl);
    setVoiceUrl(null);
    setRecordSeconds(0);
  };

  // Photo upload
  const onPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    try {
      const compressed = await compressImage(file);
      if (cardPhotoUrl) URL.revokeObjectURL(cardPhotoUrl);
      setCardPhoto(compressed);
      setCardPhotoUrl(URL.createObjectURL(compressed));
    } catch {
      setError("Could not optimize photo. Try a smaller JPG or PNG image.");
    }
  };

  // Shuffle card suggestions
  const shuffleSuggestion = () => {
    const list = occasion === "anniversary" ? ANNIVERSARY_CARD_SUGGESTIONS[cardCategory] : BIRTHDAY_CARD_SUGGESTIONS[cardCategory];
    const item = list[Math.floor(Math.random() * list.length)];
    setCardMessage(item);
  };

  // Submit to Supabase
  const handleFinalSubmit = async () => {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      const payload = {
        recipientName: receiverName.trim(),
        senderName: senderName.trim(),
        message: cardMessage.trim() || (occasion === "anniversary" ? "Happy Anniversary!" : "Wishing you a magical day!"),
        theme: "dusk",
        candleCount,
        wishes: wheelOptions.map((w) => w.trim()).filter(Boolean),
        cakeStyle,
        cakeFlavor,
        cardStyle,
        cardMessage: cardMessage.trim(),
        introMessage: introMessage.trim(),
        personalNote: personalNote.trim(),
        finalMessage: finalMessage.trim(),
        recipientGender,
        flowerType,
        flowerColor,
        photoPosition,
        occasion,
        anniversaryTarget: occasion === "anniversary" ? anniversaryTarget : undefined,
        yearsTogether: occasion === "anniversary" ? yearsTogether.trim() : undefined,
      };

      fd.append("data", JSON.stringify(payload));
      if (cardPhoto) fd.append("photo", cardPhoto, "photo.jpg");
      if (voiceBlob) fd.append("voice", voiceBlob, "voice.webm");

      const res = await fetch("/api/surprises", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(json.error || "The surprise couldn't be created. Try again.");
      setResult({ url: json.url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The surprise couldn't be created. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const [messageCopied, setMessageCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, []);

  useEffect(() => {
    if (result) {
      try {
        playChime();
      } catch {}
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.5 },
        colors: ["#e040fb", "#4cceac", "#f6c453", "#c84b31", "#8b5cf6", "#f472b6"],
      });
      const t = setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 110,
          origin: { y: 0.65 },
          colors: ["#ffd700", "#ff69b4", "#00ffff", "#ff1493"],
        });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [result]);

  const copyLink = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedShareMessage =
    occasion === "anniversary"
      ? `💍 An Anniversary Surprise For ${receiverName}! ✨\n\nI created an interactive 3D anniversary celebration just for you!\n\nOpen your magic link here:\n${result?.url || ""}\n\nWith all my love,\n${senderName || "Your partner"} ❤️`
      : `🎂 A Birthday Surprise For ${receiverName}! ✨\n\nI created an interactive 3D birthday experience just for you, complete with a birthday cake, music, wishes & a personal card!\n\nOpen your magic link here:\n${result?.url || ""}\n\nWith love,\n${senderName || "Your friend"} ❤️`;

  const copyFullMessage = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(formattedShareMessage);
    setMessageCopied(true);
    setTimeout(() => setMessageCopied(false), 2200);
  };

  const handleNativeShare = async () => {
    if (!result || !navigator.share) return;
    try {
      await navigator.share({
        title: occasion === "anniversary" ? `Anniversary Surprise for ${receiverName}` : `Birthday Surprise for ${receiverName}`,
        text: occasion === "anniversary" ? `I made an interactive 3D anniversary celebration for you! 💍✨` : `I made an interactive 3D birthday celebration for you! 🎂✨`,
        url: result.url,
      });
    } catch {}
  };

  const resetForNew = () => {
    setResult(null);
    setStep(1);
    setReceiverName("");
    setPartnerName("");
    setFirstRecipientName("");
    setSecondRecipientName("");
    setYearsTogether("");
    setSenderName("");
    setCardPhoto(null);
    setCardPhotoUrl(null);
    setVoiceBlob(null);
    setVoiceUrl(null);
    setShowFullPreview(false);
  };

  // If surprise created, show Upgraded Rich Success View
  if (result) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(result.url)}&bgcolor=150c2e&color=f472b6&margin=6`;

    return (
      <div className="min-h-screen bg-[#0f0720] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-x-hidden">
        {/* Floating background balloons (Live Down to Up) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {BALLOONS.map((b) => (
            <div key={b.id} className={`absolute ${b.cls}`} style={{ left: b.x, bottom: "-140px" }}>
              <Balloon color={b.color} size={b.size} tilt={b.tilt} depth={b.depth} />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-xl w-full text-center p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_0_90px_rgba(139,92,246,0.3)] animate-fade-in space-y-5 sm:space-y-6 my-4 sm:my-6">
          {/* Top Celebration Icon & Tag */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Link Created · Active for 48 Hours</span>
            </div>

            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-fuchsia-500/25 to-purple-500/15 border border-fuchsia-400/40 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_40px_rgba(217,70,239,0.35)] animate-bounce">
              {occasion === "anniversary" ? "💍" : "🎉"}
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif text-white tracking-tight break-words px-2">
              Surprise for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-300">{receiverName}</span> is Ready!
            </h1>
            <p className="text-slate-300 font-serif italic text-xs sm:text-base max-w-md mx-auto px-2">
              Your personalized 3D interactive celebration link has been generated. Send it to make their day truly unforgettable.
            </p>
          </div>

          {/* Surprise Experience Ticket / Summary Card */}
          <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/60 border border-white/10 text-left space-y-3 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 gap-2">
              <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold text-amber-300 flex items-center gap-1.5 truncate">
                <span>🎁</span> INCLUDED IN THIS SURPRISE
              </span>
              <button
                type="button"
                onClick={() => setShowFullPreview(true)}
                className="text-[11px] sm:text-xs font-bold text-fuchsia-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer bg-fuchsia-500/15 hover:bg-fuchsia-500/30 px-2.5 sm:px-3 py-1 rounded-full border border-fuchsia-400/30 shrink-0"
              >
                <span>👁</span> Test Experience
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white/5 rounded-xl p-2 sm:p-2.5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Cake</span>
                <span className="font-semibold text-pink-200 capitalize text-[11px] sm:text-xs truncate block">🎂 {cakeFlavor} ({candleCount}🕯️)</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 sm:p-2.5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Card Style</span>
                <span className="font-semibold text-pink-200 capitalize text-[11px] sm:text-xs truncate block">💌 {cardStyle} Card</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 sm:p-2.5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Flower</span>
                <span className="font-semibold text-pink-200 capitalize text-[11px] sm:text-xs truncate block">{flowerType ? `🌸 3D ${flowerType}` : "🎈 Balloons"}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 sm:p-2.5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Sound</span>
                <span className="font-semibold text-pink-200 text-[11px] sm:text-xs truncate block">{voiceBlob || voiceUrl ? "🎙️ Voice Note" : "🎵 Music"}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 sm:p-2.5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Wishes</span>
                <span className="font-semibold text-pink-200 text-[11px] sm:text-xs truncate block">🎡 5 Wheel Wishes</span>
              </div>
              <div className="bg-white/5 rounded-xl p-2 sm:p-2.5 border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">From</span>
                <span className="font-semibold text-pink-200 truncate block text-[11px] sm:text-xs">{senderName || "Friend"}</span>
              </div>
            </div>
          </div>

          {/* Direct URL Input Box */}
          <div className="relative">
            <input
              readOnly
              value={result.url}
              className="w-full bg-slate-950/80 p-3 sm:p-4 pe-16 sm:pe-20 rounded-xl sm:rounded-2xl border border-white/15 text-pink-300 font-mono text-[11px] sm:text-sm focus:outline-none select-all shadow-inner"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={copyLink}
              title="Copy Link"
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>

          {/* Quick Sharing Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={copyLink}
              className="py-3 sm:py-3.5 px-4 sm:px-5 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(192,38,211,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{copied ? "✓ Link Copied!" : "📋 Copy Magic Link"}</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(formattedShareMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 sm:py-3.5 px-4 sm:px-5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>💬 WhatsApp Share</span>
            </a>

            <button
              type="button"
              onClick={copyFullMessage}
              className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-bold text-[11px] sm:text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{messageCopied ? "✓ Formatted Text Copied!" : occasion === "anniversary" ? "✉️ Copy Anniversary Message & Link" : "✉️ Copy Birthday Message & Link"}</span>
            </button>

            {canNativeShare ? (
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-bold text-[11px] sm:text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📲 Share with Apps</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowQrCode((q) => !q)}
                className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 font-bold text-[11px] sm:text-xs tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{showQrCode ? "✕ Hide QR Code" : "📱 Show QR Code"}</span>
              </button>
            )}
          </div>

          {/* QR Code Reveal Section */}
          {showQrCode && (
            <div className="p-4 rounded-2xl sm:rounded-3xl bg-slate-950/80 border border-white/10 space-y-3 animate-fade-in">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                Scan With Phone Camera
              </p>
              <div className="p-3 bg-[#150c2e] rounded-2xl inline-block border border-pink-500/30 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt={`QR Code for ${occasion === "anniversary" ? "Anniversary" : "Birthday"} Surprise`}
                  width={180}
                  height={180}
                  className="rounded-lg mx-auto"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Point any smartphone camera at this code to open the 3D surprise instantly.
              </p>
            </div>
          )}

          {/* Secondary Options */}
          <div className="flex items-center justify-center gap-5 pt-2 text-xs border-t border-white/5">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-300 hover:text-white underline font-semibold tracking-wide flex items-center gap-1 transition-colors"
            >
              <span>Open in New Tab</span>
              <span>↗</span>
            </a>

            <button
              type="button"
              onClick={resetForNew}
              className="text-slate-400 hover:text-slate-200 underline font-semibold tracking-wide transition-colors cursor-pointer"
            >
              Create Another Surprise ✨
            </button>
          </div>
        </div>

        {/* Receiver Experience Preview Modal */}
        {showFullPreview && (
          <FullExperiencePreviewModal
            receiverName={receiverName}
            senderName={senderName}
            cardMessage={cardMessage}
            cardStyle={cardStyle}
            photoUrl={cardPhotoUrl}
            photoPosition={photoPosition}
            flowerType={flowerType}
            flowerColor={flowerColor}
            occasion={occasion}
            onClose={() => setShowFullPreview(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0720] text-slate-200 flex flex-col relative overflow-x-hidden">
      {/* Background radial glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(139,92,246,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Floating balloons (Live Down to Up) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {BALLOONS.map((b) => (
          <div key={b.id} className={`absolute ${b.cls}`} style={{ left: b.x, bottom: "-140px" }}>
            <Balloon color={b.color} size={b.size} tilt={b.tilt} depth={b.depth} />
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className={`flex-1 w-full mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 relative z-10 flex flex-col justify-start transition-all duration-500 ${step === 4 ? "max-w-6xl" : "max-w-2xl"}`}>

        {/* ── TOP HEADER / PROGRESS BAR ──────────────────────────────── */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 backdrop-blur-xl bg-white/5 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(139,38,242,0.15)]">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="font-serif font-black text-lg sm:text-xl text-white tracking-wide">
              {BRAND.name}
            </span>
          </Link>
          <div className="flex flex-col items-end">
            <div className="text-[9px] sm:text-[10px] text-pink-300 uppercase tracking-[0.2em] sm:tracking-[0.25em] font-extrabold mb-0.5">
              {occasion === "anniversary" ? "ANNIVERSARY" : "BIRTHDAY"} · PROGRESS
            </div>
            <div className="text-xs text-white/50 font-serif italic">
              Step {step} of 7
            </div>
          </div>
        </div>

        {/* Progress gradient bar */}
        <div className="w-full h-1.5 bg-white/5 mb-6 sm:mb-8 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-300 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(217,70,239,0.7)] relative"
            style={{ width: `${(step / 7) * 100}%` }}
          >
            <div className="absolute top-0 right-0 w-8 h-full bg-white/40 blur-sm animate-pulse" />
          </div>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs text-center font-medium animate-fade-in">
            {error}
          </div>
        )}

        {/* ── STEP 1: HERO TITLE, BADGES, TOGGLE & FORM ─────────────────── */}
        {step === 1 && (
          <div className="space-y-5 sm:space-y-6">
            {/* Header Hero & Mode Switcher */}
            <div className="text-center space-y-3 sm:space-y-4 pt-1 sm:pt-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
                {occasion === "anniversary" ? (
                  <>
                    <span className="font-hand italic text-pink-400 text-3xl sm:text-5xl md:text-6xl inline-block mr-1.5 sm:mr-2">
                      Anniversary
                    </span>
                    {" — celebrate your story together"}
                  </>
                ) : (
                  <>
                    <span className="font-hand italic text-pink-400 text-3xl sm:text-5xl md:text-6xl inline-block mr-1.5 sm:mr-2">
                      Birthday
                    </span>
                    {" — celebrate someone special"}
                  </>
                )}
              </h1>
              <p className="text-slate-300 font-serif italic text-sm sm:text-base md:text-lg max-w-xl mx-auto px-1">
                {occasion === "anniversary"
                  ? "A cake, your memories, and a little magic for the love you celebrate."
                  : "A personalized 3D cake, heartfelt wishes, and magical memories crafted with love."}
              </p>

              {/* Social Proof Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 pt-1">
                <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-900/70 border border-white/10 text-[11px] sm:text-xs backdrop-blur-md shadow-sm">
                  <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
                  <span className="font-bold text-white">4.9/5</span>
                  <span className="text-slate-400 font-medium">(89)</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-900/70 border border-white/10 text-[11px] sm:text-xs backdrop-blur-md shadow-sm">
                  <span className="text-purple-400">🛡️</span>
                  <span className="font-medium text-white">Private & Secure</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-900/70 border border-white/10 text-[11px] sm:text-xs backdrop-blur-md shadow-sm">
                  <span className="text-sky-400">👥</span>
                  <span className="font-bold text-sky-300">703</span>
                  <span className="text-slate-400 font-medium">active online</span>
                </div>
              </div>

              {/* Occasion Pill Toggle (Birthday / Anniversary) */}
              <div className="inline-flex items-center p-1 sm:p-1.5 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-xl shadow-2xl mt-1 sm:mt-2">
                <button
                  type="button"
                  onClick={() => handleSwitchOccasion("birthday")}
                  className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                    occasion === "birthday"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.5)]"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Birthday
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchOccasion("anniversary")}
                  className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                    occasion === "anniversary"
                      ? "bg-[#b81bd4] hover:bg-[#c924e6] text-white shadow-[0_0_25px_rgba(184,27,212,0.6)]"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Anniversary
                </button>
              </div>
            </div>

            {/* Step 1 Form Card */}
            <div className="animate-fade-in backdrop-blur-2xl bg-white/[0.04] p-4 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] space-y-6 sm:space-y-8">
              <div className="text-center space-y-1.5 sm:space-y-2">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
                  Whose day are we{" "}
                  <span className="text-pink-300 font-hand text-4xl sm:text-5xl md:text-6xl inline-block">
                    celebrating?
                  </span>
                </h2>
                <p className="text-slate-400 font-serif italic text-xs sm:text-base md:text-lg">
                  &ldquo;Every great surprise begins with a thought for someone special.&rdquo;
                </p>
              </div>

              {occasion === "anniversary" ? (
                /* ── ANNIVERSARY FORM ── */
                <div className="space-y-5 sm:space-y-6 pt-1 sm:pt-2">
                  {/* Sub-pill: [ My partner ] [ Another couple ] */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setAnniversaryTarget("partner");
                        if (partnerName) setReceiverName(partnerName);
                      }}
                      className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer text-center ${
                        anniversaryTarget === "partner"
                          ? "border-2 border-fuchsia-400/80 bg-fuchsia-950/40 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                          : "text-slate-400 hover:text-white border border-transparent"
                      }`}
                    >
                      My partner
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAnniversaryTarget("couple");
                        if (firstRecipientName && secondRecipientName) {
                          setReceiverName(`${firstRecipientName} & ${secondRecipientName}`);
                        } else if (firstRecipientName || secondRecipientName) {
                          setReceiverName(firstRecipientName || secondRecipientName);
                        }
                      }}
                      className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer text-center ${
                        anniversaryTarget === "couple"
                          ? "border-2 border-fuchsia-400/80 bg-fuchsia-950/40 text-white shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                          : "text-slate-400 hover:text-white border border-transparent"
                      }`}
                    >
                      Another couple
                    </button>
                  </div>

                  {/* Mode: "My partner" Form Fields */}
                  {anniversaryTarget === "partner" ? (
                    <div className="space-y-4 sm:space-y-5">
                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-black text-pink-300 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-1.5 sm:mb-2">
                          YOUR NAME
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="e.g. Alex"
                            className="w-full bg-[#0d091e] p-3.5 sm:p-4 pe-24 sm:pe-28 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/60 outline-none text-base sm:text-lg font-serif transition-all"
                          />
                          <span className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 font-serif italic text-pink-400/50 text-xs sm:text-sm tracking-widest pointer-events-none select-none flex items-center gap-1">
                            SENDER ✎
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-pink-300 tracking-wide mb-1.5 sm:mb-2">
                          Your partner&apos;s name
                        </label>
                        <input
                          type="text"
                          value={partnerName}
                          onChange={(e) => {
                            setPartnerName(e.target.value);
                            setReceiverName(e.target.value);
                          }}
                          placeholder="e.g. Shaira"
                          className="w-full bg-[#0d091e] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/60 outline-none text-base sm:text-lg transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-pink-300 tracking-wide mb-1.5 sm:mb-2">
                          Years together (optional)
                        </label>
                        <input
                          type="text"
                          value={yearsTogether}
                          onChange={(e) => setYearsTogether(e.target.value)}
                          placeholder="e.g. 5"
                          className="w-full bg-[#0d091e] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/60 outline-none text-base sm:text-lg transition-all"
                        />
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5">
                          Leave empty for a general anniversary greeting.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Mode: "Another couple" Form Fields */
                    <div className="space-y-4 sm:space-y-5">
                      <div>
                        <label className="block text-[10px] sm:text-[11px] font-black text-pink-300 uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-1.5 sm:mb-2">
                          YOUR NAME
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            placeholder="e.g. Alex"
                            className="w-full bg-[#0d091e] p-3.5 sm:p-4 pe-24 sm:pe-28 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/60 outline-none text-base sm:text-lg font-serif transition-all"
                          />
                          <span className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 font-serif italic text-pink-400/50 text-xs sm:text-sm tracking-widest pointer-events-none select-none flex items-center gap-1">
                            SENDER ✎
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-pink-300 tracking-wide mb-1.5 sm:mb-2">
                          First recipient&apos;s name
                        </label>
                        <input
                          type="text"
                          value={firstRecipientName}
                          onChange={(e) => {
                            setFirstRecipientName(e.target.value);
                            const combined = secondRecipientName
                              ? `${e.target.value} & ${secondRecipientName}`
                              : e.target.value;
                            setReceiverName(combined);
                          }}
                          placeholder="e.g. John"
                          className="w-full bg-[#0d091e] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/60 outline-none text-base sm:text-lg transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-pink-300 tracking-wide mb-1.5 sm:mb-2">
                          Second recipient&apos;s name
                        </label>
                        <input
                          type="text"
                          value={secondRecipientName}
                          onChange={(e) => {
                            setSecondRecipientName(e.target.value);
                            const combined = firstRecipientName
                              ? `${firstRecipientName} & ${e.target.value}`
                              : e.target.value;
                            setReceiverName(combined);
                          }}
                          placeholder="e.g. Emma"
                          className="w-full bg-[#0d091e] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/60 outline-none text-base sm:text-lg transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-pink-300 tracking-wide mb-1.5 sm:mb-2">
                          Years together (optional)
                        </label>
                        <input
                          type="text"
                          value={yearsTogether}
                          onChange={(e) => setYearsTogether(e.target.value)}
                          placeholder="e.g. 10"
                          className="w-full bg-[#0d091e] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/60 outline-none text-base sm:text-lg transition-all"
                        />
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-1.5">
                          Leave empty for a general anniversary greeting.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (anniversaryTarget === "partner") {
                          if (!partnerName.trim()) {
                            setError("Please enter your partner's name.");
                            return;
                          }
                          setReceiverName(partnerName.trim());
                        } else {
                          if (!firstRecipientName.trim() || !secondRecipientName.trim()) {
                            setError("Please enter both recipient names.");
                            return;
                          }
                          setReceiverName(`${firstRecipientName.trim()} & ${secondRecipientName.trim()}`);
                        }
                        setError(null);
                        setStep(2);
                      }}
                      className="w-full sm:w-auto py-3.5 sm:py-4 px-8 sm:px-10 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 hover:brightness-110 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Begin the Magic ✨</span>
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/40 flex items-center justify-center text-xs">↗</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ── BIRTHDAY FORM ── */
                <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
                  {/* 1. YOUR NAME (Auto-set from initial input!) */}
                  <div>
                    <label className="block text-[10px] font-black text-pink-300 uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-1.5 sm:mb-2">
                      YOUR NAME
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full bg-slate-900/60 p-3.5 sm:p-4 pe-24 sm:pe-28 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none text-base sm:text-xl font-serif transition-all"
                      />
                      <span className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 font-serif italic text-pink-400/50 text-xs sm:text-sm tracking-widest pointer-events-none select-none flex items-center gap-1">
                        SENDER ✎
                      </span>
                    </div>
                  </div>

                  {/* 2. THEIR NAME (Who you are celebrating) */}
                  <div>
                    <label className="block text-[10px] font-black text-pink-300 uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-1.5 sm:mb-2">
                      THEIR NAME
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        placeholder="e.g. Sarah"
                        className="w-full bg-slate-900/60 p-3.5 sm:p-4 pe-12 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none text-base sm:text-xl font-serif transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                        ✏️
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (!receiverName.trim()) {
                          setError("Please enter their name.");
                          return;
                        }
                        setError(null);
                        setStep(2);
                      }}
                      className="w-full sm:w-auto py-3.5 sm:py-4 px-8 sm:px-10 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Begin the Magic ✨</span>
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: CRAFT THEIR PERFECT CAKE ──────────── */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4 sm:space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
                Craft their{" "}
                <span className="text-pink-400 font-hand text-4xl sm:text-5xl md:text-6xl inline-block">
                  perfect cake
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-xs sm:text-base">
                &ldquo;A sweet gesture for a sweet soul.&rdquo;
              </p>
            </div>

            {/* 3D Cake Canvas Container */}
            <div className="relative bg-gradient-to-b from-slate-900/50 to-slate-950/70 backdrop-blur-2xl rounded-2xl sm:rounded-[2.5rem] border border-white/10 shadow-2xl h-64 sm:h-80 w-full overflow-hidden">
              <Cake3DCanvas
                style={cakeStyle}
                flavor={cakeFlavor}
                candles={candleCount}
                receiverName={receiverName}
                occasion={occasion}
              />
            </div>

            {/* Cake Style Selector */}
            <div className="backdrop-blur-2xl bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 space-y-5 sm:space-y-6 shadow-2xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-pink-400">✨</span>
                  <label className="text-[11px] sm:text-xs font-black text-pink-300 uppercase tracking-[0.2em]">
                    THE STYLE
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 mb-2.5 sm:mb-3">Choose the shape of your cake</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                  {CAKE_STYLES.map((st) => {
                    const isSelected = cakeStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setCakeStyle(st.id)}
                        className={`luxury-card p-2 sm:p-3 ${isSelected ? "selected" : ""}`}
                      >
                        <div className={`glow-bg ${st.glow}`} />
                        {isSelected && (
                          <div className="selected-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                        {st.icon}
                        <h4 className="text-xs sm:text-sm font-semibold text-white">{st.label}</h4>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">{st.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cake Flavor Selector */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-pink-400">🍓</span>
                  <label className="text-[11px] sm:text-xs font-black text-pink-300 uppercase tracking-[0.2em]">
                    THE FLAVOR
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 mb-2.5 sm:mb-3">Select the base flavor profile</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                  {CAKE_FLAVORS.map((fl) => {
                    const isSelected = cakeFlavor === fl.id;
                    return (
                      <button
                        key={fl.id}
                        type="button"
                        onClick={() => setCakeFlavor(fl.id)}
                        className={`luxury-card p-2 sm:p-3 ${isSelected ? "selected" : ""}`}
                      >
                        <div className={`glow-bg ${fl.glow}`} />
                        {isSelected && (
                          <div className="selected-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                        <h4 className="text-xs sm:text-sm font-semibold text-white">{fl.label}</h4>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5">{fl.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Candles Slider */}
              <div className="bg-slate-950/40 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-2.5 sm:mb-3">
                  <label className="text-[10px] font-black text-pink-300 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                    Candles of Light
                  </label>
                  <span className="font-serif text-white text-lg sm:text-xl font-bold">{candleCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={candleCount}
                  onChange={(e) => setCandleCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white font-serif italic text-sm sm:text-base transition-colors py-2"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto py-3.5 px-6 sm:px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(217,70,239,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Looks Delicious! Next Step</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: THE WHEEL OF WISHES ───────────────────────────────── */}
        {step === 3 && (
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] p-4 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-6 sm:space-y-8 relative overflow-hidden">
            {/* Background glow orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-600/[0.04] blur-[100px] rounded-full pointer-events-none" />

            <div className="text-center relative z-10 space-y-1.5 sm:space-y-2">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
                The{" "}
                <span className="text-pink-400 font-hand text-4xl sm:text-5xl md:text-7xl inline-block">
                  Wheel of Wishes
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-xs sm:text-base md:text-lg">
                &ldquo;Five promises. Five gifts of time. What magic will you grant?&rdquo;
              </p>
            </div>

            {/* 5 Grant rows */}
            <div className="space-y-3 sm:space-y-4 relative z-10 pt-1 sm:pt-2">
              {wheelOptions.map((grantText, i) => (
                <div key={i} className="flex items-center gap-2.5 sm:gap-4 bg-slate-900/40 border border-white/5 hover:border-pink-500/30 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all group focus-within:border-pink-500/50 focus-within:bg-slate-900/70">
                  <div className="w-14 sm:w-16 shrink-0 text-center">
                    <span className="text-[8px] sm:text-[9px] font-black text-pink-400/40 group-hover:text-pink-400 group-focus-within:text-pink-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] transition-colors">
                      GRANT {i + 1}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={grantText}
                    onChange={(e) => {
                      const updated = [...wheelOptions];
                      updated[i] = e.target.value;
                      setWheelOptions(updated);
                    }}
                    className="flex-1 bg-transparent text-white font-serif text-base sm:text-lg md:text-xl font-bold italic outline-none placeholder-white/20"
                    placeholder="Type a magical promise..."
                  />
                  <span className="text-slate-500 text-sm pointer-events-none group-focus-within:text-pink-400 transition-colors">
                    ✏️
                  </span>
                </div>
              ))}
            </div>

            {/* Sparkle helper text */}
            <div className="text-center relative z-10 pt-1 sm:pt-2 border-t border-white/5">
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-serif italic max-w-md mx-auto">
                Need a spark? Try <span className="text-pink-400">&ldquo;a sunset walk,&rdquo;</span>{" "}
                <span className="text-pink-400">&ldquo;your favorite meal,&rdquo;</span> or{" "}
                <span className="text-pink-400">&ldquo;a night under the stars.&rdquo;</span>
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-slate-400 hover:text-white font-serif italic text-sm sm:text-base transition-colors py-2"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full sm:w-auto py-3.5 px-6 sm:px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next: Greeting Card 💌</span>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: DESIGN A GREETING CARD ────────────────────────────── */}
        {step === 4 && (
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-10 shadow-2xl space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 sm:pb-5">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/30 flex items-center justify-center text-xl sm:text-2xl text-fuchsia-300 shrink-0">
                🎁
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-serif text-white tracking-tight">
                  Design a{" "}
                  <span className="text-pink-400 font-hand text-2xl sm:text-3xl inline-block">
                    Greeting Card
                  </span>
                </h2>
                <p className="text-slate-400 text-[11px] sm:text-xs font-serif italic">
                  This Hallmark-style card will float out of a magical gift box after they cut the cake.
                </p>
              </div>
            </div>

            {/* Grid 2 Columns: Controls & Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              {/* Left Column (Inputs) */}
              <div className="lg:col-span-5 space-y-5 sm:space-y-6">
                {/* 1. Heartfelt message */}
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-fuchsia-500 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Write Your Heartfelt Message
                      </h3>
                      <p className="text-[10px] text-slate-400">Your words make this gift truly special</p>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      value={cardMessage}
                      maxLength={300}
                      onChange={(e) => setCardMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-900/60 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none font-serif text-sm sm:text-base leading-relaxed italic"
                      placeholder={occasion === "anniversary" ? "Type your anniversary message here..." : "Type your birthday message here..."}
                    />
                    <div className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <span>{cardMessage.length}/300</span>
                      <span>✏️</span>
                    </div>
                  </div>

                  {/* Shuffle & Suggestions */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-serif italic">Need inspiration?</span>
                      <button
                        type="button"
                        onClick={shuffleSuggestion}
                        className="text-pink-400 hover:text-pink-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 cursor-pointer"
                      >
                        🔀 SHUFFLE
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {(["sweet", "emotional", "funny", "blessing"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCardCategory(cat);
                            const list = occasion === "anniversary" ? ANNIVERSARY_CARD_SUGGESTIONS[cat] : BIRTHDAY_CARD_SUGGESTIONS[cat];
                            setCardMessage(list[0]);
                          }}
                          className={`py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border text-center transition-all ${
                            cardCategory === cat
                              ? "bg-fuchsia-500/20 border-fuchsia-400 text-pink-300"
                              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Photo upload */}
                <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-fuchsia-500 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Add Their Photo
                      </h3>
                      <p className="text-[10px] text-slate-400">A photo makes your card unforgettable. Drag to position!</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className="flex-1 border-2 border-dashed border-white/10 hover:border-pink-400/40 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 text-center cursor-pointer bg-slate-900/30 transition-all flex flex-col items-center justify-center min-h-[75px] sm:min-h-[85px]">
                      <input type="file" accept="image/*" onChange={onPhotoSelect} className="hidden" />
                      <span className="text-xs text-slate-200 font-semibold">Upload Photo</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">PNG/JPG up to 2MB - optimized automatically</span>
                    </label>

                    {cardPhotoUrl ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0 mx-auto sm:mx-0">
                        <img src={cardPhotoUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setCardPhoto(null);
                            setCardPhotoUrl(null);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-black text-white text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic max-w-full sm:max-w-[140px] text-center sm:text-left leading-tight">
                        No photo selected. A warm default greeting photo will be shown instead.
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Choose card style */}
                <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-fuchsia-500 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Choose Card Style
                      </h3>
                      <p className="text-[10px] text-slate-400">Pick a design that fits their personality</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { id: "luxury", label: "LUXURY", crown: true, bg: "from-[#ebd09e] to-[#c39130]" },
                      { id: "cute", label: "CUTE", crown: false, bg: "from-[#FF9A9E] to-[#FECFEF]" },
                      { id: "minimal", label: "MINIMAL", crown: false, bg: "from-[#FFFFFF] to-[#E2E8F0] border border-white/30" },
                      { id: "floral", label: "FLORAL", crown: false, bg: "from-[#8FBC8F] to-[#556B2F]" },
                      { id: "romantic", label: "ROMANTIC", crown: false, bg: "from-[#E52D27] to-[#B31217]" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setCardStyle(st.id as CardStyleId)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          cardStyle === st.id
                            ? "bg-fuchsia-500/20 border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)] scale-105"
                            : "bg-slate-900/30 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${st.bg} flex items-center justify-center text-[10px]`}>
                          {st.crown && "👑"}
                        </div>
                        <span className={`text-[9px] font-bold tracking-wider ${cardStyle === st.id ? "text-pink-300 font-extrabold" : "text-slate-400"}`}>
                          {st.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Live Preview) */}
              <div className="lg:col-span-7 flex flex-col border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 bg-black/40 overflow-hidden relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4 border-b border-white/10 pb-2.5 sm:pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wider uppercase">
                      LIVE PREVIEW
                    </h3>
                    <p className="text-[10px] text-slate-500">This is how your greeting card will look</p>
                  </div>
                  <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10 gap-1">
                    {(["desktop", "tablet", "mobile"] as const).map((dev) => (
                      <button
                        key={dev}
                        type="button"
                        onClick={() => setPreviewDevice(dev)}
                        className={`px-2.5 sm:px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                          previewDevice === dev
                            ? "bg-fuchsia-600 text-white shadow-md"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {dev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden py-1 sm:py-2">
                  <GreetingCardPreview
                    receiverName={receiverName}
                    senderName={senderName}
                    message={cardMessage}
                    cardStyle={cardStyle}
                    photoUrl={cardPhotoUrl}
                    photoPosition={photoPosition}
                    onPhotoPositionChange={setPhotoPosition}
                    isEditable={true}
                    device={previewDevice}
                    occasion={occasion}
                  />
                </div>
              </div>
            </div>

            {/* Bottom info banner & Next CTA */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-slate-950/40 p-4 sm:p-5 rounded-2xl sm:rounded-3xl">
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl text-pink-400 shrink-0">✨</span>
                <div>
                  <p className="text-xs font-bold text-white">
                    You&apos;re one step away from creating a beautiful surprise
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Proceed to add final messages and secure your surprise link.
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-slate-400 hover:text-white font-serif italic text-sm transition-colors cursor-pointer py-1.5 px-3"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="w-full sm:w-auto py-3 sm:py-3.5 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 active:scale-95 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>CONTINUE TO CUSTOMIZE</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: POUR YOUR HEART INTO WORDS ─────────────────────────── */}
        {step === 5 && (
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] p-4 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-6 sm:space-y-8 relative overflow-hidden">
            <div className="text-center relative z-10 space-y-1.5 sm:space-y-2">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
                Pour your{" "}
                <span className="text-pink-400 font-hand text-4xl sm:text-5xl md:text-7xl inline-block">
                  heart into words
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-xs sm:text-base md:text-lg">
                &ldquo;Your voice and your words are the true gift. This is the moment they&apos;ll hear as they celebrate.&rdquo;
              </p>
            </div>

            <div className="space-y-5 sm:space-y-6 relative z-10 pt-1 sm:pt-2">
              {/* Field 1: The opening chapter */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                    THE OPENING CHAPTER
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={introMessage}
                    onChange={(e) => setIntroMessage(e.target.value)}
                    className="w-full bg-slate-900/60 p-3.5 sm:p-4 pe-12 sm:pe-14 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none font-serif text-base sm:text-lg italic"
                    placeholder="Type an opening note..."
                  />
                  <span className="absolute right-3.5 sm:right-4 top-3.5 sm:top-4 text-slate-500 pointer-events-none">✏️</span>
                  <div className="text-right text-[10px] font-bold text-slate-500 mt-1">
                    {introMessage.length} characters
                  </div>
                </div>
              </div>

              {/* Field 2: A secret note */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                    A SECRET NOTE
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    className="w-full bg-slate-900/60 p-3.5 sm:p-4 pe-12 sm:pe-14 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none font-serif text-base sm:text-lg italic"
                    placeholder="A message just for their eyes..."
                  />
                  <span className="absolute right-3.5 sm:right-4 top-3.5 sm:top-4 text-slate-500 pointer-events-none">✏️</span>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-slate-500 font-serif italic text-[10px] sm:text-xs">
                      This note stays hidden until they find it.
                    </span>
                    <span className="font-bold text-slate-500">
                      {personalNote.length} characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Field 3: One final secret */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                    ONE FINAL SECRET
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={finalMessage}
                    onChange={(e) => setFinalMessage(e.target.value)}
                    className="w-full bg-slate-900/60 p-3.5 sm:p-4 pe-16 sm:pe-20 rounded-xl sm:rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none font-serif text-base sm:text-lg italic"
                    placeholder="The very last thing they'll see..."
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2 text-slate-500 pointer-events-none">
                    <span className="text-[10px] font-bold">{finalMessage.length} chars</span>
                    <span>✏️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="text-slate-400 hover:text-white font-serif italic text-sm sm:text-base transition-colors py-2"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => setStep(6)}
                className="w-full sm:w-auto py-3.5 px-6 sm:px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Add Sound Magic ✨</span>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: THE SOUND OF MAGIC ─────────────────────────────────── */}
        {step === 6 && (
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] p-4 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-6 sm:space-y-8 relative overflow-hidden">
            <div className="text-center relative z-10 space-y-1.5 sm:space-y-2">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
                The{" "}
                <span className="text-pink-400 font-hand text-4xl sm:text-5xl md:text-7xl inline-block">
                  Sound of Magic
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-xs sm:text-base md:text-lg">
                &ldquo;A melody for the mood, a voice for the heart.&rdquo;
              </p>
            </div>

            {/* Tab Switcher: Your Voice / The Song */}
            <div className="flex bg-slate-900/80 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-white/10 max-w-xs mx-auto w-full">
              <button
                type="button"
                onClick={() => setSoundTab("voice")}
                className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  soundTab === "voice"
                    ? "bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                YOUR VOICE
              </button>
              <button
                type="button"
                onClick={() => setSoundTab("song")}
                className={`flex-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  soundTab === "song"
                    ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                THE SONG
              </button>
            </div>

            {/* Tab 1: Voice Note Recording */}
            {soundTab === "voice" && (
              <div className="bg-slate-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/5 space-y-5 sm:space-y-6 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                    VOICE NOTE
                  </span>
                  <p className="text-xs text-slate-400 font-serif italic">
                    Record a toast for their special day
                  </p>
                </div>

                {voiceUrl ? (
                  <div className="bg-black/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-between gap-3 sm:gap-4 max-w-sm mx-auto">
                    <span className="text-lg sm:text-xl">✨</span>
                    <audio src={voiceUrl} controls className="h-8 flex-1" />
                    <button
                      type="button"
                      onClick={removeVoiceNote}
                      className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 flex items-center justify-center font-bold text-sm cursor-pointer shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 sm:gap-4 py-1 sm:py-2">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl border-2 transition-all cursor-pointer active:scale-95 ${
                        isRecording
                          ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.4)] animate-pulse"
                          : "bg-white/5 border-white/15 hover:border-pink-400 text-pink-300 shadow-inner"
                      }`}
                    >
                      {isRecording ? "⏹" : "🎙️"}
                    </button>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        {isRecording ? `Recording (${recordSeconds}s / 60s)... Tap to stop` : "SPEAK FROM THE HEART"}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {isRecording ? "Speak clearly into your microphone" : "Up to 60 seconds"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Atmosphere Song */}
            {soundTab === "song" && (
              <div className="bg-slate-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/5 space-y-4 sm:space-y-5 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.25em] sm:tracking-[0.3em]">
                    ATMOSPHERE
                  </span>
                  <p className="text-xs text-slate-400 font-serif italic">
                    A melody to play as they celebrate
                  </p>
                </div>

                <div className="border-2 border-dashed border-white/10 hover:border-amber-400/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all bg-white/[0.01]">
                  <label className="cursor-pointer block space-y-2">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVoiceBlob(file);
                          setVoiceUrl(URL.createObjectURL(file));
                        }
                      }}
                      className="hidden"
                    />
                    <div className="text-2xl sm:text-3xl">🎧</div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Tap to Upload Audio (MP3, WAV, M4A)
                    </p>
                    <p className="text-[10px] text-slate-500">Up to 2MB</p>
                  </label>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="text-slate-400 hover:text-white font-serif italic text-sm sm:text-base transition-colors py-2"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => setStep(7)}
                className="w-full sm:w-auto py-3.5 px-6 sm:px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Next: Character Style 👤</span>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 7: GIFT A CELEBRATION FLOWER ────────────────────────────── */}
        {step === 7 && (
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] p-4 sm:p-7 md:p-10 rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-6 sm:space-y-7 relative overflow-hidden">
            <div className="text-center relative z-10 space-y-1.5 sm:space-y-2">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight">
                Gift a{" "}
                <span className="text-amber-400 font-hand text-4xl sm:text-5xl md:text-7xl inline-block">
                  {occasion === "anniversary" ? "Anniversary Flower" : "Birthday Flower"}
                </span>{" "}
                🌸
              </h2>
              <p className="text-slate-400 font-serif italic text-xs sm:text-base md:text-lg">
                &ldquo;Choose a beautiful 3D flower to hand over to them, or skip it.&rdquo;
              </p>
            </div>

            {/* Two columns: Controls and 3D preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch relative z-10">
              {/* Left Controls */}
              <div className="md:col-span-6 space-y-4 sm:space-y-5">
                {/* Character Style */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 space-y-2.5 sm:space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-300">
                    RECIPIENT&apos;S CHARACTER STYLE
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setRecipientGender("male")}
                      className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                        recipientGender === "male"
                          ? "bg-fuchsia-500/20 border-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/20 scale-[1.02]"
                          : "bg-black/20 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-xl sm:text-2xl mb-1">🙋‍♂️</span>
                      <span className="text-xs font-bold tracking-wide">Male Character</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipientGender("female")}
                      className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all cursor-pointer ${
                        recipientGender === "female"
                          ? "bg-fuchsia-500/20 border-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/20 scale-[1.02]"
                          : "bg-black/20 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-xl sm:text-2xl mb-1">🙋‍♀️</span>
                      <span className="text-xs font-bold tracking-wide">Female Character</span>
                    </button>
                  </div>
                </div>

                {/* Choose Flower Type */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 space-y-2.5 sm:space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-300">
                    CHOOSE FLOWER TYPE
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "rose", label: "Rose 🌹" },
                      { id: "tulip", label: "Tulip 🌷" },
                      { id: "sunflower", label: "Sunflower 🌻" },
                      { id: "daisy", label: "Daisy 🌼" },
                      { id: null, label: "No Flower ❌" },
                    ].map((fl) => {
                      const isSelected = flowerType === fl.id;
                      return (
                        <button
                          key={fl.label}
                          type="button"
                          onClick={() => {
                            setFlowerType(fl.id);
                            if (fl.id === "sunflower") setFlowerColor("#f59e0b");
                            else if (fl.id === "daisy") setFlowerColor("#ffffff");
                            else if (fl.id === "rose" && !flowerColor) setFlowerColor("#ff3388");
                          }}
                          className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-400 text-white scale-[1.02] shadow-md shadow-amber-500/20"
                              : "bg-black/20 border-white/10 text-slate-400 hover:border-white/20"
                          } ${fl.id === null ? "col-span-2 sm:col-span-1" : ""}`}
                        >
                          <span className="text-xs font-bold whitespace-nowrap">{fl.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Petal Color Swatches */}
                  {flowerType && (
                    <div className="pt-2.5 sm:pt-3 border-t border-white/5 space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-300">
                        PETAL COLOR
                      </p>
                      <div className="flex gap-2 sm:gap-2.5 justify-center flex-wrap pt-1">
                        {[
                          { hex: "#ff3388", label: "Pink" },
                          { hex: "#e11d48", label: "Red" },
                          { hex: "#a855f7", label: "Purple" },
                          { hex: "#f59e0b", label: "Gold" },
                          { hex: "#f97316", label: "Orange" },
                          { hex: "#ffffff", label: "White" },
                        ].map((c) => (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => setFlowerColor(c.hex)}
                            title={c.label}
                            className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                              flowerColor === c.hex
                                ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0f0720] shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                                : "hover:scale-110 opacity-80 hover:opacity-100"
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Button */}
                <button
                  type="button"
                  onClick={() => setShowFullPreview(true)}
                  className="w-full py-3.5 px-4 rounded-full border border-fuchsia-400/30 hover:border-fuchsia-400/60 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                >
                  <span>👁</span> PREVIEW HOW RECEIVER SEES IT
                </button>
              </div>

              {/* Right Column: 3D Flower Preview */}
              <div className="md:col-span-6 bg-slate-900/40 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden h-[280px] sm:h-[380px] md:h-auto min-h-[280px] sm:min-h-[340px] flex flex-col justify-center relative shadow-2xl">
                <Flower3DPreview type={flowerType} color={flowerColor} />
              </div>
            </div>

            {/* Retention Notice */}
            <p className="text-center text-[11px] sm:text-xs leading-relaxed text-slate-400 max-w-xl mx-auto pt-1 sm:pt-2 px-2">
              Your private link is available for 48 hours from when your surprise is successfully created. Opening or sharing it does not restart this period.
            </p>

            {/* Footer Navigation */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="text-slate-400 hover:text-white font-serif italic text-sm sm:text-base transition-colors py-2"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleFinalSubmit}
                className="w-full sm:w-auto py-3.5 sm:py-4 px-6 sm:px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:opacity-50 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_30px_rgba(192,38,211,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{busy ? "Finalizing Magic..." : "Get My Surprise Link ✨"}</span>
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Receiver Experience Preview Modal */}
      {showFullPreview && (
        <FullExperiencePreviewModal
          receiverName={receiverName}
          senderName={senderName}
          cardMessage={cardMessage}
          cardStyle={cardStyle}
          photoUrl={cardPhotoUrl}
          photoPosition={photoPosition}
          flowerType={flowerType}
          flowerColor={flowerColor}
          occasion={occasion}
          onClose={() => setShowFullPreview(false)}
        />
      )}
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f0720] flex items-center justify-center text-pink-300 font-serif text-lg animate-pulse">
          Baking the magic... 🎂
        </div>
      }
    >
      <CreateContent />
    </Suspense>
  );
}
