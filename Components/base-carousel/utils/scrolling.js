import { prefersReducedMotion } from '@ecosia/common-vue2/utils/screen.js';

const getDefaultScrollOptions = () => ({
  behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  block: 'nearest',
  inline: 'start',
});

// abstract class for a scrolling algorithm
export default class Scrolling {
  constructor({ scrollOptions = getDefaultScrollOptions } = {}) {
    this.scrollOptions = scrollOptions;
  }

  scrollToStart(container) {
    container?.scrollIntoView(this.scrollOptions());
  }
}
