<template>
  <Component
    :is="message.componentName"
    v-if="message"
    :key="message.id"
    v-bind="message.props"
    @dismiss-message="onDismissMessage(message.id)"
    @impression="onImpression(message.id)"
  />
</template>

<script>
import { mapActions, mapState } from 'pinia';

import EMainNavImpactProfileErrorMessage from './error-message/index.vue';
import EMainNavImpactProfileMultiDeviceMessage from './multi-device-message/index.vue';
import EMainNavImpactProfileOnboardingMessage from './onboarding-message/index.vue';
import EMainNavImpactProfileSignUpToLevelUpMessage from './sign-up-to-level-up-message/index.vue';
import { useNavMenuMessagesStore } from './store.js';
import EMainNavImpactProfileUserEngagementMessage from './user-engagement-message/index.vue';

export default {
  name: 'EMainNavImpactProfileMessage',
  components: {
    EMainNavImpactProfileErrorMessage,
    EMainNavImpactProfileMultiDeviceMessage,
    EMainNavImpactProfileOnboardingMessage,
    EMainNavImpactProfileSignUpToLevelUpMessage,
    EMainNavImpactProfileUserEngagementMessage,
  },
  computed: {
    ...mapState(useNavMenuMessagesStore, [
      'message',
    ]),
  },
  methods: {
    ...mapActions(useNavMenuMessagesStore, [
      'setMessageAsSeen',
      'setMessageAsDismissed',
    ]),
    onImpression(messageId) {
      this.setMessageAsSeen(messageId);
    },
    onDismissMessage(messageId) {
      this.setMessageAsDismissed(messageId);
    },
  },
};
</script>
