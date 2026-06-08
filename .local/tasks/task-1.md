---
title: SmartCart Vision web app
---
# SmartCart Vision Web App

## What & Why
Build a single-file static web app (`index.html` with all CSS and JS inline) called SmartCart Vision — a browser-based prototype of checkout-free retail computer vision. No backend, no build step, no frameworks. Runs entirely client-side using TensorFlow.js and COCO-SSD from CDN.

The app has two tabbed views:
1. **Live Demo** — real-time webcam object detection with a virtual shopping cart
2. **How It Works** — an illustrated explainer doc with timeline, pipeline diagram, and CV theory

## Done looks like
- A single `index.html` file is served by the react-vite artifact's Vite dev server (replacing the scaffold's index.html and removing all React boilerplate)
- Opening the preview shows the SmartCart Vision UI — two tabs ("▣ Live Demo" and "◈ How It Works") with a dark monospace dashboard aesthetic
- On Live Demo: clicking "Start Camera" requests webcam access; bounding boxes with class + confidence % are drawn on a canvas overlay; a virtual cart on the right populates/depopulates as items enter/leave the frame; confidence threshold slider (30–90%) filters detections live; event log and stats (ms/frame, total detections, session time) are shown
- The cart maps these COCO classes to retail SKUs with emoji + price: bottle→Beverage $1.99 🧴, cup→Fountain Drink $2.49 🥤, banana→Banana $0.69 🍌, sandwich→Sandwich $5.49 🥪, donut→Donut $1.79 🍩, book→Book $12.99 📕, cell phone→Phone (not for sale) 📱; unknown objects get gray boxes, recognized retail items get green boxes
- Cart items animate in (slide-in) and out; the running total and item count update in real time
- On How It Works: a readable doc with (a) processing pipeline flow diagram, (b) confidence threshold as precision/recall operating point, (c) visual vertical CV history timeline (Hubel & Wiesel 1959–62 → Neocognitron 1980 → LeNet 1989–98 → AlexNet 2012 → SSD/YOLO 2015–16 → ViT/VLM 2020–2026), (d) how CNNs work (convolution, feature hierarchy, pooling, weight sharing), (e) CNNs vs human vision, (f) closing note on hybrid edge+cloud architecture
- Error states: clear message if model fails to load or camera permission is denied; "Start Camera" button is disabled until model is ready
- Responsive: two-column on desktop, single column on mobile
- Design: near-black background (#0a0e14), dark panels with subtle borders, bright green accent (#00e08a), amber alert color, monospace font throughout, rounded panels, pulsing "live" indicator dot, subtle radial gradient glows in background

## Out of scope
- Any backend server, database, or API calls
- Any React/Vue/Svelte components — pure HTML/CSS/JS only
- Video upload or server-side processing
- Actual checkout/payment flows

## Steps
1. **Scaffold the artifact** — Create a `react-vite` artifact at path `/` titled "SmartCart Vision". Then strip the React scaffold entirely: replace `index.html` with the full standalone implementation (all CSS and JS inline), remove all React source files that are no longer needed, and ensure Vite serves the static HTML at root.
2. **Core TF.js detection loop** — Load COCO-SSD via the two CDN script tags. On camera start, use `getUserMedia` with `facingMode: environment` (falling back to any camera). Run `model.detect(videoEl)` on each `requestAnimationFrame`, draw bounding boxes + labels on the overlaid canvas, track ms-per-frame, total detections, and session elapsed time.
3. **Virtual cart logic** — Implement debounce (item must appear for ~8 consecutive frames before adding) and presence timeout (~1.5 s after last detection before removing). Map the 7 specified COCO classes to SKU labels, emoji, and prices. Unknown classes get a gray box but do not enter the cart. Show running total, item count, and a slide-in animation on add.
4. **Event log + confidence slider** — Timestamped log entries for add/remove/system events styled with green/amber/dim colors. Range slider (30–90, default 60) filters detections by confidence; display current value next to the slider.
5. **"How It Works" explainer page** — Tab-switched (CSS display toggle, fade animation). Build the pipeline flow diagram as styled flex boxes with arrows, the vertical timeline with dot markers, and all the prose sections (CNN mechanics, human vs CNN, hybrid architecture closing note) using the doc styles from the attached reference HTML.
6. **Polish and error handling** — Show a clear overlay message if `getUserMedia` is rejected or the model throws. Keep the "Loading model…" badge until COCO-SSD resolves, then switch to "● Model ready". Ensure the layout is responsive (two-column → single column at ≤920 px viewport width). Add tasteful pulsing live indicator, radial gradient background glows, and smooth transitions throughout.

## Relevant files
- `attached_assets/checkout-vision-demo_1780923852043.html`
- `artifacts/mockup-sandbox/vite.config.ts`