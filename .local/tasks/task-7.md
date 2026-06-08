---
title: Cookieless analytics & session tracking
---
# Analytics & Session Tracking

## What & Why
Add cookieless, privacy-friendly analytics using Replit's built-in PostgreSQL and the existing api-server. Each page visit and key user action (camera started, item detected, mode switched, session ended) is recorded server-side. No third-party services, no cookies, no consent banner required. Two tables: `activity_log` (every event) and `user_log` (one row per unique anonymous session). Both tables are only accessible through the api-server — there is no way to read them from the frontend.

## Done looks like
- `activity_log` table exists with columns: `id`, `session_id`, `event_type`, `event_data` (JSONB), `created_at`
- `user_log` table exists with columns: `id`, `session_id`, `first_seen`, `last_seen`, `page_views`, `items_scanned`, `user_agent`, `referrer`
- Anonymous `session_id` is a UUID generated once per browser session and stored in `sessionStorage` (not `localStorage` — clears on tab close, never a cookie)
- The api-server exposes `POST /api/analytics/event` to receive events; it validates input and inserts into `activity_log` and upserts into `user_log`
- The frontend fires events for: session start, camera started, item added to cart, scanner mode toggled, session end (beforeunload)
- There is NO public GET endpoint — the tables cannot be read from the browser
- The api-server has a rate limit of 60 requests per minute per IP on the analytics endpoint to prevent abuse
- Database migrations run automatically on api-server startup

## Out of scope
- An admin dashboard UI (data is queryable via Replit's database tool)
- User accounts or authenticated sessions (anonymous only)
- Any PII collection — no IP addresses stored, no email, no names

## Steps
1. **Database setup** — Use Replit's built-in PostgreSQL integration. Create the `activity_log` and `user_log` tables in a migration that runs on api-server startup. Use the `database` skill to set this up.
2. **API endpoint** — Add `POST /api/analytics/event` to the api-server with input validation (zod schema), rate limiting (express-rate-limit, 60 req/min per IP), and DB inserts. Return `204 No Content` on success.
3. **Session ID** — In the frontend, generate a UUID v4 session ID at page load and store it in `sessionStorage`. Include it in every analytics event payload.
4. **Frontend event firing** — Add a lightweight `trackEvent(type, data)` function that POSTs to `/api/analytics/event`. Fire it on: session start, camera granted, first item added, scanner mode toggle, and `beforeunload`.
5. **Security hardening** — Confirm there is no GET endpoint that exposes table contents. Add the rate limiter. Ensure CORS on the analytics endpoint only accepts requests from the app's own origin.

## Relevant files
- `artifacts/api-server/src/app.ts`
- `artifacts/api-server/src/routes/index.ts`
- `artifacts/api-server/src/routes/health.ts`
- `artifacts/smartcart-vision/index.html`