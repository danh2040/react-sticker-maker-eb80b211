<template>
  <EModal class="feedback-modal" v-bind="$attrs" v-on="$listeners">
    <EFeedbackForm
      v-bind="$props"
      data-test-id="feedback-modal-form"
      @success="onSuccess"
      @option-select="onOptionSelect"
    >
      <template #form-footer>
        <slot name="form-footer" />
      </template>
    </EFeedbackForm>
  </EModal>
</template>

<script>
import '@ecosia/common-vue2/directives/validity.js';

import EFeedbackForm from '@ecosia/common-vue2/components/feedback-form/index.vue';
import EModal from '@ecosia/common-vue2/components/modal/index.vue';

import { AUTOCLOSE as AUTOCLOSE_TIMEOUT } from '@ecosia/constants/timeouts.js';

export default {
  name: 'EFeedbackModal',
  components: {
    EModal,
    EFeedbackForm,
  },
  props: EFeedbackForm.props,
  methods: {
    onOptionSelect(...args) {
      this.$emit('option-select', ...args);
    },
    onSuccess() {
      setTimeout(() => {
        this.$emit('close');
      }, AUTOCLOSE_TIMEOUT);
    },
  },
};
</script>
