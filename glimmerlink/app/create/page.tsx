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

/* ─── Balloons Backdrop ─────────────────────────────────────────────── */
const BALLOONS = [
  { id: 1, color: "#e040fb", size: 85, x: "3%", y: "12%", cls: "balloon-1" },
  { id: 2, color: "#4cceac", size: 105, x: "2%", y: "48%", cls: "balloon-2" },
  { id: 3, color: "#f6c453", size: 65, x: "8%", y: "78%", cls: "balloon-3" },
  { id: 4, color: "#c84b31", size: 75, x: "92%", y: "15%", cls: "balloon-5" },
  { id: 5, color: "#c020e0", size: 95, x: "88%", y: "55%", cls: "balloon-6" },
  { id: 6, color: "#8b5cf6", size: 70, x: "94%", y: "80%", cls: "balloon-10" },
];

function Balloon({ color, size }: { color: string; size: number }) {
  const h = size;
  const w = size * 0.82;
  const shine = "rgba(255,255,255,0.3)";
  return (
    <svg width={w} height={h + 20} viewBox={`0 0 ${w} ${h + 20}`} aria-hidden>
      <ellipse cx={w / 2} cy={h * 0.48} rx={w / 2} ry={h * 0.52} fill={color} />
      <ellipse cx={w * 0.35} cy={h * 0.3} rx={w * 0.12} ry={h * 0.1} fill={shine} />
      <polygon points={`${w / 2 - 4},${h} ${w / 2 + 4},${h} ${w / 2},${h + 8}`} fill={color} />
      <line x1={w / 2} y1={h + 8} x2={w / 2 + 4} y2={h + 20} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  );
}

/* ─── Cake Options ──────────────────────────────────────────────────── */
const CAKE_STYLES = [
  { id: "classic", label: "Classic", subtitle: "Timeless elegance", glow: "glow-pink" },
  { id: "modern", label: "Modern", subtitle: "Clean & minimal", glow: "glow-blue" },
  { id: "grand", label: "Grand", subtitle: "Majestic presence", glow: "glow-rose" },
  { id: "heart", label: "Heart", subtitle: "Romantic design", glow: "glow-rose" },
  { id: "hexagon", label: "Hexagon", subtitle: "Geometric symmetry", glow: "glow-purple" },
  { id: "tiered_square", label: "Tiered Sq.", subtitle: "Bold layers", glow: "glow-gold" },
  { id: "bundt", label: "Bundt", subtitle: "Artisanal shape", glow: "glow-purple" },
  { id: "pillow", label: "Pillow", subtitle: "Soft contours", glow: "glow-purple" },
  { id: "sphere", label: "Sphere", subtitle: "Perfect curves", glow: "glow-blue" },
  { id: "tower", label: "Tower", subtitle: "Grand celebration", glow: "glow-gold" },
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
const CARD_SUGGESTIONS = {
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

function CreateContent() {
  const searchParams = useSearchParams();
  const initialName = searchParams.get("name") || "";

  const [step, setStep] = useState(1); // 1 to 7
  const [receiverName, setReceiverName] = useState(initialName);
  const [senderName, setSenderName] = useState("");

  // Step 2: Cake
  const [cakeStyle, setCakeStyle] = useState("classic");
  const [cakeFlavor, setCakeFlavor] = useState("vanilla");
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
  const [cardCategory, setCardCategory] = useState<keyof typeof CARD_SUGGESTIONS>("sweet");
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

  // Step 7: Birthday Flower
  const [recipientGender, setRecipientGender] = useState<"male" | "female">("male");
  const [flowerType, setFlowerType] = useState<string | null>("rose");
  const [flowerColor, setFlowerColor] = useState("#ff3388");
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Submission state
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [copied, setCopied] = useState(false);

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
    const list = CARD_SUGGESTIONS[cardCategory];
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
        message: cardMessage.trim() || "Wishing you a magical day!",
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

  const copyLink = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If surprise created, show Success View
  if (result) {
    const shareText = `${receiverName}, I made an interactive 3D birthday surprise for you! 🎂✨ Open your magic link: ${result.url}`;
    return (
      <div className="min-h-screen bg-[#0f0720] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Floating background balloons */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {BALLOONS.map((b) => (
            <div key={b.id} className={`absolute ${b.cls}`} style={{ left: b.x, top: b.y }}>
              <Balloon color={b.color} size={b.size} />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-lg w-full text-center p-8 sm:p-10 rounded-[2.5rem] bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] animate-fade-in space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-fuchsia-500/20 to-purple-500/10 border border-fuchsia-400/30 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(217,70,239,0.3)]">
            🎉
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
              Your surprise is ready!
            </h1>
            <p className="text-slate-300 font-serif italic text-sm sm:text-base mt-2">
              Send this private link to <span className="text-fuchsia-300 font-bold">{receiverName}</span>. It stays active for 48 hours.
            </p>
          </div>

          <div className="relative">
            <input
              readOnly
              value={result.url}
              className="w-full bg-slate-900/60 p-4 pe-12 rounded-2xl border border-white/10 text-white font-mono text-xs sm:text-sm focus:outline-none"
              onFocus={(e) => e.target.select()}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={copyLink}
              className="flex-1 py-4 px-6 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(192,38,211,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{copied ? "✓ Copied!" : "📋 Copy Link"}</span>
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-bold text-sm tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>💬 WhatsApp</span>
            </a>
          </div>

          <div className="pt-2">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-fuchsia-300 hover:text-white underline font-semibold tracking-wide"
            >
              Preview it yourself in a new tab ↗
            </a>
            <p className="text-[10px] text-slate-500 mt-1">
              Previewing doesn&apos;t affect the 48-hour active duration.
            </p>
          </div>
        </div>
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

      {/* Floating balloons */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {BALLOONS.map((b) => (
          <div key={b.id} className={`absolute ${b.cls}`} style={{ left: b.x, top: b.y }}>
            <Balloon color={b.color} size={b.size} />
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className={`flex-1 w-full mx-auto px-4 py-8 relative z-10 flex flex-col justify-start transition-all duration-500 ${step === 4 ? "max-w-6xl" : "max-w-2xl"}`}>

        {/* ── TOP HEADER / PROGRESS BAR ──────────────────────────────── */}
        <div className="flex items-center justify-between mb-4 backdrop-blur-xl bg-white/5 p-4 sm:p-5 rounded-3xl border border-white/10 shadow-[0_0_30px_rgba(139,38,242,0.15)]">
          <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
            <span className="font-serif font-black text-xl text-white tracking-wide">
              {BRAND.name}
            </span>
          </Link>
          <div className="flex flex-col items-end">
            <div className="text-[10px] text-pink-300 uppercase tracking-[0.25em] font-extrabold mb-0.5">
              BIRTHDAY · CREATION PROGRESS
            </div>
            <div className="text-xs text-white/50 font-serif italic">
              Step {step} of 7
            </div>
          </div>
        </div>

        {/* Progress gradient bar */}
        <div className="w-full h-1.5 bg-white/5 mb-8 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-amber-300 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(217,70,239,0.7)] relative"
            style={{ width: `${(step / 7) * 100}%` }}
          >
            <div className="absolute top-0 right-0 w-8 h-full bg-white/40 blur-sm animate-pulse" />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs text-center font-medium animate-fade-in">
            {error}
          </div>
        )}

        {/* ── STEP 1: WHOSE DAY ARE WE CELEBRATING? ─────────────────────── */}
        {step === 1 && (
          <div className="animate-fade-in backdrop-blur-2xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                Whose day are we{" "}
                <span className="text-pink-400 font-hand text-5xl md:text-6xl inline-block">
                  celebrating?
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-base md:text-lg">
                &ldquo;Every great surprise begins with a thought for someone special.&rdquo;
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div>
                <label className="block text-[10px] font-black text-pink-300 uppercase tracking-[0.3em] mb-2">
                  THEIR NAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="e.g. Sarah"
                    className="w-full bg-slate-900/60 p-4 pe-12 rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none text-xl font-serif transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    ✏️
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-pink-300 uppercase tracking-[0.3em] mb-2">
                  YOUR NAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-slate-900/60 p-4 pe-12 rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none text-xl font-serif transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    ✏️
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
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
                className="py-4 px-10 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Begin the Magic ✨</span>
                <span className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: CRAFT THEIR PERFECT CAKE ──────────────────────────── */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                Craft their{" "}
                <span className="text-pink-400 font-hand text-5xl md:text-6xl inline-block">
                  perfect cake
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-base">
                &ldquo;A sweet gesture for a sweet soul.&rdquo;
              </p>
            </div>

            {/* 3D Cake Canvas Container */}
            <div className="relative bg-gradient-to-b from-slate-900/50 to-slate-950/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl h-80 w-full overflow-hidden">
              <Cake3DCanvas
                style={cakeStyle}
                flavor={cakeFlavor}
                candles={candleCount}
                receiverName={receiverName}
              />
            </div>

            {/* Cake Style Selector */}
            <div className="backdrop-blur-2xl bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-pink-400">✨</span>
                  <label className="text-xs font-black text-pink-300 uppercase tracking-[0.2em]">
                    THE STYLE
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 mb-3">Choose the shape of your cake</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {CAKE_STYLES.map((st) => {
                    const isSelected = cakeStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setCakeStyle(st.id)}
                        className={`luxury-card ${isSelected ? "selected" : ""}`}
                      >
                        <div className={`glow-bg ${st.glow}`} />
                        {isSelected && (
                          <div className="selected-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                        <h4 className="text-sm font-semibold text-white">{st.label}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{st.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cake Flavor Selector */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-pink-400">🍓</span>
                  <label className="text-xs font-black text-pink-300 uppercase tracking-[0.2em]">
                    THE FLAVOR
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 mb-3">Select the base flavor profile</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {CAKE_FLAVORS.map((fl) => {
                    const isSelected = cakeFlavor === fl.id;
                    return (
                      <button
                        key={fl.id}
                        type="button"
                        onClick={() => setCakeFlavor(fl.id)}
                        className={`luxury-card ${isSelected ? "selected" : ""}`}
                      >
                        <div className={`glow-bg ${fl.glow}`} />
                        {isSelected && (
                          <div className="selected-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                        <h4 className="text-sm font-semibold text-white">{fl.label}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{fl.subtitle}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Candles Slider */}
              <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-pink-300 uppercase tracking-[0.3em]">
                    Candles of Light
                  </label>
                  <span className="font-serif text-white text-xl font-bold">{candleCount}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={candleCount}
                  onChange={(e) => setCandleCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white font-serif italic text-base transition-colors"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3.5 px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(217,70,239,0.35)] transition-all flex items-center gap-2 cursor-pointer"
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
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-8 relative overflow-hidden">
            {/* Background glow orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-600/[0.04] blur-[100px] rounded-full pointer-events-none" />

            <div className="text-center relative z-10 space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                The{" "}
                <span className="text-pink-400 font-hand text-5xl md:text-7xl inline-block">
                  Wheel of Wishes
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-base md:text-lg">
                &ldquo;Five promises. Five gifts of time. What magic will you grant?&rdquo;
              </p>
            </div>

            {/* 5 Grant rows */}
            <div className="space-y-4 relative z-10 pt-2">
              {wheelOptions.map((grantText, i) => (
                <div key={i} className="flex items-center gap-4 bg-slate-900/40 border border-white/5 hover:border-pink-500/30 p-3.5 sm:p-4 rounded-2xl transition-all group focus-within:border-pink-500/50 focus-within:bg-slate-900/70">
                  <div className="w-16 shrink-0 text-center">
                    <span className="text-[9px] font-black text-pink-400/40 group-hover:text-pink-400 group-focus-within:text-pink-400 uppercase tracking-[0.25em] transition-colors">
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
                    className="flex-1 bg-transparent text-white font-serif text-lg md:text-xl font-bold italic outline-none placeholder-white/20"
                    placeholder="Type a magical promise..."
                  />
                  <span className="text-slate-500 text-sm pointer-events-none group-focus-within:text-pink-400 transition-colors">
                    ✏️
                  </span>
                </div>
              ))}
            </div>

            {/* Sparkle helper text */}
            <div className="text-center relative z-10 pt-2 border-t border-white/5">
              <p className="text-[11px] text-slate-400 font-serif italic max-w-md mx-auto">
                Need a spark? Try <span className="text-pink-400">&ldquo;a sunset walk,&rdquo;</span>{" "}
                <span className="text-pink-400">&ldquo;your favorite home-cooked meal,&rdquo;</span> or{" "}
                <span className="text-pink-400">&ldquo;a night under the stars.&rdquo;</span>
              </p>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-slate-400 hover:text-white font-serif italic text-base transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-3.5 px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-sm tracking-wider shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Next: Greeting Card 💌</span>
                <span className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: DESIGN A GREETING CARD ────────────────────────────── */}
        {step === 4 && (
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="w-11 h-11 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/30 flex items-center justify-center text-2xl text-fuchsia-300">
                🎁
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-white tracking-tight">
                  Design a{" "}
                  <span className="text-pink-400 font-hand text-2xl sm:text-3xl inline-block">
                    Greeting Card
                  </span>
                </h2>
                <p className="text-slate-400 text-xs font-serif italic">
                  This Hallmark-style card will float out of a magical gift box after they cut the cake.
                </p>
              </div>
            </div>

            {/* Grid 2 Columns: Controls & Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (Inputs) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Heartfelt message */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-fuchsia-500 text-white font-bold text-xs flex items-center justify-center">
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
                      className="w-full bg-slate-900/60 p-4 rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none font-serif text-sm leading-relaxed italic"
                      placeholder="Type your birthday message here..."
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

                    <div className="grid grid-cols-4 gap-1.5">
                      {(["sweet", "emotional", "funny", "blessing"] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCardCategory(cat);
                            setCardMessage(CARD_SUGGESTIONS[cat][0]);
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
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-fuchsia-500 text-white font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Add Their Photo
                      </h3>
                      <p className="text-[10px] text-slate-400">A photo makes your card unforgettable. Drag to position!</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex-1 border-2 border-dashed border-white/10 hover:border-pink-400/40 rounded-2xl p-4 text-center cursor-pointer bg-slate-900/30 transition-all flex flex-col items-center justify-center min-h-[85px]">
                      <input type="file" accept="image/*" onChange={onPhotoSelect} className="hidden" />
                      <span className="text-xs text-slate-200 font-semibold">Upload Photo</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">PNG/JPG up to 2MB - optimized before upload</span>
                    </label>

                    {cardPhotoUrl ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0">
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
                      <div className="text-[10px] text-slate-400 italic max-w-[140px] leading-tight">
                        No photo selected. A warm default greeting photo will be shown instead.
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Choose card style */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-fuchsia-500 text-white font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Choose Card Style
                      </h3>
                      <p className="text-[10px] text-slate-400">Pick a design that fits their personality</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: "luxury", label: "LUXURY", crown: true, bg: "from-[#ebd09e] to-[#c39130]" },
                      { id: "cute", label: "CUTE", crown: false, bg: "from-[#FF9A9E] to-[#FECFEF]" },
                      { id: "minimal", label: "MINIMAL", crown: false, bg: "from-[#EAEAEA] to-[#CCCCCC]" },
                      { id: "floral", label: "FLORAL", crown: false, bg: "from-[#8FBC8F] to-[#556B2F]" },
                      { id: "romantic", label: "ROMANTIC", crown: false, bg: "from-[#E52D27] to-[#B31217]" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setCardStyle(st.id as CardStyleId)}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          cardStyle === st.id
                            ? "bg-fuchsia-500/20 border-fuchsia-400 shadow-inner scale-105"
                            : "bg-slate-900/30 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${st.bg} flex items-center justify-center text-[10px]`}>
                          {st.crown && "👑"}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                          {st.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Live Preview) */}
              <div className="lg:col-span-7 flex flex-col border border-white/10 rounded-3xl p-5 bg-black/40 overflow-hidden relative">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
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
                        className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
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

                <div className="flex-1 flex items-center justify-center overflow-hidden py-2">
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
                  />
                </div>
              </div>
            </div>

            {/* Bottom info banner & Next CTA */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 p-5 rounded-3xl">
              <div className="flex items-center gap-3 text-left">
                <span className="text-2xl text-pink-400">✨</span>
                <div>
                  <p className="text-xs font-bold text-white">
                    You&apos;re one step away from creating a beautiful surprise
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Proceed to add final messages and secure your surprise link.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-slate-400 hover:text-white font-serif italic text-sm transition-colors cursor-pointer px-3"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all flex items-center gap-2 cursor-pointer"
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
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-8 relative overflow-hidden">
            <div className="text-center relative z-10 space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                Pour your{" "}
                <span className="text-pink-400 font-hand text-5xl md:text-7xl inline-block">
                  heart into words
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-base md:text-lg">
                &ldquo;Your voice and your words are the true gift. This is the moment they&apos;ll hear as they celebrate.&rdquo;
              </p>
            </div>

            <div className="space-y-6 relative z-10 pt-2">
              {/* Field 1: The opening chapter */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">
                    THE OPENING CHAPTER
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={introMessage}
                    onChange={(e) => setIntroMessage(e.target.value)}
                    className="w-full bg-slate-900/60 p-4 pe-14 rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none font-serif text-lg italic"
                    placeholder="Type an opening note..."
                  />
                  <span className="absolute right-4 top-4 text-slate-500 pointer-events-none">✏️</span>
                  <div className="text-right text-[10px] font-bold text-slate-500 mt-1">
                    {introMessage.length} characters
                  </div>
                </div>
              </div>

              {/* Field 2: A secret note */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">
                    A SECRET NOTE
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    className="w-full bg-slate-900/60 p-4 pe-14 rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none font-serif text-lg italic"
                    placeholder="A message just for their eyes..."
                  />
                  <span className="absolute right-4 top-4 text-slate-500 pointer-events-none">✏️</span>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-slate-500 font-serif italic">
                      This note stays hidden until they find it.
                    </span>
                    <span className="font-bold text-slate-500">
                      {personalNote.length} characters
                    </span>
                  </div>
                </div>
              </div>

              {/* Field 3: One final secret */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">
                    ONE FINAL SECRET
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={finalMessage}
                    onChange={(e) => setFinalMessage(e.target.value)}
                    className="w-full bg-slate-900/60 p-4 pe-20 rounded-2xl border border-white/10 text-white placeholder-white/20 focus:border-pink-500/50 outline-none font-serif text-lg italic"
                    placeholder="The very last thing they'll see..."
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-500 pointer-events-none">
                    <span className="text-[10px] font-bold">{finalMessage.length} chars</span>
                    <span>✏️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="text-slate-400 hover:text-white font-serif italic text-base transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => setStep(6)}
                className="py-3.5 px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-sm tracking-wider shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Add Sound Magic ✨</span>
                <span className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: THE SOUND OF MAGIC ─────────────────────────────────── */}
        {step === 6 && (
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-8 relative overflow-hidden">
            <div className="text-center relative z-10 space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                The{" "}
                <span className="text-pink-400 font-hand text-5xl md:text-7xl inline-block">
                  Sound of Magic
                </span>
              </h2>
              <p className="text-slate-400 font-serif italic text-base md:text-lg">
                &ldquo;A melody for the mood, a voice for the heart.&rdquo;
              </p>
            </div>

            {/* Tab Switcher: Your Voice / The Song */}
            <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 max-w-xs mx-auto w-full">
              <button
                type="button"
                onClick={() => setSoundTab("voice")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
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
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
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
              <div className="bg-slate-900/50 rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">
                    VOICE NOTE
                  </span>
                  <p className="text-xs text-slate-400 font-serif italic">
                    Record a toast for their special day
                  </p>
                </div>

                {voiceUrl ? (
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4 max-w-sm mx-auto">
                    <span className="text-xl">✨</span>
                    <audio src={voiceUrl} controls className="h-8 flex-1" />
                    <button
                      type="button"
                      onClick={removeVoiceNote}
                      className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-2">
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl border-2 transition-all cursor-pointer ${
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
              <div className="bg-slate-900/50 rounded-3xl p-6 sm:p-8 border border-white/5 space-y-5 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-[0.3em]">
                    ATMOSPHERE
                  </span>
                  <p className="text-xs text-slate-400 font-serif italic">
                    A melody to play as they cut the cake
                  </p>
                </div>

                <div className="border-2 border-dashed border-white/10 hover:border-amber-400/40 rounded-2xl p-6 transition-all bg-white/[0.01]">
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
                    <div className="text-3xl">🎧</div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Tap to Upload Audio (MP3, WAV, M4A)
                    </p>
                    <p className="text-[10px] text-slate-500">Up to 2MB</p>
                  </label>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setStep(5)}
                className="text-slate-400 hover:text-white font-serif italic text-base transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => setStep(7)}
                className="py-3.5 px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-sm tracking-wider shadow-[0_0_25px_rgba(192,38,211,0.4)] transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Next: Character Style 👤</span>
                <span className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 7: GIFT A BIRTHDAY FLOWER ────────────────────────────── */}
        {step === 7 && (
          <div className="animate-fade-in backdrop-blur-3xl bg-white/[0.03] p-6 sm:p-8 md:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] space-y-7 relative overflow-hidden">
            <div className="text-center relative z-10 space-y-2">
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
                Gift a{" "}
                <span className="text-amber-400 font-hand text-5xl md:text-7xl inline-block">
                  Birthday Flower
                </span>{" "}
                🌸
              </h2>
              <p className="text-slate-400 font-serif italic text-base md:text-lg">
                &ldquo;Choose a beautiful 3D flower to hand over to them, or skip it.&rdquo;
              </p>
            </div>

            {/* Two columns: Controls and 3D preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative z-10">
              {/* Left Controls */}
              <div className="md:col-span-6 space-y-5">
                {/* Character Style */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-300">
                    RECIPIENT&apos;S CHARACTER STYLE
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRecipientGender("male")}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        recipientGender === "male"
                          ? "bg-fuchsia-500/20 border-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/20 scale-[1.02]"
                          : "bg-black/20 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-2xl mb-1">🙋‍♂️</span>
                      <span className="text-xs font-bold tracking-wide">Male Character</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecipientGender("female")}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        recipientGender === "female"
                          ? "bg-fuchsia-500/20 border-fuchsia-400 text-white shadow-lg shadow-fuchsia-500/20 scale-[1.02]"
                          : "bg-black/20 border-white/10 text-slate-400 hover:border-white/20"
                      }`}
                    >
                      <span className="text-2xl mb-1">🙋‍♀️</span>
                      <span className="text-xs font-bold tracking-wide">Female Character</span>
                    </button>
                  </div>
                </div>

                {/* Choose Flower Type */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-300">
                    CHOOSE FLOWER TYPE
                  </p>
                  <div className="grid grid-cols-3 gap-2">
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
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-400 text-white scale-[1.02] shadow-md shadow-amber-500/20"
                              : "bg-black/20 border-white/10 text-slate-400 hover:border-white/20"
                          } ${fl.id === null ? "col-span-2" : ""}`}
                        >
                          <span className="text-xs font-bold whitespace-nowrap">{fl.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Petal Color Swatches */}
                  {flowerType && (
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black text-amber-300">
                        PETAL COLOR
                      </p>
                      <div className="flex gap-2.5 justify-center flex-wrap pt-1">
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
                  className="w-full py-3.5 px-4 rounded-full border border-fuchsia-400/30 hover:border-fuchsia-400/60 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>👁</span> PREVIEW HOW RECEIVER SEES IT
                </button>
              </div>

              {/* Right Column: 3D Flower Preview */}
              <div className="md:col-span-6 bg-slate-900/40 border border-white/10 rounded-3xl overflow-hidden min-h-[300px] flex flex-col justify-center relative">
                <Flower3DPreview type={flowerType} color={flowerColor} />
              </div>
            </div>

            {/* Retention Notice */}
            <p className="text-center text-xs leading-relaxed text-slate-400 max-w-xl mx-auto pt-2">
              Your private link is available for 48 hours from when your surprise is successfully created. Opening or sharing it does not restart this period. For paid surprises, successful creation follows payment confirmation.
            </p>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between pt-4 relative z-10">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="text-slate-400 hover:text-white font-serif italic text-base transition-colors"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleFinalSubmit}
                className="py-4 px-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(192,38,211,0.5)] transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>{busy ? "Finalizing Magic..." : "Get My Surprise Link ✨"}</span>
                <span className="w-7 h-7 rounded-full bg-black/30 flex items-center justify-center text-xs">↗</span>
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
