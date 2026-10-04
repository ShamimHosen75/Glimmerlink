import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { STORAGE_BUCKET } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Deletes expired surprises and their files. Called by Vercel Cron or Supabase pg_cron.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from("surprises")
    .select("id, photo_path, voice_path")
    .lt("expires_at", new Date().toISOString())
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data.length) return NextResponse.json({ deleted: 0 });

  const paths = data.flatMap((r) => [r.photo_path, r.voice_path]).filter((p): p is string => Boolean(p));
  if (paths.length) {
    const { error: storageError } = await sb.storage.from(STORAGE_BUCKET).remove(paths);
    // Keep the rows so the next run retries the file deletion.
    if (storageError) return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  const ids = data.map((r) => r.id);
  const { error: deleteError } = await sb.from("surprises").delete().in("id", ids);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ deleted: ids.length, more: data.length === 200 });
}
