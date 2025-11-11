<template>
  <EInlineAlert
    v-intersect="onIntersect"
    class="sign-up-to-level-up"
    variant="warning"
    subtle
    action-icon="close"
    :action-assistive-tech-only="$t('common.header.menu.impact.messages.signup.closebutton')"
    :title="$t('common.header.menu.impact.messages.signup.heading')"
    title-component="h4"
    @action="onClose"
  >
    <p>{{ message }}</p>
  </EInlineAlert>
</template>

<script>
import '@ecosia/common-vue2/directives/intersect.js';

import { mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EInlineAlert from '@ecosia/common-vue2/components/inline-alert/index.vue';

import { useImpactStore } from '@ecosia/accounts-impact-client/store';

export default {
  name: 'EMainNavImpactProfileSignUpToLevelUpMessage',
  components: {
    EInlineAlert,
  },
  computed: {
    ...mapState(useImpactStore, [
      'isSeedsLevelsV2UIEnabled',
    ]),
    message() {
      return this.isSeedsLevelsV2UIEnabled ?
        this.$t('common.header.menu.impact.messages.signup.message.seedslevelsv2') :
        this.$t('common.header.menu.impact.messages.signup.message');
    },
  },
  mounted() {
    sendCoreAnalyticsEvent('accountsSignupToLevelUpDisplay');
  },
  methods: {
    onClose() {
      sendCoreAnalyticsEvent('accountsSignupToLevelUpDismiss');
      this.$emit('dismiss-message');
    },
    onIntersect() {
      this.$emit('impression');
    },
  },
};
</script>

<style lang="scss" scoped>
.sign-up-to-level-up {
  margin-top: $space-m;

  h4,
  p {
    margin-top: 0;
    margin-bottom: $space-2s;
  }

  h4 {
    font-size: $font-l;
    font-weight: $font-weight-700;
  }
}
</style>
