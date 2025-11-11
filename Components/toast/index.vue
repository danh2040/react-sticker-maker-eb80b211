<template>
  <transition>
    <div
      v-if="show"
      :class="classes"
      role="log"
      aria-live="polite"
      data-test-id="toast"
    >
      <div class="toast__body">
        <EIcon v-if="icon" :icon="icon" />
        <div class="toast-body__text">
          <slot />
        </div>
        <EButton
          class="toast__button"
          data-test-id="dismiss"
          variant="bare"
          icon="close"
          @click="$emit('dismiss')"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

// note: for future "auto dismiss" refactoring (see Figma).
// durations are accessibility related
export const durations = {
  // for brief text of 10-15 words
  DEFAULT: 5000,
  // for text of ~20 words
  EXTENDED: 10000,
};

export const variants = {
  NEUTRAL: 'neutral',
  INFORMATIVE: 'informative',
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
};

const icons = {
  [variants.NEUTRAL]: null,
  [variants.INFORMATIVE]: 'info-circle',
  [variants.POSITIVE]: 'check-circle',
  [variants.NEGATIVE]: 'problem',
};

export default {
  name: 'EToast',
  components: {
    EButton,
    EIcon,
  },
  mixins: [classes],
  props: {
    variant: {
      type: String,
      default: variants.NEUTRAL,
      validator: (value) => Object.values(variants).includes(value),
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    right: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    icon() {
      return icons[this.variant];
    },
  },
};
</script>

<style lang="scss" scoped>
.toast {
  --toast-text: #{$white};
  --toast-neutral: #{$c-gray-90};
  --toast-negative: #{$n-red-700};
  --toast-positive: #{$c-green-70};
  --toast-informative: #{$c-blue-70};

  .dark & {
    --toast-text: #{$black};
    --toast-neutral: #{$c-gray-20};
    --toast-negative: #{$n-red-200};
    --toast-positive: #{$n-light-green-50};
    --toast-informative: #{$n-blue-100};
  }
  display: flex;
  position: fixed;
  z-index: 2;
  bottom: 0;
  left: 0;
  justify-content: center;
  width: 100%;

  transform: translateY(0);
  transition: transform $timing-s ease-in-out;

  pointer-events: none;
}

.toast.v-enter-active,
.toast.v-leave-active {
  transform: translateY(100%);
}

.toast--right {
  justify-content: flex-end;
}

.toast--show {
  transform: translateY(0);
}

.toast--variant-neutral {
  --background: var(--toast-neutral);
}

.toast--variant-informative {
  --background: var(--toast-informative);
}

.toast--variant-positive {
  --background: var(--toast-positive);
}

.toast--variant-negative {
  --background: var(--toast-negative);
}

.toast__body {
  display: flex;
  gap: $space-1s;
  align-items: center;
  max-width: 100%;
  margin-bottom: $space-m;
  padding: $space-1s $space-s;

  border-radius: $border-radius-m;

  background-color: var(--background);
  box-shadow: $elevation-2;

  color: var(--toast-text);

  pointer-events: auto;

  @include tablet {
    max-width: 500px;
  }
}

.toast--right .toast__body {
  margin: 0 $space-m $space-m;
}

.toast-body__text {
  flex-grow: 1;
}
</style>

<style lang="scss">
// TODO: this is a quick fix for the lack of a "bare-inverted" variant
// that we can add later.
.toast .toast__button {
  filter: invert(1);
}
</style>
