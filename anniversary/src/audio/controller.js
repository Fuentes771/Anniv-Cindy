// Audio controller — user-gesture gate, fade in/out, mute toggle.
// Uses HTMLAudioElement (no Howler needed).

const audio = document.getElementById('bg-audio');
let unlocked = false;
let muted = false;

export function unlockAudio() {
  if (unlocked || !audio) return;
  unlocked = true;

  audio.volume = 0;
  audio.play().catch(() => {
    // autoplay blocked — will retry on next interaction
    unlocked = false;
  });

  // Fade in 2s
  const step = 0.04;
  const target = 0.55;
  const interval = setInterval(() => {
    if (audio.volume < target - step) {
      audio.volume = Math.min(audio.volume + step, target);
    } else {
      audio.volume = target;
      clearInterval(interval);
    }
  }, 80);
}

export function toggleMute() {
  muted = !muted;
  if (muted) {
    _fadeOut();
  } else {
    _fadeIn(0.55);
  }
  return muted;
}

export function isMuted() { return muted; }

function _fadeIn(target) {
  const interval = setInterval(() => {
    if (audio.volume < target - 0.03) {
      audio.volume = Math.min(audio.volume + 0.03, target);
    } else {
      audio.volume = target;
      clearInterval(interval);
    }
  }, 80);
}

function _fadeOut() {
  const interval = setInterval(() => {
    if (audio.volume > 0.03) {
      audio.volume = Math.max(audio.volume - 0.03, 0);
    } else {
      audio.volume = 0;
      clearInterval(interval);
    }
  }, 80);
}
