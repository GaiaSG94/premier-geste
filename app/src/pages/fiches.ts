import { voice } from '../audio'
import { URG, URG_BY_ID } from '../data'
import { ill } from '../illus'
import { audioKey, pad2, speechOf } from '../state'
import { callBar, esc, notch, type View } from '../view'

const DEMO = 'Demonstration version — content under review'
const FOOT = 'Does not replace first-aid training (PSC1). If in doubt, call 15.'

export function createFichesView(el: HTMLElement, id: string | null): View {
  if (id && URG_BY_ID[id]) return detail(el, URG_BY_ID[id].id)
  el.className = 'screen fiches'
  el.innerHTML = notch +
    '<header class="f-top"><a href="#/">‹ Emergencies</a></header>' +
    '<h1 class="f-title"><span>Fact sheets</span></h1>' +
    `<p class="f-demo">${esc(DEMO)}</p>` +
    '<div class="f-list">' + URG.map(u =>
      `<a class="f-row" href="#/fiches/${esc(u.id)}">` +
        `<span class="f-row-ill">${ill(u.id)}</span>` +
        `<span class="f-row-lbl"><span>${esc(u.nom)}</span></span>` +
        `<span class="f-row-sign">${esc(u.signe)}</span>` +
      `</a>`
    ).join('') + '</div>' +
    `<p class="f-foot">${esc(FOOT)}</p>` +
    callBar
  return { el, destroy(): void {} }
}

function detail(el: HTMLElement, id: string): View {
  const U = URG_BY_ID[id]
  el.className = 'screen fiche'
  el.innerHTML = notch +
    '<header class="f-top"><a href="#/fiches">‹ Fact sheets</a></header>' +
    `<h1 class="f-title"><span>${esc(U.nom)}</span></h1>` +
    `<p class="f-demo">${esc(DEMO)}</p>` +
    '<div class="f-steps">' + U.steps.map((S, k) =>
      `<article class="f-step">` +
        `<div class="f-step-n">${pad2(k + 1)}</div>` +
        `<div class="f-step-ill">${ill(S.il || U.id)}</div>` +
        `<h2 class="f-step-t"><span>${esc(S.t)}</span></h2>` +
        `<p class="f-step-x">${esc(S.x)}</p>` +
        (S.no ? `<p class="f-step-no">${S.no.map(w => `<s>${esc(w)}</s>`).join('')}</p>` : '') +
        `<button class="f-step-audio" data-a="say" data-key="${esc(audioKey(id, k))}">▶ Listen</button>` +
      `</article>`
    ).join('') + '</div>' +
    `<p class="f-foot">${esc(FOOT)}</p>` +
    callBar

  return {
    el,
    destroy(): void { voice.stop(true) },
    act(action: string, target: HTMLElement): void {
      if (action !== 'say') return
      const match = /^(.+)-(\d+)$/.exec(target.dataset.key ?? '')
      if (!match) return
      const urgency = URG_BY_ID[match[1]]
      const index = Number(match[2]) - 1
      const step = urgency?.steps[index]
      if (!step) return
      voice.say(speechOf(step), audioKey(urgency.id, index))
    },
  }
}
