# DESIGN.md — Premier Geste (app premiers secours)

## V1 — 2026-11-22 — 3 directions sur la page principale

Page principale (cf. `PAGES.md`) : **Guide pas à pas**. Chaque étape =
image (illustration du geste) + texte (titre + consigne) + audio.

Planches (ouvrir `planches/index.html` via un serveur local, cf. plus bas) :

| Planche | Direction | Ref | En une phrase |
|---|---|---|---|
| A | Bandeau | Concept Studio | Signalétique : bandes rouges, capitales condensées, dessin au trait |
| B | Tuiles | LogoPoint | Tuiles douces flottantes, étapes voisines autour, pilule noire d'appel |
| C | Relief | Flow Computing | Monochrome, gestes en relief, appel en onglet vertical noir |

Commun aux 3 (source unique, `planches/shared/`) :
- `data.js` — 8 urgences, 33 étapes (texte affiché = texte lu).
- `illus.js` — 11 illustrations SVG (8 urgences + dos, appel, défibrillateur),
  une géométrie, repeinte par chaque direction via variables CSS.
- `guide.js` — navigation, lecture auto, métronome 110/min (WebAudio),
  audio : `audio/<urgence>-<étape>.wav` puis repli synthèse du navigateur.
- `gen-audio.ps1` — régénère les 33 WAV (voix Windows Hortense, FR féminine).
  À remplacer par Kokoro (même nommage) pour la version finale.

Recommandation : **B (Tuiles)** comme base — la plus rassurante, l'appel du 15
reste l'élément le plus contrasté, coût d'intégration CSS pur. Emprunt
possible à A : le titre d'étape en capitales condensées pour la lisibilité.

Points ouverts :
- Contenu médical à faire relire par un formateur PSC1 avant diffusion.
- Format téléphone retenu car demandé (« une app ») ; aucun hackathon
  rattaché pour l'instant → pas de `CRITERES.md`.

Aperçu local : `python -m http.server 8765 --directory planches` puis
`http://localhost:8765/` (l'audio et les polices ont besoin d'un serveur).

### Changelog V1
- Création : PAGES.md, REFS.md, 3 planches, jeu d'illustrations, 33 audios.

## V1.1 — 2026-11-22 — style A « Bandeau » retenu par Gaia

- Style formalisé dans `STYLE.md` (tokens, typo, grille, 12 composants,
  mouvement, illustrations, ton).
- Pages 2-4 (Accueil, Appel, Fiches) non dessinées en planche : décrites dans
  le prompt de build, à produire dans la continuité stricte de `STYLE.md`.
- Prompt de build autonome : `../PROMPT-APP-BANDEAU.md`, généré par
  `node build-prompt.js` depuis `prompt-app-tete.md` + `STYLE.md` + sources
  (à régénérer après toute modification de ces fichiers).
