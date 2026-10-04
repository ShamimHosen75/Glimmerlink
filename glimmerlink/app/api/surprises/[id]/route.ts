import { NextResponse } from "next/server";
import { getSurprise } from "@/lib/surprises";
import { SURPRISE_ID } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!SURPRISE_ID.test(params.id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const result = await getSurprise(params.id);
  if (result.status === "missing") return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (result.status === "expired") return NextResponse.json({ error: "Expired" }, { status: 410 });
  return NextResponse.json(result.surprise, { headers: { "Cache-Control": "private, no-store" } });
}
