<template>
  <div class="carousel">
    <slot
      name="previous-control"
      v-bind="{ getCurrentScrollPosition, visible: previousVisible }"
    />
    <div
      ref="scroll-container"
      class="carousel__content"
      data-test-id="carousel-content"
      tabindex="-1"
      @scroll="onScroll"
    >
      <slot />
    </div>
    <slot
      name="next-control"
      v-bind="{ getCurrentScrollPosition, visible: nextVisible }"
    />
  </div>
</template>

<script>
import { throttle } from 'throttle-debounce';

import windowResize from '@ecosia/common-vue2/mixins/window-resize.js';

const SCROLL_THROTTLE_TIME = 100;

export const scrollStates = {
  START: 0,
  MIDDLE: 1,
  END: 2,
  NONE: 3,
};

export default {
  name: 'ECarouselBase',
  mixins: [windowResize('updateScrollState')],
  props: {
    scrollDistance: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    scrollState: scrollStates.NONE,
  }),
  computed: {
    previousVisible() {
      return this.scrollState !== scrollStates.NONE && this.scrollState !== scrollStates.START;
    },
    nextVisible() {
      return this.scrollState !== scrollStates.NONE && this.scrollState !== scrollStates.END;
    },
  },
  mounted() {
    if (window.IntersectionObserver) {
      this.observer = new IntersectionObserver(() => this.updateScrollState());
      this.observer.observe(this.$el);
    }
    this.$refs['scroll-container'].scrollLeft = 0;

    this.throttledOnScroll = throttle(SCROLL_THROTTLE_TIME, ({ target }) => {
      const scrollPosition = this.getCurrentScrollPosition();
      let stateKey;

      if (scrollPosition - this.scrollDistance <= 0) {
        stateKey = 'START';
      } else if (Math.abs(scrollPosition - (target.scrollWidth - target.offsetWidth)) <= 1) {
        // allowing for 1px offset from the current scroll position
      // to avoid off-by-1 browser calculations (e.g. in Firefox on Retina displays)
        stateKey = 'END';
      } else {
        stateKey = 'MIDDLE';
      }
      this.scrollState = scrollStates[stateKey];
      this.$emit('scroll-state', stateKey.toLowerCase());
    });
  },
  methods: {
    canScroll() {
      const scrollContainer = this.$refs['scroll-container'];
      if (!scrollContainer) {
        return false;
      }
      return scrollContainer.scrollWidth > scrollContainer.offsetWidth;
    },
    getCurrentScrollPosition() {
      return this.$refs['scroll-container'].scrollLeft;
    },
    updateScrollState() {
      if (this.canScroll()) {
        if (this.scrollState === scrollStates.NONE) {
          // we've probably just rendered for the first time
          this.scrollState = scrollStates.START;
        }
      } else {
        this.scrollState = scrollStates.NONE;
      }
    },
    onScroll(event) {
      this.throttledOnScroll(event);
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  display: flex;
  position: relative;
  align-items: center;
}

.carousel__content {
  @extend %no-scrollbar;
  position: relative;
  flex-grow: 1;
  overflow-x: scroll;

  @include desktop-down {
    display: flex;
  }
}

.carousel__content:focus {
  @extend %keyboard-nav-focus;
}
</style>
