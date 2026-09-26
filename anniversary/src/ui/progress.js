// Chapter index — archival notation, not a dashboard (PRD §25).
//   07 / 10  ARCHIVE / 07
//   │ │ │ ● │ │ …   (each tick is a button)
import { chapters } from '../content/scenes.js';
import { scrollToChapter } from '../motion/scroll.js';

let root;
let ticks = [];
let counter;
let name;

const pad = n => String(n).padStart(2, '0');

export function initProgress() {
  root = document.getElementById('progress');
  if (!root) return;

  counter = document.createElement('p');
  counter.className = 'progress__count t-index';
  counter.setAttribute('aria-hidden', 'true');

  name = document.createElement('p');
  name.className = 'progress__name t-index';
  name.setAttribute('aria-live', 'polite');

  const list = document.createElement('ol');
  list.className = 'progress__list';

  ticks = chapters.map((c, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'progress__tick';
    btn.type = 'button';
    btn.setAttribute('aria-label', `${pad(i + 1)} — ${c.title}`);
    btn.addEventListener('click', () => scrollToChapter(i, { at: c.enter + 0.02 }));
    li.append(btn);
    list.append(li);
    return btn;
  });

  root.append(counter, list, name);
}

export function showProgress() {
  if (root) root.hidden = false;
}

export function setProgress(index) {
  if (!root) return;
  const c = chapters[index];
  counter.textContent = `${pad(index + 1)} / ${pad(chapters.length)}`;
  name.textContent = c.title;
  ticks.forEach((t, i) => {
    if (i === index) t.setAttribute('aria-current', 'step');
    else t.removeAttribute('aria-current');
  });
}
