// Scene contracts — defines camera choreography and motion intent per scene.
// Each scene module reads this to configure itself.

export const scenes = [
  {
    id: 'opening',
    label: 'FRAME 01',
    primaryMotion: 'camera-push',
    secondaryMotion: 'shallow-parallax',
    cameraStart: { x: 0, y: 0, z: 6 },
    cameraEnd:   { x: 0, y: 0, z: 4.2 },
    maxPlanes: 1,
    mobileMode: 'single-plane',
  },
  {
    id: 'frameField',
    label: 'ARCHIVE / 02',
    primaryMotion: 'lateral-drift',
    secondaryMotion: 'depth-parallax',
    cameraStart: { x: -1.5, y: 0.3, z: 5 },
    cameraEnd:   { x:  1.5, y: -0.2, z: 4.5 },
    maxPlanes: 7,
    mobileMode: 'single-plane-stack',
  },
  {
    id: 'environmentalDepth',
    label: 'SCENE 03',
    primaryMotion: 'lateral-diagonal',
    secondaryMotion: 'depth-separation',
    cameraStart: { x: -2, y: 0.5, z: 5.5 },
    cameraEnd:   { x:  2, y: -0.3, z: 4.8 },
    maxPlanes: 5,
    mobileMode: 'two-plane-stack',
  },
  {
    id: 'reflectivePassage',
    label: 'SCENE 04',
    primaryMotion: 'camera-passage',
    secondaryMotion: 'mask-reveal',
    cameraStart: { x: 0, y: 0, z: 5 },
    cameraEnd:   { x: 0, y: 0, z: 2.5 },
    maxPlanes: 3,
    mobileMode: 'single-plane',
  },
  {
    id: 'privateDetails',
    label: 'ARCHIVE / 05',
    primaryMotion: 'opacity-reveal',
    secondaryMotion: 'micro-rotation',
    cameraStart: { x: 0, y: 0, z: 5 },
    cameraEnd:   { x: 0, y: 0, z: 5 },
    maxPlanes: 6,
    mobileMode: 'single-plane-stack',
  },
  {
    id: 'nightSpace',
    label: 'SCENE 06',
    primaryMotion: 'horizontal-drift',
    secondaryMotion: 'depth-bokeh',
    cameraStart: { x: -1, y: 0, z: 5 },
    cameraEnd:   { x:  1, y: 0, z: 4.5 },
    maxPlanes: 4,
    mobileMode: 'two-plane-stack',
  },
  {
    id: 'coupleArchive',
    label: 'ARCHIVE / 07',
    primaryMotion: 'pointer-parallax',
    secondaryMotion: 'depth-hierarchy',
    cameraStart: { x: 0, y: 0, z: 5 },
    cameraEnd:   { x: 0, y: 0, z: 4.8 },
    maxPlanes: 5,
    mobileMode: 'single-plane-stack',
  },
  {
    id: 'quietCounterpoint',
    label: 'SCENE 08',
    primaryMotion: 'near-static',
    secondaryMotion: 'fade',
    cameraStart: { x: 0, y: 0, z: 5 },
    cameraEnd:   { x: 0, y: 0, z: 4.9 },
    maxPlanes: 2,
    mobileMode: 'single-plane',
  },
  {
    id: 'letter',
    label: null, // no index label on letter
    primaryMotion: 'text-reveal',
    secondaryMotion: null,
    maxPlanes: 0, // DOM-only scene
    mobileMode: 'dom',
  },
  {
    id: 'finalFrame',
    label: null,
    primaryMotion: 'slow-pull-back',
    secondaryMotion: null,
    cameraStart: { x: 0, y: 0, z: 4.5 },
    cameraEnd:   { x: 0, y: 0, z: 6 },
    maxPlanes: 1,
    mobileMode: 'single-plane',
  },
];

export function getSceneById(id) {
  return scenes.find(s => s.id === id);
}
