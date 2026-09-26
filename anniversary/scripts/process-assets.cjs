/**
 * Asset pipeline: duplicate detection, orientation normalization,
 * derivative generation (WebP), focal point manifest output.
 * 
 * Usage: node scripts/process-assets.js
 * Output: public/assets/images/{thumb,content,hero}/*.webp
 *         src/content/photos-generated.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const INPUT_DIR = path.resolve(__dirname, '../../FOTO');
const OUT_BASE  = path.resolve(__dirname, '../public/assets/images');
const MANIFEST  = path.resolve(__dirname, '../src/content/photos-generated.js');

// Derivative sizes (long edge px)
const SIZES = {
  thumb:   480,
  content: 1400,
  hero:    2000,
};

// Which files get hero derivative (TIER A per PRD §14, §36)
const HERO_IDS = new Set(['42','43','44','45','48','49','38','39']);

// Scene assignment per PRD §38
const SCENE_MAP = {
  '42': 'opening', '43': 'opening', '48': 'opening', '49': 'opening',
  '4':  'frameField', '5':  'frameField', '7':  'frameField',
  '17': 'frameField', '32': 'frameField', '41': 'frameField',
  '52': 'frameField',
  '6':  'environmentalDepth', '12': 'environmentalDepth',
  '30': 'environmentalDepth', '51': 'environmentalDepth',
  '53': 'environmentalDepth',
  '14': 'reflectivePassage', '16': 'reflectivePassage',
  '15': 'reflectivePassage',
  '2':  'privateDetails', '3':  'privateDetails', '8':  'privateDetails',
  '20': 'privateDetails', '24': 'privateDetails', '26': 'privateDetails',
  '31': 'privateDetails', '34': 'privateDetails', '55': 'privateDetails',
  '56': 'privateDetails',
  '44': 'nightSpace', '45': 'nightSpace',
  '46': 'nightSpace', '37': 'nightSpace',
  '39': 'coupleArchive',
  '57': 'quietCounterpoint', '1': 'environmentalDepth',
  '0':  'opening', // unsuffixed file
};

// Role assignment
const ROLE_MAP = {
  '42':'hero','43':'hero','48':'hero','49':'hero',
  '38':'couple','39':'couple','44':'couple','45':'couple',
  '6':'environment','12':'environment','30':'environment',
  '51':'environment','52':'environment','53':'environment',
  '1':'environment','14':'environment','15':'environment','16':'environment',
  '27':'environment',
  '57':'closing','0':'support',
};

function getRole(id) { return ROLE_MAP[id] || 'support'; }
function getScene(id) {
  return SCENE_MAP[id] || (HERO_IDS.has(id) ? 'coupleArchive' : 'privateDetails');
}

// Default focal points (center; visual QA will refine)
const FOCAL_OVERRIDES = {
  '42': { x: 0.50, y: 0.40 },
  '43': { x: 0.50, y: 0.38 },
  '48': { x: 0.48, y: 0.42 },
  '49': { x: 0.52, y: 0.40 },
  '38': { x: 0.50, y: 0.35 },
  '39': { x: 0.50, y: 0.40 },
};

function getFocalPoint(id) {
  return FOCAL_OVERRIDES[id] || { x: 0.50, y: 0.45 };
}

// Parallax strength: hero = more, support = less
function getParallax(id) {
  if (HERO_IDS.has(id)) return 0.22;
  const role = getRole(id);
  if (role === 'environment') return 0.15;
  if (role === 'couple') return 0.18;
  return 0.10;
}

async function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', d => hash.update(d));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function extractId(filename) {
  // "Desain tanpa judul (42).jpg" → "42"
  // "Desain tanpa judul.jpg" → "0"
  const match = filename.match(/\((\d+)\)/);
  return match ? match[1] : '0';
}

async function processFile(filename, seenHashes) {
  const src = path.join(INPUT_DIR, filename);
  const id  = extractId(filename);

  // Duplicate check
  const hash = await hashFile(src);
  if (seenHashes.has(hash)) {
    console.log(`  SKIP exact duplicate: ${filename}`);
    return null;
  }
  seenHashes.add(hash);

  // Read metadata (sharp auto-applies EXIF rotation)
  const img = sharp(src).rotate(); // rotate() with no args = auto EXIF orientation
  const meta = await img.metadata();
  const origW = meta.width;
  const origH = meta.height;
  const isPortrait = origH >= origW;

  const entry = {
    id:   `img-${id}`,
    filename,
    role: getRole(id),
    scene: getScene(id),
    focalPoint: getFocalPoint(id),
    parallaxStrength: getParallax(id),
    priority: HERO_IDS.has(id) ? 'critical' : 'lazy',
    origW,
    origH,
    isPortrait,
    hash,
    srcs: {},
  };

  // Generate derivatives
  for (const [size, longEdge] of Object.entries(SIZES)) {
    if (size === 'hero' && !HERO_IDS.has(id)) continue; // hero only for TIER A

    const outDir  = path.join(OUT_BASE, size);
    await ensureDir(outDir);
    const outFile = path.join(outDir, `${id}.webp`);

    if (fs.existsSync(outFile)) {
      console.log(`  EXISTS ${size}/${id}.webp`);
    } else {
      // Resize by long edge, preserve ratio
      const resizeOpts = isPortrait
        ? { height: longEdge }
        : { width: longEdge };

      await sharp(src)
        .rotate() // normalize EXIF orientation
        .resize({ ...resizeOpts, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(outFile);

      console.log(`  → ${size}/${id}.webp`);
    }

    // Relative src for manifest
    entry.srcs[size] = `/assets/images/${size}/${id}.webp`;
  }

  // Blur placeholder (tiny 20px, base64)
  const thumbPath = path.join(OUT_BASE, 'thumb', `${id}.webp`);
  const tinyBuf = await sharp(thumbPath)
    .resize(20, 20, { fit: 'inside' })
    .webp({ quality: 20 })
    .toBuffer();
  entry.placeholder = `data:image/webp;base64,${tinyBuf.toString('base64')}`;

  return entry;
}

async function main() {
  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => /\.jpe?g$/i.test(f))
    .sort();

  console.log(`Processing ${files.length} files…\n`);

  const seenHashes = new Set();
  const manifest = [];

  for (const f of files) {
    console.log(f);
    const entry = await processFile(f, seenHashes);
    if (entry) manifest.push(entry);
  }

  // Write manifest
  await ensureDir(path.dirname(MANIFEST));
  const js = `// AUTO-GENERATED by scripts/process-assets.js — do not edit manually
// Visual QA: review focalPoint values after visual inspection
export const photos = ${JSON.stringify(manifest, null, 2)};
`;
  fs.writeFileSync(MANIFEST, js, 'utf8');

  console.log(`\nDone. ${manifest.length} unique assets processed.`);
  console.log(`Manifest → ${MANIFEST}`);

  // Summary
  const byRole = {};
  for (const e of manifest) {
    byRole[e.role] = (byRole[e.role] || 0) + 1;
  }
  console.log('\nBy role:', byRole);
}

main().catch(err => { console.error(err); process.exit(1); });
