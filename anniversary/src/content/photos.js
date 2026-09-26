// Photo curation layer (PRD §13, §33, §36–38).
//
// Facts (dimensions, derivatives, placeholder) come from photos-generated.js,
// which the asset pipeline writes. This file only decides *how* a photo is used:
// which chapter, in what order, its role/tier, focal point and alt text.
// Change curation here — scene modules never hard-code filenames.
//
// Numbers are the filename suffix: '42' → "Desain tanpa judul (42).jpg",
// '0' → "Desain tanpa judul.jpg".

import { manifest } from './photos-generated.js';

// Order inside each list = composition order in the scene (first = dominant).
export const chapterPhotos = {
  opening:            ['42'],
  frameField:         ['5', '0', '17', '4', '32', '41', '7'],
  environmentalDepth: ['12', '1', '6', '52', '53', '30'],
  reflectivePassage:  ['48', '27', '14', '13'],
  privateDetails:     ['8', '2', '20', '56', '24', '35', '3', '55'],
  nightSpace:         ['43', '44', '9', '28', '29'],
  coupleArchive:      ['49', '39', '46', '47', '38'],
  quietCounterpoint:  ['57', '54'],
  letter:             [],
  finalFrame:         ['42'],
};

// Deliberately left out after review (PRD §15, §36 Tier D). Kept here so the
// decision is visible and reversible.
export const excluded = {
  '11': 'near-duplicate of 9 (dHash distance 0)',
  '59': 'near-duplicate of 54 (dHash distance 0)',
  '45': 'visually near-identical to 42 (same moment); 42 is sharper',
  '25': 'near-identical to 24',
  '15': 'same cage framing as 13/14',
};

// Per-photo curation. Anything not listed falls back to DEFAULTS.
// focal: normalized point to keep in frame when a plane crops (x→right, y→down).
// alt: describes only what is visible — no invented place, date or event (PRD §40, AC-02).
const META = {
  '42': { role: 'hero',   tier: 'A', focal: { x: 0.52, y: 0.42 }, alt: 'Foto berdua pada malam hari, lampu panggung di kejauhan.' },
  '43': { role: 'couple', tier: 'A', focal: { x: 0.45, y: 0.45 }, alt: 'Berdua di tengah keramaian malam.' },
  '44': { role: 'couple', tier: 'A', focal: { x: 0.45, y: 0.35 }, alt: 'Berdua memakai jas hujan di keramaian malam.' },
  '48': { role: 'hero',   tier: 'A', focal: { x: 0.46, y: 0.55 }, alt: 'Pantulan berdua di cermin kaca sebuah lorong.' },
  '49': { role: 'hero',   tier: 'A', focal: { x: 0.50, y: 0.35 }, alt: 'Selfie berdua dari dekat.' },
  '39': { role: 'couple', tier: 'A', focal: { x: 0.55, y: 0.35 }, alt: 'Selfie berdua dengan latar merah.' },
  '46': { role: 'couple', tier: 'A', focal: { x: 0.55, y: 0.45 }, alt: 'Selfie berdua di dalam ruangan.' },
  '47': { role: 'couple', tier: 'A', focal: { x: 0.55, y: 0.45 }, alt: 'Selfie berdua sambil bergaya.' },
  '38': { role: 'couple', tier: 'B', focal: { x: 0.35, y: 0.60 }, alt: 'Berdua di bawah lengkung pintu.', note: 'Watermark @mixuepramuka — kept small and secondary (PRD §17).' },

  '0':  { role: 'support', tier: 'B', focal: { x: 0.45, y: 0.35 }, alt: 'Potret duduk di sebuah kafe.' },
  '4':  { role: 'support', tier: 'B', focal: { x: 0.50, y: 0.30 }, alt: 'Potret dengan latar dinding polos.' },
  '5':  { role: 'support', tier: 'B', focal: { x: 0.50, y: 0.30 }, alt: 'Potret dengan jaket biru.' },
  '7':  { role: 'support', tier: 'B', focal: { x: 0.50, y: 0.35 }, alt: 'Potret di ruangan dengan lampu biru.' },
  '17': { role: 'support', tier: 'B', focal: { x: 0.50, y: 0.35 }, alt: 'Potret berkacamata.' },
  '32': { role: 'support', tier: 'B', focal: { x: 0.50, y: 0.35 }, alt: 'Selfie berkacamata.' },
  '41': { role: 'support', tier: 'B', focal: { x: 0.50, y: 0.35 }, alt: 'Potret dengan tirai merah di belakang.' },

  '1':  { role: 'environment', tier: 'A', focal: { x: 0.55, y: 0.55 }, alt: 'Berdiri di pantai di balik sebuah tiang.' },
  '6':  { role: 'environment', tier: 'B', focal: { x: 0.45, y: 0.60 }, alt: 'Berdiri di tepi sungai berpohon.' },
  '12': { role: 'environment', tier: 'A', focal: { x: 0.45, y: 0.55 }, alt: 'Seekor burung merah hinggap di tangan, dikelilingi tanaman.' },
  '30': { role: 'environment', tier: 'B', focal: { x: 0.45, y: 0.70 }, alt: 'Berdiri di antara tanaman pada malam hari.' },
  '52': { role: 'environment', tier: 'B', focal: { x: 0.45, y: 0.50 }, alt: 'Berdiri di bawah pepohonan.' },
  '53': { role: 'environment', tier: 'B', focal: { x: 0.50, y: 0.55 }, alt: 'Duduk di bebatuan di bawah langit terang.' },
  '13': { role: 'environment', tier: 'B', focal: { x: 0.40, y: 0.60 }, alt: 'Duduk di dalam kandang kawat yang tinggi.' },
  '14': { role: 'environment', tier: 'A', focal: { x: 0.35, y: 0.60 }, alt: 'Merentangkan tangan di dalam kandang kawat, seekor merak di depan.' },
  '27': { role: 'environment', tier: 'A', focal: { x: 0.50, y: 0.55 }, alt: 'Berdiri di depan dinding bilah vertikal.' },

  '2':  { role: 'detail', tier: 'C', focal: { x: 0.55, y: 0.45 }, alt: 'Selfie dengan kerudung merah muda.' },
  '3':  { role: 'detail', tier: 'C', focal: { x: 0.45, y: 0.45 }, alt: 'Selfie dengan kerudung hitam.' },
  '8':  { role: 'detail', tier: 'C', focal: { x: 0.50, y: 0.40 }, alt: 'Dikelilingi tumpukan boneka.' },
  '20': { role: 'detail', tier: 'C', focal: { x: 0.50, y: 0.35 }, alt: 'Potret dengan latar merah muda.' },
  '24': { role: 'detail', tier: 'C', focal: { x: 0.50, y: 0.40 }, alt: 'Selfie sambil bergaya dengan tangan.' },
  '35': { role: 'detail', tier: 'C', focal: { x: 0.55, y: 0.45 }, alt: 'Selfie di depan dinding bertulisan.' },
  '55': { role: 'detail', tier: 'C', focal: { x: 0.50, y: 0.45 }, alt: 'Duduk di meja makan.' },
  '56': { role: 'detail', tier: 'C', focal: { x: 0.50, y: 0.45 }, alt: 'Berdiri di depan rak buku.' },

  '9':  { role: 'support', tier: 'B', focal: { x: 0.50, y: 0.45 }, alt: 'Di ruangan gelap penuh titik cahaya biru.' },
  '28': { role: 'support', tier: 'B', focal: { x: 0.45, y: 0.45 }, alt: 'Duduk di luar pada malam hari.' },
  '29': { role: 'support', tier: 'C', focal: { x: 0.50, y: 0.50 }, alt: 'Berdiri dalam gelap malam.' },

  '57': { role: 'closing', tier: 'B', focal: { x: 0.50, y: 0.55 }, alt: 'Memegang buket bunga di bawah pepohonan.' },
  '54': { role: 'support', tier: 'C', focal: { x: 0.40, y: 0.50 }, alt: 'Berdiri di antara rak toko buku.' },
};

const DEFAULTS = { role: 'support', tier: 'C', focal: { x: 0.5, y: 0.42 }, alt: '' };

const byNumber = new Map(manifest.map(p => [String(p.n), p]));

/** Merged photo record: manifest facts + curation. Throws on unknown ids so typos fail loudly. */
export function getPhoto(n) {
  const facts = byNumber.get(String(n));
  if (!facts) throw new Error(`Unknown photo "${n}" — check src/content/photos.js`);
  return { ...DEFAULTS, ...facts, ...(META[n] || {}), key: String(n) };
}

export function photosForChapter(chapterId) {
  return (chapterPhotos[chapterId] || []).map(getPhoto);
}

/** Every unique photo used in the journey, in order of first appearance. */
export function journeyPhotos() {
  const seen = new Set();
  const out = [];
  for (const list of Object.values(chapterPhotos)) {
    for (const n of list) {
      if (!seen.has(n)) { seen.add(n); out.push(getPhoto(n)); }
    }
  }
  return out;
}
