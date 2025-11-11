<template>
  <div class="feedback-link">
    <ELink
      v-bind="$attrs"
      ref="link"
      as="button"
      type="button"
      color="secondary"
      tabindex="0"
      data-test-id="feedback-link"
      :aria-pressed="!!modalActive"
      @click="onClick"
      @keydown.enter="onClick"
      @keydown.space="onClick"
      v-on="$listeners"
    >
      <slot />
    </ELink>
    <EFeedbackModal v-bind="$props" :active="modalActive" @close="onClose" />
  </div>
</template>

<script>
import EFeedbackModal from '@ecosia/common-vue2/components/feedback-modal/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

export default {
  name: 'EFeedbackLink',
  components: {
    ELink,
    EFeedbackModal,
  },
  props: {
    ...EFeedbackModal.props,
  },
  data() {
    return {
      modalActive: false,
    };
  },
  methods: {
    onClick() {
      this.modalActive = true;
    },
    onClose() {
      this.modalActive = false;
    },
  },
};
</script>
