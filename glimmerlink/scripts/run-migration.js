// Script to run the migration SQL against Supabase via postgres connection
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qfvllmorcjqlzjcituud.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmdmxsbW9yY2pxbHpqY2l0dXVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTEwNTA1OSwiZXhwIjoyMTA2NjgxMDU5fQ.GudCQFKfN42NwHJNYExoJObVRzGTN96qc4LaC_KYdhk';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function main() {
  console.log('Checking if surprises table exists...');

  // Try to query the surprises table
  const { data, error } = await supabase.from('surprises').select('id').limit(1);

  if (error && error.code === '42P01') {
    console.log('Table does not exist. Please run the migration SQL manually.');
    console.log('\nGo to: https://supabase.com/dashboard/project/qfvllmorcjqlzjcituud/sql/new');
    console.log('\nPaste this SQL:');
    console.log(`
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
alter table public.surprises enable row level security;
insert into storage.buckets (id, name, public, file_size_limit)
values ('surprise-media', 'surprise-media', false, 5242880)
on conflict (id) do nothing;
    `);
    process.exit(1);
  } else if (error) {
    console.error('Error connecting to Supabase:', error.message);
    console.error('Code:', error.code);
    process.exit(1);
  } else {
    console.log('✅ surprises table EXISTS and is reachable!');
    console.log('✅ Supabase connection is working correctly.');
    console.log('Your app should work now. Try creating a link at http://localhost:3000');
  }
}

main();
