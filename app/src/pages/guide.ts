import { URG_BY_ID } from '../data'
import { ill } from '../illus'
import { Metronome } from '../metro'
import { voice } from '../audio'
import { acquireWakeLock } from '../wakeLock'
import { audioKey, clampStep, pad2, readAuto, speechOf, writeAuto } from '../state'
import { callBar, esc, notch, type View } from '../view'

type Touch = { x: number; y: number }

export class GuideView implements View {
  readonly el: HTMLElement
  private u: string
  private i: number
  private auto = true
  private readonly metro: Metronome
  private readonly releaseWake: () => void
  private readonly unsubscribe: () => void
  private touch: Touch | null = null
  private beatTimer: number | null = null

  constructor(el: HTMLElement, u: string, i: number) {
    this.el = el
    this.u = u
    this.i = clampStep(i, URG_BY_ID[u].steps.length)
    this.auto = readAuto()
    this.metro = new Metronome(() => this.beat())
    this.releaseWake = acquireWakeLock()
    this.unsubscribe = voice.subscribe(() => this.paint())
    this.el.className = 'screen guide'
    this.el.addEventListener('touchstart', this.onTouchStart, { passive: true })
    this.el.addEventListener('touchend', this.onTouchEnd, { passive: true })
    window.addEventListener('keydown', this.onKey)
    this.paint()
    if (this.auto) this.say()
  }

  get urgencyId(): string { return this.u }

  private get urgency() { return URG_BY_ID[this.u] }
  private get step() { return this.urgency.steps[this.i] }
  private get total(): number { return this.urgency.steps.length }

  private beat(): void {
    this.el.classList.add('beat')
    if (this.beatTimer !== null) window.clearTimeout(this.beatTimer)
    this.beatTimer = window.setTimeout(() => this.el.classList.remove('beat'), 140)
  }

  private paint(): void {
    const U = this.urgency
    const S = this.step
    this.el.innerHTML = notch +
      `<header class="a-top"><a href="#/" aria-label="Retour aux urgences">‹ Urgences</a>` +
      `<span class="a-count"><b>${pad2(this.i + 1)}</b> / ${pad2(this.total)}</span></header>` +
      `<div class="a-prog" aria-label="Progression">${U.steps.map((_, k) =>
        `<i data-a="step" data-v="${k}" class="${k <= this.i ? 'on' : ''}" role="button" tabindex="0" aria-label="Étape ${k + 1}"></i>`
      ).join('')}</div>` +
      `<div class="a-urg">${esc(U.nom)}</div>` +
      `<div class="a-ill">${ill(S.il || U.id)}</div>` +
      `<div class="a-live" aria-live="polite">` +
        `<h2 class="a-t"><span>${esc(S.t)}</span></h2>` +
        `<p class="a-x">${esc(S.x)}</p>` +
        (S.no ? `<p class="a-no">${S.no.map(w => `<s>${esc(w)}</s>`).join('')}</p>` : '') +
        (S.metro ? `<button class="a-metro" data-a="metro">${this.metro.running ? '■ Stop rythme' : '▶ Rythme 110 / min'}</button>` : '') +
      `</div>` +
      `<nav class="a-ctl" aria-label="Contrôles">` +
        `<button class="a-prev" data-a="prev" aria-label="Étape précédente" ${this.i ? '' : 'disabled'}>‹</button>` +
        `<button class="a-play" data-a="play" aria-label="${voice.speaking ? 'Arrêter la lecture' : 'Écouter la consigne'}">` +
          (voice.speaking ? '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span> Pause' : '▶ Écouter') +
        `</button>` +
        `<button class="a-next" data-a="next" aria-label="Étape suivante" ${this.i < this.total - 1 ? '' : 'disabled'}>›</button>` +
      `</nav>` +
      `<button class="a-auto" data-a="auto">${this.auto ? '● Lecture auto activée' : '○ Lecture auto'}</button>` +
      callBar
    this.el.classList.toggle('is-speaking', voice.speaking)
    this.el.classList.toggle('is-auto', this.auto)
    this.el.classList.toggle('is-metro', this.metro.running)
  }

  private say(): void {
    voice.say(speechOf(this.step), audioKey(this.u, this.i))
  }

  go(index: number, updateHash = true): void {
    const next = clampStep(index, this.total)
    if (next !== this.i || updateHash) {
      if (this.metro.running && !this.urgency.steps[next].metro) this.metro.stop()
      voice.stop(true)
      this.i = next
      this.paint()
      if (this.auto) this.say()
    }
    if (updateHash) {
      const hash = '#/guide/' + this.u + '/' + (this.i + 1)
      if (window.location.hash !== hash) window.location.hash = hash
    }
  }

  sync(route: { page: 'guide'; u: string; i: number }): void {
    if (route.i !== this.i) this.go(route.i, false)
  }

  act(action: string, target: HTMLElement): void {
    switch (action) {
      case 'prev': this.go(this.i - 1); break
      case 'next': this.go(this.i + 1); break
      case 'step': this.go(Number(target.dataset.v)); break
      case 'play':
        if (voice.speaking) voice.stop()
        else this.say()
        break
      case 'auto':
        this.auto = !this.auto
        writeAuto(this.auto)
        if (this.auto) this.say()
        else voice.stop(true)
        this.paint()
        break
      case 'metro':
        if (this.metro.running) this.metro.stop()
        else this.metro.start()
        this.paint()
        break
    }
  }

  private onTouchStart = (e: Event): void => {
    const t = e as TouchEvent
    if (!(t.target as HTMLElement).closest('.a-ill')) return
    const point = t.changedTouches[0]
    if (point) this.touch = { x: point.clientX, y: point.clientY }
  }

  private onTouchEnd = (e: Event): void => {
    if (!this.touch) return
    const t = e as TouchEvent
    const point = t.changedTouches[0]
    const start = this.touch
    this.touch = null
    if (!point) return
    const dx = point.clientX - start.x
    const dy = point.clientY - start.y
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return
    this.go(dx < 0 ? this.i + 1 : this.i - 1)
  }

  private onKey = (e: KeyboardEvent): void => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    if ((e.target as HTMLElement)?.tagName === 'INPUT') return
    this.go(e.key === 'ArrowRight' ? this.i + 1 : this.i - 1)
  }

  destroy(): void {
    this.metro.stop()
    voice.stop(true)
    this.unsubscribe()
    this.releaseWake()
    this.el.removeEventListener('touchstart', this.onTouchStart)
    this.el.removeEventListener('touchend', this.onTouchEnd)
    window.removeEventListener('keydown', this.onKey)
    if (this.beatTimer !== null) window.clearTimeout(this.beatTimer)
  }
}
