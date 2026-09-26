// Builds the semantic DOM for every chapter from the scene contracts.
// Text lives here as HTML (PRD §31.5); the canvas behind is aria-hidden.
import { chapters } from '../content/scenes.js';
import { photosForChapter } from '../content/photos.js';
import { copy, letter } from '../content/letter.js';

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'style') node.style.cssText = v;
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of [].concat(children)) if (c) node.append(c);
  return node;
}

function altList(id) {
  const alts = photosForChapter(id).map(p => p.alt).filter(Boolean);
  if (!alts.length) return null;
  return el('ul', { class: 'sr-only' }, alts.map(a => el('li', { text: a })));
}

function meta(c) {
  const caption = copy.captions[c.id];
  return el('div', { class: 'chapter__meta', 'data-align': c.align }, [
    el('p', { class: 'chapter__label t-index', 'aria-hidden': 'true', text: c.label }),
    caption ? el('p', { class: 'chapter__caption t-caption', text: caption }) : null,
  ]);
}

function openingInner(c) {
  return el('div', { class: 'chapter__meta chapter__meta--opening', 'data-align': c.align }, [
    el('p', { class: 'opening__title t-display', 'data-reveal-hero': '', text: copy.title }),
    el('p', { class: 'opening__meta t-index', 'data-reveal-hero': '' }, [
      el('span', { text: c.label }),
      el('span', { class: 'opening__rule', 'aria-hidden': 'true' }),
      el('span', { text: copy.entry.date }),
    ]),
    copy.heroStatement
      ? el('p', { class: 'opening__statement t-body', 'data-reveal-hero': '', text: copy.heroStatement })
      : null,
    el('p', { class: 'opening__hint t-index', 'aria-hidden': 'true', 'data-reveal-hero': '', text: 'scroll' }),
  ]);
}

function letterInner() {
  return el('article', { class: 'letter', 'aria-labelledby': 'h-letter' }, [
    el('p', { class: 'letter__for-you t-for-you', 'data-reveal': '', text: letter.forYou }),
    el('div', { class: 'letter__body' }, letter.body.map(t => el('p', { class: 't-letter', 'data-reveal': '', text: t }))),
    el('p', { class: 'letter__signature t-letter', 'data-reveal': '', text: letter.signature }),
  ]);
}

function finalInner() {
  return el('div', { class: 'final' }, [
    el('p', { class: 'final__line t-display', text: copy.finalLine }),
  ]);
}

/** @returns {HTMLElement[]} section elements in chapter order */
export function buildChapters(root) {
  const sections = chapters.map((c, i) => {
    const section = el('section', {
      id: `ch-${c.id}`,
      class: `chapter chapter--${c.id}`,
      'data-scene': c.id,
      'data-index': i,
      'aria-labelledby': `h-${c.id}`,
      style: c.height ? `--h:${c.height}` : null,
    });
    section.append(el('h2', { id: `h-${c.id}`, class: 'sr-only', text: c.title }));

    if (c.id === 'opening') section.append(openingInner(c));
    else if (c.id === 'letter') section.append(letterInner());
    else if (c.id === 'finalFrame') section.append(finalInner());
    else if (c.label) section.append(meta(c));

    const alts = altList(c.id);
    if (alts) section.append(alts);
    root.append(section);
    return section;
  });
  return sections;
}

export { el };
