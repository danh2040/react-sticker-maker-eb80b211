<template>
  <div :class="classes">
    <span
      v-if="hasToggle"
      class="popover__toggle"
      tabindex="0"
      role="button"
      data-test-id="popover-toggle"
      :aria-expanded="visible ? 'true' : 'false'"
      :aria-controls="$id('popover-content')"
      aria-haspopup="dialog"
    >
      <slot />
    </span>
    <transition name="fade" appear>
      <span v-show="visible" class="popover__arrow" aria-hidden="true" />
    </transition>
    <transition name="fade" appear>
      <div
        v-show="visible"
        :id="$id('popover-content')"
        role="dialog"
        class="popover__content"
        data-test-id="popover-content"
      >
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const sides = [
  'left-top',
  'left-center',
  'left-bottom',
  'right-top',
  'right-center',
  'right-bottom',
  'center-top',
  'center-bottom',
];

export default {
  name: 'EPopover',
  mixins: [classes],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    side: {
      type: String,
      default: 'left-top',
      validator: (value) => sides.includes(value),
      cssClass: true,
    },
  },
  computed: {
    hasToggle() {
      return !!this.$slots.default;
    },
  },
};
</script>

<style lang="scss" scoped>
$max-width: 280px;
$sides: (
  center-top: (
    left: 50%,
    content-x: -50%,
    content-y: -100%,
    content-offset-x: -50%,
    content-offset-y: - (100 - $slide-offset),
    content-vertical-distance-property: top,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-top: - $space-m,
    arrow-left: 50%,
    arrow-rotate: 0,
  ),
  center-bottom: (
    left: 50%,
    content-x: -50%,
    content-y: 100%,
    content-offset-x: -50%,
    content-offset-y: 100 - $slide-offset,
    content-vertical-distance-property: bottom,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-bottom: - $space-m,
    arrow-left: 50%,
    arrow-rotate: 180deg,
  ),
  left-top: (
    left: - $space-m,
    content-x: 0,
    content-y: -100%,
    content-offset-x: 0,
    content-offset-y: - (100 - $slide-offset),
    content-vertical-distance-property: top,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-top: - $space-m,
    arrow-left: 50%,
    arrow-rotate: 0,
  ),
  left-center: (
    top: 50%,
    content-x: -100%,
    content-y: -50%,
    content-offset-x: - (100 - ($slide-offset * 0.5)),
    content-offset-y: -50%,
    content-horizontal-distance-property: left,
    arrow-x: -25%,
    arrow-y: -50%,
    arrow-left: - $space-m,
    arrow-top: 50%,
    arrow-rotate: -90deg,
  ),
  left-bottom: (
    left: - $space-m,
    content-x: 0,
    content-y: 100%,
    content-offset-x: 0,
    content-offset-y: 100 - $slide-offset,
    content-vertical-distance-property: bottom,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-left: 50%,
    arrow-bottom: - $space-m,
    arrow-rotate: 180deg,
  ),
  right-top: (
    right: - $space-m,
    content-x: 0,
    content-y: -100%,
    content-offset-x: 0,
    content-offset-y: - (100 - $slide-offset),
    content-vertical-distance-property: top,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-left: 50%,
    arrow-top: - $space-m,
    arrow-rotate: 0,
  ),
  right-center: (
    top: 50%,
    content-x: 100%,
    content-y: -50%,
    content-offset-x: 100 - ($slide-offset * 0.5),
    content-offset-y: -50%,
    content-horizontal-distance-property: right,
    arrow-x: 25%,
    arrow-y: -50%,
    arrow-top: 50%,
    arrow-right: - $space-m,
    arrow-rotate: 90deg,
  ),
  right-bottom: (
    right: - $space-m,
    content-x: 0,
    content-y: 100%,
    content-offset-x: 0,
    content-offset-y: 100 - $slide-offset,
    content-vertical-distance-property: bottom,
    arrow-x: -50%,
    arrow-y: 0%,
    arrow-left: 50%,
    arrow-bottom: - $space-m,
    arrow-rotate: 180deg,
  )
);

.popover {
  display: inline-flex;
  position: relative;

  cursor: pointer;

  &:focus {
    @extend %keyboard-nav-focus;
  }
}

.popover__toggle {
  display: inline-flex;
  position: relative;

  &:focus {
    @extend %keyboard-nav-focus;
  }
}

.popover__content,
.popover__arrow {
  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity $timing-1s $easing, transform $timing-1s $easing;
  }

  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }
}

.popover__content {
  @include elevation(2);

  position: absolute;
  z-index: $z-index-1l;
  width: max-content;
  max-width: $max-width;
  padding: $space-m;

  border-radius: $border-radius-l;

  background-color: var(--color-surface-brand-secondary);

  color: var(--color-text-inverse-primary);
  font-size: $font-m;

  cursor: default;

  &:focus {
    @extend %keyboard-nav-focus;
  }
}

.popover__arrow {
  position: absolute;
  z-index: $z-index-2l;
  width: $space-m * 2;
  height: $space-m;
  margin-top: -1px;
  overflow: hidden;

  pointer-events: none;

  &::after {
    @include elevation(2);

    content: "";

    position: absolute;
    top: 0;
    left: 50%;
    width: $space-s;
    height: $space-s;

    transform: translate(-50%, -50%) rotate(45deg);

    background-color: var(--color-surface-brand-secondary);
  }
}

@each $side, $map in $sides {
  $left: map.get($map, left);
  $right: map.get($map, right);
  $top: map.get($map, top);
  $content-x: map.get($map, content-x);
  $content-y: map.get($map, content-y);
  $content-offset-x: map.get($map, content-offset-x);
  $content-offset-y: map.get($map, content-offset-y);
  $content-vertical-distance-property: map.get($map, content-vertical-distance-property);
  $content-horizontal-distance-property: map.get($map, content-horizontal-distance-property);
  $arrow-x: map.get($map, arrow-x);
  $arrow-y: map.get($map, arrow-y);
  $arrow-left: map.get($map, arrow-left);
  $arrow-right: map.get($map, arrow-right);
  $arrow-top: map.get($map, arrow-top);
  $arrow-bottom: map.get($map, arrow-bottom);
  $arrow-rotate: map.get($map, arrow-rotate);

  .popover--side-#{$side} {
    .popover__content {
      transform: translate($content-x, $content-y);

      @if $left {
        left: $left;
      }

      @if $right {
        right: $right;
      }

      @if $top {
        top: $top;
      }

      @if $content-horizontal-distance-property {
        #{$content-horizontal-distance-property}: 50%;
      }

      &.fade-enter,
      &.fade-leave-to {
        transform: translate($content-offset-x, $content-offset-y);
      }
    }

    .popover__arrow {
      transform: translate($arrow-x, $arrow-y) rotate($arrow-rotate);

      @if $arrow-top {
        top: $arrow-top;
      }

      @if $arrow-left {
        left: $arrow-left;
      }

      @if $arrow-right {
        right: $arrow-right;
      }

      @if $arrow-bottom {
        bottom: $arrow-bottom;
      }

      @if string.index($side, 'bottom') or string.index($side, 'right-center') {
        &::after {
          @include elevation(2-inverted);
        }
      }
    }

     .popover__content {
        @if $content-vertical-distance-property {
          #{$content-vertical-distance-property}: -$space-m;
        }

        @if $content-horizontal-distance-property {
          #{$content-horizontal-distance-property}: -$space-m;
        }
      }
    }
}
</style>
