"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/config";

/* ─── Types ──────────────────────────────────────────────── */
interface BalloonData {
  id: number; color: string; size: number; x: string;
  cls: string; tilt?: number; depth?: number;
}

/* ─── Balloon data ───────────────────────────────────────── */
const BALLOONS: BalloonData[] = [
  { id: 1,  color: "#165028", size: 110, x: "4%",  cls: "balloon-rise-2",  tilt: -6,  depth: 1.2 },
  { id: 2,  color: "#cca022", size: 90,  x: "12%", cls: "balloon-rise-3",  tilt: -8,  depth: 1.1 },
  { id: 3,  color: "#1d758f", size: 58,  x: "18%", cls: "balloon-rise-8",  tilt: 8,   depth: 0.7 },
  { id: 4,  color: "#6b581c", size: 66,  x: "8%",  cls: "balloon-rise-10", tilt: -4,  depth: 0.75 },
  { id: 5,  color: "#4f2263", size: 76,  x: "22%", cls: "balloon-rise-9",  tilt: 5,   depth: 0.9 },
  { id: 6,  color: "#c0366b", size: 125, x: "78%", cls: "balloon-rise-1",  tilt: 10,  depth: 1.25 },
  { id: 7,  color: "#af4024", size: 75,  x: "70%", cls: "balloon-rise-6",  tilt: -5,  depth: 0.85 },
  { id: 8,  color: "#1a5e2f", size: 52,  x: "88%", cls: "balloon-rise-7",  tilt: 6,   depth: 0.65 },
  { id: 9,  color: "#692982", size: 82,  x: "84%", cls: "balloon-rise-5",  tilt: -9,  depth: 0.95 },
  { id: 10, color: "#7a3782", size: 86,  x: "93%", cls: "balloon-rise-12", tilt: 7,   depth: 1.05 },
];

const SPARKLES = [
  { id: 1, x: "15%", y: "15%", delay: "0s",   size: 4 },
  { id: 2, x: "80%", y: "22%", delay: "0.7s", size: 3 },
  { id: 3, x: "30%", y: "75%", delay: "1.4s", size: 5 },
  { id: 4, x: "68%", y: "55%", delay: "0.4s", size: 3 },
  { id: 5, x: "55%", y: "88%", delay: "1.1s", size: 4 },
  { id: 6, x: "92%", y: "42%", delay: "0.9s", size: 3 },
  { id: 7, x: "8%",  y: "60%", delay: "1.8s", size: 4 },
  { id: 8, x: "45%", y: "5%",  delay: "0.3s", size: 3 },
];

/* ─── Bokeh blobs ─────────────────────────────────────────── */
const BOKEH = [
  { id: 1, w: 320, h: 320, top: "10%",  left: "5%",   color: "rgba(192,32,224,0.18)",  dur: "14s", delay: "0s"   },
  { id: 2, w: 240, h: 240, top: "60%",  left: "80%",  color: "rgba(139,92,246,0.15)",  dur: "18s", delay: "-5s"  },
  { id: 3, w: 180, h: 180, top: "30%",  left: "55%",  color: "rgba(246,196,83,0.12)",  dur: "12s", delay: "-8s"  },
  { id: 4, w: 260, h: 260, top: "75%",  left: "15%",  color: "rgba(224,64,251,0.12)",  dur: "20s", delay: "-3s"  },
  { id: 5, w: 200, h: 200, top: "5%",   left: "70%",  color: "rgba(192,32,224,0.10)",  dur: "16s", delay: "-11s" },
];

/* ─── Wish categories ─────────────────────────────────────── */
const WISH_CATEGORIES = [
  {
    id: "best-friend", icon: "✨", label: "Best Friend", color: "#e040fb",
    tag: "For Your Bestie",
    wishes: [
      { text: "You light up every room and every group chat 🌟",            tone: "Warm" },
      { text: "Here's to a year as amazing as you've been to me 🥂",        tone: "Celebratory" },
      { text: "No distance, no time zone can dull what we have 💫",         tone: "Heartfelt" },
      { text: "May your birthday be as effortlessly cool as you are 🎉",    tone: "Playful" },
      { text: "Thank you for being the friend who shows up — always 🤍",    tone: "Grateful" },
      { text: "You've turned my worst days into our funniest stories 😂",    tone: "Funny" },
      { text: "A whole year of being fabulous — here's to many more ✨",     tone: "Celebratory" },
      { text: "Side by side or miles apart, you're always in my heart 💜",  tone: "Heartfelt" },
    ],
  },
  {
    id: "sister", icon: "💗", label: "Sister", color: "#f472b6",
    tag: "For Your Sister",
    wishes: [
      { text: "My first best friend, my forever person 💕",                        tone: "Heartfelt" },
      { text: "Growing up with you was the greatest adventure 🌸",                 tone: "Nostalgic" },
      { text: "May this year bring you everything your heart desires 🎀",           tone: "Hopeful" },
      { text: "You're not just my sister — you're my home 🏠",                     tone: "Warm" },
      { text: "I stole your clothes and you stole my heart — fair trade 😄",       tone: "Funny" },
      { text: "Watching you grow has been the privilege of my life 🌷",             tone: "Proud" },
      { text: "No one laughs at our inside jokes the way we do 🤣",                tone: "Playful" },
      { text: "You are proof that siblings can be soulmates too 💖",               tone: "Poetic" },
    ],
  },
  {
    id: "boyfriend", icon: "💙", label: "Boyfriend", color: "#60a5fa",
    tag: "For Your Partner",
    wishes: [
      { text: "Every day with you feels like the universe said yes 💙",             tone: "Romantic" },
      { text: "You make ordinary moments feel extraordinary 🌊",                    tone: "Poetic" },
      { text: "Here's to a birthday as wonderful as you make me feel ✨",           tone: "Sweet" },
      { text: "You're my favourite notification, always 📱💙",                      tone: "Playful" },
      { text: "Before you, I didn't know love could feel this easy 🌙",             tone: "Heartfelt" },
      { text: "Happy birthday to the one I choose every single day 💫",             tone: "Romantic" },
      { text: "You deserve the world — starting with the best birthday 🌍",         tone: "Celebratory" },
      { text: "Growing old with you is the adventure I signed up for 🏔️",          tone: "Hopeful" },
    ],
  },
  {
    id: "mom", icon: "🌺", label: "Mom", color: "#f97316",
    tag: "For Your Mom",
    wishes: [
      { text: "Everything I am, I owe to your love and strength 🌺",                tone: "Grateful" },
      { text: "Your hugs are my safe place, always and forever 💛",                 tone: "Warm" },
      { text: "Happy birthday to the woman who makes the world better 🌸",          tone: "Celebratory" },
      { text: "Thank you for believing in me before I believed in myself 🙏",       tone: "Heartfelt" },
      { text: "You taught me to be brave, kind, and never skip dessert 🎂",         tone: "Playful" },
      { text: "A million thank-yous could never match what you've given me 🌼",     tone: "Poetic" },
      { text: "Today the universe celebrates the day it gave us you ☀️",            tone: "Poetic" },
      { text: "You're the reason home always feels like the best place 🏡",         tone: "Nostalgic" },
    ],
  },
  {
    id: "brother", icon: "🤝", label: "Brother", color: "#34d399",
    tag: "For Your Brother",
    wishes: [
      { text: "The original partner in crime — happy birthday! 🎮",                tone: "Playful" },
      { text: "You've always had my back. Now go enjoy your day! 💪",              tone: "Warm" },
      { text: "Growing older together beats growing apart 🌱",                     tone: "Heartfelt" },
      { text: "Legend, role model, annoyance — I love you 😄",                    tone: "Funny" },
      { text: "You were my first rival and my longest friend 🏅",                  tone: "Nostalgic" },
      { text: "No one else can make me laugh and furious in one sentence 😂",      tone: "Funny" },
      { text: "Here's to the guy who turned chaos into our best memories 🔥",      tone: "Celebratory" },
      { text: "I'm proud of the man you've become — genuinely 🙌",                tone: "Proud" },
    ],
  },
  {
    id: "crush", icon: "🧡", label: "Crush", color: "#fb923c",
    tag: "For Your Crush",
    wishes: [
      { text: "Wishing the most beautiful person the most beautiful day 🌅",       tone: "Admiring" },
      { text: "You deserve a day as bright as your smile ☀️",                      tone: "Sweet" },
      { text: "Hope this birthday surprises you the way you surprise me 💫",       tone: "Flirty" },
      { text: "Today's all about you — and you deserve every moment 🎁",           tone: "Genuine" },
      { text: "Just a little something to let you know you're unforgettable 🌸",   tone: "Subtle" },
      { text: "May your day be as lovely as the way you make me feel 🧡",          tone: "Flirty" },
      { text: "Thinking of you today — and if I'm honest, most days 😊",           tone: "Honest" },
      { text: "Here's hoping this year brings you closer to your dreams ✨",        tone: "Hopeful" },
    ],
  },
  {
    id: "boss", icon: "🏆", label: "Boss", color: "#fbbf24",
    tag: "For Your Boss",
    wishes: [
      { text: "Thank you for leading with vision and kindness 🏆",                 tone: "Respectful" },
      { text: "Wishing you rest, joy, and everything you've earned 🥂",            tone: "Celebratory" },
      { text: "The team wouldn't be the same without your guidance 💼",            tone: "Appreciative" },
      { text: "May this birthday mark the start of your best year yet 🚀",         tone: "Motivating" },
      { text: "You push us to be better — today we celebrate you 🌟",             tone: "Grateful" },
      { text: "Great leaders are rare. Thank you for being one of them 🎯",        tone: "Formal" },
      { text: "Your belief in the team inspires us every single day 💡",           tone: "Sincere" },
      { text: "Wishing you a day off that's actually a day off 😄",                tone: "Funny" },
    ],
  },
  {
    id: "girlfriend", icon: "💖", label: "Girlfriend", color: "#f43f5e",
    tag: "For Your Partner",
    wishes: [
      { text: "You are the reason I smile for no reason at all 💖",                tone: "Romantic" },
      { text: "Every moment with you is a memory I treasure 📸",                   tone: "Sentimental" },
      { text: "The world is better, softer, warmer — because of you 🌹",           tone: "Poetic" },
      { text: "Happy birthday to the one who makes my heart skip 💓",              tone: "Sweet" },
      { text: "You are my home, my calm, and my greatest adventure 🌍",            tone: "Heartfelt" },
      { text: "Falling in love with you was the best decision I never planned 💫", tone: "Romantic" },
      { text: "You make every ordinary Tuesday feel like a holiday ☀️",            tone: "Playful" },
      { text: "Here's to the woman who rewrote my whole world 🥂",                 tone: "Celebratory" },
    ],
  },
  {
    id: "dad", icon: "🦁", label: "Dad", color: "#a78bfa",
    tag: "For Your Dad",
    wishes: [
      { text: "You showed me what strength looks like — quiet and steady 🦁",      tone: "Proud" },
      { text: "Happy birthday to my first hero and forever role model 🌟",         tone: "Heartfelt" },
      { text: "Every lesson you taught me I carry with me every day 🎓",           tone: "Grateful" },
      { text: "You never had all the answers — but you always had time for me 🕰️", tone: "Nostalgic" },
      { text: "The older I get, the more I see you in me — and I'm glad 🌱",       tone: "Reflective" },
      { text: "Thank you for being the calm in every storm 🌊",                    tone: "Warm" },
      { text: "Dad jokes aside, you're genuinely the best 😄",                     tone: "Funny" },
      { text: "Wishing you a birthday as great as the advice you've given 🚀",     tone: "Celebratory" },
    ],
  },
];

/* ─── Testimonials ───────────────────────────────────────── */
const TESTIMONIALS = [
  { id: 1,  stars: 5, quote: "She actually cried! Best gift I have ever sent and I spent 4 minutes on it. Absolute magic.", name: "Ariana K.",   tag: "Birthday Surprise",  heart: "❤️" },
  { id: 2,  stars: 5, quote: "Very nice — he kept replaying the candle scene over and over!", name: "A Kind Soul", tag: "Magical Surprise",  heart: null },
  { id: 3,  stars: 5, quote: "Thank you 😊 My mum sobbed (happy tears) when the wish wheel spun.", name: "A Kind Soul", tag: "Magical Surprise",  heart: "🧡" },
  { id: 4,  stars: 5, quote: "Surprise bagundi! Loved how easy it was to share — just one link.", name: "Vikram S.",  tag: "Birthday Surprise",  heart: null },
  { id: 5,  stars: 5, quote: "I love it — so much better than a plain WhatsApp message.", name: "A Kind Soul", tag: "Magical Surprise",  heart: "🎁" },
  { id: 6,  stars: 3, quote: "I feel like the thank-you page should be separate from the pass-in magic one… it ruined the secret message a little.", name: "A Kind Soul", tag: "Magical Surprise",  heart: null },
  { id: 7,  stars: 5, quote: "My best friend called me crying mid-balloon-pop. That says everything.", name: "Jasmine O.", tag: "Anniversary Surprise", heart: "💜" },
  { id: 8,  stars: 5, quote: "Took 3 minutes to build, gave her a moment she'll talk about all year.", name: "Chris T.",  tag: "Birthday Surprise",  heart: null },
  { id: 9,  stars: 5, quote: "The 3D cake blowing was SO COOL on her phone. Zero apps needed.", name: "Priya M.",  tag: "Birthday Surprise",  heart: "✨" },
  { id: 10, stars: 5, quote: "Absolutely blown away — and so was she! Sending one for every occasion.", name: "Leo R.",   tag: "Magical Surprise",  heart: null },
  { id: 11, stars: 5, quote: "My girlfriend literally screamed when the confetti exploded. 10/10.", name: "Danny W.",  tag: "Anniversary Surprise", heart: "🎉" },
  { id: 12, stars: 4, quote: "Really lovely experience. Would love even more wish options on the wheel.", name: "Sunita B.", tag: "Birthday Surprise",  heart: null },
];

/* ─── Process steps ──────────────────────────────────────── */
const STEPS = [
  { n: "01", icon: "✦",  emoji: "🎨", title: "Personalise",     color: "#e040fb",
    body: "Pour your heart into words, add a photo, record a voice note, and choose a cake theme that speaks to their soul." },
  { n: "02", icon: "➤",  emoji: "🔗", title: "Share the Link",  color: "#f6c453",
    body: "Get a private magical link instantly. Works on every device, everywhere, with full privacy protection." },
  { n: "03", icon: "🎁", emoji: "🌟", title: "Watch the Magic", color: "#8fe3c9",
    body: "Your recipient enters a 3D world created just for them. Unforgettable, emotional, and pure joy." },
];

/* ─── Stats ──────────────────────────────────────────────── */
const STATS = [
  { value: "50K+", label: "Surprises Sent" },
  { value: "120+", label: "Happy Reviews" },
  { value: "4.9★", label: "Average Rating" },
  { value: "3 min", label: "To Build One" },
];

/* ─── Impact message ─────────────────────────────────────── */
function getImpact(name: string): string {
  return `${name}, a surprise like this is a reminder that they are seen, loved and truly special. You're about to make their world a little brighter today. 🎉`;
}

/* ─── SVG Balloon ─────────────────────────────────────────── */
function Balloon({ color, size, tilt = 0, depth = 1 }: { color: string; size: number; tilt?: number; depth?: number }) {
  const w = size * 0.9;
  const h = size * 2.3;
  const gradId = `hbg-${color.replace(/[^a-zA-Z0-9]/g, "")}-${size}-${Math.round(depth * 10)}`;
  return (
    <svg width={w} height={h} viewBox="0 0 100 240" className="overflow-visible pointer-events-none"
      style={{ transform: `rotate(${tilt}deg)`, opacity: depth < 0.7 ? 0.55 : depth < 1 ? 0.8 : 0.96,
        filter: depth > 1 ? "drop-shadow(0 15px 25px rgba(0,0,0,0.65))" : "drop-shadow(0 8px 15px rgba(0,0,0,0.45))" }} aria-hidden>
      <defs>
        <radialGradient id={gradId} cx="68%" cy="25%" r="72%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="12%"  stopColor={color}   stopOpacity="1" />
          <stop offset="65%"  stopColor={color}   stopOpacity="0.9" />
          <stop offset="100%" stopColor="#08020e" stopOpacity="0.95" />
        </radialGradient>
      </defs>
      <path d="M 50,96 Q 48,145 52,190 T 49,235" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      <polygon points="46,92 54,92 50,97" fill={color} opacity="0.95" />
      <ellipse cx="50" cy="50" rx="38" ry="44" fill={`url(#${gradId})`} />
      <circle cx="68" cy="24" r="3.8" fill="#fffbe8" opacity="0.75" />
      <circle cx="68" cy="24" r="1.6" fill="#ffffff" opacity="0.95" />
    </svg>
  );
}

/* ─── Star row ───────────────────────────────────────────── */
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? "#f6c453" : "rgba(255,255,255,0.2)", fontSize: 13 }}>★</span>
      ))}
    </div>
  );
}

/* ─── Scroll reveal hook ─────────────────────────────────── */
function useReveal(ref: React.RefObject<Element>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

/* ─── RevealSection wrapper ──────────────────────────────── */
function RevealSection({ children, className = "", delay = "" }: { children: React.ReactNode; className?: string; delay?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref as React.RefObject<Element>);
  return <div ref={ref} className={`reveal ${delay} ${className}`}>{children}</div>;
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const [activeTab, setActiveTab]         = useState<"birthday" | "anniversary">("birthday");
  const [name, setName]                   = useState("");
  const [showImpact, setShowImpact]       = useState(false);
  const [inputFocused, setInputFocused]   = useState(false);
  const [mounted, setMounted]             = useState(false);
  const [wishCategory, setWishCategory]   = useState("best-friend");
  const [copiedWish, setCopiedWish]       = useState<string | null>(null);
  const [navOpen, setNavOpen]             = useState(false);
  const [wishesOpen, setWishesOpen]       = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleNameSubmit = () => { if (name.trim().length > 0) setShowImpact(true); };
  const handleKeyDown    = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleNameSubmit(); };

  const trimmedName = name.trim();
  const hasName     = trimmedName.length > 0;

  const activeCategory = WISH_CATEGORIES.find(c => c.id === wishCategory) ?? WISH_CATEGORIES[0];

  function copyWish(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedWish(text);
    setTimeout(() => setCopiedWish(null), 1800);
  }

  /* ── Double testimonials for seamless scroll ── */
  const DOUBLED_TESTI = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#0f0720" }}>

      {/* ── Bokeh background blobs ── */}
      {mounted && BOKEH.map(b => (
        <div key={b.id} aria-hidden className="bokeh-blob"
          style={{ width: b.w, height: b.h, top: b.top, left: b.left,
            background: b.color, animationDuration: b.dur, animationDelay: b.delay }} />
      ))}

      {/* ── Radial glow ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.22) 0%, transparent 65%)" }} />

      {/* ── Sparkles ── */}
      {mounted && SPARKLES.map(s => (
        <div key={s.id} aria-hidden className="sparkle pointer-events-none absolute"
          style={{ left: s.x, top: s.y, animationDelay: s.delay }}>
          <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 10 10">
            <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill="#f6c453" />
          </svg>
        </div>
      ))}

      {/* ── Floating Balloons ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {mounted && BALLOONS.map(b => (
          <div key={b.id} aria-hidden className={`pointer-events-none absolute ${b.cls}`} style={{ left: b.x, bottom: "-140px" }}>
            <Balloon color={b.color} size={b.size} tilt={b.tilt} depth={b.depth} />
          </div>
        ))}
      </div>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <header className="relative z-50 w-full">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8"
          style={{
            background: "rgba(15,7,32,0.75)",
            backdropFilter: "blur(18px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label={BRAND.name}>
            <span className="text-2xl select-none">🎁</span>
            <span className="font-display text-2xl font-bold select-none"
              style={{ background: "linear-gradient(135deg, #c020e0 0%, #f6c453 60%, #e040fb 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">

            {/* Popular Wishes dropdown */}
            <div className="nav-item relative">
              <button
                id="nav-wishes-btn"
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/6 transition-colors"
                aria-haspopup="true"
                aria-expanded={wishesOpen}
              >
                <span>✦</span>
                <span>Popular Wishes</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="nav-dropdown absolute left-0 top-full pt-2 z-50" style={{ minWidth: 260 }}>
                <div className="glass-card rounded-2xl py-2 shadow-2xl" style={{ background: "rgba(15,7,32,0.97)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <div className="px-4 pb-2 pt-2 flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/30">Popular Surprises</span>
                  </div>
                  {WISH_CATEGORIES.map(cat => (
                    <a key={cat.id} href="#wish-section"
                      onClick={() => setWishCategory(cat.id)}
                      className="flex items-center gap-3 px-3 py-2 mx-1 rounded-xl transition-all duration-150 group"
                      style={{ background: wishCategory === cat.id ? `${cat.color}18` : "transparent" }}>
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-base"
                        style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}>
                        {cat.icon}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-white/85 group-hover:text-white transition-colors leading-tight">
                          Wishes for {cat.label}
                        </span>
                        <span className="text-[10px] text-white/35">{cat.wishes.length} suggestions</span>
                      </div>
                      {wishCategory === cat.id && (
                        <span className="ml-auto text-xs" style={{ color: cat.color }}>✓</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a href="#features"    className="rounded-lg px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors">Features</a>
            <a href="#how-it-works" className="rounded-lg px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors">How it works</a>
            <a href="#testimonials" className="rounded-lg px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors">Reviews</a>
            <a href="#faq"          className="rounded-lg px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors">FAQ</a>
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link href="/create" id="nav-cta"
              className="btn-glow rounded-full px-5 py-2.5 text-sm font-bold text-white hidden sm:inline-flex items-center gap-2">
              🎁 Make a Surprise
            </Link>
            {/* Mobile hamburger */}
            <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setNavOpen(o => !o)} aria-label="Toggle menu">
              <span className={`block h-0.5 w-5 bg-white/80 transition-all ${navOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white/80 transition-all ${navOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-white/80 transition-all ${navOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {navOpen && (
          <div className="md:hidden absolute inset-x-0 top-full z-40 glass-card mx-4 rounded-2xl p-4 shadow-2xl"
            style={{ background: "rgba(15,7,32,0.96)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex flex-col gap-1">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Popular Wishes</div>
              {WISH_CATEGORIES.map(cat => (
                <a key={cat.id} href="#wish-section" onClick={() => { setWishCategory(cat.id); setNavOpen(false); }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors"
                  style={{ background: wishCategory === cat.id ? `${cat.color}18` : "transparent" }}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg text-base flex-shrink-0"
                    style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}>
                    {cat.icon}
                  </span>
                  <span className="text-white/75">Wishes for {cat.label}</span>
                  {wishCategory === cat.id && <span className="ml-auto text-xs" style={{ color: cat.color }}>✓</span>}
                </a>
              ))}
              <div className="my-2 border-t border-white/8" />
              {["#features", "#how-it-works", "#testimonials", "#faq"].map((href, i) => (
                <a key={href} href={href} onClick={() => setNavOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5">
                  {["Features", "How it works", "Reviews", "FAQ"][i]}
                </a>
              ))}
              <Link href="/create" className="btn-glow mt-2 rounded-xl py-3 text-center text-sm font-bold text-white">
                🎁 Make a Surprise
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════ HERO ═══════════════ */}
      <main className="relative z-10 flex flex-col items-center px-4 pb-20 pt-6 md:pt-10">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 slide-up"
          style={{ borderColor: "rgba(192,32,224,0.4)", background: "rgba(192,32,224,0.1)" }}>
          <span className="text-xs">✨</span>
          <span className="text-xs font-bold tracking-widest text-white/80 uppercase">
            The Internet&rsquo;s Favourite 3D Birthday Surprise Creator
          </span>
        </div>

        {/* Glass hero card */}
        <div className="glass-card w-full max-w-lg rounded-3xl px-4 sm:px-8 pb-6 sm:pb-8 pt-6 sm:pt-7 slide-up" style={{ maxWidth: 520 }}>
          <div className="mb-5 flex flex-col items-center">
            <div className="mb-2 text-5xl">🎁</div>
            <h1 className="font-display text-4xl md:text-5xl"
              style={{ background: "linear-gradient(135deg, #c020e0 0%, #f6c453 50%, #e040fb 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {BRAND.name}
            </h1>
          </div>

          <p className="mb-2 text-center text-xl font-bold leading-snug text-white md:text-2xl">
            Send an{" "}
            <em className="not-italic" style={{ fontFamily: '"Dancing Script", cursive',
              background: "linear-gradient(90deg, #c020e0, #f6c453)", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text", fontSize: "1.15em" }}>
              Interactive Birthday Surprise Link
            </em>{" "}
            &amp; Make Magic
          </p>
          <p className="mb-5 text-center text-sm text-white/60">
            <em>Create a stunning, interactive 3D birthday surprise for someone you love.</em>
          </p>

          {/* Social proof */}
          <div className="mb-5 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-yellow-400">★★★★★</span>
              <span className="text-xs text-white/60">4.9/5 (120+ Ratings)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-green-400">🔒</span>
              <span className="text-xs text-white/60">Private &amp; Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-purple-400">👥</span>
              <span className="text-xs text-white/60">50K+ Surprises Sent</span>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="mb-5 flex rounded-xl p-1" style={{ background: "rgba(255,255,255,0.06)" }}
            role="tablist" aria-label="Surprise type">
            {(["birthday", "anniversary"] as const).map(tab => (
              <button key={tab} id={`tab-${tab}`} role="tab"
                aria-selected={activeTab === tab} aria-controls={`panel-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
                  activeTab === tab ? "btn-glow text-white" : "text-white/50 hover:text-white/80"}`}>
                {tab === "birthday" ? "🎂 Birthday" : "💍 Anniversary"}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
            {!showImpact ? (
              <div className="slide-up rounded-2xl p-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="rounded-xl px-4 py-1" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <input ref={inputRef} id="recipient-name" type="text"
                    placeholder="Enter your name..." value={name} maxLength={40}
                    onChange={e => { setName(e.target.value); setShowImpact(false); }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}
                    aria-label={`${activeTab === "birthday" ? "Birthday" : "Anniversary"} person's name`}
                    className="input-glow w-full bg-transparent py-3 text-center text-white placeholder:text-white/30 focus:outline-none text-lg font-semibold" />
                </div>
                <p className="mt-1 pb-1 text-center text-xs text-white/30">
                  ⚡ Type your name to see your surprise&rsquo;s impact
                </p>
                {hasName && (
                  <button id="btn-get-it" onClick={handleNameSubmit}
                    className="btn-glow mt-3 w-full rounded-xl py-3 font-bold text-white text-sm">
                    Got it! Let&rsquo;s build it →
                  </button>
                )}
              </div>
            ) : (
              <div className="slide-up">
                <div className="mb-3 rounded-2xl px-5 py-3 text-center"
                  style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-base font-bold text-white">{trimmedName}</p>
                </div>
                <div className="rounded-2xl p-4"
                  style={{ background: "rgba(192,32,224,0.08)", border: "1px solid rgba(192,32,224,0.25)" }}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider impact-text">Your Impact</p>
                  <p className="text-sm leading-relaxed text-white/80 italic">{getImpact(trimmedName)}</p>
                </div>
                <Link href={`/create?sender=${encodeURIComponent(trimmedName)}&name=${encodeURIComponent(trimmedName)}&occasion=${activeTab}&type=${activeTab}`}
                  id="btn-build-it"
                  className="btn-glow mt-4 flex w-full items-center justify-between rounded-xl px-5 py-3.5 font-bold text-white">
                  <span>Got it! Let&rsquo;s build it</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>→</span>
                </Link>
                <button onClick={() => { setName(""); setShowImpact(false); }}
                  className="mt-2 w-full text-center text-xs text-white/40 hover:text-white/60 transition-colors">
                  ← Change name
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats bar ── */}
        <RevealSection className="mt-14 w-full max-w-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="glass-card rounded-2xl p-5 text-center">
                <div className="text-2xl font-black text-white" style={{ fontFamily: "Nunito Sans, sans-serif" }}>
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-white/50 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* ═══════════════ FEATURES — What they see ═══════════════ */}
        <section id="features" className="mt-28 w-full max-w-5xl" aria-labelledby="features-heading">
          <RevealSection>
            <h2 id="features-heading" className="mb-2 text-center font-display text-3xl text-white md:text-4xl">
              What they see when they open it
            </h2>
            <p className="mb-12 text-center text-white/50 text-sm">
              A magical chain of moments, designed to make them feel truly special.
            </p>
          </RevealSection>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { n: 1, emoji: "🎁", title: "A gift to open",  body: "The link starts with a wrapped gift and their name on the tag." },
              { n: 2, emoji: "🎈", title: "Balloons to pop", body: "Real 3D balloons float up. Every tap pops one with confetti." },
              { n: 3, emoji: "🎂", title: "Candles to blow", body: "They blow at the phone's microphone, or tap if they prefer." },
              { n: 4, emoji: "🎡", title: "A wish wheel",    body: "One spin lands on one of the wishes you wrote just for them." },
              { n: 5, emoji: "💌", title: "Your words",      body: "Your message types itself out with your photo and voice note." },
            ].map((s, idx) => (
              <RevealSection key={s.n} delay={`reveal-delay-${idx + 1}`}>
                <li className="glass-card step-card rounded-2xl p-5 h-full">
                  <div className="mb-3 text-3xl">{s.emoji}</div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#c020e0" }}>Step {s.n}</span>
                  <h3 className="mt-1 font-bold text-white">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">{s.body}</p>
                </li>
              </RevealSection>
            ))}
          </ol>
        </section>

        {/* ═══════════════ HOW THE MAGIC HAPPENS ═══════════════ */}
        <section id="how-it-works" className="mt-28 w-full max-w-5xl" aria-labelledby="how-magic-heading">
          <RevealSection>
            <h2 id="how-magic-heading" className="mb-2 text-center text-3xl font-bold text-white md:text-4xl">
              How the{" "}
              <em className="not-italic font-hand" style={{ color: "#f6c453", fontFamily: '"Dancing Script", cursive' }}>
                magic
              </em>{" "}
              happens
            </h2>
            <p className="mb-14 text-center text-white/50 text-sm">
              Three simple steps to create a moment they&rsquo;ll never forget.
            </p>
          </RevealSection>

          {/* Step cards with connectors */}
          <div className="relative flex flex-col md:flex-row gap-6 items-stretch">

            {/* Connector line — desktop only */}
            <div aria-hidden className="hidden md:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 pointer-events-none z-0"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(192,32,224,0.3) 20%, rgba(246,196,83,0.3) 50%, rgba(142,227,201,0.3) 80%, transparent 100%)" }} />

            {STEPS.map((step, idx) => (
              <RevealSection key={step.n} delay={`reveal-delay-${idx + 1}`} className="flex-1">
                <div className="step-card glass-card relative z-10 rounded-2xl p-7 flex flex-col items-center text-center h-full">
                  {/* Step badge */}
                  <span className="mb-5 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-widest"
                    style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.05)" }}>
                    STEP {step.n}
                  </span>

                  {/* Animated icon circle */}
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl glow-pulse"
                    style={{ background: `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.15), rgba(255,255,255,0.03))`,
                      border: `1px solid ${step.color}44`, boxShadow: `0 0 24px ${step.color}33` }}>
                    <span className="text-2xl">{step.emoji}</span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{step.body}</p>

                  {/* Colored accent bar */}
                  <div className="mt-5 h-1 w-12 rounded-full mx-auto" style={{ background: step.color }} />
                </div>
              </RevealSection>
            ))}
          </div>

          {/* CTA below steps */}
          <RevealSection className="mt-10 text-center">
            <Link href="/create" id="start-making-cta"
              className="btn-glow inline-flex items-center gap-2 rounded-full px-10 py-4 text-base font-bold text-white">
              🎁 Start making one — it&rsquo;s free
            </Link>
          </RevealSection>
        </section>

        {/* ═══════════════ POPULAR WISHES ═══════════════ */}
        <section id="wish-section" className="mt-28 w-full max-w-5xl" aria-labelledby="wish-heading">
          <RevealSection>
            <h2 id="wish-heading" className="mb-2 text-center text-3xl font-bold text-white md:text-4xl">
              ✦ Popular Wishes{" "}
              <em className="not-italic" style={{ fontFamily: '"Dancing Script", cursive', color: "#f6c453" }}>by Occasion</em>
            </h2>
            <p className="mb-10 text-center text-white/50 text-sm">
              Pick a relationship, copy a wish, and paste it straight into your surprise.
            </p>
          </RevealSection>

          {/* Category pills */}
          <RevealSection>
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {WISH_CATEGORIES.map(cat => (
                <button key={cat.id} id={`wish-cat-${cat.id}`}
                  onClick={() => setWishCategory(cat.id)}
                  className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200"
                  style={{
                    borderColor: wishCategory === cat.id ? cat.color : "rgba(255,255,255,0.12)",
                    background: wishCategory === cat.id ? `${cat.color}22` : "rgba(255,255,255,0.04)",
                    color: wishCategory === cat.id ? cat.color : "rgba(255,255,255,0.6)",
                    boxShadow: wishCategory === cat.id ? `0 0 16px ${cat.color}44` : "none",
                  }}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </RevealSection>

          {/* Wish cards grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activeCategory.wishes.map((wish, i) => (
              <RevealSection key={i} delay={`reveal-delay-${(i % 5) + 1}`}>
                <div
                  className="wish-card glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 h-full"
                  style={{
                    border: `1px solid ${activeCategory.color}22`,
                    background: "rgba(15,7,32,0.7)",
                    minHeight: 148,
                  }}
                >
                  {/* Tone badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: `${activeCategory.color}1a`,
                        color: activeCategory.color,
                        border: `1px solid ${activeCategory.color}33`,
                      }}
                    >
                      {wish.tone}
                    </span>
                    <span className="text-base opacity-60">{activeCategory.icon}</span>
                  </div>

                  {/* Wish text */}
                  <p className="flex-1 text-sm leading-relaxed text-white/88 italic">
                    &ldquo;{wish.text}&rdquo;
                  </p>

                  {/* Footer actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyWish(wish.text)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all duration-200"
                      style={{
                        background: copiedWish === wish.text ? `${activeCategory.color}33` : "rgba(255,255,255,0.06)",
                        color: copiedWish === wish.text ? activeCategory.color : "rgba(255,255,255,0.55)",
                        border: `1px solid ${copiedWish === wish.text ? activeCategory.color + "55" : "rgba(255,255,255,0.1)"}`,
                        boxShadow: copiedWish === wish.text ? `0 0 12px ${activeCategory.color}33` : "none",
                      }}
                    >
                      {copiedWish === wish.text ? (
                        <><span>✓</span><span>Copied!</span></>
                      ) : (
                        <><span>📋</span><span>Copy wish</span></>
                      )}
                    </button>
                    <Link
                      href={`/create?wish=${encodeURIComponent(wish.text)}`}
                      className="flex items-center justify-center rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200"
                      style={{
                        background: `${activeCategory.color}22`,
                        color: activeCategory.color,
                        border: `1px solid ${activeCategory.color}44`,
                      }}
                    >
                      Use →
                    </Link>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>

          <RevealSection className="mt-8 text-center">
            <Link href="/create"
              className="btn-glow inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white">
              Use this wish in a surprise →
            </Link>
          </RevealSection>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section id="testimonials" className="mt-28 w-full" aria-labelledby="testi-heading">
          <RevealSection>
            <h2 id="testi-heading" className="mb-2 text-center text-3xl font-bold text-white md:text-4xl">
              Moments of{" "}
              <em className="not-italic font-hand" style={{ color: "#f6c453", fontFamily: '"Dancing Script", cursive' }}>
                Joy
              </em>
            </h2>
            <p className="mb-12 text-center text-white/50 text-sm">
              Join thousands who made their loved ones smile with {BRAND.name}.
            </p>
          </RevealSection>

          {/* Auto-scrolling testimonial track */}
          <div className="overflow-hidden w-full" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
            <div className="scroll-track py-4">
              {DOUBLED_TESTI.map((t, i) => (
                <div key={`${t.id}-${i}`} className="testi-card glass-card rounded-2xl p-5 flex-shrink-0 relative"
                  style={{ width: 290, background: "rgba(20,10,40,0.85)", border: "1px solid rgba(255,255,255,0.09)" }}>
                  {t.heart && (
                    <span className="absolute top-4 right-4 text-base">{t.heart}</span>
                  )}
                  <Stars n={t.stars} />
                  <p className="mt-3 text-sm leading-relaxed text-white/85 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #c020e0, #8b5cf6)" }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <span className="inline-block rounded-full border px-2 py-0.5 text-[10px] text-white/40"
                        style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                        {t.tag}
                      </span>
                    </div>
                    <span className="ml-auto text-[10px] font-bold text-white/25 uppercase tracking-wider">Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Static grid of highlighted testimonials */}
          <RevealSection className="mt-8 w-full max-w-5xl mx-auto">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.slice(0, 6).map((t, idx) => (
                <RevealSection key={t.id} delay={`reveal-delay-${(idx % 5) + 1}`}>
                  <div className="testi-card glass-card rounded-2xl p-5 relative h-full flex flex-col justify-between"
                    style={{ background: "rgba(20,10,40,0.8)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    {t.heart && <span className="absolute top-4 right-4 text-base">{t.heart}</span>}
                    <div>
                      <Stars n={t.stars} />
                      <p className="mt-3 text-sm leading-relaxed text-white/85 italic">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #c020e0, #8b5cf6)" }}>
                        {t.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{t.name}</p>
                        <span className="inline-block rounded-full border px-2 py-0.5 text-[10px] text-white/40"
                          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
                          {t.tag}
                        </span>
                      </div>
                      <span className="ml-auto flex-shrink-0 text-[10px] font-bold text-white/25 uppercase tracking-wider">Verified</span>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </RevealSection>

          <RevealSection className="mt-8 text-center">
            <button className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold text-white/70 hover:text-white transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)" }}>
              View all 120+ magical moments →
            </button>
          </RevealSection>
        </section>

        {/* ═══════════════ FAQ ═══════════════ */}
        <section id="faq" className="mt-28 w-full max-w-2xl" aria-labelledby="faq-heading">
          <RevealSection>
            <h2 id="faq-heading" className="mb-8 text-center font-display text-3xl text-white md:text-4xl">Questions</h2>
          </RevealSection>
          <div className="space-y-3">
            {[
              { q: "Does the birthday person need an app or account?",
                a: "No. The link opens in their normal browser, including inside WhatsApp and Messenger." },
              { q: "How long does the link work?",
                a: `For ${BRAND.linkLifetimeHours} hours after you create it. After that the message, photo and voice note are deleted.` },
              { q: "Who can see my surprise?",
                a: "Only people you send the link to. Each link is a long random code, and search engines are told not to index it." },
              { q: "What if their phone blocks the microphone?",
                a: "The candles can be blown out with a tap instead. Nothing gets stuck." },
              { q: "Is it really free?",
                a: "Yes — creating and sharing a surprise is completely free. No credit card needed." },
            ].map((f, i) => (
              <RevealSection key={i} delay={`reveal-delay-${(i % 5) + 1}`}>
                <details className="glass-card group rounded-2xl px-6 py-4">
                  <summary className="cursor-pointer list-none text-base font-bold text-white">
                    <span className="mr-3 inline-block transition-transform duration-200 group-open:rotate-45" style={{ color: "#c020e0" }}>+</span>
                    {f.q}
                  </summary>
                  <p className="mt-3 pl-6 text-sm leading-relaxed text-white/65">{f.a}</p>
                </details>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* ═══════════════ FINAL CTA ═══════════════ */}
        <section className="mt-24 w-full max-w-2xl text-center">
          <RevealSection className="w-full">
            <div className="w-full rounded-3xl p-8 sm:p-10 md:p-12"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(192,32,224,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 80%), rgba(255,255,255,0.04)",
                border: "1px solid rgba(192,32,224,0.25)" }}>
              <div className="mb-4 text-5xl">🎂</div>
              <h2 className="mb-3 font-display text-3xl text-white md:text-4xl text-balance">
                Ready to make someone&rsquo;s day?
              </h2>
              <p className="mb-7 text-white/60 text-base md:text-lg">
                Build a 3D birthday surprise in 3 minutes. No app needed.
              </p>
              <Link href="/create" id="final-cta"
                className="btn-glow inline-flex items-center gap-2 rounded-full px-10 py-4 text-lg font-bold text-white">
                🎁 Create a Surprise Link
              </Link>
            </div>
          </RevealSection>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t px-6 pt-10 pb-8 text-center text-sm text-white/40"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}>

        {/* Nav links */}
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 mb-6">
          {["Features", "How it works", "Reviews", "FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="hover:text-white/70 transition-colors">{item}</a>
          ))}
        </div>

        {/* Developer credit */}
        <div className="mb-3 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-white/25 text-xs uppercase tracking-widest">Crafted with</span>
          <span className="animate-pulse text-base">❤️</span>
          <span className="text-white/25 text-xs uppercase tracking-widest">by</span>
          <span
            className="font-bold"
            style={{
              fontFamily: '"Dancing Script", cursive',
              background: "linear-gradient(135deg, #c020e0 0%, #f6c453 50%, #e040fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 8px rgba(192,32,224,0.5))",
              fontSize: "1.25rem",
            }}
          >
            Shamim
          </span>
          <span className="text-base">✨</span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} {BRAND.name} · Private &amp; secure · All rights reserved
        </p>
      </footer>
    </div>
  );
}
