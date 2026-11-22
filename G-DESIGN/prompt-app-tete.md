# PROMPT — Construire l'app « Premier Geste » (style Bandeau verrouillé)

> Prompt autonome : tout ce qu'il faut est dans ce fichier (spécification,
> style, contenu, illustrations, moteur de référence). Langue de l'app :
> français. Langue de travail : français.

## 0. Ton rôle

Tu construis une **app web installable (PWA), pensée téléphone, qui marche
hors ligne**, à partir d'un design **validé et verrouillé**. Tu ne crées
aucune nouvelle direction visuelle : tu intègres le style « Bandeau » décrit
en §6.2 et montré par la planche de référence (§6.4), au pixel près sur la page
principale, et dans sa continuité stricte sur les autres pages.

## 1. Le produit

« Premier Geste » guide un témoin, pas à pas, pendant une urgence. Chaque
étape = **image** (dessin du geste) + **texte** (titre + consigne) + **audio**
(consigne lue à voix haute, mains libres). 8 urgences, 33 étapes (§6.1).
Public : n'importe qui, stressé, sans formation. Règle d'or : **le bouton
« Appeler le 15 » est visible sur chaque écran du parcours d'urgence.**

## 2. Pages (4)

| # | Route | Page | Contenu |
|---|---|---|---|
| 1 | `#/` | **Accueil « Quelle urgence ? »** | Barre haute : mot-symbole « PREMIER GESTE » (Barlow Condensed 700, 18 px). Titre sur bande rouge « QUELLE URGENCE ? » (style du titre d'étape). Grille **2 colonnes** de 8 tuiles d'urgence (STYLE §5.12), ordre de `data.js`. Lien « Que dire au téléphone ? » → page 3. En bas : bande rouge pleine largeur « APPELER LE 15 » ; au-dessus, rangée de 3 boutons blancs contour noir 3 px : « 112 », « 18 », « 114 SMS ». |
| 2 | `#/guide/<id>/<n>` | **Guide pas à pas** (page principale) | Exactement la planche A (§6.4) : barre haute, progression, étiquette, illustration, titre en bandes, consigne, puces « ne pas », bouton rythme si `metro`, contrôles ‹ ÉCOUTER ›, lecture auto, bande d'appel. « ‹ Urgences » = retour accueil. |
| 3 | `#/appel` | **Appeler les secours** | Bandes noires cliquables (une par numéro, `tel:`) : 15 SAMU · 18 Pompiers · 112 Urgence européenne · 114 SMS (sourds et malentendants, `sms:114`). Encadré « Dites : » en 4 lignes numérotées : 1. QUI vous êtes · 2. OÙ, adresse exacte · 3. QUOI, ce que vous voyez · 4. Ne raccrochez pas le premier. Bouton « MA POSITION » : Geolocation **uniquement au clic**, affiche lat/long en grand (Barlow Condensed 34) + bouton Copier. Bande d'appel en bas. |
| 4 | `#/fiches` et `#/fiches/<id>` | **Fiches (apprendre à froid)** | Liste des 8 urgences (lignes : illustration 64 px + nom sur bande rouge + signe). Fiche = toutes les étapes à la suite (numéro, illustration, titre en bande, consigne, puces), bouton « Écouter » par étape, pas de métronome. Pied : « Ne remplace pas une formation aux premiers secours (PSC1). En cas de doute, appelez le 15. » Accès : lien discret en bas de l'accueil. |

Pas d'autre page. Pas de compte, pas de pistage, pas d'appel réseau en
dehors du chargement initial.

## 3. Comportements (référence : `guide.js` §6.3, à porter en TypeScript)

- **Audio** : jouer `audio/<id>-<n>.<ext>` ; si absent ou en erreur → synthèse
  vocale du navigateur (`fr-FR`, voix féminine si dispo : Hortense, Julie,
  Amélie, Audrey, Denise…, débit 0,95). Une seule voix à la fois dans toute
  l'app. Changer d'étape coupe la voix.
- **Lecture auto** : activée, chaque nouvelle étape est lue dès l'arrivée.
  État mémorisé (`localStorage`, lecture/écriture sous try/catch).
- **Métronome** (étapes `metro: true`) : bip WebAudio 1050 Hz, 70 ms, toutes
  les **545 ms** (110/min) ; `navigator.vibrate(25)` à chaque battement si
  dispo ; effet visuel STYLE §5.8. Arrêt automatique en quittant une étape
  non-`metro`. Le minuteur doit rester stable (planifier sur
  `AudioContext.currentTime`, pas seulement `setInterval`).
- **Écran allumé** : `navigator.wakeLock.request('screen')` sur le guide,
  relâché en le quittant (ignorer si non supporté).
- **Navigation** : boutons ‹ ›, segments de progression, **balayage**
  gauche/droite sur l'illustration, flèches clavier. L'URL reflète l'étape
  (un rechargement reprend au même endroit). `aria-live="polite"` sur le
  bloc titre + consigne.
- **Appel** : la bande « APPELER LE 15 » est un vrai lien `tel:15`.
- **Hors ligne** : service worker qui précharge tout (HTML, JS, CSS,
  polices, audios). Polices Barlow / Barlow Condensed **auto-hébergées**
  (woff2), pas de Google Fonts à l'exécution.
- **Installable** : manifest (nom « Premier Geste », `theme_color` `#E3262B`,
  `background_color` `#EEECE9`, icône : croix blanche sur carré rouge, angles
  droits), `display: standalone`, orientation portrait.

## 4. Audio — fichiers

- 33 fichiers, nommage `<id>-<n>` (n commence à 1), texte lu = `t + ". " + x`
  (+ `" Ne pas : " + no.join(", ") + "."` si `no`).
- Production : voix **Kokoro** (TTS local, voix française féminine
  `ff_siwis`) ; à défaut, le script Windows fourni (§6.5, voix Hortense).
- Sortie en **.mp3 ou .ogg mono 64 kb/s** (les .wav bruts font ~10 Mo) :
  convertir avec ffmpeg ; le moteur choisit l'extension disponible.
- Un script `npm run audio` régénère tout depuis `data.js` (source unique :
  jamais de texte audio écrit ailleurs).

## 5. Contraintes

- **Style** : §6.2 fait foi. Interdits : 2e couleur d'accent, angles
  arrondis, ombres sur les composants, dégradés doux, autre police, icônes
  d'une bibliothèque (tout est en SVG maison ou en caractères ‹ › ▶ ■ ● ○).
- **Contenu** : `data.js` (§6.1) est la source unique et ne se réécrit pas.
  Tu n'inventes aucune consigne médicale. Le contenu doit être relu par un
  formateur PSC1 avant publication : laisse un bandeau « Version de
  démonstration — contenu en cours de validation » dans la page Fiches.
- **Illustrations** : réutilise `illus.js` (§6.1) tel quel (porté en module
  TS si besoin) et ses règles CSS (§6.3) — pas de redessin.
- **Code** : Vite + TypeScript, sans framework (ou Preact si un état
  complexe l'impose) ; fichiers < 500 lignes, fonctions < 50 lignes ;
  aucun secret, aucune clé.
- **Accessibilité** : contrastes AA (le blanc sur `#E3262B` n'est permis
  qu'en ≥ 19 px gras, ce qui est le cas des bandes) ; tous les boutons
  libellés ; `prefers-reduced-motion` respecté ; police agrandie du système
  supportée sans casse jusqu'à 130 %.
- **Tests** : unitaires (état du guide : bornes, arrêt métronome, URL ↔
  étape ; intégrité des données : chaque étape a `t` et `x`, chaque `il`
  existe, 33 fichiers audio présents) + un test de bout en bout (Playwright)
  : accueil → arrêt cardiaque → étape 3 → rythme → suivant → retour.
- **Git** : commits scopés (`git add -- <chemins>`, jamais `git add -A`).

## 6.0 Critères de fini (à cocher dans ton rapport)

- [ ] Guide pas à pas identique à la planche A à 390×844 (capture côte à côte jointe).
- [ ] Accueil, Appel, Fiches dans la continuité stricte du style (captures jointes).
- [ ] Audio fichier + repli synthèse, une seule voix à la fois, lecture auto mémorisée.
- [ ] Métronome 110/min stable, vibration, arrêt hors étape massage.
- [ ] `tel:15` partout dans le parcours d'urgence ; 114 en `sms:`.
- [ ] Fonctionne en mode avion après une première visite ; installable.
- [ ] Tests verts, build vert, Lighthouse PWA + accessibilité ≥ 90.
- [ ] Rapport final : fait / vérifié / non vérifié.

---

# 6. Fichiers de référence (copie exacte, ne pas modifier sans raison)
