// SCENE 02 — Frame Field
// Portraits as spatial objects. Dominant: the camera drifts diagonally *through*
// the field. Supporting: depth parallax. 7 frames on desktop, 3 on mobile (PRD §7).
import { lerp3, easeSine } from '../utils/math.js';

// [x, y, z, rotY, height] — asymmetric, uneven spacing, alternating width.
const DESKTOP = [
  [-2.3,  0.55,  -0.6,  0.10, 2.5],
  [ 2.2, -0.35,  -2.0, -0.08, 2.8],
  [-0.75, 0.95,  -4.2,  0.04, 2.1],
  [ 1.15,-0.85,  -5.8, -0.05, 2.5],
  [-2.1, -0.6,   -7.8,  0.07, 2.3],
  [ 2.5,  0.7,   -9.4, -0.09, 2.2],
  [ 0.25, 0.1,  -12.5,  0.0,  3.0],
];
const MOBILE = [
  [-0.45, 0.5,  -0.5,  0.05, 2.3],
  [ 0.5, -0.55, -4.0, -0.05, 2.4],
  [ 0.0,  0.05, -9.5,  0.0,  2.8],
];

export default {
  build(ctx) {
    const slots = ctx.mobile ? MOBILE : DESKTOP;
    slots.forEach(([x, y, z, ry, h], i) => {
      const photo = ctx.photos[i % ctx.photos.length];
      ctx.add(photo, { height: h, pos: [x, y, z], rot: [0, ry, (i % 2 ? -1 : 1) * 0.012] });
    });
  },

  pose(q, ctx) {
    const t = easeSine(q);
    if (ctx.mobile) {
      return {
        pos: lerp3([0, 0.35, 6.2], [0.05, 0.05, -4.3], t),
        target: lerp3([0, 0.1, -3], [0, 0.05, -10.5], t),
      };
    }
    return {
      pos: lerp3([-0.5, 0.35, 6.0], [0.3, 0.1, -7.4], t),
      target: lerp3([0, 0.1, -3], [0.25, 0.1, -12.5], t),
    };
  },
};
