import { describe, it, expect } from 'vitest';
import { METRO_INTERVAL_MS, beatTimes, dueBeats } from '../src/metro';

describe('METRO_INTERVAL_MS', () => {
  it('vaut 545 ms, soit environ 110 battements par minute', () => {
    expect(METRO_INTERVAL_MS).toBe(545);
    expect(60_000 / METRO_INTERVAL_MS).toBeCloseTo(110, 0);
  });
});

describe('beatTimes', () => {
  it('retourne [] pour count nul ou négatif', () => {
    expect(beatTimes(0, 0)).toEqual([]);
    expect(beatTimes(1234, -5)).toEqual([]);
  });

  it('retourne exactement count valeurs, en commençant par start', () => {
    expect(beatTimes(1000, 1)).toEqual([1000]);
    expect(beatTimes(1000, 4)).toEqual([1000, 1545, 2090, 2635]);
    expect(beatTimes(1000, 110)).toHaveLength(110);
  });

  it('garde un espacement exact de 545 ms et une suite strictement croissante', () => {
    const beats = beatTimes(250, 50);
    for (let i = 1; i < beats.length; i++) {
      expect(beats[i] - beats[i - 1]).toBe(545);
      expect(beats[i]).toBeGreaterThan(beats[i - 1]);
    }
  });

  it('accepte un départ négatif', () => {
    expect(beatTimes(-545, 3)).toEqual([-545, 0, 545]);
  });

  it('couvre environ une minute sur 110 battements (60,5 s au tempo arrondi à 550 ms)', () => {
    const beats = beatTimes(0, 110);
    expect(beats).toHaveLength(110);
    expect(beats[109]).toBe(109 * 545);

    const cycleEnd = beatTimes(0, 111)[110];
    expect(cycleEnd).toBe(110 * 545);
    expect(cycleEnd / 1000).toBe(59.95);
    expect(110 * 0.55).toBeCloseTo(60.5, 1);
  });
});

describe('dueBeats — fenêtre de lookahead', () => {
  it('ne retourne que les battements tombant dans [now, now + horizon]', () => {
    expect(dueBeats(545, 500, 100, 8)).toEqual([545]);
    expect(dueBeats(545, 500, 700, 8)).toEqual([545, 1090]);
    expect(dueBeats(1635, 500, 100, 8)).toEqual([]);
  });

  it('inclut la borne et respecte la limite de count', () => {
    expect(dueBeats(600, 500, 100, 8)).toEqual([600]);
    expect(dueBeats(100, 0, 10_000, 3)).toEqual([100, 645, 1190]);
    expect(dueBeats(545, 500, 100, 0)).toEqual([]);
  });

  it('rejette les entrées non finies ou un horizon négatif', () => {
    expect(dueBeats(Number.NaN, 0, 100, 8)).toEqual([]);
    expect(dueBeats(0, Number.NaN, 100, 8)).toEqual([]);
    expect(dueBeats(0, 0, -1, 8)).toEqual([]);
  });
});
