<template>
  <component
    :is="as"
    :class="classes"
    :rel="rel"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </component>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

export default {
  name: 'ECard',
  mixins: [classes],
  props: {
    as: {
      type: String,
      default: 'div',
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    overflowVisible: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    padding: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    border: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
  },
  computed: {
    rel() {
      return this.as === 'a' ? 'noopener' : undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: $border-radius-l;
}

.card--as-button {
  appearance: none;

  cursor: pointer;
}

.card--as-a,
.card--as-button {
  transition-property: background;
  transition-duration: $timing-2s;
  transition-timing-function: $easing;

  background-color: var(--color-background-primary);

  &:hover {
    background-color: var(--color-button-background-secondary-hover);
  }

  &:active {
    background-color: var(--color-button-background-secondary-active);
  }

  &:focus {
    @extend %keyboard-nav-focus;

    outline-offset: 0;
  }
}

.card--overflow-visible {
  overflow: visible;
}

.card--padding {
  padding: $space-m;
}

.card--border {
  border: $border-width solid var(--color-decorative-border-1);
}
</style>
