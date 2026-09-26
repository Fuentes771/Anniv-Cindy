// Scene contracts (PRD §34). Plain data read by the engine and the DOM builder.
//
// The world is one continuous space: each chapter owns a region (`origin`) and
// the camera travels between them. Scene modules in src/scenes/ describe the
// composition and camera path *relative to* that origin.
//
//   height      section height in viewport units → pacing of the scroll
//   enter       fraction of the section spent travelling in from the previous chapter
//   fog         [near, far] in world units — hides the neighbouring chapters
//   grade       colour treatment key (see GRADES) — scene-level, never one global LUT (PRD §18)
//   bg          page/fog colour for this chapter
//   audio       music level: 1 = full, <1 = ducked
//   sway        pointer-driven camera offset (world units); real parallax comes from depth
//   align       where the chapter label sits — varies per chapter to avoid a template rhythm
//   mobileMode  / reducedMotion  documented fallbacks (PRD §34)

export const GRADES = {
  neutral: { tint: [1.0, 1.0, 1.0],    sat: 1.0,  black: 0.02 },
  night:   { tint: [0.95, 0.98, 1.06], sat: 1.04, black: 0.035 },
  outdoor: { tint: [0.99, 1.02, 0.98], sat: 0.96, black: 0.025 },
  warm:    { tint: [1.05, 1.0, 0.93],  sat: 0.97, black: 0.02 },
  lifted:  { tint: [1.02, 1.01, 0.99], sat: 0.9,  black: -0.03 },
};

export const BG = '#0A0A0A';

export const chapters = [
  {
    id: 'opening', title: 'Opening Frame', label: 'FRAME 01',
    origin: [0, 0, 0], height: 220, enter: 0,
    fog: [9, 24], grade: 'night', bg: BG, audio: 1, sway: 0.18, align: 'left-bottom',
    primaryMotion: 'camera-push', secondaryMotion: 'shallow-parallax',
    transitionOut: 'camera-passage',
    mobileMode: 'single-plane', reducedMotion: 'hold-pose',
  },
  {
    id: 'frameField', title: 'Frame Field', label: 'ARCHIVE / 02',
    origin: [2, 0.5, -26], height: 240, enter: 0.2,
    fog: [7, 20], grade: 'neutral', bg: BG, audio: 1, sway: 0.28, align: 'right-top',
    primaryMotion: 'camera-through-field', secondaryMotion: 'depth-parallax',
    mobileMode: 'three-plane-column', reducedMotion: 'hold-pose',
  },
  {
    id: 'environmentalDepth', title: 'Environmental Depth', label: 'SCENE 03',
    origin: [-3, 0, -52], height: 220, enter: 0.18,
    fog: [7, 19], grade: 'outdoor', bg: BG, audio: 1, sway: 0.4, align: 'left-top',
    primaryMotion: 'lateral-truck', secondaryMotion: 'pointer-perspective',
    mobileMode: 'vertical-crane', reducedMotion: 'hold-pose',
  },
  {
    id: 'reflectivePassage', title: 'Reflective Passage', label: 'SCENE 04',
    origin: [1, -0.5, -78], height: 240, enter: 0.16,
    fog: [7, 18], grade: 'neutral', bg: BG, audio: 1, sway: 0.16, align: 'right-bottom',
    primaryMotion: 'mask-reveal-then-passage', secondaryMotion: 'corridor-parallax',
    mobileMode: 'single-corridor', reducedMotion: 'hold-pose (mask open)',
  },
  {
    id: 'privateDetails', title: 'Private Details', label: 'ARCHIVE / 05',
    origin: [-2, 0.5, -104], height: 180, enter: 0.2,
    fog: [7, 16], grade: 'warm', bg: BG, audio: 1, sway: 0.12, align: 'center-bottom',
    primaryMotion: 'blur-to-sharp', secondaryMotion: 'micro-rotation',
    interaction: 'hover-sharpen',
    mobileMode: 'center-sharpen', reducedMotion: 'hold-pose, all sharp',
  },
  {
    id: 'nightSpace', title: 'Night Space', label: 'SCENE 06',
    origin: [2, 0, -130], height: 220, enter: 0.18,
    fog: [8, 20], grade: 'night', bg: '#07080B', audio: 1, sway: 0.22, align: 'left-bottom',
    primaryMotion: 'horizontal-drift', secondaryMotion: 'rack-focus',
    mobileMode: 'three-plane-depth', reducedMotion: 'hold-pose, fixed focus',
  },
  {
    id: 'coupleArchive', title: 'Couple Archive', label: 'ARCHIVE / 07',
    origin: [0, 0.5, -156], height: 260, enter: 0.16,
    fog: [8, 20], grade: 'warm', bg: BG, audio: 1, sway: 0.2, align: 'right-top',
    primaryMotion: 'stack-displacement', secondaryMotion: 'pointer-hierarchy',
    interaction: 'focus-frame',
    mobileMode: 'three-plane-stack', reducedMotion: 'hold-pose, stack open',
  },
  {
    id: 'quietCounterpoint', title: 'Quiet Counterpoint', label: 'SCENE 08',
    origin: [-2, 0, -182], height: 160, enter: 0.22,
    fog: [8, 18], grade: 'lifted', bg: '#141311', audio: 0.85, sway: 0.08, align: 'left-top',
    primaryMotion: 'near-static', secondaryMotion: 'fade',
    mobileMode: 'single-plane', reducedMotion: 'hold-pose',
  },
  {
    id: 'letter', title: 'Letter', label: null,
    origin: [-2, 0, -182], height: null, enter: 0.3,
    fog: [8, 18], grade: 'neutral', bg: BG, audio: 0.35, sway: 0, align: 'none',
    primaryMotion: 'text-reveal', secondaryMotion: null,
    mobileMode: 'dom', reducedMotion: 'text visible',
  },
  {
    id: 'finalFrame', title: 'Final Frame', label: null,
    origin: [0, 0, -212], height: 300, enter: 0.12,
    fog: [18, 48], grade: 'neutral', bg: BG, audio: 0.8, sway: 0.1, align: 'none',
    primaryMotion: 'slow-pull-back', secondaryMotion: 'archive-reveal',
    mobileMode: 'fewer-archive-frames', reducedMotion: 'hold wide pose, archive visible',
  },
];

// Pose of the camera while the Entry screen is shown: far in front of the
// opening frame, so the hero reads as one small lit rectangle in the dark.
export const ENTRY_POSE = { pos: [0, 0.15, 19], target: [0, 0, -4] };
export const ENTRY_FOG = [10, 30];

export function getChapter(id) {
  return chapters.find(c => c.id === id);
}
