<template>
  <div
    class="textarea__container"
    :class="{ 'textarea__clearable': clearable }"
  >
    <textarea
      ref="input"
      :value="formatValue"
      :class="allClasses"
      v-bind="attrs"
      v-on="listeners"
      @input="onInput"
    />
    <EButton
      v-if="showClearBtn"
      icon="close"
      size="s"
      variant="bare"
      data-test-id="textarea-clear-btn"
      @click="clear"
    />
  </div>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const AUTOSCALE_MAX_HEIGHT = 100;
export const sizes = ['m', 'l'];
export const resizeOptions = ['vertical', 'none'];

export default {
  name: 'ETextarea',
  components: {
    EButton,
  },
  mixins: [classes],
  props: {
    value: {
      type: String,
      default: null,
    },
    name: {
      type: [String, Number],
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used by classes mixin
    invalid: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    autoscale: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    freescale: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used by classes mixin
    size: {
      type: String,
      default: 'm',
      cssClass: true,
      validator: (value) => sizes.includes(value),
    },
    // eslint-disable-next-line vue/no-unused-properties -- used by classes mixin
    resize: {
      type: String,
      default: resizeOptions[0],
      cssClass: true,
      validator: (value) => resizeOptions.includes(value),
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formatValue: this.value,
      dirty: false,
    };
  },
  computed: {
    attrs() {
      const { name, required, disabled, $attrs } = this;
      return { ...$attrs, name, required, disabled };
    },
    listeners() {
      const { input, ...rest } = this.$listeners;
      return rest;
    },
    allClasses() {
      const allClasses = this.classes;
      if (this.dirty) {
        allClasses.push('textarea--dirty');
      }
      return allClasses;
    },
    showClearBtn() {
      return this.clearable && this.hasInput;
    },
    hasInput() {
      return this.formatValue?.length > 0;
    },
  },
  watch: {
    value(value) {
      this.formatValue = value;
    },
  },
  methods: {
    onInput({ target: { value } }) {
      this.formatValue = value;
      this.dirty = true;
      this.$emit('input', value);

      const { autoscale, freescale } = this;
      this.setHeight({ autoscale, freescale });
    },
    async setHeight({ autoscale, freescale } = {}) {
      let height;

      this.$refs.input.style.height = '';
      await this.$nextTick();

      const { scrollHeight } = this.$refs.input;

      if (autoscale && !freescale) {
        height = Math.min(scrollHeight, AUTOSCALE_MAX_HEIGHT);
      }

      if (freescale) {
        height = scrollHeight;
      }

      if (height) {
        this.$refs.input.style.height = `${height}px`;
      }
    },
    clear() {
      this.formatValue = '';
      this.$emit('clear', '');
      this.setHeight();
    },
  },
};
</script>

<style lang="scss" scoped>
$sizes: (
  m: (
    font-size: $font-m,
    padding: $space-s,
    height: $space-3l,
  ),
  l: (
    font-size: $font-l,
    padding: $space-m,
    height: $space-5l,
  )
);

$resize-options: (
  vertical: (
    resize: vertical,
  ),
  none: (
    resize: none,
  )
);

.textarea {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: $space-8l;

  transition: border $timing-2s $easing;

  border: solid $border-width var(--color-form-border-default);
  border-radius: $border-radius-l;

  background: var(--color-background-primary);

  color: var(--color-text-primary);
  font-family: $family;
  font-size: $font-m;
  line-height: $line-height-s;

  resize: vertical;

  &:hover {
    border-color: var(--color-form-border-hover);
  }

  &:focus {
    @extend %keyboard-nav-focus;

    border-color: var(--color-form-border-primary-active);
  }

  &:disabled {
    background-color: var(--color-background-primary);

    color: var(--color-disabled);
  }

  &::placeholder {
    opacity: $opacity-m;

    color: var(--color-text-secondary);
  }
}

.textarea--dirty:invalid,
.textarea--invalid {
  border-color: var(--color-error);
}

@each $name, $map in $sizes {
  .textarea--size-#{$name} {
    padding: map.get($map, padding);

    font-size: map.get($map, font-size);
  }

  .textarea--autoscale {
    height: map.get($map, height);
    min-height: map.get($map, height);
  }
}

@each $name, $map in $resize-options {
  .textarea--resize-#{$name} {
    resize: map.get($map, resize);
  }
}

.textarea__container {
  width: 100%;
}

.textarea__clearable {
  display: flex;
  gap: $space-1s;
  padding: $space-s;

  border-radius: $border-radius-l;

  background-color: var(--color-background-primary);
}
</style>
