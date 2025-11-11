<template>
  <div
    v-if="segments.length > 0"
    :class="['segmented-button', `segmented-button--${size}`, classes]"
  >
    <span
      v-for="segment in segments"
      :key="segment.value"
      class="segmented-button__segment"
      data-test-id="segmented-button-segment"
    >
      <input
        :id="segment.id"
        :name="name"
        :value="segment.value"
        :checked="segment.value === value"
        type="radio"
        class="segmented-button__input"
        @change="$emit('input', segment.value)"
      >
      <label
        :for="segment.id"
        class="segmented-button__label"
      >
        {{ segment.label }}
      </label>
    </span>
  </div>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

export default {
  name: 'ESegmentedButton',
  mixins: [classes],
  props: {
    /**
     * an array of objects, where each object has a `label`.
     * If an `onClick` function is specified, this will be attached as a click handler.
     */
    segments: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: 'system',
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'l',
    },
  },
};
</script>

<style lang="scss" scoped>
// We've used the radio button pills pattern from here:
// https://scottaohara.github.io/a11y_styled_form_controls/src/radio-button--pill/
// it uses the native HTML radio buttons which provides the necessary semantics
// and user experience for keyboard users, and the accessibility API.
.segmented-button {
  display: inline-grid;
  position: relative;
  gap: $space-2s + $border-width;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  padding: $space-2s * 0.5;

  border: solid $border-width var(--color-form-border-default);
  border-radius: $border-radius-full;

  color: var(--color-button-content-secondary);

  &--s {
    height: 36px;

    font-size: $font-m;
  }

  &--m {
    height: $space-3l;

    font-size: $font-l;
  }

  &--l {
    height: $space-4l;

    font-size: $font-1l;
  }
}

.segmented-button__label {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: $space-1s $space-m;

  .segmented-button--s & {
    padding: 5px $space-m;
  }

  .segmented-button--m & {
    padding: 6px $space-m;
  }
}

.segmented-button__label::after {
  content: "";

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  pointer-events: none;
}

.segmented-button__segment {
  position: relative;

  transition: background-color $timing-2s $easing;

  & + &::before {
    content: '';

    display: block;
    position: absolute;
    top: 0;
    left: -1 * ($space-2s * 0.5 + $border-width);
    width: $border-width;
    height: 100%;

    background-color: var(--color-form-border-default);
  }

  &:first-child,
  &:first-child .segmented-button__label,
  &:first-child .segmented-button__label::after {
    border-top-left-radius: $border-radius-full;
    border-bottom-left-radius: $border-radius-full;
  }

  &:last-child,
  &:last-child .segmented-button__label,
  &:last-child .segmented-button__label::after {
    border-top-right-radius: $border-radius-full;
    border-bottom-right-radius: $border-radius-full;
  }
}

.segmented-button__input {
  appearance: none;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  border: 2px solid;

  opacity: 0.00001; /* stylelint-disable-line number-max-precision */
  background: none;

  cursor: pointer;

  &:focus ~ .segmented-button__label::after {
    @extend %keyboard-nav-focus;
  }

  &:hover ~ .segmented-button__label {
    background-color: var(--color-button-background-transparent-hover);
  }

  &:active  ~ .segmented-button__label{
    background-color: var(--color-button-background-transparent-active);
  }

  &:checked ~ .segmented-button__label {
    background: var(--color-highlight-primary);

    text-decoration: underline;

    pointer-events: none;

    text-underline-position: from-font;

    &:hover {
      background: var(--color-highlight-primary);
    }
  }
}
</style>
