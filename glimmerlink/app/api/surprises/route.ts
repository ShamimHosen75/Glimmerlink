import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabaseAdmin } from "@/lib/supabase";
import { surpriseInput, sniffAudio, sniffImage } from "@/lib/validation";
import { LIMITS } from "@/lib/themes";
import { BRAND, STORAGE_BUCKET } from "@/lib/config";
import { allow } from "@/lib/rateLimit";

export const runtime = "nodejs";

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(`create:${ip}`)) return bad("Too many surprises from this connection. Wait a few minutes and try again.", 429);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("The form couldn't be read. Refresh the page and try again.");
  }

  const raw = form.get("data");
  if (typeof raw !== "string") return bad("The form is missing its details.");
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return bad("The form details are malformed.");
  }
  const parsed = surpriseInput.safeParse(json);
  if (!parsed.success) return bad(parsed.error.issues[0]?.message ?? "Check the form fields.");
  const input = parsed.data;

  // Validate every file BEFORE touching the database or storage.
  type Media = { buf: Buffer; ext: string; mime: string };
  let photoFile: Media | null = null;
  const photo = form.get("photo");
  if (photo instanceof Blob && photo.size > 0) {
    if (photo.size > LIMITS.photoBytes) return bad("The photo is larger than 2.5 MB. Choose a smaller one.");
    const buf = Buffer.from(await photo.arrayBuffer());
    const kind = sniffImage(buf);
    if (!kind) return bad("The photo must be a JPEG, PNG or WebP image.");
    photoFile = { buf, ...kind };
  }
  let voiceFile: Media | null = null;
  const voice = form.get("voice");
  if (voice instanceof Blob && voice.size > 0) {
    if (voice.size > LIMITS.voiceBytes) return bad("The voice note is larger than 1.5 MB. Keep it under a minute.");
    const buf = Buffer.from(await voice.arrayBuffer());
    const kind = sniffAudio(buf);
    if (!kind) return bad("The voice note must be WebM, M4A, MP3, OGG or WAV audio.");
    voiceFile = { buf, ...kind };
  }

  const id = nanoid(21);
  const uploaded: string[] = [];
  let sb: ReturnType<typeof supabaseAdmin> | null = null;

  try {
    sb = supabaseAdmin();
    const upload = async (name: string, f: Media) => {
      const path = `${id}/${name}.${f.ext}`;
      const { error } = await sb!.storage.from(STORAGE_BUCKET).upload(path, f.buf, { contentType: f.mime });
      if (error) throw new Error(`${name} upload: ${error.message}`);
      uploaded.push(path);
      return path;
    };
    const photoPath = photoFile ? await upload("photo", photoFile) : null;
    const voicePath = voiceFile ? await upload("voice", voiceFile) : null;

    const expiresAt = new Date(Date.now() + BRAND.linkLifetimeHours * 3600 * 1000).toISOString();
    
    // Package rich metadata into wishes JSONB field
    const wishesPayload = {
      items: Array.isArray(input.wishes) && input.wishes.length > 0
        ? input.wishes
        : ["A big warm hug 🫂", "Dinner is on me 🍕", "Movie night 🎬", "A coffee date ☕", "Your favorite dessert 🍦"],
      cakeStyle: input.cakeStyle || "classic",
      cakeFlavor: input.cakeFlavor || "vanilla",
      cardStyle: input.cardStyle || "luxury",
      cardMessage: input.cardMessage || input.message,
      introMessage: input.introMessage || "Take a deep breath and open your gift...",
      personalNote: input.personalNote || "I'm so grateful for you.",
      finalMessage: input.finalMessage || "Friendship is the best gift!",
      recipientGender: input.recipientGender || "male",
      flowerType: input.flowerType,
      flowerColor: input.flowerColor || "#ff3388",
      photoPosition: input.photoPosition || { x: 50, y: 50 },
    };

    const { error } = await sb.from("surprises").insert({
      id,
      recipient_name: input.recipientName,
      sender_name: input.senderName,
      message: input.cardMessage || input.message,
      theme: input.theme || "dusk",
      candle_count: input.candleCount || 1,
      wishes: wishesPayload,
      photo_path: photoPath,
      voice_path: voicePath,
      expires_at: expiresAt,
    });
    if (error) throw new Error(`insert: ${error.message}`);

    return NextResponse.json({ id, url: `${BRAND.siteUrl}/s/${id}`, expiresAt }, { status: 201 });
  } catch (err) {
    console.error("create surprise failed", err);
    if (sb && uploaded.length) await sb.storage.from(STORAGE_BUCKET).remove(uploaded);
    return bad("The surprise couldn't be saved. Try again in a moment.", 500);
  }
}
