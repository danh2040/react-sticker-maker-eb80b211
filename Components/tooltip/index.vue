<template>
  <!-- @click.stop Avoids bubbling up click events -->
  <div
    v-focus-away="close"
    :class="classes"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <span
      ref="toggle"
      class="tooltip__toggle"
      :tabindex="focusable ? 0 : -1"
      :role="focusable ? 'button' : null"
      data-test-id="tooltip-toggle"
      :aria-expanded="opened ? 'true' : 'false'"
      :aria-controls="$id('tooltip-content')"
      aria-haspopup="dialog"
      @click="toggle"
      @keyup.self.escape="close"
      @keypress.self.space.prevent="toggle"
      @keypress.self.enter="toggle"
    >
      <slot />
      <transition name="fade">
        <span
          v-show="visible"
          class="tooltip__arrow"
          aria-hidden="true"
        />
      </transition>
    </span>
    <transition name="fade">
      <div
        v-show="visible"
        :id="$id('tooltip-content')"
        role="dialog"
        class="tooltip__content"
        data-test-id="tooltip-content"
        @keyup.escape="close"
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
  'center-bottom-left-aligned',
];
export const sizes = ['l', 'm', 's'];
export const hideDelay = 300;

export default {
  name: 'ETooltip',
  mixins: [classes],
  props: {
    focusable: {
      type: Boolean,
      default: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    padding: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    side: {
      type: String,
      default: 'left-top',
      validator: (value) => sides.includes(value),
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    size: {
      type: String,
      default: 'm',
      validator: (value) => sizes.includes(value),
      cssClass: true,
    },
    openOnHover: {
      type: Boolean,
      default: true,
    },
    closeOnMouseLeave: {
      type: Boolean,
      default: false,
    },
    openOnFocus: {
      type: Boolean,
      default: true,
    },
    openOnStart: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    colorVariant: {
      type: String,
      default: 'default',
      cssClass: true,
      validator: (value) => ['default', 'brand-secondary'].includes(value),
    },
    closeOnScroll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hovered: false,
      focused: false,
      opened: this.openOnStart,
    };
  },
  computed: {
    visible() {
      return this.opened || (this.openOnHover && this.hovered) || (this.openOnFocus && this.focused);
    },
  },
  watch: {
    opened(isOpened) {
      const eventOptions = { passive: true };
      if (isOpened) {
        if (this.closeOnScroll) {
          document.addEventListener('scroll', this.scrollListener, eventOptions);
        }
        this.$emit('tooltip-opened');
      } else {
        if (this.closeOnScroll) {
          document.removeEventListener('scroll', this.scrollListener, eventOptions);
        }
        // mobile browsers also fire `mouseenter` when the toggle is tapped
        // so we have to also "unhover" when closing.
        this.hovered = false;
        this.focused = false;
      }
    },
    hovered(isHovered) {
      if (this.openOnHover && isHovered) {
        this.$emit('tooltip-opened');
      }
    },
    focused(isFocused) {
      if (this.openOnFocus && isFocused) {
        this.$emit('tooltip-opened');
      }
    },
  },
  beforeMount() {
    if (this.closeOnScroll) {
      this.scrollListener = () => this.close();
    }

    if (this.opened) {
      if (this.closeOnScroll) {
        document.addEventListener('scroll', this.scrollListener, { passive: true });
      }
      this.$emit('tooltip-opened');
    }
  },
  methods: {
    onMouseEnter() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.hovered = true;
      this.$emit('tooltip-hovered');
    },
    onMouseLeave() {
      if (!this.timeout) {
        this.timeout = setTimeout(() => {
          this.hovered = false;
        }, hideDelay);
      }
      if (this.closeOnMouseLeave) {
        this.opened = false;
      }
    },
    onFocusIn() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.focused = true;
    },
    onFocusOut() {
      if (!this.timeout) {
        this.timeout = setTimeout(() => {
          this.focused = false;
        }, hideDelay);
      }
    },
    toggle() {
      this.opened = !this.opened;
    },
    close() {
      this.opened = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$max-width: 280px;
$max-width-l: 315px;

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
    arrow-top: true,
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
    arrow-bottom: true,
    arrow-left: 50%,
    arrow-rotate: 180deg,
  ),
  center-bottom-left-aligned: (
    left: 0%,
    content-x: 10%,
    content-y: 100%,
    content-offset-x: -50%,
    content-offset-y: 100 - $slide-offset,
    content-vertical-distance-property: bottom,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-bottom: true,
    arrow-left: 50%,
    arrow-rotate: 180deg,
  ),
  left-top: (
    left: true,
    content-x: 0,
    content-y: -100%,
    content-offset-x: 0,
    content-offset-y: - (100 - $slide-offset),
    content-vertical-distance-property: top,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-top: true,
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
    arrow-left: true,
    arrow-top: 50%,
    arrow-rotate: -90deg,
  ),
  left-bottom: (
    left: true,
    content-x: 0,
    content-y: 100%,
    content-offset-x: 0,
    content-offset-y: 100 - $slide-offset,
    content-vertical-distance-property: bottom,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-left: 50%,
    arrow-bottom: true,
    arrow-rotate: 180deg,
  ),
  right-top: (
    right: true,
    content-x: 0,
    content-y: -100%,
    content-offset-x: 0,
    content-offset-y: - (100 - $slide-offset),
    content-vertical-distance-property: top,
    arrow-x: -50%,
    arrow-y: 0,
    arrow-left: 50%,
    arrow-top: true,
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
    arrow-right: true,
    arrow-rotate: 90deg,
  ),
  right-bottom: (
    right: true,
    content-x: 0,
    content-y: 100%,
    content-offset-x: 0,
    content-offset-y: 100 - $slide-offset,
    content-vertical-distance-property: bottom,
    arrow-x: -50%,
    arrow-y: 0%,
    arrow-left: 50%,
    arrow-bottom: true,
    arrow-rotate: 180deg,
  )
);
$sizes: (
  l: (
    padding: $space-m,
    font-size: $font-m,
    arrow-container: $space-m,
    arrow-size: 12px,
    spacing: $space-m,
  ),
  m: (
    padding: $space-m,
    font-size: $font-m,
    arrow-container: $space-m,
    arrow-size: 12px,
    spacing: $space-m,
  ),
  s: (
    padding: $space-1s,
    font-size: $font-s,
    arrow-container: $space-1s,
    arrow-size: 6px,
    spacing: $space-1s,
  )
);

.tooltip {
  display: inline-flex;
  position: relative;

  cursor: pointer;

  &:focus {
    @extend %keyboard-nav-focus;
  }
}

.tooltip__toggle {
  display: inline-flex;
  position: relative;

  &:focus {
    @extend %keyboard-nav-focus;
  }
}

.tooltip__content,
.tooltip__arrow {
  &.fade-enter-active,
  &.fade-leave-active {
    transition: opacity $timing-1s $easing, transform $timing-1s $easing;
  }

  &.fade-enter,
  &.fade-leave-to {
    opacity: 0;
  }
}

.tooltip__content {
  @include elevation(2);

  position: absolute;
  z-index: $z-index-2l;
  width: max-content;
  max-width: $max-width;

  border-radius: $border-radius-l;

  background-color: var(--color-background-elevation-2);

  color: var(--color-text-primary);

  cursor: default;

  &:focus {
    @extend %keyboard-nav-focus;
  }
}

.tooltip__arrow {
  position: absolute;
  z-index: $z-index-3l;
  margin-top: 1px;
  overflow: hidden;

  pointer-events: none;

  &::after {
    @include elevation(2);

    content: "";

    position: absolute;
    top: 0;
    left: 50%;

    transform: translate(-50%, -50%) rotate(45deg);

    background-color: var(--color-background-elevation-2);
  }
}

.tooltip--color-variant-brand-secondary {
  .tooltip__arrow::after {
    background-color: var(--color-background-brand-secondary);
  }

  .tooltip__content {
    background-color: var(--color-background-brand-secondary);

    color: var(--color-text-inverse-primary);
  }
}

@each $size, $map in $sizes {
  $padding: map.get($map, padding);
  $font-size: map.get($map, font-size);
  $arrow-container: map.get($map, arrow-container);
  $arrow-size: map.get($map, arrow-size);

  .tooltip--size-#{$size} {
    .tooltip__content {
      font-size: $font-size;
    }

    .tooltip__arrow {
      width: $arrow-container * 2;
      height: $arrow-container;

      &::after {
        width: $arrow-size;
        height: $arrow-size;
      }
    }

    &.tooltip--padding {
      .tooltip__content {
        padding: $padding;
      }
    }
  }
}

.tooltip--size-l .tooltip__content {
  width: $max-width-l;
  max-width: calc(100vw - 2 * $space-m);
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

  .tooltip--side-#{$side} {
    .tooltip__content {
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

    .tooltip__arrow {
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

    @each $size, $map in $sizes {
      $arrow-container: map.get($map, arrow-container);
      $spacing: map.get($map, spacing);

      &.tooltip--size-#{$size} {
        .tooltip__content {
          @if $content-vertical-distance-property {
            #{$content-vertical-distance-property}: -$arrow-container;
          }

          @if $content-horizontal-distance-property {
            #{$content-horizontal-distance-property}: -$arrow-container;
          }

          @if $left == true {
            left: -$spacing;
          }

          @if $right == true {
            right: -$spacing;
          }
        }

        .tooltip__arrow {
          @if $arrow-top == true {
            top: -$spacing;
          }

          @if $arrow-bottom == true {
            bottom: -$spacing;
          }

          @if $arrow-left == true {
            left: -$spacing;
          }

          @if $arrow-right == true {
            right: -$spacing;
          }
        }
      }
    }
  }
}
</style>
