# Submission — First Aid

Project: **First Aid** (formerly "Premier Geste"), an offline first-aid guidance PWA (8 emergencies / 33 steps).
Repository: https://github.com/GaiaSG94/premier-geste (branch `main`).
Public demo: https://gaiasg94.github.io/premier-geste/

This document addresses each submission requirement explicitly.

## 1. Submit before the published deadline

**Status: Complied (ready; final submission pending).**

No specific published deadline was found in the provided materials; the project is complete and ready to submit now, to be submitted before the event's published deadline. The final submission on the competition platform must be made by the project owner.

Evidence: build complete and verified (`npm run verify` green); public demo live; documentation in this repository.

## 2. Distinguish work completed during the event from pre-existing code, templates, or assets

**Status: Complied.**

Pre-existing (design phase, archived Claude session "Visuels app premiers gestes de secours", 2026-11-22):
- `PROMPT-APP-BANDEAU.md`
- `G-DESIGN/` — `STYLE.md`, `DESIGN.md`, `PAGES.md`, `REFS.md`, mockups A/B/C, `shared/data.js`, `illus.js`, `guide.js`, `base.css`, `gen-audio.ps1`
- The 33 source WAV files in `G-DESIGN/planches/audio/`

Completed during the event (this session):
- The entire `app/` folder (Vite project, English translation, CSS style, audio/metronome engine, router, 4 pages, PWA/service worker, manifest, icons, self-hosted fonts, mp3 conversion, tests, screenshots)
- `.github/workflows/deploy-pages.yml`
- `README.md`, `SUBMISSION.md`, `BUILD-REPORT.md`
- Commits `17e6941` (initial build), `1b7ceef` (Pages workflow), `994c72c` (English UI) and a final commit for the English content, submission documentation and regenerated screenshots

Evidence: file layout above; `BUILD-REPORT.md`.

## 3. Credit external libraries, datasets, assets, and AI-assisted work

**Status: Complied.**

- Libraries: Vite, TypeScript, Vitest, Playwright, vite-plugin-pwa / Workbox (MIT).
- Fonts: Barlow and Barlow Condensed (Google Fonts, SIL Open Font License 1.1), self-hosted woff2 files.
- Audio tooling: FFmpeg for audio conversion; the French voice was generated locally with Windows built-in speech synthesis (Hortense) via `G-DESIGN/planches/shared/gen-audio.ps1`, with no third-party service.
- Illustrations: original SVGs produced during the design phase (`illus.js`); no stock photos.
- Datasets: none — no external data or third-party dataset used.
- AI-assisted work (documented openly): design and build prompt assisted by Claude (`claude-opus-5-5`); implementation, English translation, and verification assisted by OpenCode (parallel sub-agents).

Evidence: `README.md` "Credits", `BUILD-REPORT.md`.

## 4. Use materials you have permission to use

**Status: Complied.**

Fonts are OFL-licensed (redistribution permitted); audio was generated locally; SVGs are original; no restrictively licensed content is included; no secrets are present.

Evidence: font license note in `README.md`; credits in section 3.

## 5. Do not expose passwords, API keys, private information, or confidential data

**Status: Complied.**

No password, API key, token, or private data appears in the repository. A diff scan was performed before the first commit (`ghp_`, `gho_`, `sk-`, `api_key`, `password`, `BWS_ACCESS_TOKEN`, `AIVEN_AUTH_TOKEN`: 0 results). `.gitignore` excludes `node_modules`, `dist`, `test-results`, and Playwright reports.

## 6. Make the demonstration accessible to the judges and explain any setup requirements

**Status: Complied.**

- Public HTTPS demo: https://gaiasg94.github.io/premier-geste/
- Auto-deployed by `.github/workflows/deploy-pages.yml` on every push to `main`; no manual deployment needed for judges.
- Installation: on Chrome for Android, open the browser menu → "Install app"; on Safari on iOS, tap Share → "Add to Home Screen".
- The service worker caches the app (including all audio and fonts) so it works offline after a first visit — judges can open it once while online, then use it in airplane mode.
- Location permission is requested only when the user taps the location action; it is never requested on load.
- Local setup requirements: `cd app && npm install && npm run dev`; verify with `npm run verify`; Node 22+ recommended. `npm run audio` regenerates the 33 mp3 files; `npm run capture` regenerates screenshots.
