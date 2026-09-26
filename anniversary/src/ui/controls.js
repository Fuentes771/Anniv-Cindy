// Sound control — "sound ─── on/off" (PRD §12). Hidden when no music is available.
import { toggleMute, audioState, onAudioChange } from '../audio/controller.js';

export function initControls() {
  const root = document.getElementById('controls');
  const btn = document.getElementById('audio-toggle');
  const stateEl = btn.querySelector('.ctrl-audio__state');

  btn.addEventListener('click', () => toggleMute());

  const render = () => {
    const s = audioState();
    root.hidden = !s.available || !s.unlocked;
    const on = s.unlocked && !s.muted;
    btn.setAttribute('aria-pressed', String(on));
    stateEl.textContent = on ? 'on' : 'off';
  };
  onAudioChange(render);
  render();
}
