// Custom cursor — follows pointer with slight lag (desktop only)
import gsap from 'gsap';

export function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  // Hide native cursor on pointer:fine already handled in CSS
  const pos = { x: -100, y: -100 };

  window.addEventListener('pointermove', (e) => {
    gsap.to(pos, {
      x: e.clientX, y: e.clientY,
      duration: 0.18,
      ease: 'power2.out',
      onUpdate: () => {
        cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      },
    });
  });

  // Scale on hover interactive elements
  document.querySelectorAll('button, a, [data-cursor="expand"]').forEach(el => {
    el.addEventListener('pointerenter', () => {
      gsap.to(cursor, { width: 24, height: 24, duration: 0.2, ease: 'power2.out' });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(cursor, { width: 8, height: 8, duration: 0.2, ease: 'power2.out' });
    });
  });
}
