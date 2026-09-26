// UI Controls — audio toggle, scene progress dots
import gsap from 'gsap';
import { toggleMute, isMuted } from '../audio/controller.js';
import { ease } from '../motion/easing.js';

const SCENE_IDS = [
  'opening','frameField','environmentalDepth','reflectivePassage',
  'privateDetails','nightSpace','coupleArchive','quietCounterpoint',
  'letter','finalFrame',
];

export function initControls() {
  // ─── Audio toggle ───────────────────────────────────────
  const audioBtn = document.getElementById('audio-toggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const muted = toggleMute();
      audioBtn.setAttribute('aria-pressed', String(!muted));
    });
  }

  // Show controls after entry
  const controlsEl = document.getElementById('controls');
  if (controlsEl) {
    gsap.to(controlsEl.querySelector('.ctrl-audio'), {
      opacity: 1, duration: 1.0, delay: 0.5, ease: ease.out
    });
  }
}

export function showControls() {
  const controlsEl = document.getElementById('controls');
  if (controlsEl) {
    gsap.to(controlsEl, { opacity: 1, duration: 1.0, ease: ease.out });
  }
}

// ─── Scene progress dots ──────────────────────────────────
export function initProgress() {
  const progressEl = document.getElementById('progress');
  if (!progressEl) return;

  SCENE_IDS.forEach((id) => {
    const dot = document.createElement('button');
    dot.className = 'progress__dot';
    dot.setAttribute('aria-label', `Go to scene: ${id}`);
    dot.dataset.scene = id;
    progressEl.appendChild(dot);

    dot.addEventListener('click', () => {
      const target = document.querySelector(`[data-scene="${id}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Show progress
  gsap.to(progressEl, { opacity: 1, duration: 1.0, ease: ease.out });

  // Update active dot on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const dot = progressEl.querySelector(`[data-scene="${entry.target.dataset.scene}"]`);
        if (!dot) return;
        dot.classList.toggle('progress__dot--active', entry.isIntersecting);
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('[data-scene]').forEach(el => io.observe(el));
}
