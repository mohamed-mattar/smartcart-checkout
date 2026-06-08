---
title: Code documentation & developer notes
---
# Code Documentation

## What & Why
The single-file app has no inline comments and no developer-facing documentation. Add thorough JSDoc-style comments throughout the JavaScript, document every major feature and design decision, and add a "For Developers" collapsible section at the bottom of the How It Works tab so a reader can understand the architecture without opening the source.

## Done looks like
- Every major JS block has a comment header explaining what it does and why (SKU_MAP schema, ADD_FRAMES debounce constant, PRESENCE_TIMEOUT, scanner mode state machine, renderCart branching logic, detection loop, session timer)
- Non-obvious decisions have an inline comment explaining the reasoning (e.g. why 7 consecutive frames, why 1200ms presence timeout)
- The How It Works tab has a new "Developer Notes" section at the bottom (collapsible `<details>` element) that documents: file structure, how to add a new SKU, how to change debounce/timeout constants, and how Scanner Mode differs from Cart Mode internally
- The `<head>` has a comment block with a one-paragraph description of the file, author placeholder, and license note

## Out of scope
- Splitting the single file into separate modules (future refactor)
- Automated test coverage
- Any change to runtime behavior

## Steps
1. **Head comment block** — Add a structured comment at the top of the `<script>` block: app name, description, architecture summary (single HTML file, TF.js CDN, no build step), and how to run it locally.
2. **Constants documentation** — Comment each constant (`ADD_FRAMES`, `PRESENCE_TIMEOUT`, `DEBOUNCE_MS`) with its purpose, the tradeoff it controls, and guidance on when to change it.
3. **SKU_MAP documentation** — Add a comment block above the SKU_MAP explaining its schema (`{ price, icon, label }`), how COCO class names map to it, and a step-by-step guide for adding a new item.
4. **State & mode comments** — Comment the state variables (`cart`, `pending`, `scannerTotals`, `scannerMode`) explaining what each Map holds and how Scanner Mode changes their lifecycle.
5. **Function-level comments** — Add a JSDoc comment above each function (`renderCart`, `detectLoop`, `logEvent`, `updateSessionTime`) describing inputs, outputs, and side effects.
6. **Developer Notes section** — Add a `<details><summary>Developer Notes</summary>` block at the bottom of the How It Works page covering: how to add a SKU, how to tune detection sensitivity, the Scanner vs Cart mode state machine, and the single-file architecture rationale.

## Relevant files
- `artifacts/smartcart-vision/index.html`