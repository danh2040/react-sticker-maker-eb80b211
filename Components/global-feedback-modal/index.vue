<template>
  <EFeedbackModal
    v-if="validAndVisible"
    v-bind="settings"
    :active="visible"
    :widget-type="widgetType"
    @close="close"
  />
</template>

<script>
import { mapActions, mapState } from 'pinia';

import EFeedbackModal from '@ecosia/common-vue2/components/feedback-modal/index.vue';

import { useFeedbackModalStore } from '@ecosia/store/feedback-modal/index.js';

export default {
  name: 'EGlobalFeedbackModal',
  components: {
    EFeedbackModal,
  },
  computed: {
    ...mapState(useFeedbackModalStore, ['visible', 'settings', 'widgetType', 'isDataValid']),
    validAndVisible() {
      return this.visible && this.isDataValid;
    },
  },
  methods: {
    ...mapActions(useFeedbackModalStore, ['close']),
  },
};
</script>
