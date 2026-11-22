import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { URG, URG_BY_ID } from '../src/data';
import { ill, ILL_IDS } from '../src/illus';

const EXPECTED_URG_IDS = ['rcp', 'etouf', 'hemo', 'pls', 'brul', 'avc', 'conv', 'mal'];
const EXPECTED_ILL_IDS = ['rcp', 'etouf', 'dos', 'hemo', 'pls', 'brul', 'avc', 'conv', 'mal', 'call', 'dae'];

describe('data.js — 8 urgences, 33 étapes', () => {
  it('conserve les 8 urgences dans l’ordre source, avec des ids uniques', () => {
    expect(URG).toHaveLength(8);
    expect(URG.map(u => u.id)).toEqual(EXPECTED_URG_IDS);
    expect(new Set(URG.map(u => u.id)).size).toBe(8);
  });

  it('URG_BY_ID indexe chaque urgence', () => {
    expect(Object.keys(URG_BY_ID)).toEqual(EXPECTED_URG_IDS);
    for (const u of URG) expect(URG_BY_ID[u.id]).toBe(u);
  });

  it('totalise 33 étapes avec un titre et une consigne non vides', () => {
    expect(URG.reduce((n, u) => n + u.steps.length, 0)).toBe(33);
    for (const u of URG) {
      for (const s of u.steps) {
        expect(s.t.trim()).not.toBe('');
        expect(s.x.trim()).not.toBe('');
      }
    }
  });

  it('chaque étape pointe vers une illustration existante', () => {
    for (const u of URG) {
      for (const s of u.steps) {
        expect(ILL_IDS).toContain(s.il ?? u.id);
      }
    }
  });

  it('metro et no sont cohérents avec la source', () => {
    const metro = URG.flatMap(u => u.steps.map((s, i) => s.metro ? `${u.id}-${i + 1}` : null)).filter(Boolean);
    expect(metro).toEqual(['rcp-3', 'rcp-5']);

    const no: Record<string, string[]> = {};
    for (const u of URG) {
      u.steps.forEach((s, i) => {
        if (s.no) no[`${u.id}-${i + 1}`] = s.no;
      });
    }
    expect(no).toEqual({
      'brul-4': ['glace', 'beurre', 'dentifrice'],
      'avc-4': ['boire', 'manger'],
      'conv-2': ['tenir', 'rien dans la bouche']
    });
  });
});

describe('illus.js — 11 dessins SVG', () => {
  it('expose exactement les 11 ids dans l’ordre source', () => {
    expect(ILL_IDS).toEqual(EXPECTED_ILL_IDS);
  });

  it('ill(id) ouvre une balise svg avec la classe de l’id', () => {
    for (const id of ILL_IDS) {
      const svg = ill(id);
      expect(svg.startsWith(`<svg class="il il-${id}" viewBox="0 0 240 180" aria-hidden="true">`)).toBe(true);
      expect(svg.endsWith('</svg>')).toBe(true);
    }
  });

  it('ill(inconnu) replie sur le dessin call', () => {
    expect(ill('inconnu')).toBe(ill('call').replace('il-call', 'il-inconnu'));
  });
});

describe('fichiers audio', () => {
  it('les 33 fichiers public/audio/<id>-<n>.mp3 existent', () => {
    const names = URG.flatMap(u => u.steps.map((_, i) => `${u.id}-${i + 1}.mp3`));
    expect(names).toHaveLength(33);
    const missing = names.filter(name => !existsSync(fileURLToPath(new URL(`../public/audio/${name}`, import.meta.url))));
    expect(missing).toEqual([]);
  });
});
