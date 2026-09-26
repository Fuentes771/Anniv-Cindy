// SCENE 00 — Entry
// Minimal: fade in copy + magnetic button → triggers app start
import gsap from 'gsap';
import { ease } from '../motion/easing.js';

export function initEntry({ onEnter }) {
  const forYou = document.querySelector('.entry__for-you');
  const date   = document.querySelector('.entry__date');
  const btn    = document.getElementById('enter-btn');

  // Fade in sequence
  const tl = gsap.timeline({ delay: 0.4 });
  tl.to(forYou, { opacity: 1, y: 0, duration: 1.2, ease: ease.out }, 0)
    .fromTo(forYou, { y: 18 }, { y: 0, duration: 1.2, ease: ease.out }, 0)
    .to(date,   { opacity: 0.5, duration: 1.0, ease: ease.out }, 0.5)
    .fromTo(date, { y: 12 }, { y: 0, duration: 1.0, ease: ease.out }, 0.5)
    .to(btn,    { opacity: 1, duration: 0.9, ease: ease.out }, 0.9);

  // Magnetic button — subtle pull toward cursor
  btn.addEventListener('pointermove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) * 0.18;
    const dy = (e.clientY - cy) * 0.18;
    gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: ease.out });
  });
  btn.addEventListener('pointerleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: ease.out });
  });

  btn.addEventListener('click', () => {
    gsap.to('#scene-entry', {
      opacity: 0, duration: 1.0, ease: ease.in,
      onComplete: () => {
        document.getElementById('scene-entry').style.display = 'none';
        document.getElementById('scroll-container').setAttribute('aria-hidden', 'false');
        onEnter();
      }
    });
  });

  // Keyboard: Enter key
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') btn.click();
  });
}
