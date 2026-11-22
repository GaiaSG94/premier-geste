# First Aid

A step-by-step first-aid guidance Progressive Web App (PWA) that works offline. Formerly named "Premier Geste". It covers **8 emergencies / 33 steps** in a deliberately locked-down "Banner" visual style (red `#E3262B`).

> Demonstration only — content requires PSC1 review; in an emergency call 15.

## Live demo

- Public HTTPS demo (GitHub Pages): https://gaiasg94.github.io/premier-geste/
- Source repository: https://github.com/GaiaSG94/premier-geste (branch `main`)
- The demo is deployed automatically by `.github/workflows/deploy-pages.yml` on every push to `main`.
- The app is installable: Chrome on Android offered "Install app", and installation was confirmed on a phone connected via ADB.

## Setup / development

Node 22+ is recommended.

```bash
cd app
npm install
npm run dev
```

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Typecheck and build the production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run the 25 Vitest unit tests |
| `npm run typecheck` / `npm run lint` | Run the TypeScript compiler check |
| `npm run e2e` | Run the 8 Playwright end-to-end tests |
| `npm run verify` | Full check: typecheck + tests + build + e2e |
| `npm run audio` | Regenerate the 33 mp3 files from the WAV sources |
| `npm run capture` | Regenerate screenshots and the mockup/product comparison |

Verified: 25 unit tests + 8 E2E tests passing, Vite build passing, Lighthouse 12 (performance 99 / accessibility 100 / best practices 100) and Lighthouse 11 (PWA 100). Screenshots and comparisons are in `app/reports/`.

## Repository structure

- `app/` — application source (Vite + TypeScript, no framework): `src/` (router, 4 pages, audio/metronome engine, state, styles), `public/` (audio, icons, manifest), `scripts/` (audio generation, capture), `tests/` and `e2e/`, `reports/`.
- `G-DESIGN/` — pre-event design phase: `STYLE.md`, `DESIGN.md`, `PAGES.md`, `REFS.md`, mockups A/B/C, shared data/illustration assets, and WAV audio sources.
- `PROMPT-APP-BANDEAU.md` — pre-event build prompt for the "Banner" style.
- `.github/workflows/deploy-pages.yml` — automatic GitHub Pages deployment.
- `README.md`, `SUBMISSION.md`, `BUILD-REPORT.md`, `STATUS.md` — English project and submission documentation.

Provenance is documented in `SUBMISSION.md` and `BUILD-REPORT.md`.

## Credits

Built with Vite, TypeScript, Vitest, Playwright, and vite-plugin-pwa / Workbox (MIT). Fonts Barlow and Barlow Condensed (Google Fonts, SIL Open Font License 1.1) are self-hosted as woff2. French audio voices were generated locally with Windows built-in speech synthesis (Hortense) via `G-DESIGN/planches/shared/gen-audio.ps1`, with no third-party service. SVG illustrations are original. Design and build prompt assisted by Claude; implementation, English translation, and verification assisted by OpenCode. See `SUBMISSION.md` for full credits.

## Font license

Barlow and Barlow Condensed are distributed under the SIL Open Font License 1.1; redistribution of the self-hosted woff2 files is permitted.

## Disclaimer

Demonstration only — content requires PSC1 review; in an emergency call 15.
