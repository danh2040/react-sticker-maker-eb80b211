<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

/**
 * A wrapper for a group of related buttons
 */
export default {
  name: 'EButtonGroup',
  mixins: [classes],
};
</script>

<style lang="scss" scoped>
.button-group {
  display: flex;
  margin-top: $space-m;

  & ::v-deep {
    .base-button--size-s {
      margin-left: $space-1s;
    }

    .base-button--size-m {
      margin-left: $space-m;
    }

    .base-button--size-l {
      margin-left: $space-l;
    }

    .base-button:first-child {
      margin-left: 0;
    }
  }
}
</style>
