import { NEXT } from './direction.js';
/**
 * this algorithm is based on scrolling the carousel
 * by a specified length/distance (in pixels)
 * in either next or previous direction.
 */
export default class PixelBasedScrolling {
  // This method can't be static because the other scrolling algorithms
  // like ItemBasedScrolling have a non-static scroll method.

  scroll(container, direction, distance, behavior = 'smooth') {
    if (direction === NEXT) {
      container.parentElement.scrollBy({
        left: distance,
        behavior,
      });
    } else {
      container.parentElement.scrollBy({
        left: -distance,
        behavior,
      });
    }
  }
}
