# SPEC: Glimmerlink (working name)

> AI assistants: read this whole file before every task. Follow the rules section strictly.

## Product
A no-login web app. A sender builds an interactive 3D birthday surprise and gets a private link.
The recipient opens the link in any browser (including WhatsApp's in-app browser) and goes through:
gift -> pop balloons -> blow out candles (mic or tap) -> spin wish wheel -> message + photo + voice note -> end CTA.
Links expire 48 hours after creation; a cleanup job deletes the row and files.

## Stack
Next.js 14 App Router + TypeScript (strict) + Tailwind. React Three Fiber + drei for 3D.
Supabase Postgres + private Storage bucket `surprise-media`. Deployed on Vercel.

## Folder map
- `app/page.tsx` landing · `app/create/page.tsx` builder wizard · `app/s/[id]/page.tsx` recipient page
- `app/api/surprises` create (POST) · `app/api/surprises/[id]` read (GET) · `app/api/cron/cleanup` expiry job
- `components/experience/*` recipient experience (Scene.tsx = all 3D)
- `lib/themes.ts` themes + LIMITS (shared client/server) · `lib/validation.ts` zod schema + file sniffing
- `lib/config.ts` brand name, site URL, link lifetime (change brand here only)
- `supabase/migrations` SQL

## Data model: `surprises`
id (nanoid 21) · recipient_name · sender_name · message · theme · candle_count · wishes (jsonb string[])
· photo_path · voice_path · created_at · expires_at

## Rules (do not break)
1. Never use the Supabase service role key in client code or any `NEXT_PUBLIC_` variable. DB access only in `lib/supabase.ts` consumers on the server.
2. RLS stays enabled with no public policies. All reads/writes go through API routes or server components.
3. Validate all input with zod on the server. Check uploaded files by their bytes (`sniffImage`/`sniffAudio`), never by name or MIME header.
4. Never render user text with `dangerouslySetInnerHTML`.
5. `/s/*` pages: noindex, no-store, generic link-preview text (never the recipient's name or message).
6. Any sound must start after a user tap. Every mic feature needs a tap fallback.
7. 3D must stay smooth on low-end Android: dpr capped at 1.5, low-poly primitives, no heavy post-processing.
8. Keep total upload under 4.5 MB per request (Vercel limit). For bigger files, switch to Supabase signed upload URLs.
9. All UI copy: plain, sentence case, active voice. Errors say what happened and how to fix it.
10. One feature per change. Run `npm run build` before saying a task is done.
