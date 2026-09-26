// utils/viewport.js — device + layout queries
const mq = q => window.matchMedia(q);

export const isTouch = () => mq('(pointer: coarse)').matches || !mq('(hover: hover)').matches;

// "Mobile" means the recomposed layout (PRD §21, §35), not the device class:
// narrow screens and tall portrait viewports both get it.
export function isMobile() {
  return window.innerWidth < 700 || window.innerWidth / window.innerHeight < 0.8;
}

export function isTablet() {
  return !isMobile() && window.innerWidth <= 1100;
}
