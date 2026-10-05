import "server-only";
import { supabaseAdmin } from "./supabase";
import { STORAGE_BUCKET } from "./config";
import { THEMES, type ThemeId } from "./themes";
import type { PublicSurprise } from "./types";

type Row = {
  id: string;
  recipient_name: string;
  sender_name: string;
  message: string;
  theme: string;
  candle_count: number;
  wishes: unknown;
  photo_path: string | null;
  voice_path: string | null;
  expires_at: string;
};

export type SurpriseLookup =
  | { status: "ok"; surprise: PublicSurprise }
  | { status: "expired" }
  | { status: "missing" };

const SIGNED_URL_SECONDS = 60 * 60 * 3;

async function signedUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabaseAdmin().storage.from(STORAGE_BUCKET).createSignedUrl(path, SIGNED_URL_SECONDS);
  if (error) {
    console.error("signed url failed", path, error.message);
    return null;
  }
  return data.signedUrl;
}

export async function getSurprise(id: string): Promise<SurpriseLookup> {
  const { data, error } = await supabaseAdmin()
    .from("surprises")
    .select("id, recipient_name, sender_name, message, theme, candle_count, wishes, photo_path, voice_path, expires_at")
    .eq("id", id)
    .maybeSingle<Row>();

  if (error) throw new Error(error.message);
  if (!data) return { status: "missing" };
  if (new Date(data.expires_at).getTime() <= Date.now()) return { status: "expired" };

  const [photoUrl, voiceUrl] = await Promise.all([signedUrl(data.photo_path), signedUrl(data.voice_path)]);
  const theme: ThemeId = data.theme in THEMES ? (data.theme as ThemeId) : "dusk";
  const wishesPayload = data.wishes;
  let wishes: string[] = [];
  let meta: Record<string, any> = {};

  if (Array.isArray(wishesPayload)) {
    wishes = wishesPayload.filter((w): w is string => typeof w === "string");
  } else if (typeof wishesPayload === "object" && wishesPayload !== null) {
    meta = wishesPayload as Record<string, any>;
    if (Array.isArray(meta.items)) {
      wishes = meta.items.filter((w: unknown): w is string => typeof w === "string");
    } else if (Array.isArray(meta.wheelOptions)) {
      wishes = meta.wheelOptions.filter((w: unknown): w is string => typeof w === "string");
    }
  }

  return {
    status: "ok",
    surprise: {
      recipientName: data.recipient_name,
      senderName: data.sender_name,
      message: data.message,
      theme,
      candleCount: data.candle_count,
      wishes: wishes.length ? wishes : ["A big warm hug 🫂", "Dinner is on me 🍕", "Movie night 🎬", "A coffee date ☕", "Your favorite dessert 🍦"],
      photoUrl,
      voiceUrl,
      expiresAt: data.expires_at,
      cakeStyle: meta.cakeStyle || "classic",
      cakeFlavor: meta.cakeFlavor || "vanilla",
      cardStyle: meta.cardStyle || "luxury",
      cardMessage: meta.cardMessage || data.message,
      introMessage: meta.introMessage || "Take a deep breath and open your gift...",
      personalNote: meta.personalNote || "I'm so grateful for you.",
      finalMessage: meta.finalMessage || "Friendship is the best gift!",
      recipientGender: meta.recipientGender || "male",
      flowerType: meta.flowerType ?? "rose",
      flowerColor: meta.flowerColor || "#ff3388",
      photoPosition: meta.photoPosition || { x: 50, y: 50 },
      occasion: meta.occasion || "birthday",
      anniversaryTarget: meta.anniversaryTarget,
      yearsTogether: meta.yearsTogether,
    },
  };
}
