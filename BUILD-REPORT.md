# Build report — First Aid ("Banner" style)

Date: 2026-11-22. Location: `premier-geste/app`. Source prompt: `PROMPT-APP-BANDEAU.md`.

Design provenance: archived Claude session "Visuels app premiers gestes de secours" (2026-11-22, `local_b34a730f-859c-4be6-a54a-e2e68ddbc10b`, `claude-opus-5-5`), whose deliverable was exactly `G-DESIGN/STYLE.md` + `G-DESIGN/planches/planche-A-bandeau.html` + the build prompt. No newer version of the design was found; this source is the one that was reproduced, compared, and visually validated (`reports/comparaison-guide.png`). This pre-event design work and the build prompt are credited to Claude; implementation, English translation, and verification during the event were assisted by OpenCode.

## Done

- Vite + TypeScript PWA, no framework, 4 pages: home, guide, call, fact sheets.
- Content carried over strictly from `data.js` (8 emergencies, 33 steps) and `illus.js` (11 SVGs) — no instruction was rewritten.
- Locked style (§6.2) transcribed into `src/style.css`: tokens, red banner, light bias, self-hosted Barlow/Barlow Condensed, 0 rounded corners except the status dot.
- Audio: 33 mono 64 kb/s mp3 files in `public/audio/`, file → speech-synthesis fallback engine (`fr-FR`, 0.95, female FR voice preferred), a single global voice, autoplay preference saved in `localStorage`.
- WebAudio metronome 1050 Hz / 70 ms / 545 ms (110/min) with scheduling on `AudioContext.currentTime` (25 ms lookahead, 100 ms horizon), 25 ms vibration, 140 ms visual effect, stopped outside the `metro` step.
- Navigation: ‹ ›, clickable segments, touch swipe, keyboard arrows, URL `#/guide/<id>/<n>` resuming the step on reload, `aria-live="polite"`.
- `tel:15` on all pathway pages; 112 and 18 as `tel:`, 114 as `sms:`; geolocation on tap only.
- Wake lock acquired on entering the guide, released on exit.
- Workbox service worker: 55 precached files (2.2 MB), including the 33 audio files and 14 woff2 files — works in airplane mode after a first visit.
- Installable manifest (name, `theme_color` `#E3262B`, `background_color` `#EEECE9`, `standalone`, portrait, white cross icon on a square red background with right angles).
- "Demonstration version — content under review" banner on fact sheets.
- Scripts: `npm run audio` (regenerates the 33 mp3 files from WAV), `npm run capture` (screenshots + comparison), `npm run verify`.

## Verified

| Criterion §6.0 | Result |
|---|---|
| Guide identical to mockup A at 390×844 | Yes — `reports/comparaison-guide.png` |
| Home, Call, Fact sheets consistent with the style | Yes — `reports/accueil.png`, `appel.png`, `fiches.png`, `fiche-rcp.png` |
| Audio file + fallback, single voice, autoplay saved | File and persistence verified in E2E; fallback verified by code review |
| Metronome stable at 110/min, vibration, stop outside massage | Pure logic tested (9 tests), stop verified in E2E |
| `tel:15` everywhere; 114 as `sms:` | Yes — E2E test on 6 screens |
| Airplane mode after first visit; installable | Yes — offline E2E test; Lighthouse PWA 100 |
| Tests green, build green, Lighthouse | `tsc` 0 errors; 25 unit tests; 8 E2E; build 636 ms; Lighthouse 12: perf 99 / a11y 100 / best practices 100; Lighthouse 11: PWA 100 |

Screenshots: `app/reports/`. Lighthouse reports: `app/reports/lighthouse.json`, `lighthouse-pwa.json`.

## Not verified / reservations

- **Speech-synthesis fallback**: the fallback path could not be triggered under real conditions (all mp3 files exist); covered by code review and cancellation-logic tests only.
- **Real vibration and wake lock**: require a physical device; APIs absent from the test browser.
- **Acoustic measurement of the metronome**: interval and scheduling tested, audio output not measured with a microphone.
- **Installation on a phone**: the manifest is valid and the PWA score is 100; manual installation was later confirmed on a phone connected via ADB (Chrome offered "Install app" and the installation succeeded).
- **System font size at 130%**: the locked style imposes px sizes; browser zoom works, system font enlargement was not tested.
- **Medical validation**: content not reviewed by a PSC1 instructor — demonstration banner in place.
- **Accepted visual gap**: the mockup renders an inner screen of 368×822 (phone frame 390×844), the app fills 390×844; the title "MASSEZ FORT ET VITE" fits on one line instead of two. Everything else is superimposable.
- `data.js` also contains a `no` field on `conv-2` (not mentioned in the prompt): kept as-is, single source respected.

## Git

Public repository `GaiaSG94/premier-geste`, branch `main`: commits `17e6941`, `1b7ceef`, `994c72c` (plus a final commit to come). Automatic deployment to GitHub Pages via `.github/workflows/deploy-pages.yml`.
