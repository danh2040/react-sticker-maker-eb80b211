<template>
  <div>
    <EButton
      variant="solid-green"
      @click="active = true"
    >
      Show modal
    </EButton>
    <EFeedbackModal
      :active="active"
      title="What is your feedback?"
      submit-text="Submit"
      ticket-subject="Subject: Test Ticket"
      success-title="Thank you for your time!"
      success-message="Your feedback will help us improve ecosia"
      textarea-label="Tell us more (optional)"
      button-text="Send"
      :options="options"
      @close="active = false"
    />
  </div>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';

import EFeedbackModal from './index.vue';

export default {
  name: 'BaseFeedbackModal',
  components: { EFeedbackModal, EButton },
  mockStoreModules: ['user'],
  data() {
    return {
      options: [
        { label: 'I like the feature', value: 'helpful' },
        { label: 'Something is missing', value: 'missing' },
        { label: 'I don\'t find this useful', value: 'not_helpful' },
        { label: 'I don\'t understand this', value: 'wrong' },
      ],
      active: false,
    };
  },
};
</script>
