<template>
  <div
    class="input"
    :class="allClasses"
  >
    <div class="input__addon input__addon--start" aria-hidden="true">
      <EIcon v-if="iconStart" class="input__icon" :icon="iconStart" :size="iconSize" />
    </div>
    <button
      v-if="asButton"
      type="button"
      v-bind="attrs"
      v-on="listeners"
    >
      {{ inputValue }}
    </button>
    <input
      v-else-if="type==='number'"
      v-model.number="inputValue"
      v-bind="attrs"
      v-on="listeners"
    >
    <input
      v-else
      v-model="inputValue"
      v-bind="attrs"
      v-on="listeners"
    >
    <div class="input__addon input__addon--end" aria-hidden="true">
      <EIcon v-if="icon" class="input__icon" :icon="icon" :size="iconSize" />
    </div>
  </div>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export default {
  name: 'EInput',
  components: {
    EIcon,
  },
  mixins: [classes],
  props: {
    /**
     * Renders the input as a `<button>`.
     * This is needed to simplify the Select implementation
     * which can either act as a listbox or combobox,
     * so we need to apply the exact same styles to an `<input>` (for combobox)
     * as a `<button>` (for listbox).
     */
    asButton: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- needed for parent components using v-model
    model: {
      type: [String, Number],
      default: null,
    },
    value: {
      type: [String, Number],
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    icon: {
      type: String,
      default: null,
    },
    iconStart: {
      type: String,
      default: null,
    },
    iconSize: {
      type: String,
      default: 'm',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    invalid: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    ariaControls: {
      type: String,
      default: null,
    },
    ariaExpanded: {
      type: String,
      default: null,
    },
    ariaLabel: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      inputValue: this.value,
      dirty: false,
    };
  },
  computed: {
    attrs() {
      const { name, type, placeholder, required, disabled, $attrs } = this;
      return {
        ...$attrs,
        name,
        type,
        placeholder,
        required,
        disabled,
        'class': 'input__element',
        'data-test-id': 'input-input',
        'aria-controls': this.ariaControls,
        'aria-expanded': this.ariaExpanded,
        'aria-label': this.ariaLabel,
      };
    },
    listeners() {
      const { input, ...rest } = this.$listeners;
      return rest;
    },
    allClasses() {
      const allClasses = [...this.classes];
      if (this.dirty) {
        allClasses.push('input--dirty');
      }
      if (this.icon) {
        allClasses.push('input--has-icon');
      }
      if (this.iconStart) {
        allClasses.push('input--has-icon-start');
      }
      if (this.type === 'hidden') {
        allClasses.push('input--hidden');
      }
      return allClasses;
    },
  },
  watch: {
    inputValue(val) {
      this.dirty = true;
      this.$emit('input', val);
    },
    value(val) {
      this.inputValue = val;
    },
  },
};
</script>

<style lang="scss" scoped>
$icon-padding-left: $space-m;
$icon-padding-right: $space-s;

.input {
  display: flex;
  appearance: none;
  position: relative;
}

.input__element {
  $padding-unit: $space-s + $space-2s;
  display: flex;
  appearance: none;
  box-sizing: border-box;
  flex-grow: 1;
  align-items: center;
  width: 100%;
  height: $space-3l;
  padding: 0 $space-l 0 $padding-unit;

  transition: border $timing-2s $easing;

  border: solid $border-width var(--color-form-border-default);
  border-radius: $border-radius-1l;

  background: var(--color-button-background-secondary);

  color: var(--color-button-content-secondary);
  font-family: $family;
  font-size: $font-m;
  line-height: $line-height-s;

  &::placeholder {
    opacity: 1;

    color: var(--color-text-secondary);
  }

  // Chrome lets the user open the date picker UI
  // by clicking on the built-in indicator icon.
  // We want to hide that icon, but let the user open the indicator,
  // so we set its opacity to 0 and stretch it over the whole input field.
  // This does stop the user from typing the date in using the keyboard after clicking in,
  // but we don't have a better solution right now.
  &::-webkit-calendar-picker-indicator {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;

    opacity: 0;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    display: none;
  }

  &[type="number"] {
    appearance: textfield;
  }

  &:hover {
    border-color: var(--color-form-border-hover);
  }

  &:focus {
    @extend %keyboard-nav-focus;

    border-color: var(--color-form-border-primary-active);
  }

  &:disabled {
    border-color: var(--color-disabled);

    background: var(--color-background-primary);

    color: var(--color-disabled);

    cursor: not-allowed;
  }
}

.input__icon {
  pointer-events: none;
}

.input--has-icon {
  .input__element {
    padding-right: $space-3l;
  }
}

.input--has-icon-start {
  .input__element {
    padding-left: $space-3l;
  }
}

.input--as-button {
  .input__element {
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
    }
  }
}

.input--hidden {
  display: none;
}

.input--disabled {
  .input__icon {
    color: var(--color-disabled);
  }
}

// to make stylelint happy we'd have to break up the following block :(
// stylelint-disable-next-line no-descending-specificity
.input--invalid .input__element,
.input--dirty .input__element:invalid {
  border-color: var(--color-error);
}

.input__addon {
  display: inline-flex;
  position: absolute;
  top: 50%;

  transform: translateY(-50%);

  pointer-events: none;

  & > * {
    display: flex;
  }
}

.input__addon--start {
  left: $icon-padding-left;
}

.input__addon--end {
  right: $icon-padding-right;
}
</style>
