<template>
  <div
    :class="allClasses"
    tabindex="0"
    v-on="listeners"
    @keydown.enter.space.stop.prevent="delegateInput"
  >
    <div class="checkbox__icon">
      <EIcon class="checkbox__check" icon="check" size="s" />
    </div>
    <input
      ref="inputElement"
      v-bind="{ disabled, required, name, value, id, ...$attrs }"
      class="checkbox__input"
      type="checkbox"
      tabindex="-1"
      data-test-id="checkbox-input"
      :checked="checked"
      @click="onInput"
    >
  </div>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes, { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';

// TODO: implement ECheckboxes and update below
/**
 * A single checkbox input, whose value is `true` or `false`.
 *
 * For multiple checkboxes, use the `ECheckboxes` component (not implemented yet).
 */
export default {
  name: 'ECheckbox',
  components: {
    EIcon,
  },
  mixins: [classes],
  props: {
    id: {
      type: [String, null],
      default: null,
    },
    value: {
      type: [Boolean, String, Array],
      default: false,
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
      cssClass: true,
    },
  },
  computed: {
    listeners() {
      const { input, ...rest } = this.$listeners;
      return rest;
    },
    checked() {
      return !!this.value;
    },
    allClasses() {
      const allClasses = [...this.classes];
      if (this.checked) {
        allClasses.push(getModifierClass('checkbox', 'checked'));
      }
      return allClasses;
    },
  },
  methods: {
    onInput(event) {
      const value = event.target.checked;
      this.$emit('input', value);
    },
    delegateInput() {
      this.$refs.inputElement.click();
    },
  },
};
</script>

<style lang="scss" scoped>
$checkbox-size: $space-l;
$tappable-area-padding: $space-1s;
$icon-padding: $space-2s * 0.5;

.checkbox {
  display: inline-block;
  position: relative;

  font-family: $family;
  font-size: $font-l;
  line-height: $line-height-m;

  cursor: pointer;

  &::before {
    content: "";

    display: block;
    box-sizing: border-box;
    width: $checkbox-size;
    height: $checkbox-size;

    transition: border $timing-2s $easing;

    border: solid $border-width var(--color-form-border-default);
    border-radius: $border-radius-s;

    background: var(--color-button-content-primary); // Same color as the check icon.

    pointer-events: none;
  }

  &:hover {
    &::before {
      border-color: var(--color-form-border-hover);
    }
  }

  &:focus {
    @extend %keyboard-nav-focus;

    &::before {
      border-color: var(--color-form-border-primary-active);
    }
  }

  &__icon {
    position: absolute;
    top: 0;
    left: 0;
  }

  ::v-deep &__check {
    position: absolute;
    top: $icon-padding;
    left: $icon-padding;

    color: var(--color-button-content-primary);
  }

  &__input {
    position: absolute;
    top: -1 * $tappable-area-padding;
    left: -1 * $tappable-area-padding;
    width: calc(100% + #{2 * $tappable-area-padding});
    height: calc(100% + #{2 * $tappable-area-padding});
    margin: 0;

    border: none;

    opacity: 0;

    cursor: pointer;
  }

  &.checkbox--checked {
    &::before {
      border-width: $checkbox-size * 0.5;
      border-color: var(--color-brand-primary);
    }
  }

  &--disabled {
    color: var(--color-disabled);

    pointer-events: none;

    &::before {
      border-color: var(--color-disabled);

      background-color: var(--color-background-secondary);
    }

    .checkbox__icon {
      display: none;
    }

    &.checkbox--checked {
      &::before {
        border-color: var(--color-disabled);
      }

      .checkbox__icon {
        display: unset;
      }
    }
  }
}
</style>
