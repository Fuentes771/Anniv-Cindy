// utils/performance.js — GPU budget helpers
// Track how many textures are currently resident
let _count = 0;

export function trackTextureAdd() { _count++; }
export function trackTextureRemove() { _count = Math.max(0, _count - 1); }
export function getTextureCount() { return _count; }

// ponytail: simple counter; upgrade to WebGL memory API if profiling shows issues
