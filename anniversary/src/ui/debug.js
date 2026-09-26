// ?debug overlay — fps, tier, resident textures, current chapter (PRD §30 verification).
let el = null;

export function initDebug() {
  if (!new URLSearchParams(location.search).has('debug')) return;
  el = document.createElement('pre');
  el.className = 'debug';
  el.setAttribute('aria-hidden', 'true');
  document.body.append(el);
}

export function updateDebug(info) {
  if (!el) return;
  el.textContent = Object.entries(info).map(([k, v]) => `${k.padEnd(9)} ${v}`).join('\n');
  window.__BF_DEBUG__ = info;
}
