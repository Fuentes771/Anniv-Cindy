// SCENE 09 — Letter
// DOM-only: text reveal, no 3D. Most human scene.
import gsap from 'gsap';
import { scrollScene } from '../motion/scroll.js';
import { reducedMotion, ease } from '../motion/easing.js';
import { letter } from '../content/letter.js';

let scrollTrigger;

export function initLetter() {
  // Populate letter content from data
  const contentEl   = document.getElementById('letter-content');
  const signatureEl = document.getElementById('letter-signature');

  if (contentEl && letter.body.length) {
    contentEl.innerHTML = letter.body
      .map(para => `<p>${para}</p>`)
      .join('');
  }

  if (signatureEl) {
    signatureEl.textContent = letter.signature;
  }

  // Text reveal on scroll
  const paragraphs = contentEl ? contentEl.querySelectorAll('p') : [];
  const forYouEl   = document.querySelector('.letter__for-you');
  const allText    = [forYouEl, ...paragraphs, signatureEl].filter(Boolean);

  if (reducedMotion) {
    // Just show everything
    allText.forEach(el => { if (el) el.style.opacity = '1'; });
    return;
  }

  // Initial state
  gsap.set(allText, { opacity: 0, y: 24 });

  const trigger = document.querySelector('[data-scene="letter"]');
  scrollTrigger = scrollScene({
    trigger,
    start: 'top 80%',
    end: 'center center',
    onUpdate: (prog) => {
      // reveal staggered by progress
      allText.forEach((el, i) => {
        const threshold = i / allText.length;
        if (prog > threshold) {
          const localProg = Math.min((prog - threshold) * allText.length, 1);
          gsap.to(el, {
            opacity: localProg,
            y: 24 * (1 - localProg),
            duration: 0.01,
            overwrite: 'auto',
          });
        }
      });
    },
  });
}

export function disposeLetter() {
  scrollTrigger && scrollTrigger.kill();
}
