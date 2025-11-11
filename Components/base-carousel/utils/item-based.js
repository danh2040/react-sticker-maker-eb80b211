import Scrolling from './scrolling.js';
/**
 * this algorithm finds the first item visible in the
 * current "scroll frame", and moves the frame 1 or more
 * items away from the found item.
 */
export default class ItemBasedScrolling extends Scrolling {
  constructor({ scrollBy = 1, ...options } = {}) {
    super(options);
    this.scrollBy = scrollBy;
  }

  scroll(container, items, currentPosition, direction) {
    // allowing for 1px offset from the current scroll position
    // to avoid off-by-1 browser calculations (e.g. in Firefox on Retina displays)
    const firstVisibleItemIndex = items.findIndex(
      (item) => item.offsetLeft >= currentPosition - 1,
    );
    const jumpIndex = firstVisibleItemIndex + direction * this.scrollBy;
    const nextVisibleItemIndex = Math.max(0, Math.min(jumpIndex, items.length));
    // in case the item list inside the carousel has padding, we have to scroll
    // to the beginning of the list itself, rather than the first item
    if (nextVisibleItemIndex === 0) {
      this.scrollToStart(container);
      return;
    }

    items[nextVisibleItemIndex]?.scrollIntoView(this.scrollOptions());
  }
}
