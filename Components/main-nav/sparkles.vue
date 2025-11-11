<template>
  <div
    v-if="isVisible"
    :class="classNames"
  >
    <div class="menu-button-impact-counter-sparkles__sparkle">
      <SparkleSVG />
    </div>
    <div class="menu-button-impact-counter-sparkles__sparkle">
      <SparkleSVG />
    </div>
    <div class="menu-button-impact-counter-sparkles__sparkle">
      <SparkleSVG />
    </div>
  </div>
</template>

<script>
/*
  there's magic numbers all over the shop in this component

  please forgive me and just believe that the magic is
  what make the animations feel nice 🙈✨
*/

import { mapActions, mapState } from 'pinia';

import { useImpactStore } from '@ecosia/accounts-impact-client/store';

import SparkleSVG from './sparkle.svg';

const SPARKLE_ANIMATION_DURATION_MS = 400;
const SPARKLE_ANIMATION_DELAY_BETWEEN_MS = 200;

export default {
  name: 'EMainNavMenuButtonImpactCounterSparkles',
  components: {
    SparkleSVG,
  },
  constants: {
    SPARKLE_ANIMATION_DURATION_MS,
    SPARKLE_ANIMATION_DELAY_BETWEEN_MS,
  },
  data() {
    return {
      isVisible: false,
      isAnimating: false,
    };
  },
  computed: {
    ...mapState(useImpactStore, [
      'isSeedsLevelsV2UIEnabled',
    ]),
    classNames() {
      return {
        'menu-button-impact-counter-sparkles': true,
        'menu-button-impact-counter-sparkles--is-animating': this.isAnimating,
      };
    },
  },
  mounted() {
    this.$nextTick(async () => {
      if (this.isSeedsLevelsV2UIEnabled) {
        this.isVisible = this.getIsGrowthPointsLevelUpUIVisible();
      } else {
        this.isVisible = this.getIsLevelUpUIVisible();
      }

      if (this.isVisible) {
        await this.runAnimation();
      }
    });
  },
  methods: {
    ...mapActions(useImpactStore, [
      'getIsGrowthPointsLevelUpUIVisible',
      'getIsLevelUpUIVisible',
    ]),
    async runAnimation() {
      // run the animation after waiting a bit so seed animation is finished
      await this.waitSeconds(800);
      this.isAnimating = true;

      // stop animation after waiting for all 3 sparkles to finish
      await this.waitSeconds(
        SPARKLE_ANIMATION_DURATION_MS +
        (2 * SPARKLE_ANIMATION_DELAY_BETWEEN_MS),
      );
      this.isAnimating = false;

      // run the animation again after waiting a bit
      await this.waitSeconds(500);
      this.isAnimating = true;

      // don't need to stop animating, cause CSS animation doesn't loop
    },
    async waitSeconds(value) {
      return await new Promise((resolve) => {
        setTimeout(resolve, value);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$sparkle-animation-duration: 400ms;
$sparkle-animation-delay-between: 200ms;

@keyframes fade-in-out {
  0% { opacity: 0; }
  10%, 90% { opacity: 1; }
  100% { opacity: 0;}
}

@keyframes spin-in-clockwise {
  0% { transform: scale(0.5) rotate(-45deg); }
  50% { transform: scale(1) rotate(0deg); }
  100% { transform: scale(0.5) rotate(45deg); }
}

@keyframes spin-in-anti-clockwise {
  0% { transform: scale(0.5) rotate(45deg); }
  50% { transform: scale(1) rotate(0deg); }
  100% { transform: scale(0.5) rotate(-45deg); }
}

.menu-button-impact-counter-sparkles {
  pointer-events: none;
}

.menu-button-impact-counter-sparkles__sparkle {
  position: absolute;

  transform-origin: center;

  opacity: 0;

  &:nth-child(1) {
    top: -2px;
    left: -2px;
  }

  &:nth-child(2) {
    bottom: -3px;
    left: -5px;
  }

  &:nth-child(3) {
    top: -4px;
    right: -5px;
  }

  .menu-button-impact-counter-sparkles--is-animating & {
    animation-duration: $sparkle-animation-duration;
    animation-timing-function: ease-in-out;
    animation-direction: forwards;

    &:nth-child(1) {
      animation-name: fade-in-out, spin-in-anti-clockwise;
    }

    &:nth-child(2) {
      animation-name: fade-in-out, spin-in-clockwise;
      animation-delay: $sparkle-animation-delay-between;
    }

    &:nth-child(3) {
      animation-name: fade-in-out, spin-in-anti-clockwise;
      animation-delay: calc($sparkle-animation-delay-between * 2);
    }
  }
}
</style>
