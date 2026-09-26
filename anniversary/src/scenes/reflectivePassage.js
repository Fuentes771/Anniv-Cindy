// SCENE 04 — Reflective / Masked Passage
// Uses geometry that already exists in the photo: the vertical seam between the
// mirror panels of img-48. The frame opens *from that seam* (mask reveal,
// PRD §23 B), then the camera passes through it into a short corridor of
// framed spaces (wire, slats). No generic mirror effect on other photos.
import { lerp, smoothstep, easeInOut, easeSine, lerp3 } from '../utils/math.js';

const SEAM_U = 0.455; // seam position across img-48 (verified visually)

export default {
  build(ctx) {
    const [mirror, slats, wire, cage] = ctx.photos;
    const h = ctx.mobile ? 3.3 : 3.6;
    ctx.state.mirror = ctx.add(mirror, { height: h, pos: [0, 0, 0] });
    ctx.state.mirror.uniforms.uMask.value.set(SEAM_U, 0.004, 0.02, 1);

    if (ctx.mobile) {
      ctx.add(slats, { height: 2.6, pos: [-0.7, 0.1, -5.5], rot: [0, 0.3, 0] });
      ctx.add(cage,  { height: 2.8, pos: [0.05, 0, -12.5] });
    } else {
      // corridor walls angled inward, then an end frame
      ctx.add(slats, { height: 3.0, pos: [-1.55, 0.05, -5.0], rot: [0,  0.45, 0] });
      ctx.add(wire,  { height: 2.8, pos: [ 1.65, -0.1, -8.2], rot: [0, -0.45, 0] });
      ctx.add(cage,  { height: 3.0, pos: [ 0.0,  0.1, -13.2] });
    }
    ctx.state.seamX = (SEAM_U - 0.5) * ctx.state.mirror.width;
  },

  pose(q, ctx) {
    const sx = ctx.state.seamX || 0;
    // 0–0.42: hold while the seam opens. 0.42–1: pass through the seam.
    const travel = easeInOut(smoothstep(0.42, 1, q));
    const settle = easeSine(smoothstep(0, 0.42, q));
    const endZ = ctx.mobile ? -8.4 : -8.2;
    const z = travel > 0 ? lerp(5.4, endZ, travel) : lerp(6.6, 5.4, settle);
    return {
      pos: [lerp(0, sx, smoothstep(0.35, 0.6, q)), 0, z],
      target: lerp3([0, 0, -2], [0, 0.05, -13.2], travel),
    };
  },

  update(q, dt, ctx) {
    const mirror = ctx.state.mirror;
    if (!mirror) return;
    const open = ctx.reduced ? 1 : smoothstep(0.02, 0.4, q);
    mirror.uniforms.uMask.value.y = lerp(0.004, 0.62, open * open);
  },
};
