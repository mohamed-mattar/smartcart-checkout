# Privacy Policy, Terms & Security

## What & Why
Before launch, document exactly what data is collected and stored, set rules for how the app may be used, and apply application-level security measures. This is a camera app — users need to know their video never leaves their device. The policy must be honest, specific, and readable. Rate limiting (already added for analytics) should be confirmed app-wide.

## Done looks like
- A "Privacy & Terms" tab (or modal accessible from the footer) contains two sections: Privacy Policy and Terms of Service, rendered in the same dark monospace aesthetic as the rest of the app
- **Privacy Policy** covers: what data is collected (anonymous session ID in sessionStorage, event types, browser user-agent and referrer — no video, no images, no personal identity), how it is stored (Replit PostgreSQL, not shared or sold), how long it is retained (state a specific period, e.g. 90 days), admin access (only the app owner via Replit's database tool), no third-party AI services used (all inference runs on-device), GDPR/CCPA rights (session data can be deleted on request — provide a contact email), and that no cookies are used
- **Terms of Service** covers: acceptable use (no automated scraping, no using the demo to identify real people), no warranties, owner's right to shut down the service
- The footer has "Privacy & Terms" link that opens the tab/modal
- A one-sentence camera disclosure appears inline on the Live Demo tab before the camera starts: "Your camera feed is processed entirely on this device. No video or images are ever uploaded."
- The api-server has a global rate limit (100 req/min per IP) in addition to the analytics-specific one
- An `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN` header is set on all api-server responses

## Out of scope
- Cookie consent banner (no cookies are used — none needed)
- OAuth or user login (anonymous-only app)
- GDPR data portability export (the app stores no personal data — only anonymous session events)

## Steps
1. **Privacy Policy text** — Write a plain-English privacy policy specific to this app. Be explicit: camera video never leaves the device (TensorFlow.js runs locally), the only data sent to the server is anonymous session events, no cookies are set, the session ID is stored in sessionStorage and cleared on tab close.
2. **Terms of Service text** — Write concise ToS covering acceptable use and no-warranty disclaimer.
3. **UI integration** — Add a "Privacy & Terms" entry to the existing nav tab bar (or as a footer link opening a modal). Style it consistently with the existing How It Works tab.
4. **Camera disclosure** — Add a one-line disclosure above the "Start Camera" button on the Live Demo tab, visible before the user grants camera access.
5. **Security headers** — Add `X-Content-Type-Options`, `X-Frame-Options`, and a basic `Content-Security-Policy` header to all api-server responses.
6. **Global rate limit** — Apply a 100 req/min per IP rate limit to all api-server routes as a top-level middleware, before route handlers.

## Relevant files
- `artifacts/smartcart-vision/index.html`
- `artifacts/api-server/src/app.ts`
