<template>
  <div>
    <EBaseButton
      :class="classNames"
      size="m"
      variant="solid-white"
      :force-hover="isMenuExpanded"
      data-test-id="menu-button-impact-counter"
      :aria-haspopup="showMenuAsSheet ? 'dialog' : 'false'"
      :aria-expanded="isMenuExpanded ? 'true' : 'false'"
      :aria-label="menuButtonAriaLabel"
      :aria-controls="menuButtonAriaControlsId"
      v-on="$listeners"
    >
      <template v-if="hasSeedsTotalAmount">
        <EMainNavMenuButtonImpactCounterSparkles
          class="menu-button-impact-counter__sparkles"
        />
        <span class="menu-button-impact-counter__seed-icon" data-test-id="seed-icon">
          <EIcon icon="seed" size="m" />
        </span>
        <span
          v-if="seeds?.isModified && totalSeedAmountChangeString"
          data-test-id="menu-button-impact-counter-total-seed-amount-change"
          class="menu-button-impact-counter-total-seed-amount-change"
        >
          {{ totalSeedAmountChangeString }}
        </span>
        <span class="menu-button-impact-counter__counter">
          <EMainNavMenuCounter
            :previous-value="seeds?.previousTotalAmount"
            :value="seeds?.totalAmount"
            :is-text-animation-disabled="isAnimationDisabled"
            :is-lock-icon-animation-disabled="isLockIconAnimationDisabled"
            :is-locked="isCounterLocked"
            :was-locked="wasCounterLocked"
            :aria-label="seedsAmountAriaLabel"
            is-animation-delayed
          />
        </span>
      </template>
      <EAvatar />
      <ENotificationPill :has-notification="hasNotification" />
    </EBaseButton>

    <EMainNavMenuPopoverLevelUp />
  </div>
</template>

<script>
import { mapState } from 'pinia';

import EAvatar from '@ecosia/common-vue2/components/avatar/index.vue';
import EBaseButton from '@ecosia/common-vue2/components/button/base.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import ENotificationPill from '@ecosia/common-vue2/components/notification-pill/index.vue';

import { useSeedsAmountText } from '@ecosia/accounts-impact-client/composables/seeds-amount-text.js';
import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';
import { useUserStore } from '@ecosia/store/user';

import EMainNavMenuCounter from './counter.vue';
import { useNavMenuMessagesStore } from './impact-profile/message/store.js';
import EMainNavMenuPopoverLevelUp from './popover-level-up.vue';
import EMainNavMenuButtonImpactCounterSparkles from './sparkles.vue';

export default {
  name: 'EMainNavMenuButtonImpactCounter',
  components: {
    EBaseButton,
    EIcon,
    EAvatar,
    EMainNavMenuCounter,
    EMainNavMenuPopoverLevelUp,
    EMainNavMenuButtonImpactCounterSparkles,
    ENotificationPill,
  },
  props: {
    isMenuExpanded: {
      type: Boolean,
      default: false,
    },
    menuButtonAriaLabel: {
      type: String,
      default: '',
    },
    menuButtonAriaControlsId: {
      type: String,
      default: '',
    },
    showMenuAsSheet: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useUserStore, ['isSignedIn']),
    ...mapState(useImpactStore, [
      'isSeedsLevelsV2UIEnabled',
      'hasSeedsTotalAmount',
      'seeds',
      'totalSeedAmountChangeString',
      'isGrowthPointsLevelLocked',
      'wasGrowthPointsLevelLocked',
      'isUsersTotalLocked',
      'wasUsersPreviousTotalLocked',
    ]),
    ...mapState(useNavMenuMessagesStore, [
      'hasNotification',
    ]),
    seedsAmountAriaLabel() {
      const seedsAmount = this.seeds?.totalAmount;
      return useSeedsAmountText.call(this, seedsAmount);
    },
    classNames() {
      return {
        'menu-button-impact-counter': true,
        'menu-button-impact-counter--is-animation-disabled': this.isAnimationDisabled,
      };
    },
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
      // the seed total was not modified
      return !this.seeds?.isModified;
    },
    isLockIconAnimationDisabled() {
      return !this.isSignedIn && !this.seeds?.isModified;
    },
  },
};
</script>

<style lang="scss" scoped>
$menu-button-padding: $space-2s;
$menu-button-height: calc($icon-size-l + $menu-button-padding);

.menu-button-impact-counter {
  @extend %increase-target-size;

  display: flex;
  position: relative;
  height: $menu-button-height;

  /*
    oh no !important?

    for some reason the cascade is broken because of the
    base-button styles being imported after this file

    TODO to fix properly: https: //ecosia.atlassian.net/browse/FE-594
  */
  padding: $menu-button-padding !important;
}

.menu-button-impact-counter--is-animation-disabled * {
  @include disable-animations;
}

.menu-button-impact-counter__sparkles {
  position: absolute;
  top: 0;
  left: 0;
  width: calc($icon-size-l + $menu-button-padding);
  height: $menu-button-height;
}

.menu-button-impact-counter__seed-icon {
  margin-left: $space-2s;

  animation-name: animation-seed-icon;
  animation-duration: 0.65s;
  animation-timing-function: cubic-bezier(.44, .43, .37, 2.25);
  animation-delay: 1s;

  animation-fill-mode: forwards;
}

@keyframes animation-seed-icon {
  50% {
    transform: rotate(-15deg) scale(0.65) translateY(-12px);
  }
}

.menu-button-impact-counter-total-seed-amount-change {
  position: absolute;
  top: -2px;
  left: 22px;

  /* magic numbers sorry */
  padding: 2px;

  animation-name: animation-total-change;
  animation-duration: 1s;
  animation-delay: 1s;

  border-radius: $border-radius-l;

  opacity: 0;
  background: $n-peach-100;

  color: $n-peach-300;
  font-size: $font-1s;
  font-weight: $font-weight-700;

  animation-fill-mode: forwards;
}

@keyframes animation-total-change {
  0% {
    transform: translateY(2px);

    opacity: 0;
  }

  33%, 50% {
    transform: translateY(0);

    opacity: 1;
  }

  100% {
    transform: translateY(-2px);

    opacity: 0;
  }
}

.menu-button-impact-counter__counter {
  height: $menu-button-height;
  margin-right: $space-2s;
  padding: 0 $space-2s;
}

.menu-button-impact-counter ::v-deep .avatar {
  flex-shrink: 0;
}
</style>
