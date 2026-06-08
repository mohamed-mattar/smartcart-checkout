# Rename, Logo & Copyright

## What & Why
Rename the app from "SmartCart Vision" to "SmartCart Checkout" everywhere it appears, create a consistent SVG logo that shows in the browser tab (favicon), the app header, and the web app manifest (so it looks right if a user pins it to their home screen), and add a copyright line to the footer.

## Done looks like
- Browser tab shows "SmartCart Checkout" as the page title and displays a custom favicon (not the generic Replit orange square)
- The `<h1>` header, footer tagline, all `<meta>` og: tags, and the How It Works page text all read "SmartCart Checkout"
- A green-on-dark SVG favicon is inlined as a `<link rel="icon">` data URI so it requires no extra file
- A web app manifest (`<link rel="manifest">`) registers the app name and icon for home-screen installs
- Footer contains `© 2026 SmartCart Checkout. All rights reserved.`

## Out of scope
- Changing the underlying model name (COCO-SSD) or any detection logic
- Any redesign of the page layout

## Steps
1. **Global rename** — Find and replace every occurrence of "SmartCart Vision" with "SmartCart Checkout" in `index.html`: the `<title>`, `<h1>`, all `<meta>` og: tags, the footer tagline, and any prose in the How It Works section.
2. **SVG favicon** — Design a compact square SVG icon using the existing dark background (`#0a0e14`) and green accent (`#00e08a`) — a stylized cart or checkmark — and embed it as a base64 data URI in a `<link rel="icon" type="image/svg+xml">` tag in the `<head>`.
3. **Web app manifest** — Add an inline `<link rel="manifest">` pointing to a small `manifest.json` (or inline it as a data URI) declaring the app name, short name, and icon so the app installs cleanly on mobile.
4. **Copyright footer** — Append `© 2026 SmartCart Checkout. All rights reserved.` to the existing `<footer>` element, styled to match the existing dim footer text.

## Relevant files
- `artifacts/smartcart-vision/index.html`
