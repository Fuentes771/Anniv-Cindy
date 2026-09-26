// SCENE 00 — Entry / Unlock
// Almost black. Small type, one visual hint (the opening frame far away in the
// canvas behind), a thin load line, and ENTER. Music starts only from this click.
import gsap from 'gsap';
import { ease, reducedMotion } from '../motion/easing.js';
import { copy } from '../content/letter.js';

export function initEntry({ onEnter }) {
  const root = document.getElementById('entry');
  const forYou = root.querySelector('[data-entry="for-you"]');
  const date = root.querySelector('[data-entry="date"]');
  const btn = root.querySelector('#enter-btn');
  const bar = root.querySelector('.entry__load');

  forYou.textContent = copy.entry.forYou;
  date.textContent = copy.entry.date;
  btn.querySelector('span').textContent = copy.entry.enter;

  const intro = gsap.timeline({ delay: 0.3 });
  if (reducedMotion) {
    intro.to([forYou, date, bar], { opacity: 1, duration: 0.6 });
  } else {
    intro
      .fromTo(forYou, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.4, ease: ease.out }, 0)
      .fromTo(date, { opacity: 0, y: 10 }, { opacity: 0.6, y: 0, duration: 1.2, ease: ease.out }, 0.45)
      .to(bar, { opacity: 1, duration: 0.8 }, 0.8);
  }

  // Magnetic, but light (PRD §7 Scene 00, §11)
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (fine && !reducedMotion) {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.18,
        y: (e.clientY - (r.top + r.height / 2)) * 0.18,
        duration: 0.35, ease: ease.ui,
      });
    });
    btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: ease.out }));
  }

  let entered = false;
  btn.addEventListener('click', () => {
    if (entered || btn.disabled) return;
    entered = true;
    onEnter(); // synchronous inside the gesture → audio can unlock
    gsap.to(root, {
      opacity: 0,
      duration: reducedMotion ? 0.3 : 1.1,
      ease: ease.inOut,
      onComplete: () => { root.hidden = true; },
    });
  });

  return {
    /** 0..1 — critical textures loaded. */
    setProgress(p) {
      bar.style.setProperty('--p', p.toFixed(3));
      bar.setAttribute('aria-valuenow', String(Math.round(p * 100)));
    },
    ready() {
      bar.classList.add('is-done');
      btn.disabled = false;
      gsap.fromTo(btn, { opacity: 0 }, { opacity: 1, duration: reducedMotion ? 0.3 : 1.0, ease: ease.out });
    },
  };
}
