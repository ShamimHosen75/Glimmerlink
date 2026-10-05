"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/config";

/* ─── Balloon data ──────────────────────────────────────────────────── */
/* ─── Balloon data (Matched to 3D Atmospheric Screenshot) ─────────── */
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
  // left side
  { id: 1, color: "#165028", size: 110, x: "4%",  cls: "balloon-rise-2", tilt: -6, depth: 1.2 },
  { id: 2, color: "#cca022", size: 90,  x: "12%", cls: "balloon-rise-3", tilt: -8, depth: 1.1 },
  { id: 3, color: "#1d758f", size: 58,  x: "18%", cls: "balloon-rise-8", tilt: 8,  depth: 0.7 },
  { id: 4, color: "#6b581c", size: 66,  x: "8%",  cls: "balloon-rise-10", tilt: -4, depth: 0.75 },
  { id: 5, color: "#4f2263", size: 76,  x: "22%", cls: "balloon-rise-9", tilt: 5,  depth: 0.9 },
  // right side
  { id: 6,  color: "#c0366b", size: 125, x: "78%", cls: "balloon-rise-1", tilt: 10, depth: 1.25 },
  { id: 7,  color: "#af4024", size: 75,  x: "70%", cls: "balloon-rise-6", tilt: -5, depth: 0.85 },
  { id: 8,  color: "#1a5e2f", size: 52,  x: "88%", cls: "balloon-rise-7", tilt: 6,  depth: 0.65 },
  { id: 9,  color: "#692982", size: 82,  x: "84%", cls: "balloon-rise-5", tilt: -9, depth: 0.95 },
  { id: 10, color: "#7a3782", size: 86,  x: "93%", cls: "balloon-rise-12", tilt: 7, depth: 1.05 },
];

/* ─── Sparkle positions ─────────────────────────────────────────────── */
const SPARKLES = [
  { id: 1, x: "15%",  y: "15%",  delay: "0s",    size: 4 },
  { id: 2, x: "80%",  y: "22%",  delay: "0.7s",  size: 3 },
  { id: 3, x: "30%",  y: "75%",  delay: "1.4s",  size: 5 },
  { id: 4, x: "68%",  y: "55%",  delay: "0.4s",  size: 3 },
  { id: 5, x: "55%",  y: "88%",  delay: "1.1s",  size: 4 },
  { id: 6, x: "92%",  y: "42%",  delay: "0.9s",  size: 3 },
  { id: 7, x: "8%",   y: "60%",  delay: "1.8s",  size: 4 },
  { id: 8, x: "45%",  y: "5%",   delay: "0.3s",  size: 3 },
];

/* ─── Impact messages per name ──────────────────────────────────────── */
function getImpact(name: string): string {
  return `${name}, a surprise like this is a reminder that they are seen, loved and truly special. You're about to make their world a little brighter today. 🎉`;
}

/* ─── SVG Balloon component ─────────────────────────────────────────── */
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
  const gradId = `home-bg-${color.replace(/[^a-zA-Z0-9]/g, "")}-${size}-${Math.round(depth * 10)}`;
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

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function Home() {
  const [activeTab, setActiveTab] = useState<"birthday" | "anniversary">("birthday");
  const [name, setName] = useState("");
  const [showImpact, setShowImpact] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleNameSubmit = () => {
    if (name.trim().length > 0) setShowImpact(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNameSubmit();
  };

  const trimmedName = name.trim();
  const hasName = trimmedName.length > 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#0f0720" }}>

      {/* ── Radial glow backdrop ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,92,246,0.22) 0%, transparent 65%)",
        }}
      />

      {/* ── Sparkles ── */}
      {mounted && SPARKLES.map((s) => (
        <div
          key={s.id}
          aria-hidden
          className="sparkle pointer-events-none absolute"
          style={{ left: s.x, top: s.y, animationDelay: s.delay }}
        >
          <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 10 10">
            <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill="#f6c453" />
          </svg>
        </div>
      ))}

      {/* ── Live Floating Balloons (Down to Up) ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {mounted && BALLOONS.map((b) => (
          <div
            key={b.id}
            aria-hidden
            className={`pointer-events-none absolute ${b.cls}`}
            style={{ left: b.x, bottom: "-140px" }}
          >
            <Balloon color={b.color} size={b.size} tilt={b.tilt} depth={b.depth} />
          </div>
        ))}
      </div>

      {/* ─────────────────────────── NAV ────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label={BRAND.name}>
          <span className="text-2xl">🎁</span>
          <span
            className="font-display text-2xl"
            style={{
              background: "linear-gradient(135deg, #c020e0 0%, #f6c453 60%, #e040fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {BRAND.name}
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-white/70 hover:text-white transition-colors">
            How it works
          </a>
          <a href="#faq" className="text-sm text-white/70 hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* CTA */}
        <Link
          href="/create"
          id="nav-cta"
          className="btn-glow rounded-full px-5 py-2.5 text-sm font-bold text-white"
        >
          Make a surprise
        </Link>
      </header>

      {/* ─────────────────────────── HERO ───────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center px-4 pb-20 pt-4 md:pt-8">

        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
          style={{
            borderColor: "rgba(192,32,224,0.4)",
            background: "rgba(192,32,224,0.1)",
          }}
        >
          <span className="text-xs">✨</span>
          <span className="text-xs font-bold tracking-widest text-white/80 uppercase">
            The Internet&#39;s Favorite 3D Birthday Surprise Creator
          </span>
        </div>

        {/* Glass card */}
        <div
          className="glass-card w-full max-w-lg rounded-3xl px-4 sm:px-8 pb-6 sm:pb-8 pt-6 sm:pt-7"
          style={{ maxWidth: 520 }}
        >
          {/* Logo inside card */}
          <div className="mb-5 flex flex-col items-center">
            <div className="mb-2 text-5xl">🎁</div>
            <h1
              className="font-display text-4xl md:text-5xl"
              style={{
                background: "linear-gradient(135deg, #c020e0 0%, #f6c453 50%, #e040fb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {BRAND.name}
            </h1>
          </div>

          {/* Headline */}
          <p className="mb-2 text-center text-xl font-bold leading-snug text-white md:text-2xl">
            Send an{" "}
            <em
              className="not-italic"
              style={{
                fontFamily: '"Dancing Script", cursive',
                background: "linear-gradient(90deg, #c020e0, #f6c453)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: "1.15em",
              }}
            >
              Interactive Birthday Surprise Link
            </em>{" "}
            &amp; Make Magic
          </p>
          <p className="mb-5 text-center text-sm text-white/60">
            <em>Create a stunning, interactive 3D birthday surprise for someone you love.</em>
          </p>

          {/* Social proof row */}
          <div className="mb-5 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-yellow-400">★★★★★</span>
              <span className="text-xs text-white/60">4.9/5 (8k Ratings)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-green-400">🔒</span>
              <span className="text-xs text-white/60">Private &amp; Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-purple-400">👥</span>
              <span className="text-xs text-white/60">700+ active users online</span>
            </div>
          </div>

          {/* Tab switcher */}
          <div
            className="mb-5 flex rounded-xl p-1"
            style={{ background: "rgba(255,255,255,0.06)" }}
            role="tablist"
            aria-label="Surprise type"
          >
            <button
              id="tab-birthday"
              role="tab"
              aria-selected={activeTab === "birthday"}
              aria-controls="panel-birthday"
              onClick={() => setActiveTab("birthday")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
                activeTab === "birthday"
                  ? "btn-glow text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              🎂 Birthday
            </button>
            <button
              id="tab-anniversary"
              role="tab"
              aria-selected={activeTab === "anniversary"}
              aria-controls="panel-anniversary"
              onClick={() => setActiveTab("anniversary")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all duration-200 ${
                activeTab === "anniversary"
                  ? "btn-glow text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              💍 Anniversary
            </button>
          </div>

          {/* Panel */}
          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {!showImpact ? (
              /* Name input state */
              <div
                className="slide-up rounded-2xl p-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="rounded-xl px-4 py-1"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  <input
                    ref={inputRef}
                    id="recipient-name"
                    type="text"
                    placeholder="Enter your name..."
                    value={name}
                    maxLength={40}
                    onChange={(e) => { setName(e.target.value); setShowImpact(false); }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    aria-label={`${activeTab === "birthday" ? "Birthday" : "Anniversary"} person's name`}
                    className="input-glow w-full bg-transparent py-3 text-center text-white placeholder:text-white/30 focus:outline-none text-lg font-semibold"
                  />
                </div>
                <p className="mt-1 pb-1 text-center text-xs text-white/30">
                  ⚡ Type your name to see your surprise&rsquo;s impact
                </p>

                {hasName && (
                  <button
                    id="btn-get-it"
                    onClick={handleNameSubmit}
                    className="btn-glow mt-3 w-full rounded-xl py-3 font-bold text-white text-sm"
                  >
                    Got it! Let&rsquo;s build it →
                  </button>
                )}
              </div>
            ) : (
              /* Impact revealed state */
              <div className="slide-up">
                {/* Name bubble */}
                <div
                  className="mb-3 rounded-2xl px-5 py-3 text-center"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-base font-bold text-white">{trimmedName}</p>
                </div>

                {/* Impact box */}
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(192,32,224,0.08)",
                    border: "1px solid rgba(192,32,224,0.25)",
                  }}
                >
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider impact-text">
                    Your Impact
                  </p>
                  <p className="text-sm leading-relaxed text-white/80 italic">
                    {getImpact(trimmedName)}
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={`/create?sender=${encodeURIComponent(trimmedName)}&name=${encodeURIComponent(trimmedName)}&occasion=${activeTab}&type=${activeTab}`}
                  id="btn-build-it"
                  className="btn-glow mt-4 flex w-full items-center justify-between rounded-xl px-5 py-3.5 font-bold text-white"
                >
                  <span>Got it! Let&rsquo;s build it</span>
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  >
                    →
                  </span>
                </Link>

                {/* Reset */}
                <button
                  onClick={() => { setName(""); setShowImpact(false); }}
                  className="mt-2 w-full text-center text-xs text-white/40 hover:text-white/60 transition-colors"
                >
                  ← Change name
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── How it works ── */}
        <section
          id="features"
          className="mt-24 w-full max-w-4xl"
          aria-labelledby="features-heading"
        >
          <h2
            id="features-heading"
            className="mb-2 text-center font-display text-3xl text-white md:text-4xl"
          >
            What they see when they open it
          </h2>
          <p className="mb-12 text-center text-white/50 text-sm">
            A magical chain of moments, designed to make them feel truly special.
          </p>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { n: 1, emoji: "🎁", title: "A gift to open", body: "The link starts with a wrapped gift and their name on the tag." },
              { n: 2, emoji: "🎈", title: "Balloons to pop", body: "Real 3D balloons float up. Every tap pops one with confetti." },
              { n: 3, emoji: "🎂", title: "Candles to blow", body: "They blow at the phone's microphone, or tap if they prefer." },
              { n: 4, emoji: "🎡", title: "A wish wheel", body: "One spin lands on one of the wishes you wrote just for them." },
              { n: 5, emoji: "💌", title: "Your words", body: "Your message types itself out with your photo and voice note." },
            ].map((s) => (
              <li
                key={s.n}
                className="glass-card rounded-2xl p-5"
              >
                <div className="mb-3 text-3xl">{s.emoji}</div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "#c020e0" }}
                >
                  Step {s.n}
                </span>
                <h3 className="mt-1 font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── How to make one ── */}
        <section
          id="how-it-works"
          className="mt-24 w-full max-w-3xl"
          aria-labelledby="how-heading"
        >
          <div className="glass-card rounded-3xl p-5 sm:p-8 md:p-12">
            <h2
              id="how-heading"
              className="mb-4 font-display text-3xl text-white md:text-4xl"
            >
              Making one takes{" "}
              <span style={{ color: "#f6c453" }}>3 minutes</span>
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-white/75">
              <p>
                Type their name, pick colours and the number of candles, write your message and a few wishes for the spin wheel. Add a photo or record a short voice note if you like.
              </p>
              <p>
                You get a link straight away. Paste it into WhatsApp, a text or an email. It works the same on phones and laptops, anywhere in the world.
              </p>
            </div>
            <Link
              href="/create"
              id="start-making-cta"
              className="btn-glow mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white"
            >
              🎁 Start making one
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          id="faq"
          className="mt-24 w-full max-w-2xl"
          aria-labelledby="faq-heading"
        >
          <h2
            id="faq-heading"
            className="mb-8 text-center font-display text-3xl text-white md:text-4xl"
          >
            Questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Does the birthday person need an app or account?",
                a: "No. The link opens in their normal browser, including inside WhatsApp and Messenger.",
              },
              {
                q: "How long does the link work?",
                a: `For ${BRAND.linkLifetimeHours} hours after you create it. After that the message, photo and voice note are deleted.`,
              },
              {
                q: "Who can see my surprise?",
                a: "Only people you send the link to. Each link is a long random code, and search engines are told not to index it.",
              },
              {
                q: "What if their phone blocks the microphone?",
                a: "The candles can be blown out with a tap instead. Nothing gets stuck.",
              },
            ].map((f, i) => (
              <details
                key={i}
                className="glass-card group rounded-2xl px-6 py-4"
              >
                <summary className="cursor-pointer list-none text-base font-bold text-white">
                  <span
                    className="mr-3 inline-block transition-transform duration-200 group-open:rotate-45"
                    style={{ color: "#c020e0" }}
                  >
                    +
                  </span>
                  {f.q}
                </summary>
                <p className="mt-3 pl-6 text-sm leading-relaxed text-white/65">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="mt-24 w-full max-w-xl text-center">
          <div
            className="rounded-3xl p-8 md:p-12"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(192,32,224,0.3) 0%, rgba(139,92,246,0.1) 50%, transparent 80%), rgba(255,255,255,0.04)",
              border: "1px solid rgba(192,32,224,0.25)",
            }}
          >
            <div className="mb-4 text-5xl">🎂</div>
            <h2 className="mb-3 font-display text-3xl text-white md:text-4xl">
              Ready to make someone&rsquo;s day?
            </h2>
            <p className="mb-7 text-white/60">
              Build a 3D birthday surprise in 3 minutes. No app needed.
            </p>
            <Link
              href="/create"
              id="final-cta"
              className="btn-glow inline-flex items-center gap-2 rounded-full px-10 py-4 text-lg font-bold text-white"
            >
              🎁 Create a Surprise Link
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 border-t px-6 py-8 text-center text-sm text-white/40"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        © {new Date().getFullYear()} {BRAND.name} · Built with 💜 · Private &amp; secure
      </footer>
    </div>
  );
}
