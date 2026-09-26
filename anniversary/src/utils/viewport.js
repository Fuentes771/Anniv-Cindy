// utils/viewport.js
export function isMobile() {
  return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 640;
}

export function isTablet() {
  return window.innerWidth <= 1024 && !isMobile();
}
