import type { Metadata } from "next";
import Experience from "@/components/experience/Experience";
import type { PublicSurprise } from "@/lib/types";

// Test page: the full recipient experience with sample data. Needs no database.
export const metadata: Metadata = { title: "Demo surprise", robots: { index: false, follow: false } };

const sample: PublicSurprise = {
  recipientName: "Nadia",
  senderName: "Rafi",
  message:
    "Happy birthday! I couldn't be there today, so I built you a tiny party instead.\nI hope this year brings you everything you've been wishing for.",
  theme: "dusk",
  candleCount: 5,
  wishes: ["A year full of good surprises", "Cake for breakfast", "A trip somewhere new", "Laughing until it hurts"],
  photoUrl: null,
  voiceUrl: null,
  expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
  cakeFlavor: "strawberry",
  cakeStyle: "classic",
  cardStyle: "luxury",
  cardMessage: "Happy birthday! I couldn't be there today, so I built you a tiny party instead.\nI hope this year brings you everything you've been wishing for.",
  flowerType: "rose",
  flowerColor: "#ff3388",
  personalNote: "I'm so grateful to celebrate this special day with you.",
  finalMessage: "May all your birthday dreams come true!",
};

export default function DemoPage() {
  return <Experience surprise={sample} />;
}
