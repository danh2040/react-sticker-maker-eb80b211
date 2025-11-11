<template>
  <EMainNavImpactProfileImageMessageWrapper
    v-intersect="onIntersect"
    :close-button-aria-label="$t('common.header.menu.impact.messages.onboarding.button.close')"
    :link-text="$t('common.header.menu.impact.messages.onboarding.learnmore')"
    :link-url="helpscoutSeedCounterURL"
    link-test-id="onboarding-learn-more-cta"
    @close="onClose"
    @link-click="onLinkClick"
  >
    <template #image>
      <FlagSVG data-test-id="onboarding-message-image" />
    </template>

    <h4 data-test-id="onboarding-message-title">
      {{ $t('common.header.menu.impact.messages.onboarding.header') }}
    </h4>
    <p data-test-id="onboarding-message-text">
      {{ $t('common.header.menu.impact.messages.onboarding.body') }}
    </p>
  </EMainNavImpactProfileImageMessageWrapper>
</template>

<script>
import '@ecosia/common-vue2/directives/intersect.js';

import { mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getHelpscoutSeedCounterURL } from '@ecosia/common-js/universal/url-utils.js';

import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user';

import EMainNavImpactProfileImageMessageWrapper from '../image-message-wrapper.vue';
import FlagSVG from './Flag.svg';

export default {
  name: 'EMainNavImpactProfileOnboardingMessage',
  components: {
    FlagSVG,
    EMainNavImpactProfileImageMessageWrapper,
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useUserStore, ['isSignedIn']),
    helpscoutSeedCounterURL() {
      return getHelpscoutSeedCounterURL(this.locale);
    },
  },
  methods: {
    onClose() {
      this.$emit('dismiss-message');
    },
    onLinkClick() {
      sendCoreAnalyticsEvent('accountsMainNavSeedLearnMoreButtonClick', {
        isSignedIn: this.isSignedIn,
      });
    },
    onIntersect() {
      this.$emit('impression');
    },
  },
};
</script>
