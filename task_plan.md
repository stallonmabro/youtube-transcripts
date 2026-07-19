# TranscriptPro Enhancement Plan

## Goal
Make TranscriptPro richer, more robust, and more intuitive without over-engineering.

## Guiding Principles
1. Fix foundation before adding features (DB, RLS, rate limits, tests).
2. Every new feature must have an error state and a loading state.
3. Copy and limits must match reality.
4. Prefer small, shippable milestones over a big-bang rewrite.

---

## Phase 0 — Foundation & Cleanup (Ship First)
**Objective:** close gaps that break trust or correctness.

| # | Task | Why | Effort |
|---|------|-----|--------|
| 0.1 | Add missing Supabase migrations: `transcripts`, `usage_logs`, baseline `001_`. | Tables referenced in code but not versioned. | Small |
| 0.2 | Add RLS policies for `transcripts` and `usage_logs`. | Users must only read own data. | Small |
| 0.3 | Fix save flow: send full metadata (`title`, `channel`, `thumbnail`, `duration`, `word_count`) to `/api/transcripts`. | Dashboard currently shows blank cards. | Small |
| 0.4 | Align marketing copy: replace "unlimited" with actual limits (free 3/day, signed-in 100/day) or change limits to match copy. | Misleading users causes churn. | Tiny |
| 0.5 | Harden anonymous rate limit: IP-backed or Supabase-backed fallback, keep cookie as cache. | Cookie bypass trivial. | Small |
| 0.6 | Add OpenAI-key fallback to `/api/translate` like `/api/summarize`. | Avoids 500 when key missing. | Tiny |
| 0.7 | Standardize error handling: return structured `{error,code}` from APIs; surface toast/inline errors. | Better UX and debugging. | Small |
| 0.8 | Add a basic health-check/API test using Playwright or Vitest. | Prevents regressions. | Small |

**Milestone deliverable:** clean DB schema, truthful copy, stable watch/save/share flow.

---

## Phase 1 — Intuitiveness & Polish (High-Impact, Low-Risk)
**Objective:** make the app feel professional and frictionless.

| # | Task | Why | Effort |
|---|------|-----|--------|
| 1.1 | Auto-close auth modal on successful sign-in/up and refresh auth state. | Current modal stays open. | Tiny |
| 1.2 | Add sign-in button to mobile hamburger menu. | Mobile users can't sign in from menu. | Tiny |
| 1.3 | Add skeleton loaders for dashboard, transcript viewer, and share page. | Reduces perceived loading time. | Small |
| 1.4 | Improve empty states (dashboard, search results, transcript errors). | Guides next action. | Small |
| 1.5 | Add keyboard shortcuts: `/` focus search, `Esc` close modal/dropdown, `t` toggle transcript/summary tabs. | Power-user UX. | Small |
| 1.6 | Add dark mode toggle using existing CSS custom properties. | Modern expectation. | Small |
| 1.7 | Reliability fix: load YouTube IFrame API properly and seek only after `onReady`. | Current seek often fails. | Small |
| 1.8 | Consolidate header/footer across all pages; unify CTA styling. | Consistent brand feel. | Small |

**Milestone deliverable:** polished UI, fewer dead-ends, working player seek.

---

## Phase 2 — Core Feature Richness
**Objective:** extend what users can do with transcripts.

| # | Task | Why | Effort |
|---|------|-----|--------|
| 2.1 | Caption language selector: fetch available languages from `youtube-transcript` and let user pick. | Non-English users are blocked. | Small |
| 2.2 | Auto-save every generated transcript for signed-in users (deduped by video_id). | History becomes useful. | Small |
| 2.3 | Timestamped share links: add `?t=...` support on `/watch` and share modal. | Common sharing need. | Small |
| 2.4 | In-place transcript search with highlight and result count. | Current search unclear. | Small |
| 2.5 | Copy formats: plain text, text with timestamps, SRT, VTT, JSON from one dropdown. | Power users need options. | Small |
| 2.6 | Real SRT/VTT/ASS/TXT converters and an SRT file viewer at the existing placeholder routes. | Footer links currently lie. | Medium |
| 2.7 | Transcript editing + highlights: let signed-in users edit segment text, highlight lines, add notes per timestamp. | Differentiator for researchers. | Medium |
| 2.8 | Share modal: dedupe rows by `video_id` or return existing share ID. | Prevents DB spam. | Tiny |

**Milestone deliverable:** multilingual support, useful history, real converters, richer transcript interaction.

---

## Phase 3 — Robustness & Scale
**Objective:** survive real-world traffic and abuse.

| # | Task | Why | Effort |
|---|------|-----|--------|
| 3.1 | Server-side URL validation and ID normalization in API routes. | Blocks malformed input. | Small |
| 3.2 | Segment payload size limit on share/save endpoints. | Prevents huge DB writes. | Small |
| 3.3 | Retry + exponential backoff for `youtube-transcript` with fallback messages. | YouTube transient failures common. | Small |
| 3.4 | Middleware rate limiting (per IP + per user) for API routes. | Layered defense. | Small |
| 3.5 | Scheduled cleanup of expired shared transcripts (Supabase cron or edge function). | Avoids manual/data growth. | Small |
| 3.6 | Add request logging and basic error tracking (e.g., Sentry or LogSnag). | Diagnose issues in production. | Small |
| 3.7 | Input sanitization for OpenAI prompts and chat history. | Safety/cost control. | Small |

**Milestone deliverable:** hardened app, lower incident rate, production visibility.

---

## Phase 4 — Growth & Monetization (Optional)
**Objective:** turn utility into business.

| # | Task | Why | Effort |
|---|------|-----|--------|
| 4.1 | Subscription tiers: Free / Pro / Team with usage-based limits. | Revenue path. | Medium |
| 4.2 | Stripe checkout + webhook to update limits. | Payments. | Medium |
| 4.3 | Admin panel: user list, usage analytics, abuse flags. | Operations. | Medium |
| 4.4 | Public API keys for third-party integrations. | B2B expansion. | Medium |
| 4.5 | Batch/playlist processing: multiple URLs or playlist import. | Power-user workflow. | Medium |
| 4.6 | Site-wide public transcript search (opt-in). | SEO/engagement. | Medium |

**Decision point:** tackle Phase 4 only after Phases 0–3 are stable and metrics justify it.

---

## Prioritization
1. **Must ship first:** Phase 0 (foundation) + 1.1–1.4 (quick wins).
2. **Should ship next:** Phase 1 remainder + Phase 2 core features (language, auto-save, converters, dedupe).
3. **Nice to have:** Phase 3 polish items beyond basics.
4. **Later:** Phase 4.

---

## Risks
- YouTube transcript availability can break any time; keep fallback messaging.
- OpenAI costs scale with chat/translation; add token limits and caps.
- Over-building converter tools can distract from core transcript value.

---

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-19 | Plan structured around Foundation → Polish → Features → Robustness → Growth | Fixes trust issues before adding scope. |

## Task List
- [ ] Phase 0: migrations + RLS + save fix + copy fix + rate limit + translate fallback + errors + test
- [ ] Phase 1: auth modal close + mobile sign-in + skeletons + empty states + shortcuts + dark mode + player API + header/footer
- [ ] Phase 2: language selector + auto-save + timestamp share + search highlight + copy formats + real converters + editing/highlights + share dedupe
- [ ] Phase 3: validation + payload limits + retry + middleware rate limit + cleanup cron + logging + prompt sanitization
- [ ] Phase 4: subscriptions + admin + API keys + batch + public search
