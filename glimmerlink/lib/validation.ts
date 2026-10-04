import { z } from "zod";
import { LIMITS, THEME_IDS, type ThemeId } from "./themes";

export const surpriseInput = z.object({
  recipientName: z.string().trim().min(1, "Add the birthday person's name.").max(LIMITS.name, "Name is too long."),
  senderName: z.string().trim().max(LIMITS.name, "Your name is too long.").default(""),
  message: z.string().trim().default("Wishing you a magical day!").transform((m) => m || "Wishing you a magical day!"),
  theme: z.string().default("dusk"),
  candleCount: z.coerce.number().int().min(1).max(9).default(1),
  wishes: z.any().default([]),
  cakeStyle: z.string().optional().default("classic"),
  cakeFlavor: z.string().optional().default("vanilla"),
  cardStyle: z.string().optional().default("luxury"),
  cardMessage: z.string().optional(),
  introMessage: z.string().optional(),
  personalNote: z.string().optional(),
  finalMessage: z.string().optional(),
  recipientGender: z.string().optional().default("male"),
  flowerType: z.string().nullable().optional().default("rose"),
  flowerColor: z.string().optional().default("#ff3388"),
  photoPosition: z.object({ x: z.number(), y: z.number() }).optional(),
});

export type SurpriseInput = z.infer<typeof surpriseInput>;

export const SURPRISE_ID = /^[A-Za-z0-9_-]{21}$/;

// Check real file bytes, not the file name or the browser-reported type.
export function sniffImage(b: Buffer): { ext: string; mime: string } | null {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return { ext: "png", mime: "image/png" };
  if (b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP")
    return { ext: "webp", mime: "image/webp" };
  return null;
}

export function sniffAudio(b: Buffer): { ext: string; mime: string } | null {
  if (b.length > 4 && b.readUInt32BE(0) === 0x1a45dfa3) return { ext: "webm", mime: "audio/webm" };
  if (b.length > 12 && b.toString("ascii", 4, 8) === "ftyp") return { ext: "m4a", mime: "audio/mp4" };
  if (b.length > 4 && b.toString("ascii", 0, 4) === "OggS") return { ext: "ogg", mime: "audio/ogg" };
  if (b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WAVE")
    return { ext: "wav", mime: "audio/wav" };
  if (b.length > 3 && (b.toString("ascii", 0, 3) === "ID3" || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0)))
    return { ext: "mp3", mime: "audio/mpeg" };
  return null;
}
