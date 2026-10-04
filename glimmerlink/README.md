# Glimmerlink: interactive 3D birthday surprise links

Starter codebase (Phases 0 to 4). Rename the brand in `lib/config.ts`.

## 1. Run it locally (about 15 minutes)

1. Install Node.js 20+.
2. Create a free project at supabase.com.
3. In Supabase: **SQL Editor** -> paste `supabase/migrations/001_init.sql` -> Run.
4. Copy `.env.example` to `.env.local` and fill in:
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from **Project Settings -> API**
   - `CRON_SECRET`: any long random string
5. Install and start:
   ```bash
   npm install
   npm run dev
   ```
6. Open http://localhost:3000, make a surprise, open the link.

Testing on your phone: microphone access needs HTTPS. Use `npx localtunnel --port 3000` or deploy to Vercel.

## 2. Deploy

1. Push to GitHub, import the repo on vercel.com.
2. Add the same env vars in Vercel, with `NEXT_PUBLIC_SITE_URL` set to your real domain.
3. Cleanup: `vercel.json` runs it daily (Vercel's free plan limit). For every 10 minutes,
   use the optional pg_cron snippet at the bottom of the SQL file.

## 3. What's built

- Landing page with interactive candle, FAQ, OG image, robots.txt, sitemap
- 5-step builder: names, theme, candles, message, wishes, photo (compressed in browser), voice note (record or upload)
- Share screen: copy, WhatsApp, native share
- Recipient experience: gift -> 3D balloons -> 3D cake (mic blow + tap fallback) -> confetti -> wish wheel -> message, photo, voice -> end CTA
- API with zod validation, byte-level file checks, rate limit, rollback of uploads on failure
- Expiry: 410/expired page at 48 h + cleanup job
- Privacy: random 21-char IDs, RLS locked, private bucket, signed URLs, noindex on surprise pages

## 4. Next phases (prompt one at a time, after "Read SPEC.md")

- Replace the in-memory rate limiter with Upstash Redis.
- Background music: add 3 royalty-free tracks the sender can pick, fading in after "Tap to open".
- Hidden message inside one balloon.
- Nicer 3D: a GLB cake model, candle smoke puffs, balloon shine.
- `/about`, `/privacy`, `/terms` pages and a `/resources` MDX blog for SEO.
- Analytics (Vercel Analytics or Plausible), then AdSense on public pages only.

## 5. QA checklist before launch

- [ ] Open a link inside WhatsApp, Messenger and Instagram in-app browsers (Android + iPhone)
- [ ] Mic blow works on Chrome Android and Safari iOS; tap fallback when mic is denied
- [ ] Tune `THRESHOLD` in `components/experience/useBlowDetector.ts` in a noisy room
- [ ] Smooth on a low-end Android phone
- [ ] iPhone HEIC photo: works in Safari; other browsers show a clear error
- [ ] Message `<script>alert(1)</script>` shows as plain text
- [ ] Expired link shows the expired page; cleanup deletes files from Storage
- [ ] Link preview in WhatsApp shows the generic image, not the recipient's name
- [ ] `npm run build` passes
