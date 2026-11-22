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

## 6.1 Contenu — data.js (8 urgences, 33 étapes)

`data.js`

```js
/* Premier Geste — contenu des 8 urgences (source unique texte + audio).
   t = titre d'étape (affiché + lu), x = consigne (affichée + lue),
   il = illustration (défaut : celle de l'urgence), metro = métronome 110/min,
   no = gestes à NE PAS faire (affichés barrés).
   Contenu aligné sur les recommandations grand public françaises
   (gestes qui sauvent / PSC1) — à faire relire par un formateur. */
window.URG = [
  { id: 'rcp', nom: 'Arrêt cardiaque', signe: 'Ne répond pas, ne respire pas', steps: [
    { t: 'Appelez le 15', x: 'Mettez le haut-parleur. Faites chercher un défibrillateur.', il: 'call' },
    { t: 'Allongez-la sur le dos', x: 'Sur un sol dur. Mettez-vous à genoux à côté de sa poitrine.' },
    { t: 'Massez fort et vite', x: 'Mains au centre de la poitrine, bras tendus. Enfoncez de 5 cm, au rythme du bip.', metro: true },
    { t: 'Le défibrillateur arrive', x: 'Allumez-le et suivez sa voix. Ne cessez de masser que lorsqu’il le demande.', il: 'dae' },
    { t: 'Ne vous arrêtez pas', x: 'Continuez jusqu’à l’arrivée des secours ou si elle se remet à respirer.', metro: true }
  ]},
  { id: 'etouf', nom: 'Étouffement', signe: 'Ne peut ni parler, ni tousser', steps: [
    { t: 'Elle tousse ?', x: 'Encouragez-la à tousser. Ne tapez pas dans le dos tant qu’elle tousse.' },
    { t: '5 claques dans le dos', x: 'Penchez-la en avant. Frappez fort entre les omoplates, avec le talon de la main.', il: 'dos' },
    { t: '5 compressions', x: 'Derrière elle, poing au creux de l’estomac. Tirez fort vers vous et vers le haut.' },
    { t: 'Alternez 5 et 5', x: 'Jusqu’à ce que ça sorte. Si elle perd connaissance : 15 et massage cardiaque.' }
  ]},
  { id: 'hemo', nom: 'Hémorragie', signe: 'Le sang coule abondamment', steps: [
    { t: 'Appuyez fort sur la plaie', x: 'Avec un tissu propre, ou la main protégée par un gant ou un sac.' },
    { t: 'Allongez-la', x: 'Gardez la pression sans relâcher, même pour regarder.' },
    { t: 'Faites appeler le 15', x: 'Ne lâchez pas la plaie. Donnez l’adresse exacte.', il: 'call' },
    { t: 'Couvrez-la', x: 'Elle ne doit pas avoir froid. Parlez-lui, surveillez qu’elle répond.' }
  ]},
  { id: 'pls', nom: 'Inconscient qui respire', signe: 'Ne répond pas mais respire', steps: [
    { t: 'Elle respire ?', x: 'Regardez son ventre et sa poitrine se soulever, pendant 10 secondes.' },
    { t: 'Tournez-la sur le côté', x: 'Bras proche à angle droit, son autre main contre sa joue, genou opposé plié : faites-la rouler vers vous.' },
    { t: 'Bouche vers le sol', x: 'Tête légèrement en arrière, bouche ouverte, pour qu’elle respire librement.' },
    { t: 'Appelez le 15', x: 'Puis vérifiez sa respiration jusqu’à l’arrivée des secours.', il: 'call' }
  ]},
  { id: 'brul', nom: 'Brûlure', signe: 'Peau rouge, cloque, douleur', steps: [
    { t: 'Refroidissez tout de suite', x: 'Eau tempérée, pendant au moins 10 minutes.' },
    { t: 'Retirez ce qui serre', x: 'Bagues, montre, vêtements autour. Sauf ce qui colle à la peau.' },
    { t: 'Grave ? Appelez le 15', x: 'Plus grande que sa paume, cloque, ou visage, mains, cou : appelez.', il: 'call' },
    { t: 'Ne mettez rien dessus', x: 'Ne percez pas les cloques.', no: ['glace', 'beurre', 'dentifrice'] }
  ]},
  { id: 'avc', nom: 'AVC', signe: 'Visage, bras, parole : VITE', steps: [
    { t: 'Visage', x: 'Demandez-lui de sourire : la bouche part-elle de travers ?' },
    { t: 'Inertie d’un bras', x: 'Demandez-lui de lever les deux bras : l’un retombe-t-il ?' },
    { t: 'Trouble de la parole', x: 'Faites-lui répéter une phrase simple : parle-t-elle mal ?' },
    { t: 'En urgence : 15', x: 'Un seul signe suffit. Notez l’heure du début.', il: 'call', no: ['boire', 'manger'] }
  ]},
  { id: 'conv', nom: 'Convulsions', signe: 'Secousses, ne répond plus', steps: [
    { t: 'Protégez sa tête', x: 'Un vêtement plié dessous. Écartez ce qui peut la blesser.' },
    { t: 'Ne la retenez pas', x: 'Laissez la crise passer.', no: ['tenir', 'rien dans la bouche'] },
    { t: 'Chronométrez', x: 'Plus de 5 minutes, ou crises qui se suivent : appelez le 15.', il: 'call' },
    { t: 'Après la crise', x: 'Mettez-la sur le côté et restez près d’elle.', il: 'pls' }
  ]},
  { id: 'mal', nom: 'Malaise', signe: 'Douleur, pâleur, sueurs', steps: [
    { t: 'Mettez-la au repos', x: 'Assise ou allongée, comme elle se sent le mieux.' },
    { t: 'Posez 3 questions', x: 'Depuis quand ? Douleur dans la poitrine ? Maladie ou traitement ?' },
    { t: 'Appelez le 15', x: 'Répétez ses réponses au médecin. Suivez ses conseils.', il: 'call' },
    { t: 'Restez avec elle', x: 'Si elle ne répond plus et ne respire plus : arrêt cardiaque.' }
  ]}
];
window.URG_BY_ID = Object.fromEntries(window.URG.map(u => [u.id, u]));
```


## 6.1 bis Illustrations — illus.js (11 dessins SVG)

`illus.js`

```js
/* Premier Geste — jeu d'illustrations des gestes (SVG, 240×180).
   Une seule géométrie ; chaque direction la peint via ses variables CSS
   (--il-ink, --il-v victime, --il-r sauveteur, --il-skin, --il-accent…).
   L = membre (trait épais + contour), H = tête, P = main, A = flèche. */
(function () {
  const L = (d, w, c) => `<path class="o" d="${d}" stroke-width="${w + 6}"/><path class="${c}" d="${d}" stroke-width="${w}"/>`;
  const H = (x, y, r = 13) => `<circle class="hd" cx="${x}" cy="${y}" r="${r}"/>`;
  const P = (x, y, r = 7) => `<circle class="hn" cx="${x}" cy="${y}" r="${r}"/>`;
  const AH = (x, y, deg) => `<path class="ah" d="M3 0 L-9 -6 L-9 6Z" transform="translate(${x} ${y}) rotate(${deg})"/>`;
  const A = (d, x, y, deg) => `<path class="mv" d="${d}"/>${AH(x, y, deg)}`;
  const FLOOR = '<line class="fl" x1="8" y1="163" x2="232" y2="163"/>';
  const LYING = H(36, 136) + L('M56 140 L132 140', 26, 'v') + L('M132 142 L214 148', 17, 'v');
  const BADGE = (t) => `<circle class="badge" cx="192" cy="48" r="26"/><text class="bt" x="192" y="56" text-anchor="middle">${t}</text>`;

  const D = {
    rcp: () => FLOOR
      + L('M128 108 L138 150 L182 156', 17, 'r')
      + LYING
      + L('M92 62 L128 108', 25, 'r') + L('M90 66 L85 116', 11, 'r')
      + P(84, 121, 8) + P(89, 118, 7) + H(100, 40)
      + '<circle class="mv pulse" cx="86" cy="122" r="18"/>'
      + A('M58 88 L58 112', 58, 116, 90),
    etouf: () => FLOOR
      + L('M96 110 L92 160', 16, 'r') + L('M104 110 L112 160', 16, 'r') + L('M98 56 L100 110', 24, 'r') + H(92, 34)
      + L('M136 110 L140 160', 16, 'v') + L('M128 110 L122 160', 16, 'v') + L('M142 58 L132 112', 26, 'v') + H(152, 38)
      + L('M146 64 L162 74 L156 58', 9, 'v') + P(155, 55, 6)
      + L('M102 64 L124 88 L134 92', 10, 'r') + P(137, 92, 8)
      + A('M160 116 Q166 96 152 84', 150, 82, -140),
    dos: () => FLOOR
      + L('M52 110 L48 160', 16, 'r') + L('M60 110 L66 160', 16, 'r') + L('M56 56 L56 110', 24, 'r') + H(54, 34)
      + L('M100 112 L104 160', 16, 'v') + L('M94 112 L88 160', 16, 'v') + L('M98 112 L146 80', 26, 'v') + H(166, 78)
      + L('M140 88 L148 122', 9, 'v') + P(148, 126, 6)
      + L('M60 62 L96 46 L118 70', 10, 'r') + P(120, 76, 8)
      + A('M90 26 Q116 26 124 50', 125, 55, 75),
    hemo: () => L('M20 128 L196 128', 34, 'sk') + P(208, 128, 19)
      + '<ellipse class="ac" cx="112" cy="116" rx="22" ry="6"/><circle class="ac" cx="104" cy="154" r="3.5"/><circle class="ac" cx="120" cy="160" r="2.5"/>'
      + '<rect class="pad" x="80" y="98" width="66" height="16" rx="5"/>'
      + L('M180 -4 L138 68', 30, 'r') + '<ellipse class="hn" cx="114" cy="86" rx="31" ry="13"/>'
      + A('M54 50 L54 80', 54, 86, 90) + A('M176 70 L176 92', 176, 98, 90),
    pls: () => FLOOR + H(40, 132)
      + L('M66 148 L64 160', 9, 'v')
      + L('M58 136 L136 138', 26, 'v') + L('M136 146 L216 150', 16, 'v') + L('M134 134 L172 106 L196 146', 16, 'v')
      + L('M70 128 L82 108 L52 122', 9, 'v') + P(48, 124, 6)
      + A('M104 84 Q134 58 164 78', 168, 81, 35),
    brul: () => '<rect class="objf" x="16" y="12" width="20" height="28" rx="5"/>'
      + L('M36 26 L96 26 L96 40', 14, 'tool')
      + '<rect class="wat" x="89" y="48" width="14" height="66" rx="7"/><path class="wl" d="M96 52 L96 108"/>'
      + L('M20 128 L186 128', 32, 'sk') + P(198, 128, 19)
      + '<ellipse class="ac" cx="96" cy="114" rx="24" ry="6"/><circle class="wat" cx="72" cy="104" r="4"/><circle class="wat" cx="122" cy="102" r="3"/>'
      + BADGE('10′'),
    avc: () => L('M138 166 L178 114', 12, 'v') + P(181, 109, 8)
      + '<path class="vf" d="M30 180 Q34 146 92 144 Q150 146 154 180Z"/>'
      + '<circle class="hd" cx="92" cy="86" r="54"/>'
      + '<circle class="ey" cx="72" cy="80" r="5"/><circle class="ey" cx="112" cy="84" r="5"/>'
      + '<path class="mo" d="M64 120 Q92 118 118 104"/>'
      + '<path class="bub" d="M164 14 h52 a10 10 0 0 1 10 10 v24 a10 10 0 0 1 -10 10 h-34 l-12 12 v-12 h-6 a10 10 0 0 1 -10 -10 v-24 a10 10 0 0 1 10 -10z"/>'
      + '<text class="bt bt-ink" x="190" y="44" text-anchor="middle">?!</text>',
    conv: () => FLOOR + '<rect class="pad" x="14" y="142" width="46" height="14" rx="7"/>' + LYING
      + '<path class="mv" d="M66 112 l8 -10 l8 10 l8 -10 l8 10"/><path class="mv" d="M146 118 l8 -10 l8 10 l8 -10 l8 10"/><path class="mv" d="M24 106 l6 -8 l6 8"/>'
      + BADGE('5′'),
    mal: () => FLOOR
      + L('M84 112 L80 50', 6, 'tool') + L('M84 112 L168 112', 6, 'tool') + L('M92 112 L92 160', 6, 'tool') + L('M160 112 L160 160', 6, 'tool')
      + L('M118 110 L164 112', 18, 'v') + L('M164 116 L168 158', 15, 'v') + L('M110 62 L116 108', 24, 'v') + H(106, 40)
      + L('M106 68 L126 92 L118 82', 9, 'v') + P(116, 80, 7)
      + '<path class="mv" d="M142 62 h10 l5 -12 l7 24 l5 -12 h12"/>',
    call: () => '<rect class="objf" x="80" y="16" width="80" height="146" rx="16"/><rect class="scr" x="88" y="32" width="64" height="108" rx="7"/>'
      + '<text class="bt bt-big" x="120" y="100" text-anchor="middle">15</text>'
      + '<path class="mv" d="M172 62 q12 24 0 48"/><path class="mv" d="M186 50 q22 36 0 72"/>'
      + '<path class="mv" d="M68 62 q-12 24 0 48"/><path class="mv" d="M54 50 q-22 36 0 72"/>',
    dae: () => L('M98 34 L98 20 L142 20 L142 34', 8, 'tool')
      + '<rect class="objf" x="46" y="34" width="148" height="116" rx="18"/>'
      + '<path class="ac" d="M120 122 C78 94 84 62 106 66 C114 68 118 74 120 79 C122 74 126 68 134 66 C156 62 162 94 120 122Z"/>'
      + '<path class="bolt" d="M126 68 L110 96 h12 l-6 22 l20 -32 h-12 l7 -18z"/>'
  };

  window.ILL = (id) => `<svg class="il il-${id}" viewBox="0 0 240 180" aria-hidden="true">${(D[id] || D.call)()}</svg>`;
  window.ILL_IDS = Object.keys(D);
})();
```


## 6.2 Style verrouillé — STYLE.md

### STYLE.md — Premier Geste · direction A « Bandeau » (validée 2026-11-22)

Source de vérité du style. Toute page nouvelle s'y conforme ; une dérive est
un défaut, pas une variation. Planche de référence :
`planches/planche-A-bandeau.html`.

#### 1. Idée

Chaque consigne est un **panneau** : le titre d'étape est posé sur une bande
rouge pleine, en capitales condensées, lisible à 2 m dans la panique. Le geste
est montré par un **dessin au trait noir** sur aplats clairs. Une lumière en
biais (deux tons de gris) structure le fond. Un seul accent : le rouge secours.

#### 2. Couleurs (tokens)

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

#### 3. Typographie

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

#### 4. Grille et espacements

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

#### 5. Composants

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

#### 6. Mouvement

- Battement métronome : 545 ms (110/min), effet 140 ms, aucune transition
  longue.
- Eau qui coule (brûlure) : tirets animés en continu.
- Onde d'impulsion autour des mains (massage) : seulement quand le rythme
  est actif.
- `prefers-reduced-motion: reduce` → toutes les animations coupées (le bip
  sonore reste).

#### 7. Illustrations

- Une seule géométrie SVG (viewBox `0 0 240 180`) pour 11 dessins : `rcp`,
  `etouf`, `dos`, `hemo`, `pls`, `brul`, `avc`, `conv`, `mal`, `call`, `dae`.
- Personnages = traits épais à bouts ronds **doublés d'un contour noir**
  (trait noir de largeur +6 dessous, trait de couleur dessus) ; têtes et
  mains = cercles blancs contour noir 3 px.
- Victime en blanc, sauveteur en gris `#CFCBC5`, mouvement (flèches, ondes,
  zigzags) en rouge 4 px.
- Pas de visage réaliste, pas de couleur de peau : silhouettes neutres.

#### 8. Voix et ton

- Tutoiement interdit : vouvoiement impératif (« Appuyez », « Allongez-la »).
- Titre d'étape ≤ 4 mots si possible ; consigne ≤ 2 phrases.
- Audio = exactement le texte affiché (titre + consigne + « Ne pas : … »),
  voix féminine française, débit légèrement lent.


## 6.3 Règles CSS des illustrations et du cadre — base.css

`base.css`

```css
/* Premier Geste — base commune des planches : illustrations + cadre de planche.
   Chaque direction redéfinit les variables --il-* et --b-* dans sa planche. */

/* ---------- Illustrations ---------- */
.il { width: 100%; height: auto; display: block; overflow: visible; }
.il .o, .il .v, .il .r, .il .sk, .il .tool, .il .mv, .il .mo, .il .wl { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.il .o { stroke: var(--il-o, var(--il-ink)); }
.il .v { stroke: var(--il-v); }
.il .r { stroke: var(--il-r); }
.il .sk { stroke: var(--il-skin); }
.il .tool { stroke: var(--il-obj); }
.il .hd, .il .hn { fill: var(--il-skin); stroke: var(--il-o, var(--il-ink)); stroke-width: var(--il-lw, 3); }
.il .ac, .il .ah { fill: var(--il-accent); }
.il .mv { stroke: var(--il-accent); stroke-width: 4; }
.il .pad, .il .bub { fill: var(--il-pad); stroke: var(--il-o, var(--il-ink)); stroke-width: var(--il-lw, 3); }
.il .objf { fill: var(--il-obj); stroke: var(--il-o, var(--il-ink)); stroke-width: var(--il-lw, 3); }
.il .badge { fill: var(--il-badge, var(--il-ink)); }
.il .vf { fill: var(--il-v); stroke: var(--il-o, var(--il-ink)); stroke-width: var(--il-lw, 3); }
.il .scr, .il .bolt { fill: var(--il-pad); }
.il .wat { fill: var(--il-water); }
.il .wl { stroke: var(--il-pad); stroke-width: 3; stroke-dasharray: 6 10; animation: pgFlow .6s linear infinite; }
.il .fl { stroke: var(--il-floor); stroke-width: 3; stroke-linecap: round; }
.il .ey { fill: var(--il-ink); }
.il .mo { stroke: var(--il-ink); stroke-width: 4; }
.il .bt { fill: var(--il-btxt, #fff); font: 700 21px/1 var(--il-font, system-ui, sans-serif); }
.il .bt-ink { fill: var(--il-ink); }
.il .bt-big { fill: var(--il-ink); font-size: 40px; }
.il .pulse { transform-box: fill-box; transform-origin: center; opacity: 0; }
.is-metro .il .pulse { animation: pgPulse .545s ease-out infinite; }

@keyframes pgPulse { 0% { opacity: .9; transform: scale(.5); } 100% { opacity: 0; transform: scale(1.5); } }
@keyframes pgFlow { to { stroke-dashoffset: -16; } }
@media (prefers-reduced-motion: reduce) { .il *, .phone * { animation: none !important; transition: none !important; } }

/* ---------- Planche (bureau, 1440) ---------- */
* { box-sizing: border-box; }
body { margin: 0; background: var(--b-bg); color: var(--b-ink); font-family: var(--b-font, system-ui, sans-serif); -webkit-font-smoothing: antialiased; }
.board { max-width: 1440px; margin: 0 auto; padding: 48px 56px 72px; }
.board-head { display: grid; grid-template-columns: 1.3fr 1fr; gap: 48px; align-items: end; margin-bottom: 40px; }
.board-kicker { font: 600 12px/1 ui-monospace, Consolas, monospace; letter-spacing: .14em; text-transform: uppercase; opacity: .6; margin: 0 0 14px; }
.board-meta { font-size: 14px; line-height: 1.55; opacity: .85; }
.board-meta b { font-weight: 700; }
.swatches { display: flex; gap: 8px; margin-top: 12px; }
.swatches i { width: 40px; height: 40px; border-radius: 10px; display: block; box-shadow: inset 0 0 0 1px rgba(0,0,0,.12); }
.phones { display: flex; gap: 40px; justify-content: center; align-items: flex-start; }
.phone-wrap { display: flex; flex-direction: column; gap: 14px; align-items: center; }
.phone-cap { font: 600 12px/1.3 ui-monospace, Consolas, monospace; letter-spacing: .06em; opacity: .65; text-align: center; max-width: 360px; }
.phone { width: 390px; height: 844px; border-radius: 54px; padding: 11px; background: #0d0d0d; box-shadow: 0 30px 60px -20px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.4); flex: none; }
.screen { position: relative; width: 100%; height: 100%; border-radius: 44px; overflow: hidden; background: var(--s-bg); color: var(--s-ink); }
.screen .notch { position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 110px; height: 32px; border-radius: 20px; background: #0d0d0d; z-index: 5; }
.toast { position: absolute; left: 50%; bottom: 120px; transform: translateX(-50%); background: #111; color: #fff; padding: 10px 16px; border-radius: 12px; font: 600 14px/1.2 system-ui, sans-serif; z-index: 9; white-space: nowrap; }
.strip-title { margin: 64px 0 18px; }
.strip { display: grid; grid-template-columns: repeat(8, 1fr); gap: 14px; }
.strip button { all: unset; cursor: pointer; display: flex; flex-direction: column; gap: 10px; }
.strip button:focus-visible { outline: 3px solid var(--b-ink); outline-offset: 4px; }
.notes { margin-top: 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; font-size: 14px; line-height: 1.55; }
.notes h3 { margin: 0 0 6px; font-size: 13px; text-transform: uppercase; letter-spacing: .1em; }
.notes p { margin: 0; opacity: .85; }
[data-a] { cursor: pointer; }
```


## 6.3 bis Moteur du guide (audio, métronome, navigation) — guide.js

`guide.js`

```js
/* Premier Geste — moteur du Guide pas à pas (commun aux 3 directions).
   Audio : synthèse vocale du navigateur (fr-FR, voix féminine si dispo),
   métronome WebAudio 110/min pour le massage cardiaque.
   Chaque direction fournit render(g) → HTML ; les boutons portent data-a. */
(function () {
  const hasTTS = 'speechSynthesis' in window;
  let voiceFR = null;
  function pickVoice() {
    const vs = speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang));
    voiceFR = vs.find(v => /denise|julie|hortense|am[eé]lie|audrey|marie|eloise|vivienne|female/i.test(v.name)) || vs[0] || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

  /* --- métronome (un seul pour toute la planche) --- */
  const metro = { ctx: null, timer: null, owner: null };
  function tick() {
    const c = metro.ctx, o = c.createOscillator(), gn = c.createGain();
    o.frequency.value = 1050;
    gn.gain.setValueAtTime(0.35, c.currentTime);
    gn.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
    o.connect(gn).connect(c.destination); o.start(); o.stop(c.currentTime + 0.07);
  }
  function metroStop() {
    clearInterval(metro.timer); metro.timer = null;
    const g = metro.owner; metro.owner = null; if (g) g.paint();
  }
  function metroStart(g) {
    metroStop();
    metro.ctx = metro.ctx || new (window.AudioContext || window.webkitAudioContext)();
    metro.owner = g; g.paint();
    metro.timer = setInterval(() => {
      tick(); g.el.classList.add('beat'); setTimeout(() => g.el.classList.remove('beat'), 140);
    }, 545); /* 110 compressions / min */
  }

  let speaker = null; /* guide en train de parler */

  class Guide {
    constructor(el, o) {
      Object.assign(this, { el, u: o.u || 'rcp', i: o.i || 0, render: o.render, auto: !!o.auto, speaking: false, tok: 0 });
      el.addEventListener('click', e => {
        const a = e.target.closest('[data-a]');
        if (a && el.contains(a)) this.act(a.dataset.a, a.dataset.v);
      });
      this.paint();
    }
    get U() { return window.URG_BY_ID[this.u]; }
    get S() { return this.U.steps[this.i]; }
    get n() { return this.U.steps.length; }
    get il() { return this.S.il || this.u; }
    get metroOn() { return metro.owner === this; }
    act(a, v) {
      const map = {
        next: () => this.go(this.i + 1), prev: () => this.go(this.i - 1), step: () => this.go(+v),
        play: () => (this.speaking ? this.hush() : this.say()),
        auto: () => { this.auto = !this.auto; this.auto ? this.say() : this.hush(); },
        metro: () => (this.metroOn ? metroStop() : metroStart(this)),
        urg: () => this.load(v), call: () => this.toast('Appel du ' + v + ' — simulation')
      };
      (map[a] || (() => {}))();
    }
    go(i) {
      if (i < 0 || i >= this.n) return;
      this.i = i; if (this.metroOn && !this.S.metro) metroStop();
      this.hush(true); this.paint(); if (this.auto) this.say();
    }
    load(u) { this.u = u; this.i = 0; if (this.metroOn) metroStop(); this.hush(true); this.paint(); this.el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    speech() { const s = this.S; return s.t + '. ' + s.x + (s.no ? ' Ne pas : ' + s.no.join(', ') + '.' : ''); }
    /* 1) fichier audio/<urgence>-<étape>.wav (voix enregistrée), 2) repli : synthèse du navigateur */
    say() {
      if (speaker && speaker !== this) speaker.hush();
      this.hush(true);
      const tok = ++this.tok;
      const done = () => { if (this.tok !== tok) return; this.speaking = false; this.audio = null; speaker = null; this.paint(); };
      let fell = false;
      const fallback = () => { if (fell || this.tok !== tok) return; fell = true; this.audio = null; this.tts(done); };
      speaker = this; this.speaking = true; this.paint();
      const au = new Audio(`audio/${this.u}-${this.i + 1}.wav`);
      this.audio = au; au.onended = done; au.onerror = fallback;
      au.play().catch(fallback);
    }
    tts(done) {
      if (!hasTTS) { done(); return this.toast('Audio indisponible sur ce navigateur'); }
      const ut = new SpeechSynthesisUtterance(this.speech());
      ut.lang = 'fr-FR'; ut.rate = 0.95; if (voiceFR) ut.voice = voiceFR;
      ut.onend = ut.onerror = done; speechSynthesis.speak(ut);
    }
    hush(silent) {
      this.tok++;
      if (this.audio) { this.audio.pause(); this.audio = null; }
      if (speaker === this) { if (hasTTS) speechSynthesis.cancel(); speaker = null; }
      this.speaking = false; if (!silent) this.paint();
    }
    paint() {
      this.el.innerHTML = this.render(this);
      ['speaking', 'auto'].forEach(k => this.el.classList.toggle('is-' + k, this[k]));
      this.el.classList.toggle('is-metro', this.metroOn);
    }
    toast(msg) {
      const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
      this.el.appendChild(t); setTimeout(() => t.remove(), 1800);
    }
  }

  window.Guide = Guide;
  window.esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* monte les 3 téléphones + la bande d'illustrations d'une planche */
  window.mountBoard = function (render, strip) {
    const guides = [...document.querySelectorAll('[data-guide]')].map(el => {
      const [u, i] = el.dataset.guide.split(':');
      return new Guide(el, { u, i: +i || 0, render });
    });
    const s = document.querySelector('.strip');
    if (s) {
      s.innerHTML = window.URG.map(u => `<button data-u="${u.id}" aria-label="Ouvrir ${esc(u.nom)}">${strip(u)}</button>`).join('');
      s.addEventListener('click', e => { const b = e.target.closest('[data-u]'); if (b) guides[0].load(b.dataset.u); });
    }
    return guides;
  };
})();
```


## 6.4 Planche de référence — page principale à reproduire

`planche-A-bandeau.html`

```html
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Premier Geste — A Bandeau</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shared/base.css">
<style>
:root {
  --red: #E3262B; --ink: #161616; --paper: #EEECE9; --light: #F8F7F5;
  --b-bg: var(--paper); --b-ink: var(--ink); --b-font: 'Barlow', system-ui, sans-serif;
  --s-bg: var(--paper); --s-ink: var(--ink);
  --il-ink: var(--ink); --il-v: #FFFFFF; --il-r: #CFCBC5; --il-skin: #FFFFFF;
  --il-accent: var(--red); --il-floor: #B9B4AD; --il-pad: #FFFFFF; --il-obj: #DAD6D0;
  --il-water: #9CC9E8; --il-lw: 3; --il-font: 'Barlow Condensed', sans-serif;
}
.cond { font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; }
h1.board-title { font: 700 88px/.9 'Barlow Condensed', sans-serif; text-transform: uppercase; margin: 0; }
h1.board-title span { background: var(--red); color: #fff; padding: 0 14px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }

/* ----- écran ----- */
.screen { display: flex; flex-direction: column; padding: 58px 20px 0;
  background: linear-gradient(115deg, var(--light) 0 38%, var(--paper) 38%); }
.a-top { display: flex; justify-content: space-between; align-items: baseline; font: 600 18px/1 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: .04em; }
.a-count { font-size: 18px; opacity: .55; } .a-count b { font-size: 34px; opacity: 1; color: var(--ink); }
.screen .a-count b { opacity: 1; }
.a-prog { display: flex; gap: 6px; margin: 12px 0 14px; }
.a-prog i { flex: 1; height: 6px; background: #D2CEC8; }
.a-prog i.on { background: var(--ink); }
.a-urg { align-self: flex-start; background: var(--ink); color: #fff; font: 600 15px/1 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: .08em; padding: 6px 10px; }
.a-ill { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 6px 4px; }
.a-ill .il { max-height: 232px; width: auto; max-width: 100%; }
.beat .a-ill .il { transform: scale(1.025); }
.a-t { margin: 0 0 10px; font: 700 42px/1.08 'Barlow Condensed', sans-serif; text-transform: uppercase; }
.a-t span { background: var(--red); color: #fff; padding: 0 10px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.a-x { margin: 0 0 12px; font: 500 19px/1.35 'Barlow', sans-serif; }
.a-no { margin: -4px 0 12px; display: flex; gap: 8px; flex-wrap: wrap; }
.a-no s { font: 600 18px/1 'Barlow Condensed', sans-serif; text-transform: uppercase; background: #fff; padding: 6px 10px; text-decoration-thickness: 3px; text-decoration-color: var(--red); }
.a-metro { all: unset; cursor: pointer; align-self: flex-start; margin-bottom: 12px; font: 700 20px/1 'Barlow Condensed', sans-serif; text-transform: uppercase; background: #fff; border: 3px solid var(--ink); padding: 8px 12px; }
.is-metro .a-metro { background: var(--ink); color: #fff; }
.beat .a-metro { background: var(--red); border-color: var(--red); }
.a-ctl { display: grid; grid-template-columns: 64px 1fr 64px; gap: 8px; margin-bottom: 8px; }
.a-ctl button { all: unset; cursor: pointer; height: 60px; display: flex; align-items: center; justify-content: center; background: #fff; border: 3px solid var(--ink); font: 700 30px/1 'Barlow Condensed', sans-serif; }
.a-ctl button:disabled { opacity: .25; cursor: default; }
.a-ctl .a-play { background: var(--ink); color: #fff; font-size: 24px; text-transform: uppercase; gap: 10px; }
.is-speaking .a-ctl .a-play { background: var(--red); border-color: var(--red); }
.eq { display: inline-flex; gap: 3px; align-items: flex-end; height: 20px; }
.eq i { width: 4px; background: currentColor; animation: eq .7s ease-in-out infinite alternate; }
.eq i:nth-child(2) { animation-delay: .2s; } .eq i:nth-child(3) { animation-delay: .4s; }
@keyframes eq { from { height: 4px; } to { height: 20px; } }
.a-auto { all: unset; cursor: pointer; align-self: center; font: 600 15px/1 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; opacity: .7; }
.is-auto .a-auto { opacity: 1; color: var(--red); }
.a-call { all: unset; cursor: pointer; margin: 0 -20px; height: 76px; display: flex; align-items: center; justify-content: center; gap: 12px; background: var(--red); color: #fff; font: 700 30px/1 'Barlow Condensed', sans-serif; text-transform: uppercase; letter-spacing: .03em; padding-bottom: 10px; }
.a-call::before { content: ''; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 5px rgba(255,255,255,.3); }

/* ----- bande d'illustrations ----- */
.strip .cell { background: linear-gradient(115deg, var(--light) 0 45%, #E4E1DC 45%); padding: 14px 10px 10px; }
.strip .lbl { font: 700 19px/1.05 'Barlow Condensed', sans-serif; text-transform: uppercase; }
.strip .lbl span { background: var(--red); color: #fff; padding: 0 6px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
.strip .sig { font-size: 13px; opacity: .7; }
.strip button:hover .cell { outline: 3px solid var(--ink); }
.notes h3 { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; }
</style>
</head>
<body>
<main class="board">
  <header class="board-head">
    <div>
      <p class="board-kicker">Premier Geste · Planche A · V1 · 2026-11-22 · page principale « Guide pas à pas »</p>
      <h1 class="board-title"><span>Bandeau</span><br>chaque consigne est un panneau</h1>
    </div>
    <div class="board-meta">
      <p><b>Intention.</b> Lisible à 2 m, dans la panique. Les consignes s'empilent sur des bandes rouges en capitales condensées, comme une signalétique ; l'illustration au trait noir rend le geste sans ambiguïté.</p>
      <p><b>Référence.</b> Concept Studio (<i>saas-marketing</i>) : bandes surlignées, condensée capitale, dessin au trait mono-couleur, lumière en biais. Principes seulement.</p>
      <p><b>Tokens.</b> Barlow Condensed 700 / Barlow 500 · un seul accent rouge secours #E3262B.</p>
      <div class="swatches"><i style="background:#E3262B"></i><i style="background:#161616"></i><i style="background:#EEECE9"></i><i style="background:#F8F7F5"></i><i style="background:#9CC9E8"></i></div>
    </div>
  </header>

  <section class="phones">
    <div class="phone-wrap"><div class="phone"><div class="screen" data-guide="rcp:2"></div></div><p class="phone-cap">Arrêt cardiaque · étape 3 — touchez « Rythme » : bip 110/min + pulsation</p></div>
    <div class="phone-wrap"><div class="phone"><div class="screen" data-guide="etouf:2"></div></div><p class="phone-cap">Étouffement · étape 3 — « Écouter » lit la consigne à voix haute</p></div>
    <div class="phone-wrap"><div class="phone"><div class="screen" data-guide="brul:3"></div></div><p class="phone-cap">Brûlure · étape 4 — les gestes interdits, barrés</p></div>
  </section>

  <h2 class="strip-title cond">Jeu d'illustrations — 8 urgences <small style="font-size:15px;opacity:.6">(cliquez : s'ouvre dans le 1er téléphone)</small></h2>
  <div class="strip"></div>

  <section class="notes">
    <div><h3>Force</h3><p>Le texte EST l'image : titre lisible même sans lunettes, bouton d'appel impossible à rater (bande pleine largeur, en bas, sous le pouce).</p></div>
    <div><h3>Risque</h3><p>Beaucoup de rouge : peut stresser. À tester avec le rouge réservé au titre + appel seulement (delta possible).</p></div>
    <div><h3>Audio</h3><p>« Écouter » lit titre + consigne (voix FR du système). « Lecture auto » lit chaque étape dès qu'on avance : mains libres pendant le massage.</p></div>
  </section>
</main>
<script src="shared/data.js"></script>
<script src="shared/illus.js"></script>
<script src="shared/guide.js"></script>
<script>
const pad = n => String(n).padStart(2, '0');
function render(g) {
  const U = g.U, S = g.S, n = g.n;
  return `<div class="notch"></div>
  <header class="a-top"><span data-a="urg" data-v="${g.u}">‹ Urgences</span><span class="a-count"><b>${pad(g.i + 1)}</b> / ${pad(n)}</span></header>
  <div class="a-prog">${U.steps.map((_, k) => `<i data-a="step" data-v="${k}" class="${k <= g.i ? 'on' : ''}"></i>`).join('')}</div>
  <div class="a-urg">${esc(U.nom)}</div>
  <div class="a-ill">${ILL(g.il)}</div>
  <h2 class="a-t"><span>${esc(S.t)}</span></h2>
  <p class="a-x">${esc(S.x)}</p>
  ${S.no ? `<p class="a-no">${S.no.map(w => `<s>${esc(w)}</s>`).join('')}</p>` : ''}
  ${S.metro ? `<button class="a-metro" data-a="metro">${g.metroOn ? '■ Stop rythme' : '▶ Rythme 110 / min'}</button>` : ''}
  <nav class="a-ctl"><button data-a="prev" aria-label="Étape précédente" ${g.i ? '' : 'disabled'}>‹</button>
    <button class="a-play" data-a="play">${g.speaking ? '<span class="eq"><i></i><i></i><i></i></span> Pause' : '▶ Écouter'}</button>
    <button data-a="next" aria-label="Étape suivante" ${g.i < n - 1 ? '' : 'disabled'}>›</button></nav>
  <button class="a-auto" data-a="auto">${g.auto ? '● Lecture auto activée' : '○ Lecture auto'}</button>
  <button class="a-call" data-a="call" data-v="15">Appeler le 15</button>`;
}
mountBoard(render, u => `<div class="cell">${ILL(u.id)}</div><div class="lbl"><span>${esc(u.nom)}</span></div><div class="sig">${esc(u.signe)}</div>`);
</script>
</body>
</html>
```


## 6.5 Génération audio de secours (voix Windows) — gen-audio.ps1

`gen-audio.ps1`

```powershell
# Génère audio/<urgence>-<étape>.wav pour chaque étape de data.js
# avec la voix FR intégrée de Windows (Hortense = voix féminine, règle solo G).
# Hors ligne, sans clé. Remplaçable plus tard par Kokoro (même nommage).
# Usage : powershell -NoProfile -File shared/gen-audio.ps1   (depuis planches/)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$out = Join-Path $root 'audio'
New-Item -ItemType Directory -Force $out | Out-Null

# data.js -> JSON via node (le texte lu = exactement celui affiché)
$js = Join-Path $PSScriptRoot 'data.js'
$json = node -e "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.URG))" $js
$urg = $json | ConvertFrom-Json

Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$v = $s.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -like 'fr*' -and $_.VoiceInfo.Gender -eq 'Female' } | Select-Object -First 1
if (-not $v) { throw 'Aucune voix FR féminine installée.' }
$s.SelectVoice($v.VoiceInfo.Name)
$s.Rate = 0
$n = 0
foreach ($u in $urg) {
  $k = 0
  foreach ($st in $u.steps) {
    $k++
    $txt = "$($st.t). $($st.x)"
    if ($st.no) { $txt += " Ne pas : " + ($st.no -join ', ') + '.' }
    $s.SetOutputToWaveFile((Join-Path $out "$($u.id)-$k.wav"))
    $s.Speak($txt)
    $n++
  }
}
$s.SetOutputToNull(); $s.Dispose()
"$n fichiers audio -> $out (voix : $($v.VoiceInfo.Name))"
```
