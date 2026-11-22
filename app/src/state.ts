import type { Step } from './data'

export const AUTO_KEY = 'premier-geste:auto'

export function clampStep(index: number, count: number): number {
  if (!Number.isFinite(index) || count <= 0) return 0
  return Math.min(Math.max(Math.floor(index), 0), count - 1)
}

export function readAuto(): boolean {
  try {
    return window.localStorage.getItem(AUTO_KEY) !== '0'
  } catch {
    return true
  }
}

export function writeAuto(value: boolean): void {
  try {
    window.localStorage.setItem(AUTO_KEY, value ? '1' : '0')
  } catch {}
}

export function speechOf(step: Step): string {
  const base = step.t + '. ' + step.x
  return step.no && step.no.length ? base + ' Ne pas : ' + step.no.join(', ') + '.' : base
}

export function audioKey(id: string, index: number): string {
  return id + '-' + (index + 1)
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}
