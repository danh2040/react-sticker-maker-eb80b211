<template>
  <svg
    :class="classNames"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    aria-hidden="true"
  >
    <circle
      data-test-id="circle-progress-bar-background"
      class="circle-progress__bar-background"
      :r="circleRadius"
      :cx="circlePosition"
      :cy="circlePosition"
      :stroke-width="strokeWidth"
    />
    <circle
      data-test-id="circle-progress-bar"
      class="circle-progress__bar"
      :r="circleRadius"
      :cx="circlePosition"
      :cy="circlePosition"
      :stroke-width="strokeWidth"
      :stroke-dasharray="dashArray"
      :stroke-dashoffset="dashOffset"
    />
  </svg>
</template>

<script>
import { mapState } from 'pinia';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';

const PI = 3.14;
const CIRCLE_PATH_STROKE_WIDTH = 6.5;
const MAX_PERCENTAGE = 1;

export default {
  name: 'ECircleProgress',
  props: {
    size: {
      type: Number,
      required: true,
    },
    previousPercentage: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    isAnimationDisabled: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      usePreviousPercentage: true,
    };
  },
  computed: {
    ...mapState(useImpactStore, [
      'isSeedsLevelsV2UIEnabled',
    ]),
    classNames() {
      return {
        'circle-progress': true,
        'circle-progress--is-locked': this.isLocked,
        'circle-progress--seeds-levels-v2-enabled': this.isSeedsLevelsV2UIEnabled,
        'circle-progress--is-animation-disabled': this.isAnimationDisabled,
      };
    },
    currentPercentage() {
      if (this.isAnimationDisabled) {
        return this.percentage;
      }

      if (this.usePreviousPercentage) {
        return this.previousPercentage;
      }

      return this.percentage;
    },
    strokeWidth() {
      return CIRCLE_PATH_STROKE_WIDTH;
    },
    circlePosition() {
      return this.size / 2;
    },
    circleRadius() {
      return (this.size / 2) - (this.strokeWidth / 2);
    },
    circleCircumference() {
      return Math.floor(2 * PI * this.circleRadius);
    },
    dashArray() {
      return this.circleCircumference;
    },
    dashOffset() {
      if (this.isSeedsLevelsV2UIEnabled) {
        // if the percentage is more than 100%
        if (this.currentPercentage > MAX_PERCENTAGE) {
          return 0; // make the progress bar full
        }

        return this.circleCircumference - (
          this.circleCircumference * this.currentPercentage
        );
      }

      // 50 is magic number to end the progress bar
      // just behind the right of the level info

      // if the percentage is more than 100%
      if (this.currentPercentage > MAX_PERCENTAGE) {
        return 50; // make the progress bar full
      }

      return this.circleCircumference - ((this.circleCircumference - 50) * this.currentPercentage);
    },
  },
  mounted() {
    setTimeout(() => {
      this.usePreviousPercentage = false;
    }, 500);
  },
};
</script>

<style lang="scss" scoped>
.circle-progress--is-animation-disabled * {
  @include disable-animations;
}

.circle-progress__bar-background,
.circle-progress__bar {
  fill: none;
}

.circle-progress__bar-background {
  stroke: var(--color-decorative-border-1);
}

.circle-progress__bar {
  // magic number to rotate the start of the progress bar
  // to just behind left of the level info
  transform: rotate(130deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.5s;

  stroke-linecap: round;
  stroke: $n-yellow-200;

  .circle-progress--seeds-levels-v2-enabled & {
    // rotate the progress bar so it starts bottom center
    transform: rotate(90deg);
  }

  .circle-progress--is-locked & {
    animation: 0.5s 0.5s forwards;

    .light & {
      animation-name: lock-stroke-light;
    }

    .dark & {
      animation-name: lock-stroke-dark;
    }
  }
}

@keyframes lock-stroke-dark {
  100% {
    stroke: $n-yellow-800;
  }
}

@keyframes lock-stroke-light {
  100% {
    stroke: $n-yellow-100;
  }
}
</style>
