import { describe, expect, it } from 'vitest'
import { URG } from '../src/data'
import { parseRoute, routeHash, samePage } from '../src/router'
import { audioKey, clampStep, pad2, speechOf } from '../src/state'

describe('guide state', () => {
  it('clamps an index to the available steps', () => {
    expect(clampStep(-3, 5)).toBe(0)
    expect(clampStep(2, 5)).toBe(2)
    expect(clampStep(99, 5)).toBe(4)
    expect(clampStep(0, 0)).toBe(0)
    expect(clampStep(Number.NaN, 5)).toBe(0)
  })

  it('builds the audio key and counter', () => {
    expect(audioKey('rcp', 0)).toBe('rcp-1')
    expect(audioKey('brul', 3)).toBe('brul-4')
    expect(pad2(3)).toBe('03')
    expect(pad2(12)).toBe('12')
  })

  it('speaks exactly the displayed text, including actions to avoid', () => {
    const step = URG[0].steps[0]
    expect(speechOf(step)).toBe('Call 15. Put the phone on speaker. Have someone fetch a defibrillator.')
    const burn = URG.find(u => u.id === 'brul')?.steps[3]
    expect(burn && speechOf(burn)).toContain('Do not: ice, butter, toothpaste.')
  })
})

describe('URL ↔ step', () => {
  it('parses known routes', () => {
    expect(parseRoute('')).toEqual({ page: 'home' })
    expect(parseRoute('#/')).toEqual({ page: 'home' })
    expect(parseRoute('#/appel')).toEqual({ page: 'appel' })
    expect(parseRoute('#/fiches')).toEqual({ page: 'fiches', u: null })
    expect(parseRoute('#/fiches/avc')).toEqual({ page: 'fiches', u: 'avc' })
    expect(parseRoute('#/guide/rcp/3')).toEqual({ page: 'guide', u: 'rcp', i: 2 })
  })

  it('clamps and repairs a step URL', () => {
    expect(parseRoute('#/guide/rcp/0')).toEqual({ page: 'guide', u: 'rcp', i: 0 })
    expect(parseRoute('#/guide/rcp/999')).toEqual({ page: 'guide', u: 'rcp', i: 4 })
    expect(parseRoute('#/guide/inconnu/1')).toEqual({ page: 'home' })
  })

  it('round-trips hash → route → hash', () => {
    const routes = [
      { page: 'home' },
      { page: 'appel' },
      { page: 'fiches', u: null },
      { page: 'fiches', u: 'pls' },
      { page: 'guide', u: 'rcp', i: 2 },
      { page: 'guide', u: 'brul', i: 3 },
    ] as const
    for (const route of routes) {
      const parsed = parseRoute(routeHash(route as never))
      expect(parsed).toEqual(route as never)
    }
  })

  it('detects meaningful page changes', () => {
    expect(samePage({ page: 'guide', u: 'rcp', i: 0 }, { page: 'guide', u: 'rcp', i: 3 })).toBe(true)
    expect(samePage({ page: 'guide', u: 'rcp', i: 0 }, { page: 'guide', u: 'brul', i: 0 })).toBe(false)
    expect(samePage({ page: 'home' }, { page: 'appel' })).toBe(false)
  })
})
