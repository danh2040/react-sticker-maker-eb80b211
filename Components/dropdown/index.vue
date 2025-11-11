<template>
  <transition
    name="fade-slide"
  >
    <div
      v-if="visible"
      ref="dropdown"
      :class="classes"
      data-test-id="dropdown"
      v-on="$listeners"
      @keydown.esc="closeOnEscape"
    >
      <slot />
    </div>
  </transition>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';
import { focusFocusableChild } from '@ecosia/common-vue2/utils/keyboard-utils.js';

export const sides = ['left', 'center', 'right'];

export default {
  name: 'EDropdown',
  mixins: [classes],
  props: {
    /**
     * The side for the dropdown `left, right`
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    side: {
      type: String,
      default: 'left',
      validator: (value) => sides.includes(value),
      cssClass: true,
    },
    /**
     * The visibility for the dropdown
     */
    visible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        this.$nextTick(this.focusFirstElement);
      }
    },
  },
  methods: {
    focusFirstElement() {
      focusFocusableChild(this.$refs.dropdown);
    },
    closeOnEscape(event) {
      if (event.key === 'Escape') {
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  @include elevation(2);

  --slide-animation: e-slide-top;

  position: absolute;
  z-index: $z-index-1l;
  top: 100%;
  min-width: 184px;
  overflow: hidden;

  border-radius: $border-radius-l;

  background-color: var(--color-background-elevation-2);
}

.dropdown--side-left {
  left: 0;
}

.dropdown--side-center {
  --slide-animation: e-slide-top-center;

  left: 50%;

  transform: translateX(-50%);
}

.dropdown--side-right {
  right: $space-s;
}

.fade-slide-enter-active {
  animation: e-fade-in $timing-1s both, var(--slide-animation) $timing-1s both;
}

.fade-slide-leave-active {
  animation: e-fade-in $timing-1s both reverse, var(--slide-animation) $timing-1s both reverse;
}
</style>
