import { URG } from '../data'
import { ill } from '../illus'
import { callBar, esc, notch, type View } from '../view'

function tile(id: string, nom: string, signe: string): string {
  return `<a class="h-tile" href="#/guide/${esc(id)}/1">` +
    `<div class="h-tile-ill">${ill(id)}</div>` +
    `<div class="h-tile-lbl"><span>${esc(nom)}</span></div>` +
    `<div class="h-tile-sig">${esc(signe)}</div>` +
    `</a>`
}

export function createHomeView(el: HTMLElement): View {
  el.className = 'screen home'
  el.innerHTML = notch +
    '<header class="h-top"><span class="h-brand">Premier Geste</span></header>' +
    '<h1 class="h-title"><span>Quelle urgence ?</span></h1>' +
    '<div class="h-grid">' + URG.map(u => tile(u.id, u.nom, u.signe)).join('') + '</div>' +
    '<a class="h-help" href="#/appel">Que dire au téléphone ?</a>' +
    '<div class="h-quick">' +
      '<a class="h-quick-b" href="tel:112">112</a>' +
      '<a class="h-quick-b" href="tel:18">18</a>' +
      '<a class="h-quick-b" href="sms:114">114 SMS</a>' +
    '</div>' +
    '<a class="h-fiches" href="#/fiches">Fiches — apprendre à froid</a>' +
    callBar
  return { el, destroy(): void {} }
}
