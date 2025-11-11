<template>
  <div class="feedback-form">
    <div v-if="!success && showProgressBar" class="feedback-form__step_info">
      <div class="feedback-form__step_info-label">
        <span>Step</span> {{ currentStep }} of {{ totalSteps }}
      </div>
      <EProgressBar
        :start-point="0"
        :standing="currentStep"
        :goal="totalSteps"
      />
    </div>
    <form
      v-if="!success"
      :id="formId"
      v-validity="validity"
      data-test-id="feedback-form-element"
      novalidate
      @submit.prevent="send"
      @change="clearErrors"
    >
      <component
        :is="titleAs"
        v-if="title"
        class="feedback-form__title"
        data-test-id="feedback-form-title"
      >
        {{ title }}
      </component>
      <div
        v-if="hasMultipleAnswers"
        class="feedback-form__checkboxes"
        data-test-id="feedback-form-answer-checkbox"
      >
        <EField
          v-for="(option, index) in selectedAnswers"
          :key="index"
          v-model="option.selected"
          :name="`answer-${index}`"
          :label="options[index].label"
          type="checkbox"
          :label-left="labelLeft"
        />
      </div>
      <EField
        v-else
        v-model="answer"
        name="answer"
        class="feedback-form__radios"
        data-test-id="feedback-form-answer"
        type="radio"
        required
        :options="options"
        :label-left="labelLeft"
        :error="optionsError"
        @change="onAnswerChange"
      />
      <!-- Snowplow form tracker works for fields which exist in DOM when it is called -->
      <!-- Using v-show instead of v-if to handle tracking dynamic field -->
      <transition name="toggle">
        <div class="feedback-form__extra">
          <EField
            v-show="showTextField"
            v-model="message"
            name="message"
            type="textarea"
            class="feedback-form__textarea"
            data-test-id="feedback-form-message"
            maxlength="500"
            autoscale
            size="l"
            :required="currentMessageRequirement"
            :force-stacked="true"
            :error="messageError"
            :label="messageLabel"
            :placeholder="$t('common.header.feedback.whatcanweimprove')"
            @change="messageError = undefined"
          />
          <slot name="form-footer" />
          <div class="feedback-form__actions">
            <ELoadingButton
              type="submit"
              class="feedback-form__submit"
              data-test-id="feedback-form-submit"
              variant="solid-gray"
              :size="isDesktopUp ? 'm' : 'l'"
              :loading="sending"
              :disabled="sending"
            >
              {{ submitText }}
            </ELoadingButton>
          </div>
        </div>
      </transition>
    </form>
    <div v-else class="feedback-form__success" data-test-id="feedback-form-success">
      <slot name="success">
        <EIcon
          icon="check-circle"
          size="l"
          class="feedback-form__success-icon"
          data-test-id="feedback-form-success-icon"
        />
        <h2 class="feedback-form__title" data-test-id="feedback-form-success-title">
          {{ successTitle }}
        </h2>
        <p class="feedback-form__success-message">
          {{ successMessage }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script>
import '@ecosia/common-vue2/directives/validity.js';

import { mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EField from '@ecosia/common-vue2/components/field/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import ELoadingButton from '@ecosia/common-vue2/components/loading-button/index.vue';
import EProgressBar from '@ecosia/common-vue2/components/progress-bar/index.vue';
import screen from '@ecosia/common-vue2/mixins/screen.js';

import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

export default {
  name: 'EFeedbackForm',
  components: {
    EField,
    EIcon,
    ELoadingButton,
    EProgressBar,
  },
  mixins: [screen],
  props: {
    /**
     * Sets the textarea as required for all options.
     * If true, takes precendence over `messageRequired` value
     * in each option's properties.
     */
    messageAlwaysRequired: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      required: true,
    },
    /**
     * Array of { label: String, value: String};
     * e.g. { label: 'Option description', value: "option_key_for_analytics" }
     */
    options: {
      type: Array,
      required: true,
      validator: (options) => Array.isArray(options) &&
        options.every((option) => (
          Object.keys(option).includes('value') &&
          Object.keys(option).includes('label')
        )),
    },
    query: {
      type: String,
      default: '',
    },
    formId: {
      type: String,
      default: null,
    },
    showProgressBar: {
      type: Boolean,
      default: false,
    },
    submitText: {
      type: String,
      required: true,
    },
    successMessage: {
      type: String,
      required: true,
    },
    successTitle: {
      type: String,
      required: true,
    },
    textareaLabel: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    titleAs: {
      type: String,
      default: 'h2',
    },
    /**
     * Type of content to which the feedback is related.
     * e.g. "word_definitions_rich" or "uninstall".
     *
     */
    widgetType: {
      type: String,
      default: '',
    },
    /**
     * Optional information about where the feedback originated from.
     * For example, this can be the specific URL from an ad result,
     * (full ad URL incl. Bing IDs), but might also be a page position.
     */
    origin: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: '',
    },
    selectedOption: {
      type: String,
      default: '',
    },
    labelLeft: {
      type: Boolean,
      default: false,
    },
    hasMultipleAnswers: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      default: null,
    },
    internalMessage: {
      type: String,
      default: '',
    },
    customTrackingPayload: {
      type: Object,
      required: false,
      default: undefined,
    },
  },
  constants: {
    totalSteps: 3,
  },
  data() {
    return {
      message: '',
      answer: this.selectedOption || null,
      optionsError: '',
      messageError: '',
      sending: false,
      success: false,
      validity: {},
      selectedAnswers: this.hasMultipleAnswers ?
        this.options.map((option) => ({ value: option.value, selected: false })) :
          [],
    };
  },
  computed: {
    ...mapState(useGlobalStore, ['mainResultsProvider']),
    ...mapState(useUserStore, ['bingMarketCode']),
    hasAnswers() {
      if (this.hasMultipleAnswers) {
        return this.selectedAnswers.some((option) => option.selected);
      } else {
        return !!this.answer;
      }
    },
    showTextField() {
      return this.hasAnswers;
    },
    currentStep() {
      // answers selected and message written
      if (this.hasAnswers && this.message.length > 0) {
        return 3;
      }
      // answers selected, no message written
      if (this.hasAnswers) {
        return 2;
      }
      // answers not selected
      return 1;
    },
    /**
     * Returns the current requirement for textarea value.
     * Can return:
     *  - true: value is required
     *  - false: value is optional
     *  - undefined: no requirement specified; works like optional
     * but doesn't show any indication in the form field.
     */
    currentMessageRequirement() {
      if (this.messageAlwaysRequired) {
        return true;
      }

      const selected = this.hasMultipleAnswers ?
        this.selectedAnswers :
        this.options.find(({ value }) => value === this.answer);

      if (!selected || selected.messageRequired === undefined) {
        return undefined;
      }

      return selected.messageRequired;
    },
    messageLabel() {
      if (this.currentMessageRequirement === undefined) {
        return this.textareaLabel;
      }

      const requiredLabelKey = this.currentMessageRequirement ?
        'common.header.feedback.required' :
        'common.header.feedback.optional';

      return `${this.textareaLabel} ${this.$t(requiredLabelKey)}`;
    },
    trackingPayload() {
      const payload = {
        widget_type: this.widgetType,
        origin: this.origin,
        source: this.source,
        query: this.query,
        market: this.bingMarketCode,
        provider: this.provider || this.mainResultsProvider || '',
      };

      if (this.customTrackingPayload) {
        return { ...payload, ...this.customTrackingPayload };
      }

      return payload;
    },
  },
  methods: {
    clearErrors() {
      this.optionsError = undefined;
      this.messageError = undefined;
    },
    onAnswerChange() {
      this.$emit('option-select', this.answer);
    },

    buildFullMessage() {
      // current Snowplow data structure limit for the message
      const maxCharLimit = 500;

      let fullMessage = this.message;

      if (this.internalMessage) {
        // making sure the internal message is appended after the user message
        // in case it gets cut by the character limit
        fullMessage = `${fullMessage} {{internal: ${this.internalMessage}}}`;
      }

      if (fullMessage.length > maxCharLimit) {
        fullMessage = fullMessage.substring(0, maxCharLimit);
      }

      return fullMessage;
    },

    validate() {
      if (!this.hasMultipleAnswers && !this.answer) {
        this.optionsError = this.$t('common.header.feedback.bulletserror');
        return false;
      }

      if (this.currentMessageRequirement && this.message.length === 0) {
        this.messageError = this.$t('common.header.feedback.tellmoreerror');
        return false;
      }

      return true;
    },

    track() {
      const message = this.buildFullMessage();
      let multiple_answers = null;
      let answer = null;

      if (this.hasMultipleAnswers) {
        multiple_answers = this.selectedAnswers
          .filter((option) => !!option.selected)
          .map(({ value }) => value);
      } else {
        const selected = this.options.find(({ value }) => value === this.answer);
        // TODO: check if `selected.value` can ever be nullish,
        // therefore needing the fallback to `selected`
        answer = selected?.value ?? selected;
      }

      sendCoreAnalyticsEvent('feedbackFormSubmit', { ...this.trackingPayload, message, answer, multiple_answers });
    },

    async send(event) {
      if (!this.validate()) {
        event.preventDefault();
        return;
      }

      if (this.sending) {
        return;
      }
      this.sending = true;

      try {
        this.track();
        this.success = true;
        this.sending = false;
        this.$emit('success');
      } catch (err) {
        this.sending = false;
        this.messageError = this.errorMessage;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-form {
  display: block;
  position: relative;
  padding: 0 $space-1l;

  color: var(--color-text-primary);
  text-align: left;

  @include tablet {
    padding: 0;
  }
}

.feedback-form__title {
  margin-top: 0;
  margin-bottom: $space-m;

  font-family: $family;
  font-size: $font-2l;
  font-weight: $font-weight-700;
}

.feedback-form__extra {
  max-height: 450px; // to have a scroll-out animation effect
  overflow: hidden;
}

.feedback-form__textarea {
  min-height: $space-3l;
  margin-top: $space-1l;
}

.feedback-form__actions {
  display: flex;
  justify-content: right;
  margin-top: $space-m;
  padding: $space-2s 0;

  @include mobile-l {
    margin-top: $space-3l;
    padding: 0;
  }
}

.feedback-form__submit {
  width: auto;
}

.feedback-form__success {
  position: relative;
  overflow: auto;

  color: var(--color-text-primary);
  text-align: center;
}

.feedback-form__success-icon {
  width: $space-4l;
  height: $space-4l;
  margin: 0 0 $space-m;

  stroke-width: 5px;

  color: var(--color-brand-primary);
  font-family: $family;
  font-size: $font-l;
}

.feedback-form__success-message {
  margin: $space-s 0 0;

  font-family: $family;
  font-size: $font-l;
}

.toggle-enter-active,
.toggle-leave-active {
  transition: max-height $timing-l $easing;
}

.toggle-enter,
.toggle-leave-to {
  max-height: 0;
}

.feedback-form__checkboxes {
  margin-bottom: $space-m;
}

.feedback-form__step_info {
  margin-bottom: $space-2l;
}

.feedback-form__step_info-label {
  font-size: $font-s;
  font-weight: $font-weight-700;
  text-align: right;

  span {
    color: var(--color-text-secondary);
    font-weight: $font-weight-400;
  }
}
</style>
