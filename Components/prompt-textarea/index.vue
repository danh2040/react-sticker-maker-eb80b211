<template>
  <textarea
    ref="textarea"
    rows="1"
    name="prompt"
    :value="value"
    :maxlength="maxLength"
    data-test-id="prompt-textarea"
    :class="{ 'status-text': status }"
    :disabled="status"
    @input="onInput"
    @keydown.exact="onKeydown"
    @keydown.enter.exact.prevent="onEnter"
    @keydown.enter.shift.exact.prevent="lineBreak"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script>
import { isTouchDevice } from '@ecosia/common-js/client/utils.js';

export default {
  name: 'PromptTextarea',
  props: {
    value: {
      type: String,
      default: null,
    },
    maxLength: {
      type: Number,
      required: true, // Default max length, can be overridden
    },
    status: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMultiline: false,
    };
  },
  computed: {
    isTouchDevice() {
      return isTouchDevice();
    },
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.checkMultiline();
        this.setHeight();
      });
    },
    isMultiline(newValue) {
      this.$emit('multiline-change', newValue);
    },
  },
  mounted() {
    if (this.autofocus && this.$refs.textarea) {
      this.$nextTick(() => {
        this.focus();
        // Explicitly dispatch a focus event to make sure it propagates at mount directly
        this.$refs.textarea.dispatchEvent(new FocusEvent('focus'));
      });
    }
  },
  methods: {
    blur() {
      this.$refs.textarea.blur();
    },
    focus() {
      this.$refs.textarea.focus();
    },
    lineBreak() {
      const start = this.$refs.textarea.selectionStart;
      const end = this.$refs.textarea.selectionEnd;

      const newValue = this.value.slice(0, start) + '\n' + this.value.slice(end);

      this.$refs.textarea.value = newValue;
      this.onInput({ target: { value: newValue } });
      this.$refs.textarea.selectionStart = this.$refs.textarea.selectionEnd = start + 1;

      // Ensure resize happens immediately for manual line breaks
      this.isMultiline = true;
      this.setHeight();
    },
    onEnter() {
      if (this.isTouchDevice) {
        this.lineBreak();
      } else {
        this.$emit('enter');
      }
    },
    onInput({ target: { value } }) {
      this.$emit('input', value);
    },
    async setHeight() {
      this.$el.style.height = 'auto';
      if (this.value && this.isMultiline) {
        await this.$nextTick();
        const { scrollHeight } = this.$el;
        this.$el.style.height = `${scrollHeight + 1}px`;

        this.scrollToCaret();
      }
    },
    scrollToCaret() {
      const textToCaret = this.$refs.textarea.value.substr(0, this.$refs.textarea.selectionStart);
      const linesToCaret = textToCaret.split('\n').length;
      const lineHeight = parseInt(getComputedStyle(this.$refs.textarea).lineHeight, 10);
      const caretY = lineHeight * linesToCaret;

      if (caretY > this.$refs.textarea.scrollTop + this.$refs.textarea.clientHeight) {
        this.$refs.textarea.scrollTop = caretY - this.$refs.textarea.clientHeight + lineHeight;
      }
    },

    clear() {
      this.$emit('input', '');
      this.$el.style.height = 'auto';
    },
    onFocus(event) {
      this.$emit('focus', event);
    },
    onBlur(event) {
      this.$emit('blur', event);
    },
    onKeydown(event) {
      this.$emit('keydown', event);
    },
    checkMultiline() {
      if (!this.value) {
        this.isMultiline = false;
        return;
      }

      this.$nextTick(() => {
        if (!this.$refs.textarea) {
          return;
        }

        const textarea = this.$refs.textarea;
        const computedStyle = getComputedStyle(textarea);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);

        const singleLineHeight = Math.ceil(lineHeight + paddingTop + paddingBottom);
        const scrollHeight = textarea.scrollHeight;

        this.isMultiline = scrollHeight > singleLineHeight;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  width: 100%;
  height: auto;
  max-height: 230px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-background-quaternary) transparent;

  transition: border $timing-2s $easing;

  border: none;

  background-color: transparent;

  color: var(--color-text-primary);
  font-family: $family;
  font-size: $font-1l;
  font-weight: $font-weight-400;
  line-height: $line-height-m;

  resize: none;

  &:focus {
    outline: none;
  }

  &::placeholder,
  &.status-text {
    color: var(--color-text-secondary);
  }

  // Minimal custom scrollbar for WebKit browsers
  &::-webkit-scrollbar {
    width: $space-1s;

    border-radius: $border-radius-m;

    background: transparent
  }
}
</style>
