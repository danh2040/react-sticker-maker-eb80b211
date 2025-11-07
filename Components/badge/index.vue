<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const variants = ['featured', 'neutral', 'accent-yellow'];

export default {
  name: 'EBadge',
  mixins: [classes],
  props: {
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    variant: {
      type: String,
      validator: (variant) => variants.includes(variant),
      default: 'featured',
      cssClass: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.badge {
  display: inline-flex;
  align-items: center;
  height: $space-l;
  padding-right: $space-1s;
  padding-left: $space-1s;

  border-radius: $border-radius-full;

  color: var(--color-text-inverse-primary);
  font-size: $font-s;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: $font-weight-600;

  user-select: none;
}

.badge--variant-featured {
  background-color: var(--color-background-featured-static);

  color: var(--color-text-static-dark);

}

.badge--variant-neutral {
  background-color: var(--color-background-inverse-primary);
}

.badge--variant-accent-yellow {
  background: $n-yellow-200;

  color: $c-gray-90;
}
</style>
