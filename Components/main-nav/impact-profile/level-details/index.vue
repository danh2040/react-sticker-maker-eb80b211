<template>
  <EBadge
    v-if="hasLevelValue"
    class="level-details"
    :variant="isSignedIn ? 'accent-yellow': 'neutral'"
    data-test-id="impact-profile-level-badge"
  >
    <EMainNavMenuAnimatedLockIcon
      :is-locked="isCounterLocked"
      :was-locked="wasCounterLocked"
      :is-animation-disabled="isAnimationDisabled"
      animate-in-from="left"
    />
    <span class="level-details__text">
      <span data-test-id="impact-profile-level-number">
        {{ $t('common.header.menu.impact.levelnumber', { number: levelNumber }) }}
      </span>&nbsp;-&nbsp;
      <span data-test-id="impact-profile-level-name">{{ $t(`common.header.menu.impact.level.${levelNumber}`) }}</span>
    </span>
  </EBadge>
</template>

<script>
import { mapState } from 'pinia';

import EBadge from '@ecosia/common-vue2/components/badge/index.vue';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EMainNavMenuAnimatedLockIcon from '../../animated-lock-icon.vue';

export default {
  name: 'ELevelDetails',
  components: {
    EBadge,
    EMainNavMenuAnimatedLockIcon,
  },
  computed: {
    ...mapState(useImpactStore, [
      'isSeedsLevelsV2UIEnabled',
      'hasLevel',
      'level',
      'hasGrowthPointsLevel',
      'isGrowthPointsLevelLocked',
      'wasGrowthPointsLevelLocked',
      'isUsersTotalLocked',
      'wasUsersPreviousTotalLocked',
      'growthPoints',
      'seeds',
      'hasUserSeenTheLevelProgressAnimation',
    ]),
    ...mapState(useUserStore, ['isSignedIn']),
    isCounterLocked() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.isGrowthPointsLevelLocked;
      }

      return this.isUsersTotalLocked;
    },
    wasCounterLocked() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.wasGrowthPointsLevelLocked;
      }

      return this.wasUsersPreviousTotalLocked;
    },
    isAnimationDisabled() {
      // disable the animation if
      // user isn't signed-in AND the total was not modified
      // OR the user has seen the animation

      if (this.isSeedsLevelsV2UIEnabled) {
        return (!this.isSignedIn && !this.growthPoints?.isModified) || this.hasUserSeenTheLevelProgressAnimation;
      }

      return (!this.isSignedIn && !this.seeds?.isModified) || this.hasUserSeenTheLevelProgressAnimation;
    },
    hasLevelValue() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.hasGrowthPointsLevel;
      }

      return this.hasLevel;
    },
    levelNumber() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.growthPoints.level.number;
      }

      return this.level.number;
    },
  },
};
</script>

<style lang="scss" scoped>
.level-details {
  max-width: 100%;
}

.level-details__text {
  max-width: 100%;
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
