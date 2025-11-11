<template>
  <span :class="classNames">
    <span class="counter__item" aria-hidden="true">
      <span
        class="counter__item__text counter__item__text--previous-value"
        data-test-id="impact-counter-item-previous-value"
      >
        {{ previousValue }}
      </span>
    </span>
    <span class="counter__item">
      <span
        class="counter__item__text counter__item__text--value"
        data-test-id="impact-counter-item-value"
      >
        {{ value }}
      </span>
      <EMainNavMenuAnimatedLockIcon
        class="counter__item__animated-lock-icon"
        :is-locked="isLocked"
        :was-locked="wasLocked"
        :is-animation-delayed="isAnimationDelayed"
        :is-animation-disabled="isLockIconAnimationDisabled"
        animate-in-from="right"
      />
    </span>
  </span>
</template>

<script>
import EMainNavMenuAnimatedLockIcon from './animated-lock-icon.vue';

export default {
  name: 'EMainNavMenuCounter',
  components: {
    EMainNavMenuAnimatedLockIcon,
  },
  props: {
    previousValue: {
      type: Number,
      required: false,
      default: 0,
    },
    value: {
      type: Number,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    wasLocked: {
      type: Boolean,
      default: false,
    },
    isTextAnimationDisabled: {
      type: Boolean,
      default: false,
    },
    isLockIconAnimationDisabled: {
      type: Boolean,
      default: false,
    },
    isAnimationDelayed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classNames() {
      return {
        'counter': true,
        'counter--is-locked': this.isLocked,
        'counter--was-locked': this.wasLocked,
        'counter--is-text-animation-disabled': this.isTextAnimationDisabled,
        'counter--is-animation-delayed': this.isAnimationDelayed,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.counter {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  font-weight: $font-weight-700;
}

.counter__item {
  display: flex;
  position: relative;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 100%;

  animation-name: animation-value-item;
  animation-duration: $timing-m;
  animation-timing-function: cubic-bezier(.19,0,.65,1.19);

  animation-fill-mode: forwards;

  .counter--is-animation-delayed & {
    animation-delay: 1.35s; // todo fix magic numbier
  }

  .counter--is-text-animation-disabled & {
    @include disable-animations;
  }
}

@keyframes animation-value-item {
  0%, 15% { transform: translateY(0); }
  100%    { transform: translateY(-100%); }
}

.counter__item__text--value {
  .counter--is-locked &,
  .counter--was-locked & {
    animation-name: animation-item-text-locked;
    animation-duration: $timing-m;
    animation-delay: calc($timing-m + $timing-1s);

    animation-fill-mode: forwards;
  }

  .counter--was-locked & {
    animation-direction: reverse;

    color: var(--color-decorative-icon);
  }

  .counter--is-animation-delayed & {
    animation-delay: $timing-1l;
  }
}

@keyframes animation-item-text-locked {
  0%   { color: unset; }
  100% { color: var(--color-decorative-icon); }
}

.counter__item__animated-lock-icon {
  color: var(--color-decorative-icon);
}
</style>
