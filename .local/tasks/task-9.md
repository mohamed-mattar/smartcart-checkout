---
title: Upload to GitHub
---
# Upload to GitHub

## What & Why
Push the complete SmartCart Checkout codebase to a new GitHub repository so the owner has version control, a public portfolio piece, and a backup outside Replit.

## Done looks like
- A new GitHub repository named `smartcart-checkout` (or similar) exists under the owner's GitHub account
- The repo contains the full monorepo: `artifacts/smartcart-vision/`, `artifacts/api-server/`, workspace config files, and `.local/tasks/` documentation
- The repo has a well-written `README.md` at the root that describes the project, how to run it locally, a screenshot/demo link, and a note about the COCO-SSD model
- A `.gitignore` excludes `node_modules/`, `.env`, build output, and Replit-specific files that shouldn't be public
- The initial commit message is descriptive

## Out of scope
- CI/CD pipelines or GitHub Actions
- Making the repo a template or fork-able starter

## Steps
1. **GitHub integration** — Use the Replit GitHub integration (integrations skill) to connect the Replit project to a GitHub account and create a new repository.
2. **`.gitignore`** — Verify the existing `.gitignore` covers `node_modules/`, `.env*`, `dist/`, `.local/state/`, and Replit cache directories. Add any missing entries.
3. **`README.md`** — Write a project README at the repo root covering: what the app does, the tech stack (TF.js, COCO-SSD, Vite, Express, PostgreSQL), how to run locally (`pnpm install && pnpm dev`), a link to the live deployed app, and a brief explanation of the two modes (Cart Mode vs Scanner Mode).
4. **Initial push** — Commit all files and push to the `main` branch of the new repository.

## Relevant files
- `artifacts/smartcart-vision/index.html`
- `artifacts/api-server/src/app.ts`