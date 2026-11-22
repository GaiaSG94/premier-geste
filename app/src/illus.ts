/* Premier Geste — jeu d'illustrations des gestes (SVG, 240×180).
   Une seule géométrie ; chaque direction la peint via ses variables CSS
   (--il-ink, --il-v victime, --il-r sauveteur, --il-skin, --il-accent…).
   L = membre (trait épais + contour), H = tête, P = main, A = flèche. */

const L = (d: string, w: number, c: string): string => `<path class="o" d="${d}" stroke-width="${w + 6}"/><path class="${c}" d="${d}" stroke-width="${w}"/>`;
const H = (x: number, y: number, r = 13): string => `<circle class="hd" cx="${x}" cy="${y}" r="${r}"/>`;
const P = (x: number, y: number, r = 7): string => `<circle class="hn" cx="${x}" cy="${y}" r="${r}"/>`;
const AH = (x: number, y: number, deg: number): string => `<path class="ah" d="M3 0 L-9 -6 L-9 6Z" transform="translate(${x} ${y}) rotate(${deg})"/>`;
const A = (d: string, x: number, y: number, deg: number): string => `<path class="mv" d="${d}"/>${AH(x, y, deg)}`;
const FLOOR = '<line class="fl" x1="8" y1="163" x2="232" y2="163"/>';
const LYING = H(36, 136) + L('M56 140 L132 140', 26, 'v') + L('M132 142 L214 148', 17, 'v');
const BADGE = (t: string): string => `<circle class="badge" cx="192" cy="48" r="26"/><text class="bt" x="192" y="56" text-anchor="middle">${t}</text>`;

const D: Record<string, () => string> = {
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

export function ill(id: string): string {
  return `<svg class="il il-${id}" viewBox="0 0 240 180" aria-hidden="true">${(D[id] || D.call)()}</svg>`;
}

export const ILL_IDS: string[] = Object.keys(D);
