# STYLE.md — Premier Geste · direction A « Bandeau » (validée 2026-11-22)

Source de vérité du style. Toute page nouvelle s'y conforme ; une dérive est
un défaut, pas une variation. Planche de référence :
`planches/planche-A-bandeau.html`.

## 1. Idée

Chaque consigne est un **panneau** : le titre d'étape est posé sur une bande
rouge pleine, en capitales condensées, lisible à 2 m dans la panique. Le geste
est montré par un **dessin au trait noir** sur aplats clairs. Une lumière en
biais (deux tons de gris) structure le fond. Un seul accent : le rouge secours.

## 2. Couleurs (tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--red` | `#E3262B` | Accent unique : bandes de titre, bouton d'appel, flèches de mouvement, plaie/brûlure, état « en cours » (lecture, battement) |
| `--ink` | `#161616` | Texte, contours d'illustration, bandes noires (étiquette d'urgence, bouton Écouter), barre de progression active |
| `--paper` | `#EEECE9` | Fond principal |
| `--light` | `#F8F7F5` | Face éclairée du fond (biais) |
| `--track` | `#D2CEC8` | Barre de progression inactive |
| `--white` | `#FFFFFF` | Boutons secondaires, puces « ne pas », corps des personnages |
| `--grey-rescuer` | `#CFCBC5` | Vêtements du sauveteur dans les illustrations |
| `--floor` | `#B9B4AD` | Ligne de sol des illustrations |
| `--object` | `#DAD6D0` | Objets (robinet, téléphone, défibrillateur) |
| `--water` | `#9CC9E8` | Eau (seule couleur hors palette, réservée à la brûlure) |

Fond d'écran : `linear-gradient(115deg, var(--light) 0 38%, var(--paper) 38%)`
— coupure nette, pas de dégradé doux.
Interdit : un 2e accent, des dégradés décoratifs, des ombres portées sur les
composants (le style est plat ; seul le cadre du téléphone a une ombre en planche).

## 3. Typographie

- Titres, boutons, étiquettes : **Barlow Condensed** (600/700), toujours en
  CAPITALES (`text-transform: uppercase`).
- Texte courant : **Barlow** (500 pour les consignes, 400 sinon).
- Échelle (écran 390 px de large) :

| Rôle | Police | Taille / interligne | Détail |
|---|---|---|---|
| Titre d'étape (bande rouge) | Barlow Condensed 700 | 42 / 1.08 | blanc sur `--red`, padding 0 10px, `box-decoration-break: clone` (chaque ligne a sa bande) |
| Bouton d'appel | Barlow Condensed 700 | 30 / 1 | blanc sur rouge, letter-spacing .03em |
| Compteur d'étape | Barlow Condensed 600 | 34 (chiffre actif) + 18 (« / 05 », opacité .55) | format `03 / 05` |
| Bouton Écouter | Barlow Condensed 700 | 24 | blanc sur `--ink` |
| Flèches ‹ › | Barlow Condensed 700 | 30 | |
| Bouton rythme | Barlow Condensed 700 | 20 | |
| Haut de page (« ‹ Urgences ») | Barlow Condensed 600 | 18, letter-spacing .04em | |
| Puces « ne pas » | Barlow Condensed 600 | 18 | barré rouge 3 px |
| Étiquette d'urgence | Barlow Condensed 600 | 15, letter-spacing .08em | blanc sur `--ink`, padding 6px 10px |
| Lecture auto | Barlow Condensed 600 | 15, letter-spacing .06em | opacité .7 ; activée = rouge, opacité 1 |
| Consigne | Barlow 500 | 19 / 1.35 | `--ink` |
| Libellé de tuile (accueil) | Barlow Condensed 700 | 19 / 1.05 | blanc sur bande rouge |
| Signe d'alerte (sous tuile) | Barlow 400 | 13, opacité .7 | |

## 4. Grille et espacements

- Écran de référence 390×844, marges latérales **20 px**, zone haute 58 px
  (encoche/barre d'état).
- Colonne unique en flex vertical ; l'illustration prend l'espace restant
  (`flex: 1`, hauteur max 232 px).
- Espacements verticaux : 12 px entre blocs, 6 px dans la barre de progression,
  8 px entre boutons.
- Le bouton d'appel est **pleine largeur, collé en bas** (déborde des marges :
  `margin: 0 -20px`), hauteur 76 px, toujours visible sur toutes les pages
  du parcours d'urgence.
- Cibles tactiles ≥ 60 px de haut pour les actions principales.
- Rayon : **0 partout** (angles droits = signalétique). Seule exception :
  points ronds (pastille d'appel).

## 5. Composants

1. **Barre haute** : « ‹ Urgences » à gauche (retour accueil), compteur
   `03 / 05` à droite.
2. **Barre de progression** : segments égaux de 6 px de haut, gap 6 px ;
   faits + en cours = `--ink`, à venir = `--track`. Un segment touché = aller à
   l'étape.
3. **Étiquette d'urgence** : bande noire, nom de l'urgence en capitales.
4. **Illustration** : SVG 240×180 (cf. §7), centrée.
5. **Titre d'étape** : bande(s) rouge(s), cf. §3.
6. **Consigne** : 1 à 3 lignes, phrases impératives courtes.
7. **Puces « ne pas »** : fond blanc, mot barré d'un trait rouge 3 px.
8. **Bouton rythme** (étapes de massage) : contour noir 3 px sur blanc,
   « ▶ RYTHME 110 / MIN » ; actif = fond noir « ■ STOP RYTHME » ; à chaque
   battement le bouton passe rouge 140 ms et l'illustration grossit à 1.025.
9. **Contrôles** : grille `64px 1fr 64px` : ‹ (blanc, contour noir 3 px) —
   « ▶ ÉCOUTER » (fond noir) — › ; désactivés à opacité .25. Pendant la
   lecture : bouton rouge, libellé « PAUSE » précédé d'un égaliseur
   3 barres animées (4 px de large, 4→20 px de haut, 0,7 s, décalages 0/.2/.4 s).
10. **Lecture auto** : bascule texte « ○ LECTURE AUTO » / « ● LECTURE AUTO
    ACTIVÉE » (rouge).
11. **Bouton d'appel** : bande rouge pleine largeur, pastille blanche 14 px avec
    halo `0 0 0 5px rgba(255,255,255,.3)`, « APPELER LE 15 ».
12. **Tuile d'urgence** (accueil) : fond biais `linear-gradient(115deg,
    var(--light) 0 45%, #E4E1DC 45%)`, illustration, libellé sur bande rouge,
    signe d'alerte dessous ; survol/focus = contour noir 3 px.

## 6. Mouvement

- Battement métronome : 545 ms (110/min), effet 140 ms, aucune transition
  longue.
- Eau qui coule (brûlure) : tirets animés en continu.
- Onde d'impulsion autour des mains (massage) : seulement quand le rythme
  est actif.
- `prefers-reduced-motion: reduce` → toutes les animations coupées (le bip
  sonore reste).

## 7. Illustrations

- Une seule géométrie SVG (viewBox `0 0 240 180`) pour 11 dessins : `rcp`,
  `etouf`, `dos`, `hemo`, `pls`, `brul`, `avc`, `conv`, `mal`, `call`, `dae`.
- Personnages = traits épais à bouts ronds **doublés d'un contour noir**
  (trait noir de largeur +6 dessous, trait de couleur dessus) ; têtes et
  mains = cercles blancs contour noir 3 px.
- Victime en blanc, sauveteur en gris `#CFCBC5`, mouvement (flèches, ondes,
  zigzags) en rouge 4 px.
- Pas de visage réaliste, pas de couleur de peau : silhouettes neutres.

## 8. Voix et ton

- Tutoiement interdit : vouvoiement impératif (« Appuyez », « Allongez-la »).
- Titre d'étape ≤ 4 mots si possible ; consigne ≤ 2 phrases.
- Audio = exactement le texte affiché (titre + consigne + « Ne pas : … »),
  voix féminine française, débit légèrement lent.
