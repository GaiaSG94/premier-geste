# Rapport de build — Premier Geste (style « Bandeau »)

Date : 2026-11-22. Lieu : `premier-geste/app`. Prompt source : `PROMPT-APP-BANDEAU.md`.

Provenance du design : session Claude archivée « Visuels app premiers gestes de secours »
(22/11, `local_b34a730f-859c-4be6-a54a-e2e68ddbc10b`, `claude-opus-5-5`) dont le livrable
est exactement `G-DESIGN/STYLE.md` + `G-DESIGN/planches/planche-A-bandeau.html` + le prompt
de build. Aucune version plus récente du design trouvée ; c'est bien cette source qui a été
reproduite, comparée et validée visuellement (`reports/comparaison-guide.png`).

## Fait

- PWA Vite + TypeScript, sans framework, 4 pages : accueil, guide, appel, fiches.
- Contenu strictement porté depuis `data.js` (8 urgences, 33 étapes) et `illus.js` (11 SVG) — aucune consigne réécrite.
- Style verrouillé §6.2 transcrit dans `src/style.css` : tokens, bande rouge, biais clair, Barlow/Barlow Condensed auto-hébergés, 0 angle arrondi sauf pastille.
- Audio : 33 mp3 mono 64 kb/s dans `public/audio/`, moteur fichier → repli synthèse vocale (`fr-FR`, 0.95, voix FR féminine prioritaire), une seule voix globale, lecture auto mémorisée en `localStorage`.
- Métronome WebAudio 1050 Hz / 70 ms / 545 ms (110/min) avec planification sur `AudioContext.currentTime` (lookahead 25 ms, horizon 100 ms), vibration 25 ms, effet visuel 140 ms, arrêt hors étape `metro`.
- Navigation : ‹ ›, segments cliquables, balayage tactile, flèches clavier, URL `#/guide/<id>/<n>` qui reprend l'étape au rechargement, `aria-live="polite"`.
- `tel:15` sur toutes les pages du parcours ; 112 et 18 en `tel:`, 114 en `sms:` ; géolocalisation au clic seulement.
- Wake lock à l'entrée du guide, relâché à la sortie.
- Service Workbox : 55 fichiers préchargés (2,2 Mo), dont les 33 audios et les 14 woff2 — fonctionne en mode avion après une première visite.
- Manifest installable (nom, `theme_color` `#E3262B`, `background_color` `#EEECE9`, `standalone`, portrait, icône croix blanche sur carré rouge à angles droits).
- Bandeau « Version de démonstration — contenu en cours de validation » sur les fiches.
- Scripts : `npm run audio` (régénère les 33 mp3 depuis les wav), `npm run capture` (captures + comparaison), `npm run verify`.

## Vérifié

| Critère §6.0 | Résultat |
|---|---|
| Guide identique à la planche A à 390×844 | Oui — `reports/comparaison-guide.png` |
| Accueil, Appel, Fiches dans la continuité du style | Oui — `reports/accueil.png`, `appel.png`, `fiches.png`, `fiche-rcp.png` |
| Audio fichier + repli, voix unique, lecture auto mémorisée | Fichier et mémorisation vérifiés en E2E ; repli vérifié par relecture du code |
| Métronome 110/min stable, vibration, arrêt hors massage | Logique pure testée (9 tests) et E2E arrêt vérifié |
| `tel:15` partout ; 114 en `sms:` | Oui — test E2E sur 6 écrans |
| Mode avion après 1re visite ; installable | Oui — test E2E hors ligne ; Lighthouse PWA 100 |
| Tests verts, build vert, Lighthouse | `tsc` 0 erreur ; 25 tests unitaires ; 8 E2E ; build 636 ms ; Lighthouse 12 : perf 99 / a11y 100 / best-practices 100 ; Lighthouse 11 : PWA 100 |

Captures : `app/reports/`. Rapports Lighthouse : `app/reports/lighthouse.json`, `lighthouse-pwa.json`.

## Non vérifié / réserve

- **Repli synthèse vocale** : le chemin de repli n'a pas pu être déclenché en conditions réelles (tous les mp3 existent) ; couverture par relecture du code et tests de la logique d'annulation uniquement.
- **Vibration et wake lock réels** : nécessitent un appareil physique ; API absente du navigateur de test.
- **Mesure acoustique du métronome** : intervalle et planification testés, sortie audio non mesurée au micros.
- **Installation sur téléphone** : manifest valide et score PWA 100, mais pas d'installation manuelle sur appareil.
- **Police système agrandie à 130 %** : le style verrouillé impose des tailles en px ; le zoom navigateur fonctionne, l'agrandissement de police du système n'a pas été testé.
- **Validation médicale** : contenu non relu par un formateur PSC1 — bandeau de démonstration en place.
- **Écart visuel assumé** : la planche rend un écran interne de 368×822 (cadre téléphone 390×844), l'app occupe 390×844 ; le titre « MASSEZ FORT ET VITE » tient sur une ligne au lieu de deux. Tout le reste est superposable.
- `data.js` contient aussi un champ `no` sur `conv-2` (non mentionné dans le prompt) : conservé tel quel, source unique respectée.

## Git

Aucun dépôt git dans `premier-geste` : aucun commit ni push effectué.
