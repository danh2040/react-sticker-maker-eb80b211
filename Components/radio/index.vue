<template>
  <label
    data-test-id="radio-label"
    :class="[{ 'radio--reversed': isReversedOrder }, classes]"
  >
    <input
      data-test-id="radio-input"
      class="radio__input"
      :value="value"
      :checked="checked"
      :required="required"
      :name="name"
      type="radio"
      autocomplete="off"
      @click="$emit('input', $event.target.value)"
    >
    <span class="radio__text">
      <slot />
    </span>
  </label>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

const sizes = ['s', 'm'];

/**
 * The radio button is a custom wrapper around the native browser
 * input, and include it's label. There is no use case for a single
 * radio button component to be used. The radio button group should
 * be always used.
 */
export default {
  name: 'ERadio',
  mixins: [classes],
  model: {
    prop: 'modelValue',
    event: 'input',
  },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    size: {
      type: String,
      default: 'm',
      cssClass: true,
      validator: (value) => sizes.includes(value),
    },
    name: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    isReversedOrder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    checked() {
      return this.modelValue === this.value;
    },
  },
};
</script>

<style lang="scss" scoped>
$radio-button-size: 20px;
$radio-button-border-active: 7px;

.radio {
  display: flex;
  position: relative;
  align-items: center;
  min-height: $tappable-area-size-mobile;

  cursor: pointer;
  touch-action: manipulation;

  &.radio--size-s {
    min-height: 20px;
  }

  &--reversed {
    flex-direction: row-reverse;
    justify-content: space-between;
    width: 100%;
  }
}

.radio__input {
  appearance: none;
  flex: none;
  width: $radio-button-size;
  height: $radio-button-size;
  margin: 0;

  transition: border $timing-2s $easing;

  border: 1px solid var(--color-form-border-default);
  border-radius: $border-radius-full;

  cursor: pointer;

  &:hover {
    border-color: var(--color-form-border-hover);
  }

  &:focus {
    @extend %keyboard-nav-focus;
  }

  &:checked {
    border-width: $radio-button-border-active;
    border-color: var(--color-form-border-primary-active);
  }
}

.radio__text {
  padding: $space-s;

  font-size: $font-l;

  .radio--size-s & {
    padding: 0 $space-1s;

    font-size: $font-m;
  }
}
</style>
