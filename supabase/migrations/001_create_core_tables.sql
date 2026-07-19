-- Baseline migration: core tables for TranscriptPro
-- Run this before 002_create_shared_transcripts.sql

-- User transcript history
 create table if not exists public.transcripts (
   id uuid primary key default gen_random_uuid(),
   user_id uuid not null references auth.users(id) on delete cascade,
   video_id text not null,
   video_title text,
   video_thumbnail text,
   channel_name text,
   duration_minutes numeric(10,2),
   word_count integer,
   segments jsonb not null default '[]'::jsonb,
   created_at timestamptz not null default now(),
   updated_at timestamptz not null default now()
 );

 create index if not exists idx_transcripts_user_id_created_at
   on public.transcripts (user_id, created_at desc);

 -- Daily usage tracking
 create table if not exists public.usage_logs (
   id uuid primary key default gen_random_uuid(),
   user_id uuid not null references auth.users(id) on delete cascade,
   created_at timestamptz not null default now()
 );

 create index if not exists idx_usage_logs_user_id_created_at
   on public.usage_logs (user_id, created_at);

 -- Row-level security
 alter table public.transcripts enable row level security;
 alter table public.usage_logs enable row level security;

 -- Transcripts policies
 drop policy if exists "Users can view own transcripts" on public.transcripts;
 create policy "Users can view own transcripts"
   on public.transcripts
   for select
   using (user_id = auth.uid());

 drop policy if exists "Users can insert own transcripts" on public.transcripts;
 create policy "Users can insert own transcripts"
   on public.transcripts
   for insert
   with check (user_id = auth.uid());

 drop policy if exists "Users can update own transcripts" on public.transcripts;
 create policy "Users can update own transcripts"
   on public.transcripts
   for update
   using (user_id = auth.uid())
   with check (user_id = auth.uid());

 drop policy if exists "Users can delete own transcripts" on public.transcripts;
 create policy "Users can delete own transcripts"
   on public.transcripts
   for delete
   using (user_id = auth.uid());

 -- Usage logs policies
 drop policy if exists "Users can view own usage logs" on public.usage_logs;
 create policy "Users can view own usage logs"
   on public.usage_logs
   for select
   using (user_id = auth.uid());

 drop policy if exists "Users can insert own usage logs" on public.usage_logs;
 create policy "Users can insert own usage logs"
   on public.usage_logs
   for insert
   with check (user_id = auth.uid());

 drop policy if exists "Users can delete own usage logs" on public.usage_logs;
 create policy "Users can delete own usage logs"
   on public.usage_logs
   for delete
   using (user_id = auth.uid());

 -- Updated-at helper
 create or replace function public.set_updated_at()
 returns trigger as $$
 begin
   new.updated_at = now();
   return new;
 end;
 $$ language plpgsql;

 drop trigger if exists set_transcripts_updated_at on public.transcripts;
 create trigger set_transcripts_updated_at
   before update on public.transcripts
   for each row execute function public.set_updated_at();
