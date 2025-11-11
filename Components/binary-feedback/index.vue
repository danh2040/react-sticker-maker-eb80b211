<template>
  <div :class="classes" data-test-id="binary-feedback">
    <span
      v-if="thankYou"
      class="binary-feedback__text binary-feedback__text--thank-you"
      data-test-id="binary-feedback-thankyou"
    >
      {{ thankYouText ?
        thankYouText :
        $t(`common.search.widgets.binaryfeedback.thankyou`)
      }}
    </span>
    <span
      v-else-if="!minimal"
      class="binary-feedback__text"
      data-test-id="binary-feedback-text"
    >
      {{ hasTitle ?
        title :
        $t(`common.search.widgets.binaryfeedback.title`)
      }}
    </span>
    <EButton
      v-if="!thankYou"
      class="binary-feedback__button binary-feedback__button--positive"
      :class="{'binary-feedback__button--positive-clicked': positiveClicked }"
      :aria-label="$t('common.search.widgets.binaryfeedback.thumbsup')"
      :icon="'thumb-up-plain'"
      variant="bare"
      icon-position="end"
      size="s"
      data-test-id="thumbs-up-button"
      @click="selectPositive"
      @animationend="onPositiveAnimationEnd"
    >
      <EIcon icon="highlight-star" size="s" class="sparkle sparkle--small" />
      <EIcon icon="highlight-star" size="s" class="sparkle" />
    </EButton>
    <EButton
      v-if="!thankYou"
      class="binary-feedback__button"
      :aria-label="$t('common.search.widgets.binaryfeedback.thumbsdown')"
      :icon="'thumb-down-plain'"
      variant="bare"
      icon-position="end"
      size="s"
      data-test-id="thumbs-down-button"
      @click="selectNegative"
    />
    <EFeedbackModal
      v-bind="feedbackOptions"
      :active="forceModal || modalActive"
      @close="onModalClose"
    />
  </div>
</template>

<script>
import { mapState } from 'pinia';

import { sleep } from '@ecosia/common-js/universal/utils.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EFeedbackModal from '@ecosia/common-vue2/components/feedback-modal/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

import { trackBinaryFeedback } from '@ecosia/analytics/feedback.js';
import { getProviderTrackingValue } from '@ecosia/analytics-client-js/src/utils.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';

import {
  ILLEGAL,
  INACCURATE,
  IRRELEVANT,
  ISSUE,
  OFFENSIVE,
  SUGGESTION,
} from './feedback-options.js';

export const FEEDBACK_POSITIVE = 'positive';
export const FEEDBACK_NEGATIVE = 'negative';
export const THANK_YOU_DELAY_MS = 900;

export default {
  name: 'EBinaryFeedback',
  components: {
    EButton,
    EFeedbackModal,
    EIcon,
  },
  mixins: [classes],
  props: {
    trackId: {
      type: String,
      required: true,
    },
    trackingType: {
      type: String,
      required: false,
      default: null,
    },
    trackingProperty: {
      type: String,
      required: false,
      default: null,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    compact: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    minimal: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    forceModal: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    thankYouText: {
      type: String,
      default: '',
    },
    labelLeft: {
      type: Boolean,
      default: false,
    },
    customOptions: {
      type: Array,
      default: null,
    },
    customTrackingPayload: {
      type: Object,
      default: null,
    },
    hasMultipleAnswers: {
      type: Boolean,
      default: false,
    },
    selectedOption: {
      type: String,
      default: undefined,
    },
    showProgressBar: {
      type: Boolean,
      default: false,
    },
  },
  data({ forceModal }) {
    return {
      displayButtons: true,
      modalActive: forceModal,
      thankYou: false,
      positiveClicked: false,
    };
  },
  computed: {
    ...mapState(useGlobalStore, ['mainResultsProvider']),
    feedbackOptions() {
      return {
        errorMessage: this.$t(`common.header.feedback.error`),
        options: this.customOptions ?
          this.customOptions :
            [
              {
                label: this.$t(`common.search.widgets.binaryfeedback.modal.bullet1`),
                value: IRRELEVANT,
                messageRequired: false,
              },
              {
                label: this.$t(`common.search.widgets.binaryfeedback.modal.bullet2`),
                value: INACCURATE,
                messageRequired: false,
              },
              {
                label: this.$t(`common.search.widgets.binaryfeedback.modal.bullet3`),
                value: OFFENSIVE,
                messageRequired: false,
              },
              {
                label: this.$t(`common.search.widgets.binaryfeedback.modal.bullet4`),
                value: ILLEGAL,
                messageRequired: false,
              },
              {
                label: this.$t(`common.search.widgets.binaryfeedback.modal.bullet5`),
                value: ISSUE,
                messageRequired: true,
              },
              {
                label: this.$t(`common.search.widgets.binaryfeedback.modal.bullet6`),
                value: SUGGESTION,
                messageRequired: true,
              },
            ],
        selectedOption: this.selectedOption,
        query: this.$route?.query.q?.toString() || '',
        submitText: this.$t(`common.header.feedback.send`),
        successMessage: this.$t(`common.header.feedback.body2`),
        successTitle: this.$t(`common.header.feedback.title2`),
        textareaLabel: this.$t(`common.header.feedback.tellmore`),
        title: this.$t(`common.search.widgets.binaryfeedback.modal.title`),
        widgetType: this.trackingCategory,
        origin: this.$registerAnalyticsEvents?.origin ?? '',
        labelLeft: this.labelLeft,
        hasMultipleAnswers: this.hasMultipleAnswers,
        customTrackingPayload: this.customTrackingPayload,
        showProgressBar: this.showProgressBar,
      };
    },
    hasTitle() {
      return !!this.title;
    },
    trackingCategory() {
      if (this.trackingType) {
        return `${this.trackId}_${this.trackingType}`;
      }
      return this.trackId;
    },
  },
  methods: {
    selectPositive() {
      this.sendFeedback(FEEDBACK_POSITIVE);
      this.positiveClicked = true;
    },
    async selectNegative() {
      this.sendFeedback(FEEDBACK_NEGATIVE);
      this.modalActive = true;

      await sleep(THANK_YOU_DELAY_MS);
      this.thankYou = true;
    },
    async onPositiveAnimationEnd() {
      await sleep(THANK_YOU_DELAY_MS);
      this.thankYou = true;
    },
    onModalClose() {
      this.$emit('modal-close');
      this.modalActive = false;
    },
    sendFeedback(feedback) {
      this.$emit('feedback', feedback);
      this.$track(trackBinaryFeedback({
        category: this.trackingCategory,
        property: this.trackingProperty || this.$route?.query.q || '',
        feedback,
        value: getProviderTrackingValue(this.mainResultsProvider),
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.binary-feedback {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  max-width: calc(100% - $space-m);
  padding-left: $space-m;

  @include mobile-l {
    max-width: none;
  }
}

.binary-feedback--minimal {
  display: inline-flex;
  justify-content: flex-start;
  padding-left: 0;
}

.binary-feedback__text {
  display: none;
  // magic number to fit "Is this helpful?" on one line
  // but not add too much spacing and still keep
  // text left-aligned ¯\_(ツ)_/¯
  min-width: 90px;

  .binary-feedback--compact & {
    width: min-content;

    &.binary-feedback__text--thank-you {
      width: max-content;
    }
  }

  @include tablet {
    display: unset;
    padding: $space-1s 0;

    color: var(--color-text-secondary);
    font-size: $font-s;

    .binary-feedback--compact & {
      padding: 0;
    }
  }
}

.binary-feedback__text--thank-you {
  display: unset;

  animation: e-fade-in $timing-s forwards;

  text-align: right;
}

// When the text is one line in the compact variant
// we don't have padding to align buttons and text,
// so we need to shift the buttons up.
.binary-feedback--compact .binary-feedback__button {
  margin-top: -1 * $space-1s;
}

.binary-feedback__button--positive {
  position: relative;
  margin-left: $space-2s;
}
</style>

<style lang="scss">
$bf-timing-sparkle: $timing-s;
$bf-timing-sparkle-small: 400ms;
$bf-timing-thumb: $bf-timing-sparkle * 2;
$bf-easing-function: cubic-bezier(0.19, 0.63, 0.6, 1.57);

@keyframes e-binary-feedback-positive-thumb {
  0% {
    transform: rotate(0) scale(1, 1) translate(0, 0);
    animation-timing-function: ease-out;
  }

  50% {
    // magic numbers specified by design
    transform: rotate(-14deg) scale(0.875, 0.875) translate(-2px, -3px);
    animation-timing-function: $bf-easing-function;
  }

  100% {
    // magic numbers specified by design
    transform: rotate(0) scale(1.2, 1.2) translate(0, 0);
  }
}

@keyframes e-binary-feedback-positive-sparkle {
  from {
    transform: scale(0, 0);

    opacity: 0;
  }

  to {
    transform: scale(1, 1);

    opacity: 1;
  }
}

.binary-feedback__button .button__text {
  // This avoids the sparkles appearing unstyled before Javascript loads.
  // Since some styles only get applied after hydration (ugh).
  display: none;
}

.binary-feedback__button--positive {
  // double up class selector for specificity
  .button__icon.button__icon {
    // Here we effectively reverse the effect of the `button__icon--with-text` class.
    // We need to do that because we've inserted other SVGs into the button, which automatically
    // adds the --with-text modifier, but we don't actually lay out any text inside the button.
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0;
    overflow: visible;

    transform: translate(-50%, -50%);
  }

  .sparkle {
    position: absolute;
    // Magic numbers specified in the design. Will fit the button if its size == s
    top: 0;
    left: 19px;
    width: 8px;
    height: 10px;

    opacity: 0;

    color: var(--color-brand-primary);
  }

  .sparkle--small {
    top: 9px;
    left: 26px;
    width: 4px;
    height: 5px;
  }
}

.binary-feedback__button--positive-clicked {
  .button__text {
    display: unset;
  }

  .button__icon path {
    transform-origin: center center;
    animation: e-binary-feedback-positive-thumb $bf-timing-thumb forwards;
  }

  .sparkle {
    animation: e-binary-feedback-positive-sparkle
      $bf-timing-sparkle $bf-timing-sparkle $bf-easing-function forwards;
  }

  .sparkle--small {
    animation-delay: $bf-timing-sparkle-small;
  }
}
</style>
