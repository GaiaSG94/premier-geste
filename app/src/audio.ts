/* First Aid — single voice: audio file, then speech-synthesis fallback. */

const EXTS = ['mp3', 'ogg'] as const
const FEMALE = /hortense|julie|am[eé]lie|audrey|denise|marie|eloise|vivienne|female/i
type Listener = () => void

let token = 0
let currentAudio: HTMLAudioElement | null = null
let isSpeaking = false
let voiceFR: SpeechSynthesisVoice | null = null
const listeners = new Set<Listener>()

function hasTTS(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function pickVoice(): void {
  if (!hasTTS()) return
  try {
    const fr = window.speechSynthesis.getVoices().filter(v => /^fr/i.test(v.lang))
    voiceFR = fr.find(v => FEMALE.test(v.name)) ?? fr[0] ?? null
  } catch {
    voiceFR = null
  }
}

if (hasTTS()) {
  pickVoice()
  try {
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
  } catch {
    try { window.speechSynthesis.onvoiceschanged = pickVoice } catch {}
  }
}

function notify(): void {
  for (const fn of [...listeners]) {
    try { fn() } catch {}
  }
}

function setSpeaking(value: boolean): void {
  if (isSpeaking === value) return
  isSpeaking = value
  notify()
}

function clearPlayback(): void {
  token++
  const audio = currentAudio
  currentAudio = null
  if (audio) {
    try { audio.pause() } catch {}
  }
  if (hasTTS()) {
    try { window.speechSynthesis.cancel() } catch {}
  }
}

function stop(silent = false): void {
  clearPlayback()
  if (silent) isSpeaking = false
  else setSpeaking(false)
}

function speak(text: string, myToken: number): void {
  if (myToken !== token) return
  if (!hasTTS()) { stop(); return }
  if (!voiceFR) pickVoice()
  let utterance: SpeechSynthesisUtterance
  try {
    utterance = new SpeechSynthesisUtterance(text)
  } catch {
    stop()
    return
  }
  utterance.lang = 'fr-FR'
  utterance.rate = 0.95
  if (voiceFR) {
    try { utterance.voice = voiceFR } catch {}
  }
  const finish = (): void => { if (myToken === token) stop() }
  utterance.onend = finish
  utterance.onerror = finish
  try {
    window.speechSynthesis.speak(utterance)
  } catch {
    finish()
  }
}

function playFile(text: string, key: string, index: number, myToken: number): void {
  if (myToken !== token) return
  const ext = EXTS[index]
  if (!ext || typeof Audio === 'undefined' || typeof document === 'undefined') {
    speak(text, myToken)
    return
  }
  let audio: HTMLAudioElement
  try {
    audio = new Audio(new URL('audio/' + key + '.' + ext, document.baseURI).href)
  } catch {
    playFile(text, key, index + 1, myToken)
    return
  }
  currentAudio = audio
  let settled = false
  const finish = (fallback: boolean): void => {
    if (settled || myToken !== token) return
    settled = true
    if (currentAudio === audio) currentAudio = null
    if (fallback) playFile(text, key, index + 1, myToken)
    else stop()
  }
  audio.addEventListener('ended', () => finish(false))
  audio.addEventListener('error', () => finish(true))
  try {
    const played = audio.play()
    if (played && typeof played.catch === 'function') played.catch(() => finish(true))
  } catch {
    finish(true)
  }
}

function say(text: string, key: string): void {
  stop(true)
  const myToken = token
  setSpeaking(true)
  playFile(text, key, 0, myToken)
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}

export const voice = {
  say,
  stop,
  get speaking(): boolean { return isSpeaking },
  subscribe,
}
