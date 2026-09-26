// SCENE 08 — Quiet Counterpoint
// A breath before the letter: lighter grade, lifted background, almost no motion.
import { lerp3, easeSine } from '../utils/math.js';

export default {
  build(ctx) {
    const [main, second] = ctx.photos;
    if (ctx.mobile) {
      ctx.add(main, { height: 3.1, pos: [0, 0.1, 0] });
    } else {
      ctx.add(main, { height: 3.2, pos: [-0.6, 0.05, 0] });
      ctx.add(second, { height: 2.1, pos: [1.95, -0.55, -1.9] });
    }
  },

  pose(q) {
    return {
      pos: lerp3([0.25, 0.02, 6.9], [0.15, 0, 6.5], easeSine(q)),
      target: [0.2, 0, -1],
    };
  },
};
