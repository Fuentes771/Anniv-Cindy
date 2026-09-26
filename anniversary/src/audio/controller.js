// Audio — user-gesture gate, fades, ducking, mute (PRD §12, §28).
// HTMLAudioElement → Web Audio GainNode, so fades are sample-accurate ramps
// instead of setInterval steps. Degrades to element volume without Web Audio,
// and to "no sound" (control hidden) when the file is missing.
import { copy } from '../content/letter.js';

const state = { available: !!copy.audio.src, unlocked: false, muted: false, level: 1 };
const listeners = new Set();
const MAX = copy.audio.volume;

let el;
let ctx = null;
let gain = null;

function emit() { listeners.forEach(fn => fn(state)); }

export function initAudio() {
  el = document.getElementById('bg-audio');
  if (!state.available || !el) { state.available = false; return; }
  el.src = copy.audio.src;
  el.addEventListener('error', () => { state.available = false; emit(); });

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (state.unlocked) ctx.resume();
  });
}

function target() {
  return state.muted ? 0 : MAX * state.level;
}

function ramp(value, seconds) {
  if (gain) {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(value, now + seconds);
  } else if (el) {
    el.volume = value; // fallback: no ramp
  }
}

/** Call synchronously inside the Enter click. Resolves true if music plays. */
export function unlockAudio() {
  if (!state.available || state.unlocked) return Promise.resolve(false);
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) {
      ctx = new AC();
      const source = ctx.createMediaElementSource(el);
      gain = ctx.createGain();
      gain.gain.value = 0;
      source.connect(gain).connect(ctx.destination);
      ctx.resume();
    } else {
      el.volume = 0;
    }
  } catch (err) {
    ctx = null;
    gain = null;
  }

  return el.play().then(() => {
    state.unlocked = true;
    ramp(target(), 2.5); // fade-in 1.5–3 s
    emit();
    return true;
  }).catch(() => {
    state.available = false;
    emit();
    return false;
  });
}

export function toggleMute() {
  state.muted = !state.muted;
  if (state.unlocked) ramp(target(), 0.6);
  emit();
  return state.muted;
}

/** Scene level (1 = full, 0.35 = ducked for the letter). */
export function setAudioLevel(level, seconds = 2.2) {
  if (state.level === level) return;
  state.level = level;
  if (state.unlocked) ramp(target(), seconds);
}

export function audioState() { return { ...state }; }

export function onAudioChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
