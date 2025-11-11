import { NEXT, PREVIOUS } from './direction.js';
import ItemBasedScrolling from './item-based.js';
import PageBasedScrolling from './page-based.js';
import PixelBasedScrolling from './pixel-based-scrolling.js';

export {
  ItemBasedScrolling,
  PageBasedScrolling,
  PixelBasedScrolling,
};
/**
 * This class manages scrolling algorithms and exposes
 * methods to navigate a carousel with "previous" and "next" buttons
 */
export default class CarouselController {
  constructor({ container, items, algorithm = new ItemBasedScrolling() } = {}) {
    this.container = container;
    this.items = items;
    this.algorithm = algorithm;
  }

  previous(currentPosition, carouselType = null) {
    this.algorithm.scroll(
      this.container,
      this.items,
      currentPosition,
      PREVIOUS,
      carouselType,
    );
  }

  next(currentPosition, carouselType = null) {
    this.algorithm.scroll(
      this.container,
      this.items,
      currentPosition,
      NEXT,
      carouselType,
    );
  }

  hovered(distance, direction) {
    if (direction === 'next') {
      this.hoveredNext(distance);
    } else {
      this.hoveredPrev(distance);
    }
  }

  leave(distance, direction) {
    if (direction === 'next') {
      this.hoveredPrev(distance);
    } else {
      this.hoveredNext(distance);
    }
  }

  hoveredNext(distance) {
    this.algorithm.scroll(this.container, NEXT, distance);
  }

  hoveredPrev(distance) {
    this.algorithm.scroll(this.container, PREVIOUS, distance);
  }
}
