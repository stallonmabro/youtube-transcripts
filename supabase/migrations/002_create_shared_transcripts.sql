-- Create shared_transcripts table for share link storage
-- Run this in Supabase SQL Editor

create table if not exists public.shared_transcripts (
  id text primary key,
  video_id text not null,
  segments jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);

-- Index for cleanup queries
create index if not exists idx_shared_transcripts_expires_at
  on public.shared_transcripts (expires_at);

-- Allow public reads (anyone with the link can view)
drop policy if exists "Anyone can view shared transcripts" on public.shared_transcripts;
create policy "Anyone can view shared transcripts"
  on public.shared_transcripts
  for select
  using (expires_at > now());

-- Allow service_role (backend) to insert/delete
-- This is controlled via the admin client, no public insert
