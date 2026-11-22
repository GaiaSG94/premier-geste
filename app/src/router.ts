import { URG_BY_ID } from './data'
import { clampStep } from './state'

export type Route =
  | { page: 'home' }
  | { page: 'guide'; u: string; i: number }
  | { page: 'appel' }
  | { page: 'fiches'; u: string | null }

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#\/?/, '').replace(/\/+$/, '')
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return { page: 'home' }
  if (parts[0] === 'guide') {
    const u = parts[1] ?? ''
    if (!URG_BY_ID[u]) return { page: 'home' }
    const raw = Number(parts[2] ?? '1')
    const index = Number.isFinite(raw) ? clampStep(raw - 1, URG_BY_ID[u].steps.length) : 0
    return { page: 'guide', u, i: index }
  }
  if (parts[0] === 'appel' && parts.length === 1) return { page: 'appel' }
  if (parts[0] === 'fiches') {
    const u = parts[1] ?? null
    return { page: 'fiches', u: u && URG_BY_ID[u] ? u : null }
  }
  return { page: 'home' }
}

export function routeHash(route: Route): string {
  if (route.page === 'home') return '#/'
  if (route.page === 'appel') return '#/appel'
  if (route.page === 'fiches') return route.u ? '#/fiches/' + route.u : '#/fiches'
  return '#/guide/' + route.u + '/' + (route.i + 1)
}

export function samePage(a: Route, b: Route): boolean {
  if (a.page !== b.page) return false
  if (a.page === 'fiches' && b.page === 'fiches') return (a.u ?? null) === (b.u ?? null)
  if (a.page === 'guide' && b.page === 'guide') return a.u === b.u
  return true
}
