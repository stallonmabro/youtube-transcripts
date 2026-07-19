-- Scheduled cleanup of expired shared transcripts
-- Requires the pg_cron extension (enable in Supabase Dashboard → Database → Extensions)

-- Run daily at 3 AM UTC
select cron.schedule(
  'cleanup-expired-shared-transcripts',
  '0 3 * * *',
  'delete from public.shared_transcripts where expires_at < now();'
);
