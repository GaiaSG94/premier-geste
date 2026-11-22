import './style.css'
import { parseRoute, samePage, type Route } from './router'
import { createHomeView } from './pages/home'
import { GuideView } from './pages/guide'
import { createAppelView } from './pages/appel'
import { createFichesView } from './pages/fiches'
import type { View } from './view'

const found = document.getElementById('app')
if (!found) throw new Error('Element #app not found')
const root: HTMLElement = found

let view: View | null = null
let route: Route | null = null

function mount(next: Route): void {
  if (view && route && samePage(route, next)) {
    if (next.page === 'guide' && view instanceof GuideView) {
      view.sync(next)
      route = next
      return
    }
    route = next
    return
  }
  view?.destroy()
  if (next.page === 'guide') view = new GuideView(root, next.u, next.i)
  else if (next.page === 'appel') view = createAppelView(root)
  else if (next.page === 'fiches') view = createFichesView(root, next.u)
  else view = createHomeView(root)
  route = next
}

root.addEventListener('click', e => {
  const target = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')
  if (!target || !root.contains(target) || !view?.act) return
  if (target.tagName === 'BUTTON' || target.tagName === 'I') e.preventDefault()
  view.act(target.dataset.a ?? '', target)
})

root.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return
  const target = (e.target as HTMLElement).closest<HTMLElement>('[data-a="step"]')
  if (!target || !view?.act) return
  e.preventDefault()
  view.act('step', target)
})

window.addEventListener('hashchange', () => mount(parseRoute(window.location.hash)))

if (!window.location.hash) window.history.replaceState(null, '', '#/')
mount(parseRoute(window.location.hash))

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(new URL('sw.js', document.baseURI).href).catch(() => {})
  })
}
