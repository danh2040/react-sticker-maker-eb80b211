<template>
  <div class="main-footer-feedback">
    <EButton
      variant="outline"
      size="s"
      tabindex="0"
      data-test-id="main-footer-feedback-link"
      :aria-pressed="!!active"
      @click="onClick"
      @keydown.enter="onClick"
      @keydown.space="onClick"
    >
      {{ $t('common.footer.feedback') }}
    </EButton>
    <EFeedbackModal
      v-bind="options"
      :active="active"
      widget-type="footer"
      @close="onClose"
      @option-select="onOptionSelect"
    >
      <template v-if="helperShown" #form-footer>
        <p>
          {{ $t('common.footer.feedback.qualityhelper') }}
          <ELink
            :href="qualityHelperLinkHref"
            rel="noopener"
            target="_blank"
            data-test-id="main-footer-feedback-quality-helper-link"
            @click="onQualityHelperLinkClick"
          >
            {{ $t('common.footer.feedback.qualityhelperlink') }}
          </ELink> {{ $t('common.footer.feedback.qualityhelper2') }}
        </p>
      </template>
    </EFeedbackModal>
  </div>
</template>

<script>
import { mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { createSupportUrl } from '@ecosia/common-js/universal/support-url-utils';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EFeedbackModal from '@ecosia/common-vue2/components/feedback-modal/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

import { useUserStore } from '@ecosia/store/user/index.js';

const helperShownOption = 'quality';

export default {
  components: {
    EButton,
    ELink,
    EFeedbackModal,
  },
  data() {
    return {
      active: false,
      helperShown: false,
    };
  },
  computed: {
    ...mapState(useUserStore, ['language']),
    options() {
      return {
        errorMessage: this.$t('common.footer.feedback.error'),
        options: [helperShownOption, 'instant', 'tabs', 'settings', 'missing', 'other'].map((value) => ({
          label: this.$t(`common.footer.feedback.${value}`),
          value,
        })),
        origin: 'footer',
        query: this.$route?.query.q?.toString() || '',
        submitText: this.$t('common.footer.feedback.send'),
        successMessage: this.$t('common.footer.feedback.body2'),
        successTitle: this.$t('common.footer.feedback.title2'),
        textareaLabel: this.$t('common.footer.feedback.messageplaceholder'),
        title: this.$t('common.footer.feedback.title'),
      };
    },
    qualityHelperLinkHref() {
      return createSupportUrl('CONTENT_AD_REMOVAL', this.language);
    },
  },
  methods: {
    onOptionSelect(option) {
      this.helperShown = option === helperShownOption;
    },
    onQualityHelperLinkClick() {
      sendCoreAnalyticsEvent('feedbackReportingResultLink');
    },
    onClick() {
      this.active = true;
    },
    onClose() {
      this.active = false;
    },
  },
};
</script>
