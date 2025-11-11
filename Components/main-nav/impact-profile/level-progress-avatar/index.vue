<template>
  <div :class="classNames">
    <ECircleProgress
      v-if="showCircleProgress"
      :size="SIZE"
      :is-animation-disabled="isAnimationDisabled"
      :is-locked="isCounterLocked"
      :previous-percentage="circleProgressPreviousLevelPercentage"
      :percentage="circleProgressLevelPercentage"
      class="level-progress-avatar__bar"
      data-test-id="level-progress-avatar-bar"
    />
    <EAvatar
      class="level-progress-avatar__avatar"
      size="l"
      data-test-id="level-progress-avatar-avatar"
    />
    <div
      v-if="showAvatarInfo && hasSeedsTotalAmount"
      class="level-progress-avatar__info"
      data-test-id="level-progress-avatar-info"
      :aria-label="ariaLabelSeedsAmount"
    >
      <EIcon
        icon="seed"
        size="s"
        aria-hidden="true"
        data-test-id="level-progress-avatar-seed-icon"
      />
      <span
        class="level-progress-avatar__info__text"
        aria-hidden="true"
      >
        <EMainNavMenuCounter
          :value="level.seedsEarned || 0"
          :previous-value="previousLevel.seedsEarned"
          :is-text-animation-disabled="isAnimationDisabled"
          data-test-id="level-progress-avatar-seed-earned"
        />
        <span class="level-progress-avatar__info__text__divider">/</span>
        <EMainNavMenuCounter
          v-if="level.seedsToEarn"
          :value="level.seedsToEarn"
          :previous-value="previousLevel.seedsToEarn"
          :is-text-animation-disabled="isAnimationDisabled"
          :is-locked="isCounterLocked"
          data-test-id="level-progress-avatar-seeds-to-earn"
        />
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import EAvatar from '@ecosia/common-vue2/components/avatar/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';

import EMainNavMenuCounter from '../../counter.vue';
import ECircleProgress from './circle-progress.vue';

const SIZE = 80;

export default {
  name: 'ELevelProgressAvatar',
  components: {
    EAvatar,
    EMainNavMenuCounter,
    EIcon,
    ECircleProgress,
  },
  constants: {
    SIZE,
  },
  computed: {
    ...mapState(useImpactStore, [
      'isSeedsLevelsV2UIEnabled',
      'hasGrowthPointsTotalAmount',
      'growthPoints',
      'seeds',
      'hasSeedsTotalAmount',
      'level',
      'previousLevel',
      'isGrowthPointsLevelLocked',
      'isUsersTotalLocked',
      'growthPointsLevelPercentage',
      'growthPointsPreviousLevelPercentage',
      'levelPercentage',
      'previousLevelPercentage',
      'hasUserSeenTheLevelProgressAnimation',
    ]),
    isCounterLocked() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.isGrowthPointsLevelLocked;
      }

      return this.isUsersTotalLocked;
    },
    circleProgressLevelPercentage() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.growthPointsLevelPercentage;
      }

      return this.levelPercentage;
    },
    circleProgressPreviousLevelPercentage() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.growthPointsPreviousLevelPercentage;
      }

      return this.previousLevelPercentage;
    },
    showCircleProgress() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.hasGrowthPointsTotalAmount;
      }

      return this.hasSeedsTotalAmount;
    },
    showAvatarInfo() {
      return !this.isSeedsLevelsV2UIEnabled;
    },
    classNames() {
      return {
        'level-progress-avatar': true,
        'level-progress-avatar--is-locked': this.isCounterLocked,
      };
    },
    isAnimationDisabled() {
      // disable the animation if
      // the total was not modified
      // OR the user has seen the animation
      if (this.isSeedsLevelsV2UIEnabled) {
        return !this.growthPoints?.isModified || this.hasUserSeenTheLevelProgressAnimation;
      }

      return !this.seeds?.isModified || this.hasUserSeenTheLevelProgressAnimation;
    },
    ariaLabelSeedsAmount() {
      return this.$t('common.header.menu.impact.seedsamount', { amountEarned: this.level.seedsEarned || 0, amountNeeded: this.level.seedsToEarn });
    },
  },
  mounted() {
    // wait for animations to play out
    setTimeout(() => {
      this.markUserAsHavingSeenTheLevelProgressAnimation();
    }, 2000);
  },
  methods: {
    ...mapActions(useImpactStore, [
      'markUserAsHavingSeenTheLevelProgressAnimation',
    ]),
  },
};
</script>

<style lang="scss" scoped>
$size: 80px;
$icon-size: 16px;

.level-progress-avatar {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  min-width: $size;
  height: $size;
}

.level-progress-avatar__bar,
.level-progress-avatar__avatar,
.level-progress-avatar__info {
  position: absolute;
}

.level-progress-avatar__avatar {
  width: 64px;
  height: 64px;
}

.level-progress-avatar__info {
  display: flex;
  position: absolute;
  bottom: -$space-2s;
  padding: $space-2s;

  border-radius: $border-radius-2l;

  background: var(--color-background-primary);

  color: var(--color-text-primary);
  font-size: $font-s;
  font-weight: $font-weight-700;
}

.level-progress-avatar__info__text {
  display: flex;

  // need fixed height for animated counters to work
  height: $icon-size;
  padding: 0 $space-2s;

  .level-progress-avatar--is-locked & {
    color: var(--color-decorative-icon);
  }
}

.level-progress-avatar__info__text__divider {
  height: 100%;
  margin: 0 $space-2s;
  margin-top: -1px; // alignment hack
}
</style>
