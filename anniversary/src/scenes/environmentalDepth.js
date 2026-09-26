// SCENE 03 — Environmental Depth
// Tempo change: from portraits to places. Dominant: wide lateral truck.
// Supporting: pointer shifts perspective (larger sway in the contract).
// Mobile recomposes the same idea vertically — a slow crane down (PRD §21).
import { lerp, lerp3, easeSine } from '../utils/math.js';

const DESKTOP = [
  [-5.0,  0.2, -1.6, 3.0],
  [-2.4, -0.4, -3.6, 2.6],
  [ 0.1,  0.3, -0.8, 3.2],
  [ 2.7, -0.25,-4.2, 2.8],
  [ 5.0,  0.45,-2.0, 3.0],
  [ 7.4, -0.3, -5.2, 2.6],
];
const MOBILE = [
  [ 0.0,  3.6, -1.0, 2.6],
  [-0.35, 0.0, -2.6, 2.6],
  [ 0.35,-3.7, -1.4, 2.6],
];

export default {
  build(ctx) {
    const slots = ctx.mobile ? MOBILE : DESKTOP;
    slots.forEach(([x, y, z, h], i) => {
      const photo = ctx.photos[i % ctx.photos.length];
      // frames turn slightly toward the travelling camera
      ctx.add(photo, { height: h, pos: [x, y, z], rot: [0, ctx.mobile ? 0 : -x * 0.018, 0] });
    });
  },

  pose(q, ctx) {
    const t = easeSine(q);
    if (ctx.mobile) {
      const y = lerp(3.8, -3.8, t);
      return { pos: [0, y, 6.4], target: [0, y - 0.2, -2] };
    }
    const x = lerp(-5.6, 7.0, t);
    return {
      pos: [x, lerp(0.45, -0.15, t), lerp(6.4, 5.8, t)],
      target: lerp3([x + 0.9, 0.1, -3], [x + 0.5, 0, -3], t),
    };
  },
};
