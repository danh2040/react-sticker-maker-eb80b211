<template>
  <span
    v-if="isLocked || wasLocked"
    data-test-id="animated-lock-icon"
    :class="classNames"
  >
    <span class="animated-lock-icon__icon">
      <EIcon
        icon="privacy-locked"
        size="s"
        aria-hidden="true"
      />
    </span>
  </span>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

export default {
  name: 'EMainNavMenuAnimatedLockIcon',
  components: {
    EIcon,
  },
  props: {
    isLocked: {
      type: Boolean,
      default: false,
    },
    wasLocked: {
      type: Boolean,
      default: false,
    },
    isAnimationDisabled: {
      type: Boolean,
      default: false,
    },
    isAnimationDelayed: {
      type: Boolean,
      default: false,
    },
    animateInFrom: {
      type: String,
      default: 'left',
    },
  },
  computed: {
    classNames() {
      return {
        'animated-lock-icon': true,
        'animated-lock-icon--is-locked': this.isLocked,
        'animated-lock-icon--was-locked': this.wasLocked,
        'animated-lock-icon--is-animation-disabled': this.isAnimationDisabled,
        'animated-lock-icon--is-animation-delayed': this.isAnimationDelayed,
        'animated-lock-icon--animate-in-from-left': this.animateInFrom === 'left',
        'animated-lock-icon--animate-in-from-right': this.animateInFrom === 'right',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$lock-icon-size: 16px;
$padding-size: calc($lock-icon-size + $space-2s);

.animated-lock-icon {
  display: flex;
  position: relative;
  flex-direction: row;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: $lock-icon-size;
  overflow: hidden;

  animation-duration: $timing-m;
  animation-delay: calc($timing-m + $timing-1s);

  animation-fill-mode: forwards;

  &.animated-lock-icon--animate-in-from-left {
    padding-left: 0;

    animation-name: animation-item-text-locked-left;
  }

  &.animated-lock-icon--animate-in-from-right {
    padding-right: 0;

    animation-name: animation-item-text-locked-right;
  }

  &.animated-lock-icon--was-locked {
    &.animated-lock-icon--animate-in-from-left {
      padding-left: $padding-size;
    }

    &.animated-lock-icon--animate-in-from-right {
      padding-right: $padding-size;
    }

    animation-direction: reverse;
  }

  &.animated-lock-icon--is-animation-delayed {
    animation-delay: $timing-1l;
  }

  &.animated-lock-icon--is-animation-disabled {
    @include disable-animations;
  }
}

@keyframes animation-item-text-locked-left {
  0%   { padding-left: 0; }
  100% { padding-left: $padding-size; }
}

@keyframes animation-item-text-locked-right {
  0%   { padding-right: 0; }
  100% { padding-right: $padding-size; }
}

.animated-lock-icon__icon {
  position: absolute;
  top: -$space-3s;
  width: $lock-icon-size;

  animation-duration: $timing-m;
  animation-delay: calc($timing-m + $timing-1s);

  animation-fill-mode: forwards;

  .animated-lock-icon--animate-in-from-left & {
    left: 0;

    animation-name: animation-lock-icon-fade, animation-lock-icon-from-left;
  }

  .animated-lock-icon--animate-in-from-right & {
    right: 0;

    animation-name: animation-lock-icon-fade, animation-lock-icon-from-right;
  }

  .animated-lock-icon--is-locked & {
    opacity: 0;
  }

  .animated-lock-icon--was-locked & {
    animation-direction: reverse;

    opacity: 1;
  }

  .animated-lock-icon--is-animation-delayed & {
    animation-delay: $timing-1l;
  }

  .animated-lock-icon--is-animation-disabled & {
    @include disable-animations;
  }
}

@keyframes animation-lock-icon-fade {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes animation-lock-icon-from-left {
  0%   { transform: translateX(-$lock-icon-size); }
  100% { transform: translateX(0); }
}

@keyframes animation-lock-icon-from-right {
  0%   { transform: translateX($lock-icon-size); }
  100% { transform: translateX(0); }
}
</style>
