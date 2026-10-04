-- Run this in Supabase -> SQL Editor (or with the Supabase CLI).

create table if not exists public.surprises (
  id             text primary key check (id ~ '^[A-Za-z0-9_-]{21}$'),
  recipient_name text not null check (char_length(recipient_name) between 1 and 40),
  sender_name    text not null default '' check (char_length(sender_name) <= 40),
  message        text not null check (char_length(message) between 1 and 1000),
  theme          text not null,
  candle_count   int  not null check (candle_count between 1 and 9),
  wishes         jsonb not null default '[]'::jsonb,
  photo_path     text,
  voice_path     text,
  created_at     timestamptz not null default now(),
  expires_at     timestamptz not null default now() + interval '48 hours'
);

create index if not exists surprises_expires_at_idx on public.surprises (expires_at);

-- RLS on with NO policies = the public anon key can do nothing.
-- Only the server (service role key) can read or write.
alter table public.surprises enable row level security;

-- Private bucket for photos and voice notes (5 MB hard cap per file).
insert into storage.buckets (id, name, public, file_size_limit)
values ('surprise-media', 'surprise-media', false, 5242880)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- OPTIONAL: run cleanup every 10 minutes instead of Vercel's daily cron.
-- 1. Database -> Extensions: enable pg_cron and pg_net.
-- 2. Replace YOUR_SITE and YOUR_CRON_SECRET, then run:
--
-- select cron.schedule(
--   'cleanup-expired-surprises',
--   '*/10 * * * *',
--   $$ select net.http_get(
--        url := 'https://YOUR_SITE/api/cron/cleanup',
--        headers := jsonb_build_object('Authorization', 'Bearer YOUR_CRON_SECRET')
--      ); $$
-- );
