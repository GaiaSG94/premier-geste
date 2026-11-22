import { describe, expect, it } from 'vitest'
import { URG } from '../src/data'
import { parseRoute, routeHash, samePage } from '../src/router'
import { audioKey, clampStep, pad2, speechOf } from '../src/state'

describe('état du guide', () => {
  it('borne un index dans les étapes disponibles', () => {
    expect(clampStep(-3, 5)).toBe(0)
    expect(clampStep(2, 5)).toBe(2)
    expect(clampStep(99, 5)).toBe(4)
    expect(clampStep(0, 0)).toBe(0)
    expect(clampStep(Number.NaN, 5)).toBe(0)
  })

  it('construit la clé audio et le compteur', () => {
    expect(audioKey('rcp', 0)).toBe('rcp-1')
    expect(audioKey('brul', 3)).toBe('brul-4')
    expect(pad2(3)).toBe('03')
    expect(pad2(12)).toBe('12')
  })

  it('lit exactement le texte affiché, avec les gestes interdits', () => {
    const step = URG[0].steps[0]
    expect(speechOf(step)).toBe('Appelez le 15. Mettez le haut-parleur. Faites chercher un défibrillateur.')
    const bruled = URG.find(u => u.id === 'brul')?.steps[3]
    expect(bruled && speechOf(bruled)).toContain('Ne pas : glace, beurre, dentifrice.')
  })
})

describe('URL ↔ étape', () => {
  it('parse les routes connues', () => {
    expect(parseRoute('')).toEqual({ page: 'home' })
    expect(parseRoute('#/')).toEqual({ page: 'home' })
    expect(parseRoute('#/appel')).toEqual({ page: 'appel' })
    expect(parseRoute('#/fiches')).toEqual({ page: 'fiches', u: null })
    expect(parseRoute('#/fiches/avc')).toEqual({ page: 'fiches', u: 'avc' })
    expect(parseRoute('#/guide/rcp/3')).toEqual({ page: 'guide', u: 'rcp', i: 2 })
  })

  it('borne et répare une URL d’étape', () => {
    expect(parseRoute('#/guide/rcp/0')).toEqual({ page: 'guide', u: 'rcp', i: 0 })
    expect(parseRoute('#/guide/rcp/999')).toEqual({ page: 'guide', u: 'rcp', i: 4 })
    expect(parseRoute('#/guide/inconnu/1')).toEqual({ page: 'home' })
  })

  it('fait l’aller-retour hash → route → hash', () => {
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

  it('détecte le changement de page utile', () => {
    expect(samePage({ page: 'guide', u: 'rcp', i: 0 }, { page: 'guide', u: 'rcp', i: 3 })).toBe(true)
    expect(samePage({ page: 'guide', u: 'rcp', i: 0 }, { page: 'guide', u: 'brul', i: 0 })).toBe(false)
    expect(samePage({ page: 'home' }, { page: 'appel' })).toBe(false)
  })
})
