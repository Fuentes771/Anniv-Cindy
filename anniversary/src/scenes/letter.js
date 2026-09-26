// SCENE 09 — Letter
// The most human part: visuals drop almost to nothing (quiet cut), the words
// are HTML, revealed paragraph by paragraph. Music ducks (contract.audio).
import { revealOnScroll } from '../motion/timeline.js';
import { lerp3 } from '../utils/math.js';

export default {
  // Camera drifts back from the quiet frames into the dark.
  pose(q) {
    return {
      pos: lerp3([0.15, 0, 7.4], [0.1, 0.2, 9.5], q),
      target: [0.2, 0, -1],
    };
  },

  dim() {
    return 0.05;
  },
};

/** DOM behaviour, set up once the section exists. */
export function initLetterReveal(section) {
  revealOnScroll(section.querySelectorAll('[data-reveal]'));
}
