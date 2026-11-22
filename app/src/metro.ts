/* Premier Geste — métronome 110/min : planification WebAudio + repli visuel. */

export const METRO_INTERVAL_MS = 545

const LOOKAHEAD_MS = 25
const HORIZON_MS = 100
const MAX_BEATS_PER_TICK = 8
const LEAD_MS = 60

type AudioContextCtor = typeof AudioContext

export function beatTimes(start: number, count: number): number[] {
  const n = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
  const times: number[] = []
  for (let i = 0; i < n; i++) times.push(start + i * METRO_INTERVAL_MS)
  return times
}

export function dueBeats(nextBeat: number, now: number, horizon: number, count: number): number[] {
  if (!Number.isFinite(nextBeat) || !Number.isFinite(now) || !Number.isFinite(horizon) || horizon < 0 || count <= 0) return []
  const end = now + horizon
  const beats: number[] = []
  let t = nextBeat
  while (t <= end && beats.length < count) {
    beats.push(t)
    t += METRO_INTERVAL_MS
  }
  return beats
}

function getAudioContextCtor(): AudioContextCtor | null {
  const scope = globalThis as typeof globalThis & { webkitAudioContext?: AudioContextCtor }
  return scope.AudioContext ?? scope.webkitAudioContext ?? null
}

export class Metronome {
  private readonly onBeat: () => void
  private active = false
  private ctx: AudioContext | null = null
  private timer: number | null = null
  private nextBeat = 0
  private useFallback = false
  private readonly sources = new Set<OscillatorNode>()
  private readonly visuals = new Set<number>()

  constructor(onBeat: () => void) {
    this.onBeat = onBeat
  }

  get running(): boolean {
    return this.active
  }

  start(): void {
    if (this.active) return
    this.active = true
    const Ctor = getAudioContextCtor()
    if (!Ctor) {
      this.useFallback = true
      this.fallbackTick()
      return
    }
    try {
      if (!this.ctx || this.ctx.state === 'closed') this.ctx = new Ctor()
      this.useFallback = false
      if (this.ctx.state === 'suspended' && typeof this.ctx.resume === 'function') {
        void this.ctx.resume().catch(() => {})
      }
      this.nextBeat = this.ctx.currentTime * 1000 + LEAD_MS
      this.schedule()
    } catch {
      this.ctx = null
      this.useFallback = true
      this.fallbackTick()
    }
  }

  stop(): void {
    this.active = false
    if (this.timer !== null) {
      try { window.clearTimeout(this.timer) } catch {}
      this.timer = null
    }
    for (const id of this.visuals) {
      try { window.clearTimeout(id) } catch {}
    }
    this.visuals.clear()
    for (const osc of this.sources) {
      try { osc.stop() } catch {}
    }
    this.sources.clear()
  }

  private schedule(): void {
    if (!this.active || this.useFallback || !this.ctx) return
    const now = this.ctx.currentTime * 1000
    if (this.nextBeat < now) {
      const missed = Math.ceil((now - this.nextBeat) / METRO_INTERVAL_MS)
      this.nextBeat += missed * METRO_INTERVAL_MS
    }
    const beats = dueBeats(this.nextBeat, now, HORIZON_MS, MAX_BEATS_PER_TICK)
    for (const beat of beats) {
      const delay = Math.max(0, beat - now)
      this.tone(delay / 1000)
      this.fireAt(delay)
    }
    if (beats.length > 0) this.nextBeat = beats[beats.length - 1] + METRO_INTERVAL_MS
    try {
      this.timer = window.setTimeout(() => this.schedule(), LOOKAHEAD_MS)
    } catch {
      this.useFallback = true
      this.fallbackTick()
    }
  }

  private tone(delay: number): void {
    const ctx = this.ctx
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const at = ctx.currentTime + delay
      osc.frequency.value = 1050
      gain.gain.setValueAtTime(0.35, at)
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.06)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(at)
      osc.stop(at + 0.07)
      this.sources.add(osc)
      osc.onended = () => { this.sources.delete(osc) }
    } catch {}
  }

  private fireAt(delay: number): void {
    try {
      const id = window.setTimeout(() => {
        this.visuals.delete(id)
        if (this.active) this.fire()
      }, delay)
      this.visuals.add(id)
    } catch {
      if (delay === 0 && this.active) this.fire()
    }
  }

  private fire(): void {
    try { this.onBeat() } catch {}
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(25)
    } catch {}
  }

  private fallbackTick(): void {
    if (!this.active || !this.useFallback) return
    this.fire()
    try {
      this.timer = window.setTimeout(() => this.fallbackTick(), METRO_INTERVAL_MS)
    } catch {}
  }
}
