<template>
  <EButton
    :class="classes"
    v-bind="$attrs"
    :aria-busy="loading"
    v-on="$listeners"
  >
    <span class="loading-button__content">
      <slot />
    </span>
    <transition name="fade">
      <EIcon
        v-if="loading"
        icon="spinner"
        class="loading-button__indicator"
        data-test-id="loading-button-indicator"
        role="alert"
        aria-live="polite"
        aria-label="Loading…"
      />
    </transition>
  </EButton>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export default {
  name: 'ELoadingButton',
  components: {
    EButton,
    EIcon,
  },
  mixins: [classes],
  props: {
    loading: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active,
.loading-button__content {
  transition: opacity $timing-2s $easing;
}

.loading-button__indicator {
  position: absolute;
}

.loading-button--loading {
  position: relative; // already set in Button, re-defineed for extra safety

  pointer-events: none;

  .loading-button__content {
    opacity: 0;
  }
}
</style>
