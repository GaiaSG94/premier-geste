/* Premier Geste — maintien de l'écran allumé pendant le guide. */

interface SentinelLike {
  released?: boolean
  release(): Promise<void>
}

interface WakeLockLike {
  request(type: 'screen'): Promise<SentinelLike>
}

function getWakeLock(): WakeLockLike | null {
  if (typeof navigator === 'undefined') return null
  const wl = (navigator as unknown as { wakeLock?: WakeLockLike }).wakeLock
  return wl && typeof wl.request === 'function' ? wl : null
}

export function acquireWakeLock(): () => void {
  let sentinel: SentinelLike | null = null
  let pending = false
  let released = false

  const releaseSentinel = (s: SentinelLike): void => {
    if (s.released) return
    try {
      const p = s.release()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } catch {}
  }

  const request = (): void => {
    if (released || pending) return
    const wl = getWakeLock()
    if (!wl) return
    const old = sentinel
    sentinel = null
    if (old) releaseSentinel(old)
    try {
      const p = wl.request('screen')
      if (!p || typeof p.then !== 'function') return
      pending = true
      p.then(
        s => {
          pending = false
          if (released) releaseSentinel(s)
          else sentinel = s
        },
        () => { pending = false }
      )
    } catch {
      pending = false
    }
  }

  const onVisibilityChange = (): void => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') request()
  }

  request()
  if (typeof document !== 'undefined') {
    try { document.addEventListener('visibilitychange', onVisibilityChange) } catch {}
  }

  let releasedOnce = false
  return () => {
    if (releasedOnce) return
    releasedOnce = true
    released = true
    if (typeof document !== 'undefined') {
      try { document.removeEventListener('visibilitychange', onVisibilityChange) } catch {}
    }
    const s = sentinel
    sentinel = null
    if (s) releaseSentinel(s)
  }
}
