<template>
  <div
    :class="allClasses"
  >
    <div data-test-id="fixed">
      <slot name="fixed" />
    </div>
    <div
      ref="scrollable"
      class="scrollable-content__scrollable"
      data-test-id="scrollable"
    >
      <slot name="scrollable" />
    </div>
  </div>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

import debounce from '@ecosia/js-utils/debounce.js';

import { RESIZE_DEBOUNCE_DELAY as DEBOUNCE_DELAY } from '@ecosia/constants/events.js';

export default {
  name: 'EScrollableContent',
  mixins: [classes],
  props: {
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    scrollShadow: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
  },
  data() {
    return {
      scrolled: 0,
    };
  },
  computed: {
    allClasses() {
      const allClasses = [...this.classes];
      if (this.scrolled) {
        allClasses.push('scrollable-content--scrolled');
      }
      return allClasses;
    },
  },
  mounted() {
    this.onScroll = debounce(this.setScrolled, DEBOUNCE_DELAY);
    this.$refs.scrollable?.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    this.$refs.scrollable?.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    setScrolled() {
      this.scrolled = this.$refs.scrollable.scrollTop > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollable-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overscroll-behavior-y: none;
}

.scrollable-content__scrollable {
  height: 100%;
  overflow: auto;
}

.scrollable-content--scroll-shadow.scrollable-content--scrolled {
  .scrollable-content__scrollable {
    box-shadow: inset 0 0 2px 0 rgba(0, 0, 0, $opacity-2s),
      inset 0 1px 3px 0 rgba(0, 0, 0, $opacity-2s); // TODO: move this to a token
  }
}
</style>
