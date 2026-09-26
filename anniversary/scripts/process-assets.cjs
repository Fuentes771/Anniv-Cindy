/**
 * Asset pipeline (PRD §15, §16, §19)
 *
 *   Original JPEG → orientation normalization → derivatives (WebP)
 *   → blur placeholder → factual manifest + duplicate report
 *
 * Usage:   npm run process-assets            (skips derivatives that already exist)
 *          npm run process-assets -- --force (regenerates every derivative)
 *
 * Output:  public/assets/images/{thumb,content,hero}/<id>.webp
 *          src/content/photos-generated.js   (facts only — curation lives in photos.js)
 *          scripts/asset-report.md           (exact + near-duplicate review list)
 *
 * Nothing is deleted or excluded automatically: the report is for the owner to review.
 */

const sharp  = require('sharp');
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const INPUT_DIR = path.resolve(__dirname, '../../FOTO');
const OUT_BASE  = path.resolve(__dirname, '../public/assets/images');
const MANIFEST  = path.resolve(__dirname, '../src/content/photos-generated.js');
const REPORT    = path.resolve(__dirname, 'asset-report.md');
const FORCE     = process.argv.includes('--force');

// Long-edge sizes. Sources top out at ~1280px, so `withoutEnlargement` keeps
// content/hero at native resolution — hero differs only by higher quality.
const SIZES = {
  thumb:   { edge: 480,  quality: 72 },
  content: { edge: 1400, quality: 82 },
  hero:    { edge: 2000, quality: 90 },
};

// Only TIER A frames get the higher-quality hero derivative (PRD §14).
const HERO_IDS = new Set(['39', '42', '43', '46', '48', '49']);

// Pixel-sideways files verified visually (PRD §16). Degrees clockwise.
// All five have the subject's head on the right edge → rotate 270° (= 90° CCW).
const ROTATE_OVERRIDES = {
  '22': 270,
  '26': 270,
  '35': 270,
  '46': 270,
  '47': 270,
};

const NEAR_DUP_DISTANCE = 10; // dHash Hamming distance (0–64) reported for review

function extractId(filename) {
  // "Desain tanpa judul (42).jpg" → "42", "Desain tanpa judul.jpg" → "0"
  const match = filename.match(/\((\d+)\)/);
  return match ? match[1] : '0';
}

function hashBuffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// Normalized pipeline start: EXIF orientation, then manual override.
function normalized(buf, id) {
  let img = sharp(buf).rotate();
  if (ROTATE_OVERRIDES[id]) img = sharp(buf).rotate().rotate(ROTATE_OVERRIDES[id]);
  return img;
}

// 64-bit difference hash, as a hex string.
async function dHash(buf, id) {
  const px = await normalized(buf, id)
    .greyscale()
    .resize(9, 8, { fit: 'fill' })
    .raw()
    .toBuffer();
  let bits = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      bits += px[y * 9 + x] > px[y * 9 + x + 1] ? '1' : '0';
    }
  }
  return BigInt('0b' + bits).toString(16).padStart(16, '0');
}

function hamming(a, b) {
  let v = BigInt('0x' + a) ^ BigInt('0x' + b);
  let n = 0;
  while (v) { n += Number(v & 1n); v >>= 1n; }
  return n;
}

async function processFile(filename) {
  const id  = extractId(filename);
  const buf = fs.readFileSync(path.join(INPUT_DIR, filename));

  const { data: normBuf, info } = await normalized(buf, id).toBuffer({ resolveWithObject: true });
  const width  = info.width;
  const height = info.height;
  const stats  = await sharp(normBuf).stats();
  const [r, g, b] = stats.channels.map(c => Math.round(c.mean));

  const entry = {
    id: `img-${id}`,
    n: Number(id),
    filename,
    width,
    height,
    orientation: height > width ? 'portrait' : width > height ? 'landscape' : 'square',
    rotated: ROTATE_OVERRIDES[id] || 0,
    dominantColor: `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`,
    hash: hashBuffer(buf),
    dhash: await dHash(buf, id),
    srcs: {},
  };

  for (const [size, { edge, quality }] of Object.entries(SIZES)) {
    if (size === 'hero' && !HERO_IDS.has(id)) continue;

    const outDir  = path.join(OUT_BASE, size);
    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${id}.webp`);

    if (FORCE || ROTATE_OVERRIDES[id] || !fs.existsSync(outFile)) {
      await sharp(normBuf)
        .resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toFile(outFile);
      console.log(`  → ${size}/${id}.webp`);
    }
    entry.srcs[size] = `/assets/images/${size}/${id}.webp`;
  }

  // Tiny blur placeholder (≈24px) shown while the real texture decodes.
  const tiny = await sharp(normBuf)
    .resize(24, 24, { fit: 'inside' })
    .webp({ quality: 40 })
    .toBuffer();
  entry.placeholder = `data:image/webp;base64,${tiny.toString('base64')}`;

  return entry;
}

function writeReport(manifest) {
  const byHash = new Map();
  for (const e of manifest) {
    byHash.set(e.hash, [...(byHash.get(e.hash) || []), e.filename]);
  }
  const exact = [...byHash.values()].filter(g => g.length > 1);

  const near = [];
  for (let i = 0; i < manifest.length; i++) {
    for (let j = i + 1; j < manifest.length; j++) {
      const d = hamming(manifest[i].dhash, manifest[j].dhash);
      if (d <= NEAR_DUP_DISTANCE) near.push([manifest[i], manifest[j], d]);
    }
  }
  near.sort((a, b) => a[2] - b[2]);

  const lines = [
    '# Asset report',
    '',
    '_Generated by `npm run process-assets`. Nothing here is removed automatically (PRD §15)._',
    '',
    `Files processed: **${manifest.length}**`,
    '',
    '## Exact duplicates (SHA-256)',
    '',
    exact.length ? exact.map(g => `- ${g.join(' = ')}`).join('\n') : 'None.',
    '',
    `## Near-duplicate candidates (dHash distance ≤ ${NEAR_DUP_DISTANCE})`,
    '',
    'Pick one per pair by framing, expression, sharpness, background, composition.',
    '',
    near.length
      ? ['| A | B | distance |', '|---|---|---|', ...near.map(([a, b, d]) => `| ${a.id} | ${b.id} | ${d} |`)].join('\n')
      : 'None.',
    '',
    '## Orientation normalized (PRD §16)',
    '',
    Object.entries(ROTATE_OVERRIDES).map(([id, deg]) => `- img-${id}: rotated ${deg}° clockwise`).join('\n') || 'None.',
    '',
  ];
  fs.writeFileSync(REPORT, lines.join('\n'), 'utf8');
}

async function main() {
  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => /\.jpe?g$/i.test(f))
    .sort((a, b) => Number(extractId(a)) - Number(extractId(b)));

  console.log(`Processing ${files.length} files${FORCE ? ' (force)' : ''}…`);

  const manifest = [];
  for (const f of files) manifest.push(await processFile(f));

  const js = `// AUTO-GENERATED by scripts/process-assets.cjs — do not edit manually.
// Facts only (dimensions after orientation normalization, derivatives, placeholder).
// Curation (chapter, role, focal point, grade) lives in ./photos.js.
export const manifest = ${JSON.stringify(manifest, null, 2)};
`;
  fs.writeFileSync(MANIFEST, js, 'utf8');
  writeReport(manifest);

  console.log(`\nDone. ${manifest.length} assets → ${path.relative(process.cwd(), MANIFEST)}`);
  console.log(`Report → ${path.relative(process.cwd(), REPORT)}`);
}

main().catch(err => { console.error(err); process.exit(1); });
