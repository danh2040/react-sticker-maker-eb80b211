<template>
  <EPopover
    v-on-clickaway="onClickaway"
    class="popover-level-up"
    :visible="isVisible"
    side="right-bottom"
  >
    <template #content>
      <h3 class="popover-level-up__heading">
        {{ $t(
          'common.header.menu.impact.popoverlevelup.heading',
          { levelNumber }
        ) }}
      </h3>

      <p
        class="popover-level-up__message"
        data-test-id="popover-level-up-message"
      >
        {{
          $t(
            isSeedsLevelsV2UIEnabled ?
              'common.header.menu.impact.popoverlevelup.message.seedslevelsv2' :
              'common.header.menu.impact.popoverlevelup.message'
          )
        }}
      </p>

      <EButtonGroup class="popover-level-up__buttons">
        <EButton
          variant="outline-inverse"
          data-test-id="popover-level-up-close-button"
          @click="onCloseButtonClick"
        >
          {{ $t('common.generic.close') }}
        </EButton>

        <EButton
          as="a"
          href="/accounts/profile"
          data-test-id="popover-level-up-cta-link"
          variant="solid-white"
          @click="onLinkClick"
        >
          {{ $t('common.header.menu.impact.popoverlevelup.cta') }}
        </EButton>
      </EButtonGroup>
    </template>
  </EPopover>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';
import { mapActions, mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EButtonGroup from '@ecosia/common-vue2/components/button-group/index.vue';
import EPopover from '@ecosia/common-vue2/components/popover/index.vue';
import { prefersReducedMotion } from '@ecosia/common-vue2/utils/screen.js';

import { useImpactStore } from '@ecosia/accounts-impact-client/store';
import { useUserStore } from '@ecosia/store/user';

export default {
  name: 'EMainNavMenuPopoverLevelUp',
  components: {
    EButton,
    EButtonGroup,
    EPopover,
  },
  mixins: [clickaway],
  data() {
    return {
      isVisible: false,
    };
  },
  computed: {
    ...mapState(useImpactStore, [
      'isSeedsLevelsV2UIEnabled',
      'level',
      'growthPoints',
    ]),
    ...mapState(useUserStore, ['isSignedIn']),
    levelNumber() {
      if (this.isSeedsLevelsV2UIEnabled) {
        return this.growthPoints.level.number;
      }

      return this.level.number;
    },
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.isSeedsLevelsV2UIEnabled) {
          this.isVisible = this.getIsGrowthPointsLevelUpUIVisible();
        } else {
          this.isVisible = this.getIsLevelUpUIVisible();
        }

        if (this.isVisible && this.isSignedIn) {
          sendCoreAnalyticsEvent('accountsUserLevelUpDisplay', {
            level: this.level.number,
          });
        }
      }, prefersReducedMotion() ? 0 : 200);
    });
  },
  methods: {
    ...mapActions(useImpactStore, [
      'getIsGrowthPointsLevelUpUIVisible',
      'hideGrowthPointsLevelUpUI',
      'getIsLevelUpUIVisible',
      'hideLevelUpUI',
    ]),
    closePopover() {
      this.isVisible = false;
      if (this.isSeedsLevelsV2UIEnabled) {
        this.hideGrowthPointsLevelUpUI();
      } else {
        this.hideLevelUpUI();
      }
    },
    onCloseButtonClick() {
      this.closePopover();
    },
    onLinkClick() {
      this.closePopover();
      if (this.isSignedIn) {
        sendCoreAnalyticsEvent('accountsUserLevelUpButtonClick', {
          level: this.level.number,
        });
      }
    },
    onClickaway() {
      this.closePopover();
    },
  },
};
</script>

<style lang="scss" scoped>
.popover-level-up {
  position: absolute;
  z-index: $z-index-overlay;
  right: 22px;
  margin-top: -8px;
}

.popover-level-up__heading {
  margin-top: 0;
  margin-bottom: $space-1s;

  font-size: $font-m;
}

.popover-level-up__message {
  margin-top: 0;
  margin-bottom: $space-m;
}

.popover-level-up__buttons {
  justify-content: flex-end;
}
</style>
