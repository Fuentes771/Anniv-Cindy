// Verifies curation ↔ manifest ↔ files on disk (PRD §42 "no missing assets").
// Usage: npm run check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { manifest } from '../src/content/photos-generated.js';
import { chapterPhotos, excluded } from '../src/content/photos.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const byN = new Map(manifest.map(p => [String(p.n), p]));

for (const [chapter, list] of Object.entries(chapterPhotos)) {
  for (const n of list) {
    const p = byN.get(n);
    if (!p) { errors.push(`${chapter}: photo "${n}" not in manifest`); continue; }
    if (excluded[n]) errors.push(`${chapter}: photo "${n}" is marked excluded (${excluded[n]})`);
    for (const src of Object.values(p.srcs)) {
      if (!fs.existsSync(path.join(root, 'public', src))) errors.push(`${chapter}: missing file public${src}`);
    }
    if (!p.width || !p.height) errors.push(`${chapter}: photo "${n}" has no dimensions`);
  }
  const dupes = list.filter((n, i) => list.indexOf(n) !== i);
  if (dupes.length) errors.push(`${chapter}: duplicate entries ${dupes.join(', ')}`);
}

const used = new Set(Object.values(chapterPhotos).flat());
console.log(`manifest: ${manifest.length} · used: ${used.size} unique · excluded: ${Object.keys(excluded).length}`);

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('✓ curation, manifest and files are consistent');
