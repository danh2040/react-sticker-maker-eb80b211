<template>
  <ELink :class="classes" v-bind="$attrs" v-on="$listeners">
    <slot name="default" />
  </ELink>
</template>

<script>
import ELink from '@ecosia/common-vue2/components/link/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const breakpoints = ['mobile-tablet', 'desktop', 'all'];
export const sizes = ['s', 'm', 'l'];

export default {
  name: 'ELinkBubble',
  components: { ELink },
  mixins: [classes],
  props: {
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    atBreakpoint: {
      type: String,
      default: 'all',
      cssClass: true,
      validator: (value) => breakpoints.includes(value),
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    size: {
      type: String,
      default: 's',
      cssClass: true,
      validator: (value) => sizes.includes(value),
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin unset {
  display: unset;
  height: unset;
  padding: unset;

  border: unset;
  border-radius: unset;

  &:hover {
    background-color: unset;
  }

  &:active {
    background-color: unset;
  }
}

.link-bubble {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;

  border: solid $border-width var(--color-decorative-border-1);
  border-radius: $border-radius-full;

  &:hover {
    background-color: var(--color-button-background-transparent-hover);
  }

  &:active {
    background-color: var(--color-button-background-transparent-active);
  }

  &:focus {
    @extend %keyboard-nav-focus;
  }

  // Tappable area extender
  &::after {
    content: '';

    position: absolute;
    top: calc(50% - #{$tappable-area-size-mobile * 0.5});
    right: 0;
    left: 0;
    height: $tappable-area-size-mobile;

    @include desktop {
      content: none;
    }
  }
}

.link-bubble--size-s {
  height: $space-2l;
  padding: 0 $space-s;
}

.link-bubble--size-m {
  height: $space-3l;
  padding: 0 $space-s;
}

.link-bubble--size-l {
  height: $space-4l;
  padding: 0 $space-m;
}

.link-bubble--at-breakpoint-mobile-tablet {
  @include desktop {
    @include unset;
  }
}

.link-bubble--at-breakpoint-desktop {
  @include desktop-down {
    @include unset;
  }
}
</style>
