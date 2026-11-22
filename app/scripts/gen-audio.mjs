import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_DIR = dirname(SCRIPT_DIR);
const BASE_DIR = dirname(APP_DIR);
const SHARED_DIR = join(BASE_DIR, 'G-DESIGN', 'planches', 'shared');
const DATA_JS = join(SHARED_DIR, 'data.js');
const TTS_PS1 = join(SHARED_DIR, 'gen-audio.ps1');
const WAV_DIR = join(BASE_DIR, 'G-DESIGN', 'planches', 'audio');
const MP3_DIR = join(APP_DIR, 'public', 'audio');

function loadUrgences() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(DATA_JS, 'utf8'), sandbox, { filename: 'data.js' });
  return sandbox.window.URG;
}

function listSteps(urgences) {
  const steps = [];
  for (const u of urgences) {
    u.steps.forEach((_, i) => {
      const name = `${u.id}-${i + 1}`;
      steps.push({
        name,
        wav: join(WAV_DIR, `${name}.wav`),
        mp3: join(MP3_DIR, `${name}.mp3`),
      });
    });
  }
  return steps;
}

function runFfmpeg(wav, mp3) {
  const args = ['-y', '-i', wav, '-ac', '1', '-b:a', '64k', '-codec:a', 'libmp3lame', mp3];
  const r = spawnSync('ffmpeg', args, { encoding: 'utf8' });
  return r.status === 0;
}

function runTts() {
  const r = spawnSync('powershell', ['-NoProfile', '-File', TTS_PS1], { encoding: 'utf8' });
  if (r.status !== 0) console.error('TTS Windows échoué : ' + (r.stderr || '').trim());
}

function countMp3() {
  return readdirSync(MP3_DIR).filter((f) => f.endsWith('.mp3')).length;
}

export function generateAudio() {
  const steps = listSteps(loadUrgences());
  mkdirSync(MP3_DIR, { recursive: true });
  if (steps.some((s) => !existsSync(s.wav))) runTts();
  let generated = 0;
  for (const s of steps) {
    if (!existsSync(s.wav)) continue;
    if (runFfmpeg(s.wav, s.mp3)) generated++;
    else console.error(`Échec conversion : ${s.name}`);
  }
  const total = countMp3();
  console.log(`Audio : ${generated} converti(s), ${total} fichier(s) mp3 dans public/audio`);
  return { generated, total };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateAudio();
}
