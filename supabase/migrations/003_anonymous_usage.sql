-- Harden anonymous rate limiting with IP-backed tracking

 create table if not exists public.anonymous_usage (
   ip_hash text not null,
   date date not null default now(),
   count integer not null default 0,
   primary key (ip_hash, date)
 );

 create index if not exists idx_anonymous_usage_date
   on public.anonymous_usage (date);

 -- Only service_role should write/read this table
 alter table public.anonymous_usage enable row level security;

 drop policy if exists "Service role manages anonymous usage" on public.anonymous_usage;
 create policy "Service role manages anonymous usage"
   on public.anonymous_usage
   for all
   using (false)
   with check (false);
