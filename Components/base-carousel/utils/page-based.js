import { NEXT } from './direction.js';
import Scrolling from './scrolling.js';
/**
 * this algorithm is based on finding the first invisible item
 * outside of the current "scroll frame" and moving the frame
 * to align the found item to the start or end, depending on direction
 */
export default class PageBasedScrolling extends Scrolling {
  scroll(container, items, scrollFrameStart, direction, carouselType) {
    const scrollFrameEnd = scrollFrameStart + container.offsetWidth;

    // check that we are within the currently visible "scroll Frame"
    // allowing for 1px offset from the current scroll position
    // to avoid off-by-1 browser calculations (e.g. in Firefox on Retina displays)
    const isInScrollFrame = (item) => item.offsetLeft >= scrollFrameStart - 1 &&
      item.offsetLeft < scrollFrameEnd;

    let itemIndex = items.findIndex(isInScrollFrame);

    while (
      // check that we are not out of bounds
      itemIndex >= 0 &&
      itemIndex < items.length &&
      isInScrollFrame(items[itemIndex])
    ) {
      itemIndex += direction;
    }

    // remove half card from current view
    if (carouselType === 'productAds' && itemIndex > 0) {
      itemIndex -= 1;
    }

    // in case the item list inside the carousel has padding, we have to scroll
    // to the beginning of the list itself, rather than the first item
    if (itemIndex === 0) {
      this.scrollToStart(container);
      return;
    }

    // if moving backwards, snap to the end of the "page"
    const inline = direction === NEXT ? 'start' : 'end';
    items[itemIndex]?.scrollIntoView({ ...this.scrollOptions(), inline });
  }
}
