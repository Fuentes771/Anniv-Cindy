// Master scroll → chapter progress (PRD §9).
//
// Native scroll only. One reading per frame maps the viewport centre line to
// (chapter index, local progress 0..1). Section heights define the pacing.
// The camera rig — not the scroll — provides smoothing.
import { clamp } from '../utils/math.js';

let sections = [];
let starts = [];
let ends = [];

export function initScroll(sectionEls) {
  sections = sectionEls;
  measure();
  const ro = new ResizeObserver(measure);
  sections.forEach(s => ro.observe(s));
  window.addEventListener('resize', measure);
}

export function measure() {
  if (!sections.length) return;
  const vh = window.innerHeight;
  const y = window.scrollY;
  const tops = sections.map(s => s.getBoundingClientRect().top + y);
  const max = document.documentElement.scrollHeight - vh;
  const n = sections.length;
  starts = tops.map((t, i) => (i === 0 ? vh * 0.5 : t));
  ends = tops.map((t, i) => (i === n - 1 ? max + vh * 0.5 : tops[i + 1]));
}

/** @returns {{ index: number, progress: number, local: (i:number)=>number }} */
export function readScroll() {
  const s = window.scrollY + window.innerHeight * 0.5;
  let index = 0;
  for (let i = 0; i < starts.length; i++) {
    if (s >= starts[i]) index = i;
  }
  const local = i => clamp((s - starts[i]) / Math.max(ends[i] - starts[i], 1));
  return { index, progress: local(index), local };
}

/** Scroll so chapter `i` sits just past its entry transition. */
export function scrollToChapter(i, { smooth = true, at = 0 } = {}) {
  if (!starts.length) return;
  const vh = window.innerHeight;
  const y = starts[i] + (ends[i] - starts[i]) * at - vh * 0.5 + 2;
  window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' });
}
