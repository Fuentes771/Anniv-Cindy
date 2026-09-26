// utils/performance.js — quality tiers + frame-rate watchdog (PRD §30)
import { isMobile, isTouch } from './viewport.js';

export const TIERS = {
  high:   { dpr: 2,    anisotropy: 4, grain: 0.022, archive: 40 },
  medium: { dpr: 1.5,  anisotropy: 2, grain: 0.018, archive: 24 },
  low:    { dpr: 1,    anisotropy: 1, grain: 0,     archive: 12 },
};
const ORDER = ['low', 'medium', 'high'];

export function detectTier() {
  const nav = navigator;
  const memory = nav.deviceMemory || 8;
  const cores = nav.hardwareConcurrency || 8;
  const saveData = nav.connection && nav.connection.saveData;

  if (saveData || memory <= 2 || cores <= 2) return 'low';
  if (isMobile() && (memory <= 4 || cores <= 4)) return 'low';
  if (isMobile() || isTouch() || memory <= 4) return 'medium';
  return 'high';
}

/**
 * Watches frame time; calls onDowngrade(nextTier) when the average stays
 * under `minFps` for `windowSec`. Never upgrades (stability over sparkle).
 */
export function createFpsMonitor(tier, onDowngrade, { minFps = 45, windowSec = 2.5 } = {}) {
  let current = tier;
  let acc = 0;
  let frames = 0;
  let fps = 60;

  return {
    get fps() { return fps; },
    get tier() { return current; },
    sample(dt) {
      if (dt > 0.25) return; // tab switch / hitch — ignore
      acc += dt;
      frames++;
      if (acc < windowSec) return;
      fps = frames / acc;
      acc = 0;
      frames = 0;
      const idx = ORDER.indexOf(current);
      if (fps < minFps && idx > 0) {
        current = ORDER[idx - 1];
        onDowngrade(current);
      }
    },
  };
}
