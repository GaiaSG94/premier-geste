// Assemble ../PROMPT-APP-BANDEAU.md : tête + sources de référence + STYLE.md.
// Source unique : rien n'est recopié à la main, on régénère (node build-prompt.js).
const fs = require('fs');
const path = require('path');
const d = __dirname;
const p = (...a) => path.join(d, 'planches', ...a);
const read = f => fs.readFileSync(f, 'utf8').replace(/^﻿/, '').trimEnd();
const FENCE = '`'.repeat(3);
const code = (title, file, lang) =>
  `\n## ${title}\n\n\`${path.basename(file)}\`\n\n${FENCE}${lang}\n${read(file)}\n${FENCE}\n`;

const parts = [
  read(path.join(d, 'prompt-app-tete.md')),
  code('6.1 Contenu — data.js (8 urgences, 33 étapes)', p('shared', 'data.js'), 'js'),
  code('6.1 bis Illustrations — illus.js (11 dessins SVG)', p('shared', 'illus.js'), 'js'),
  '\n## 6.2 Style verrouillé — STYLE.md\n\n' + read(path.join(d, 'STYLE.md')).replace(/^(#+) /gm, '$1## ') + '\n',
  code('6.3 Règles CSS des illustrations et du cadre — base.css', p('shared', 'base.css'), 'css'),
  code('6.3 bis Moteur du guide (audio, métronome, navigation) — guide.js', p('shared', 'guide.js'), 'js'),
  code('6.4 Planche de référence — page principale à reproduire', p('planche-A-bandeau.html'), 'html'),
  code('6.5 Génération audio de secours (voix Windows) — gen-audio.ps1', p('shared', 'gen-audio.ps1'), 'powershell')
];
const out = path.join(d, '..', 'PROMPT-APP-BANDEAU.md');
fs.writeFileSync(out, parts.join('\n'), 'utf8');
console.log(out, '(' + fs.readFileSync(out, 'utf8').split('\n').length + ' lignes)');
