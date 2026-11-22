import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { URG, URG_BY_ID } from '../src/data';
import { ill, ILL_IDS } from '../src/illus';
import { speechOf } from '../src/state';

const EXPECTED_URG_IDS = ['rcp', 'etouf', 'hemo', 'pls', 'brul', 'avc', 'conv', 'mal'];
const EXPECTED_ILL_IDS = ['rcp', 'etouf', 'dos', 'hemo', 'pls', 'brul', 'avc', 'conv', 'mal', 'call', 'dae'];

describe('data.ts — 8 emergencies, 33 steps', () => {
  it('keeps the 8 emergencies in source order, with unique ids', () => {
    expect(URG).toHaveLength(8);
    expect(URG.map(u => u.id)).toEqual(EXPECTED_URG_IDS);
    expect(new Set(URG.map(u => u.id)).size).toBe(8);
  });

  it('URG_BY_ID indexes every emergency', () => {
    expect(Object.keys(URG_BY_ID)).toEqual(EXPECTED_URG_IDS);
    for (const u of URG) expect(URG_BY_ID[u.id]).toBe(u);
  });

  it('has 33 steps with non-empty titles and instructions', () => {
    expect(URG.reduce((n, u) => n + u.steps.length, 0)).toBe(33);
    for (const u of URG) {
      expect(u.nom.trim()).not.toBe('');
      expect(u.signe.trim()).not.toBe('');
      for (const s of u.steps) {
        expect(s.t.trim()).not.toBe('');
        expect(s.x.trim()).not.toBe('');
      }
    }
  });

  it('every step points to an existing illustration', () => {
    for (const u of URG) {
      for (const s of u.steps) {
        expect(ILL_IDS).toContain(s.il ?? u.id);
      }
    }
  });

  it('metro and no match the source', () => {
    const metro = URG.flatMap(u => u.steps.map((s, i) => s.metro ? `${u.id}-${i + 1}` : null)).filter(Boolean);
    expect(metro).toEqual(['rcp-3', 'rcp-5']);

    const no: Record<string, string[]> = {};
    for (const u of URG) {
      u.steps.forEach((s, i) => {
        if (s.no) no[`${u.id}-${i + 1}`] = s.no;
      });
    }
    expect(no).toEqual({
      'brul-4': ['ice', 'butter', 'toothpaste'],
      'avc-4': ['drink', 'eat'],
      'conv-2': ['hold them down', 'put anything in their mouth']
    });
  });
});

describe('English spoken text', () => {
  it('reads the displayed English title and instruction', () => {
    expect(speechOf(URG[0].steps[0]))
      .toBe('Call 15. Put the phone on speaker. Have someone fetch a defibrillator.');
    expect(URG_BY_ID.rcp.nom).toBe('Cardiac arrest');
    expect(URG_BY_ID.rcp.steps[2].t).toBe('Push hard and fast');
    expect(URG_BY_ID.etouf.nom).toBe('Choking');
    expect(URG_BY_ID.etouf.steps[2].t).toBe('5 abdominal thrusts');
    expect(URG_BY_ID.hemo.nom).toBe('Severe bleeding');
    expect(URG_BY_ID.pls.nom).toBe('Unconscious but breathing');
    expect(URG_BY_ID.brul.nom).toBe('Burn');
    expect(URG_BY_ID.avc.nom).toBe('Stroke');
    expect(URG_BY_ID.conv.nom).toBe('Seizures');
    expect(URG_BY_ID.mal.nom).toBe('Sudden illness');
  });

  it('lists the forbidden actions in English', () => {
    const burn = URG_BY_ID.brul.steps[3];
    const stroke = URG_BY_ID.avc.steps[3];
    const seizure = URG_BY_ID.conv.steps[1];
    expect(burn && speechOf(burn)).toContain('ice, butter, toothpaste');
    expect(stroke && speechOf(stroke)).toContain('drink, eat');
    expect(seizure && speechOf(seizure)).toContain('hold them down, put anything in their mouth');
  });
});

describe('illus.ts — 11 SVG drawings', () => {
  it('exposes exactly the 11 ids in source order', () => {
    expect(ILL_IDS).toEqual(EXPECTED_ILL_IDS);
  });

  it('ill(id) opens an svg tag with the id class', () => {
    for (const id of ILL_IDS) {
      const svg = ill(id);
      expect(svg.startsWith(`<svg class="il il-${id}" viewBox="0 0 240 180" aria-hidden="true">`)).toBe(true);
      expect(svg.endsWith('</svg>')).toBe(true);
    }
  });

  it('ill(unknown) falls back to the call drawing', () => {
    expect(ill('unknown')).toBe(ill('call').replace('il-call', 'il-unknown'));
  });
});

describe('audio files', () => {
  it('all 33 public/audio/<id>-<n>.mp3 files exist', () => {
    const names = URG.flatMap(u => u.steps.map((_, i) => `${u.id}-${i + 1}.mp3`));
    expect(names).toHaveLength(33);
    const missing = names.filter(name => !existsSync(fileURLToPath(new URL(`../public/audio/${name}`, import.meta.url))));
    expect(missing).toEqual([]);
  });
});
