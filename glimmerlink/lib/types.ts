import type { ThemeId } from "./themes";

// What the recipient's browser receives. Never includes storage paths or internal fields.
export type PublicSurprise = {
  recipientName: string;
  senderName: string;
  message: string;
  theme: ThemeId;
  candleCount: number;
  wishes: string[];
  photoUrl: string | null;
  voiceUrl: string | null;
  expiresAt: string;
  cakeStyle?: string;
  cakeFlavor?: string;
  cardStyle?: string;
  cardMessage?: string;
  introMessage?: string;
  personalNote?: string;
  finalMessage?: string;
  recipientGender?: string;
  flowerType?: string | null;
  flowerColor?: string;
  photoPosition?: { x: number; y: number };
  occasion?: "birthday" | "anniversary";
  anniversaryTarget?: "partner" | "couple";
  yearsTogether?: string;
};
