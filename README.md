# SmartCart Checkout — Edge CV Prototype

A browser-based prototype of **checkout-free retail computer vision**. A pre-trained convolutional neural network (COCO-SSD / MobileNet v2) runs **entirely on-device** via TensorFlow.js — no video ever leaves the device — detecting items in real time and maintaining a virtual cart as products enter and leave the frame.

Built as a PM/engineering portfolio piece to demonstrate the key technical tradeoffs in real-world autonomous-checkout systems (Amazon Go, Zippin, etc.).

---

## Live Demo

> Deploy this project on [Replit](https://replit.com) to get a live URL — click **Deploy** and your app will be available at a `.replit.app` domain.

**Source & portfolio:** [github.com/mohamed-mattar/smartcart-checkout](https://github.com/mohamed-mattar/smartcart-checkout)

---

## What It Does

Hold everyday objects up to your webcam — a bottle, cup, phone, book, banana — and watch them appear in a virtual cart with running totals. Remove them from frame and they disappear automatically, mirroring how a real checkout-free store works.

### Two Modes

| Mode | Behaviour |
|------|-----------|
| **Cart Mode** (default) | Items accumulate. Each new detection of an item class increments its quantity. Removing an object from frame for a sustained period removes it from the cart. |
| **Scanner Mode** | Single-shot: each detection adds the item once and the model pauses until you explicitly scan again. Useful for demonstrating controlled item registration. |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Single-file HTML app, vanilla JS, CSS custom properties |
| ML Model | [COCO-SSD v2.2.3](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) (MobileNet v2 backbone) via [TensorFlow.js 4.20](https://www.tensorflow.org/js) |
| Dev server | [Vite 6](https://vite.dev) |
| API server | [Express 5](https://expressjs.com) + [esbuild](https://esbuild.github.io) bundle |
| Database | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| Validation | [Zod v4](https://zod.dev) |
| Package manager | [pnpm](https://pnpm.io) workspaces |
| Runtime | Node.js 24, TypeScript 5.9 |

---

## Repository Structure

```
smartcart-checkout/
├── artifacts/
│   ├── smartcart-vision/      # Vite frontend (index.html is the full app)
│   │   ├── index.html         # Single-file app — camera, CV, cart, privacy tab
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── api-server/            # Express analytics + security API
│       ├── src/
│       │   ├── app.ts         # Security headers, rate limiting, CORS
│       │   ├── index.ts       # Startup migrations, server bootstrap
│       │   └── routes/
│       │       ├── analytics.ts   # POST /api/analytics/event
│       │       └── health.ts      # GET /api/health
│       └── package.json
├── lib/
│   └── db/                    # Drizzle schema (activity_log, user_log)
├── pnpm-workspace.yaml
└── package.json
```

---

## Running Locally

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm i -g pnpm`)
- A PostgreSQL database (local or cloud)

### Steps

```bash
# 1. Clone
git clone https://github.com/mohamed-mattar/smartcart-checkout.git
cd smartcart-checkout

# 2. Install dependencies
pnpm install

# 3. Set environment variables
cp .env.example .env
# Edit .env and set DATABASE_URL to your PostgreSQL connection string

# 4. Push the database schema
pnpm --filter @workspace/db run push

# 5a. Start the frontend (root shortcut)
pnpm dev                                            # Frontend → http://localhost:5173

# 5b. Start the API server (separate terminal)
pnpm --filter @workspace/api-server run dev         # API      → http://localhost:8082
```

Then open `http://localhost:5173` in your browser and grant camera permission.

> **Note:** `pnpm dev` starts only the Vite frontend. The API server (analytics) must be started separately in a second terminal. Both are optional for the core camera demo — the frontend works standalone without the API.

> **Note:** The ML model (~8 MB) loads from the TensorFlow.js CDN on first visit. Subsequent loads use the browser cache.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (`postgres://user:pass@host:5432/db`) |
| `PORT` | ✅ (auto in Replit) | Port for the API server |
| `ALLOWED_ORIGINS` | optional | Comma-separated list of allowed CORS origins for the API |

---

## Key Design Decisions

- **On-device inference** — COCO-SSD runs in WebGL via TensorFlow.js. No video frames leave the browser. This mirrors the privacy-first architecture of production systems where raw video is processed locally and only structured signals (object class + confidence + timestamp) are sent upstream.

- **COCO-SSD as a stand-in** — A production retail system would use a domain-specific model trained on SKU imagery. COCO's 80 generic classes (bottles, cups, phones, bananas, etc.) are enough to demonstrate the detection → cart → reconciliation pipeline without requiring proprietary training data.

- **Confidence threshold as a business control** — The adjustable threshold (30–90%) is the operating point on the precision/recall curve. Lowering it catches more items but adds false positives (shrink risk). This is deliberately exposed in the UI as a PM decision, not buried as a hyperparameter.

- **Privacy by design** — Session IDs are random UUIDs stored in `sessionStorage` (cleared on tab close, never persisted server-side beyond a rolling 90-day window). No PII, no video, no biometrics are collected.

- **Single-file frontend** — `index.html` is self-contained to make the demo trivially deployable anywhere (CDN, static host, Replit). The trade-off is that `unsafe-inline` is required in the CSP; splitting into separate JS/CSS files would allow a stricter policy.

---

## Analytics Events

The API server records anonymous session events to PostgreSQL:

| Event | Trigger |
|-------|---------|
| `session_start` | Page load |
| `camera_started` | User clicks "Start Camera" |
| `item_added` | First detection of a new item class |
| `scanner_mode_toggled` | Mode switch |
| `session_end` | `beforeunload` |

Rate limited to 60 events/min per IP. UA strings truncated to 200 chars. No IP address is stored.

---

## Privacy & Terms

See the **⚿ Privacy & Terms** tab in the live app for the full policy. Summary:

- Camera feed never leaves the device
- Session ID is a random UUID, not linked to any identity
- Analytics data auto-purges after 90 days
- No cookies, no third-party tracking

---

## License

MIT — see [LICENSE](LICENSE) for details.
