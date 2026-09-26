// Personal copy — the ONLY place where words shown on the page live.
//
// Everything in [ brackets ] is a placeholder that the owner must replace
// before sending the link (PRD §26, §27, §45). Nothing here is invented:
// the only fixed facts are the date 27.09.26 and "3 years" from the PRD.
//
// Leave optional fields as '' to hide them entirely.

export const copy = {
  entry: {
    forYou: 'For You',
    date: '27.09.26',
    enter: 'Enter',
  },

  // Opening frame typography.
  title: 'Between Frames',
  heroStatement: '', // optional one-liner under the title, in the owner's voice

  // Optional short caption per chapter (a few words at most). '' = none.
  captions: {
    frameField: '',
    environmentalDepth: '',
    reflectivePassage: '',
    privateDetails: '',
    nightSpace: '',
    coupleArchive: '',
    quietCounterpoint: '',
  },

  // Final frame — the single line left on screen at the very end.
  finalLine: '[ Kalimat penutup — tulis dari pemilik ]',

  // Music (PRD §12, §28). Put the file at public/assets/audio/music.mp3,
  // or set src to '' to run without sound (the toggle hides itself).
  audio: {
    src: '/assets/audio/music.mp3',
    volume: 0.55, // master level after the fade-in
  },
};

// Letter structure per PRD §27. One string per paragraph; add or remove freely.
export const letter = {
  forYou: 'For You',

  body: [
    '[ Pembuka — tulis dari pemilik ]',
    '[ Kenangan / refleksi — tulis dari pemilik ]',
    '[ Arti dirinya bagimu — tulis dari pemilik ]',
    '[ Refleksi tiga tahun — tulis dari pemilik ]',
    '[ Satu kalimat tentang ke depan — tulis dari pemilik ]',
    '[ Penutup — tulis dari pemilik ]',
  ],

  signature: '— [ Nama ]',
};
