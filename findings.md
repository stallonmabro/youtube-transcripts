# Findings

## Current Stack
- Next.js 16.2.10, React 19.2.4, TypeScript 5, Tailwind CSS 4, Supabase SSR.
- `youtube-transcript` library for transcript fetching.
- Exports: TXT/SRT/VTT for everyone; PDF/DOCX only for signed-in users.
- OpenAI `gpt-4o-mini` for summary, chat, translation.

## Feature Set
1. Home: URL input, rate-limit banner, feature grid, FAQ, SEO footer.
2. Watch (`/watch?v=ID`): embedded player, transcript list, search, copy, share, save, download dropdown; tabs for Transcript / Summary / Chat / Translate.
3. Dashboard: saved transcript history, usage stats, search, delete.
4. Share (`/share/[id]`): public read-only transcript, 30-day expiry.
5. Auth: Supabase email/password + Google OAuth; auth modal.
6. Rate limits: 3/day anonymous (cookie), 100/day authenticated (`usage_logs`).

## Gaps & Bugs
- Missing migrations: `transcripts` and `usage_logs` tables referenced but not in repo; only `002_create_shared_transcripts.sql` exists.
- Incomplete save flow: metadata (`video_title`, `channel_name`, `thumbnail`) never sent to `/api/transcripts`.
- Marketing mismatch: hero says "Sign in for unlimited," but auth cap is 100/day.
- Placeholder tool pages: `/srt-to-*`, `/open-srt-file` are text-only, not functional converters.
- Weak anonymous rate limit: cookie `yt_usage` easily bypassed.
- Translate API has no OpenAI-key fallback; summarize does.
- YouTube seek uses raw `postMessage` without ready-state handling.
- Share creates a new DB row every time the modal opens.
- No scheduled cleanup for expired shares.
- Mobile header has no sign-in button.
- Auth modal does not auto-close on success.
- Transcript language hardcoded to `en`.
- No tests, no observability.

## Enhancement Areas
- Features: language selection, auto-save, real converters, transcript editing/highlights, batch/playlist, timestamped share links, public search.
- Robustness: migrations/RLS, rate-limit hardening, reliable player API, input validation, error handling, retry logic.
- Intuitiveness: fix copy, auto-close auth modal, skeleton loaders, mobile sign-in, dark mode, keyboard shortcuts.
- Growth: tiers, admin panel, API keys.
