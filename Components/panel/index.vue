<template>
  <div
    :class="classes"
    :aria-hidden="!visible"
    @click="onClick"
  >
    <div class="panel__content" data-test-id="panel-content">
      <slot />
    </div>
  </div>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const sides = ['left', 'right'];

export default {
  name: 'EPanel',
  mixins: [classes],
  props: {
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    backdrop: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    /**
     * The side for the panel `left, right`
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    side: {
      type: String,
      default: 'left',
      validator: (value) => sides.includes(value),
      cssClass: true,
    },
    /**
     * The visibility for the panel
     */
    visible: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
  },
  methods: {
    onClick(event) {
      // we do not want clicking on the panel's content to also close it
      if (event.target === this.$el) {
        this.$emit('click', event);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$width: 250px;

.panel {
  position: fixed;
  z-index: $z-index-2l;
  top: 0;
}

.panel__content {
  @include elevation(1);

  display: flex;
  visibility: hidden;
  position: fixed;
  flex-direction: column;
  width: $width;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  transition: all $timing-s $easing, visibility 0s $timing-s;

  background-color: var(--color-background-primary);

  .panel--visible & {
    visibility: visible;

    transition: all $timing-s $easing, visibility 0s;
  }
}

.panel--backdrop {
  &::before {
    content: '';

    visibility: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    transition: all $timing-s ease-in-out;

    opacity: 0;
    background: var(--color-overlay-primary);
  }

  &.panel--visible::before {
    visibility: visible;

    opacity: 1;
  }
}

.panel--side-left .panel__content {
  left: -$width;
}

.panel--side-right .panel__content {
  right: -$width;
}

.panel--side-left.panel--visible .panel__content {
  left: 0;
}

.panel--side-right.panel--visible .panel__content {
  right: 0;
}
</style>
