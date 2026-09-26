// SCENE 06 — Night / Event Space
// Stage and crowd light already give these photos depth. Dominant: slow
// horizontal drift. Supporting: a rack focus that travels from the front frame
// to the back one — depth separation borrowed from photography, not neon.
import { lerp, lerp3, clamp, easeSine, damp } from '../utils/math.js';

const DESKTOP = [
  [-2.6,  0.2,   0.0, 3.0],
  [ 0.25,-0.2,  -2.6, 3.2],
  [ 2.9,  0.4,  -5.0, 2.8],
  [-0.9,  0.55, -7.6, 2.6],
  [ 1.9, -0.4, -10.2, 2.8],
];
const MOBILE = [
  [-0.35, 0.3,  0.0, 2.8],
  [ 0.4, -0.3, -3.2, 2.8],
  [ 0.0,  0.25,-6.8, 2.6],
];

export default {
  build(ctx) {
    const slots = ctx.mobile ? MOBILE : DESKTOP;
    slots.forEach(([x, y, z, h], i) => {
      ctx.add(ctx.photos[i % ctx.photos.length], { height: h, pos: [x, y, z] });
    });
    ctx.state.depths = slots.map(s => s[2]);
  },

  pose(q, ctx) {
    const t = easeSine(q);
    if (ctx.mobile) {
      return {
        pos: lerp3([-0.2, 0.1, 6.6], [0.2, 0.0, 4.6], t),
        target: lerp3([0, 0, -2], [0, 0, -6], t),
      };
    }
    const x = lerp(-2.4, 2.3, t);
    return {
      pos: [x, lerp(0.15, -0.05, t), lerp(6.3, 4.4, t)],
      target: [x * 0.6, 0, -4],
    };
  },

  update(q, dt, ctx) {
    const depths = ctx.state.depths;
    const first = depths[0];
    const last = depths[depths.length - 1];
    const focusZ = ctx.reduced ? first : lerp(first + 0.3, last, easeSine(q));
    const k = damp(4, dt);
    ctx.planes.forEach((p, i) => {
      const goal = clamp(Math.abs(depths[i] - focusZ) * 0.09 - 0.05, 0, 0.4);
      p.uniforms.uBlur.value += (goal - p.uniforms.uBlur.value) * k;
    });
  },
};
