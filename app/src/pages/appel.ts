import { callBar, notch, type View } from '../view'

export function createAppelView(el: HTMLElement): View {
  el.className = 'screen callpage'
  el.innerHTML = notch +
    '<header class="c-top"><a href="#/">‹ Urgences</a></header>' +
    '<h1 class="c-title"><span>Appeler les secours</span></h1>' +
    '<div class="c-nums">' +
      '<a class="c-num" href="tel:15"><b>15</b><span>SAMU</span></a>' +
      '<a class="c-num" href="tel:18"><b>18</b><span>Pompiers</span></a>' +
      '<a class="c-num" href="tel:112"><b>112</b><span>Urgence européenne</span></a>' +
      '<a class="c-num" href="sms:114"><b>114</b><span>SMS — sourds et malentendants</span></a>' +
    '</div>' +
    '<div class="c-say"><h2>Dites :</h2><ol>' +
      '<li><b>QUI</b> vous êtes</li>' +
      '<li><b>OÙ</b>, adresse exacte</li>' +
      '<li><b>QUOI</b>, ce que vous voyez</li>' +
      '<li>Ne raccrochez pas le premier</li>' +
    '</ol></div>' +
    '<button class="c-geo" data-a="geo">MA POSITION</button>' +
    '<div class="c-pos" hidden><span class="c-pos-val"></span><button class="c-copy" data-a="copy">Copier</button></div>' +
    callBar

  const position = el.querySelector<HTMLElement>('.c-pos')
  const value = el.querySelector<HTMLElement>('.c-pos-val')
  const copy = el.querySelector<HTMLButtonElement>('.c-copy')

  return {
    el,
    destroy(): void {},
    act(action: string): void {
      if (action === 'geo') {
        if (!navigator.geolocation) {
          if (value) value.textContent = 'Position indisponible'
          if (position) position.hidden = false
          return
        }
        navigator.geolocation.getCurrentPosition(
          p => {
            if (value) value.textContent = p.coords.latitude.toFixed(5) + ' , ' + p.coords.longitude.toFixed(5)
            if (position) position.hidden = false
            if (copy) copy.textContent = 'Copier'
          },
          () => {
            if (value) value.textContent = 'Position indisponible'
            if (position) position.hidden = false
          },
          { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
        )
      }
      if (action === 'copy' && value) {
        const text = value.textContent?.trim() ?? ''
        if (!text || !navigator.clipboard) return
        void navigator.clipboard.writeText(text).then(() => {
          if (copy) copy.textContent = 'Copié'
        }).catch(() => {})
      }
    },
  }
}
