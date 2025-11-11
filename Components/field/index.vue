<template>
  <div :class="classes">
    <div v-if="label || description" class="field__details">
      <label v-if="label" :for="id" class="field__label">
        {{ label }}
      </label>
      <p v-if="hasDescription" :id="descriptionId" class="field__description">
        <EIcon
          v-if="disabled"
          class="field__disabled-icon"
          icon="exclamation-circle"
          size="s"
          aria-hidden="true"
        />
        <slot name="description" />
      </p>
    </div>
    <div class="field__input-wrapper">
      <component
        :is="inputType"
        v-model="fieldValue"
        :size="isSegmentedButton ? size : undefined"
        class="field__input"
        v-bind="{ id, type, name, disabled, options, segments, ...$attrs }"
        :aria-label="ariaLabelWithFallback"
        :aria-describedby="ariaDescribedBy"
        :invalid="!!error"
        v-on="listeners"
      >
        <slot name="input-content" />
      </component>
      <EError v-if="error" class="field__error" data-test-id="field-error">
        <EIcon
          icon="problem"
          size="s"
          aria-hidden="true"
        />
        {{ error }}
      </EError>
    </div>
  </div>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import ECheckbox from '@ecosia/common-vue2/components/checkbox/index.vue';
import EError from '@ecosia/common-vue2/components/error/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import EInput from '@ecosia/common-vue2/components/input/index.vue';
import ERadios from '@ecosia/common-vue2/components/radios/index.vue';
import ESegmentedButton from '@ecosia/common-vue2/components/segmented-button/index.vue';
import ESelect from '@ecosia/common-vue2/components/select/index.vue';
import ETextarea from '@ecosia/common-vue2/components/textarea/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const allowedTypes = [
  'text',
  'number',
  'url',
  'tel',
  'email',
  'date',
  'password',
  'radio',
  'select',
  'textarea',
  'checkbox',
  'segmented-button',
  'button',
];

/**
 * A generic form field
 */
export default {
  name: 'EField',
  components: {
    EError,
    EIcon,
  },
  mixins: [classes],
  props: {
    size: {
      type: String,
      default: 'l',
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => allowedTypes.indexOf(value) > -1,
      cssClass: true,
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: null,
    },
    error: {
      type: String,
      default: null,
      cssClass: true,
    },
    label: {
      type: [String, null],
      default: null,
    },
    ariaLabel: {
      type: [String, null],
      default: null,
    },
    /**
     * Will be mapped as the `name` attribute of the form input
     */
    name: {
      type: String,
      required: true,
    },
    description: {
      type: [String, null],
      default: null,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    forceStacked: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    disabled: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    labelLeft: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    options: ESelect.props.options,
    segments: ESegmentedButton.props.segments,
  },
  data() {
    return {
      fieldValue: this.value,
    };
  },
  computed: {
    inputType() {
      switch (this.type) {
        case 'button':
          return EButton;
        case 'checkbox':
          return ECheckbox;
        case 'radio':
          return ERadios;
        case 'select':
          return ESelect;
        case 'textarea':
          return ETextarea;
        case 'segmented-button':
          return ESegmentedButton;
        default:
          return EInput;
      }
    },
    listeners() {
      const { input, ...rest } = this.$listeners;
      return rest;
    },
    id() {
      return `e-field-${this.name}`;
    },
    descriptionId() {
      return `${this.id}-description`;
    },
    // TODO: extract this technique into a general-purpose function
    hasDescription() {
      return !!this.$slots.description && !!this.$slots.description[0];
    },
    ariaDescribedBy() {
      if (!this.hasDescription) {
        return '';
      }

      return this.descriptionId;
    },
    ariaLabelWithFallback() {
      return this.ariaLabel ?? this.label;
    },
    isSegmentedButton() {
      return this.type === 'segmented-button';
    },
  },
  watch: {
    fieldValue(val) {
      this.$emit('input', val);
    },
    value(val) {
      this.fieldValue = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.field {
  &:not(.field--force-stacked) {
    &.field--type-checkbox {
      display: flex;
      justify-content: space-between;
    }

    @include tablet {
      display: flex;
      gap: $space-m;
      justify-content: space-between;
    }
  }

  & + & {
    margin-top: $space-m;
  }

  &__error {
    display: flex;
    gap: $space-2s;
    align-items: center;
    margin-top: $space-1s;
  }
}

.field__input-wrapper {
  width: 100%;

  .field--force-stacked & {
    width: inherit;
  }

  .field--type-checkbox & {
    display: flex;
    flex-shrink: 1;
    width: auto;

    @include tablet {
      order: 1;
    }
  }

  @include tablet {
    .field--type-button & {
      text-align: right;
    }
  }
}

.field__details {
  margin: 0 0 $space-1s;

  @include tablet {
    width: 100%;
    margin-bottom: 0;

    .field--force-stacked & {
      margin-bottom: $space-1s;
    }
  }

  .field--type-checkbox & {
    flex-grow: 1;
    order: 1;
    max-width: none;
    margin-bottom: 0;
    margin-left: $space-m;

    @include tablet {
      order: 0;
      margin-left: 0;
    }
  }
}

.field__label {
  display: block;

  font-size: $font-l;

  .field--disabled & {
    color: var(--color-text-secondary);
  }
}

.field--label-left {
  align-items: center;

  .field__details {
    order: 2;
  }
}

.field__description {
  margin: 0;

  color: var(--color-text-secondary);
  font-size: $font-m;

  .field--disabled & {
    display: flex;

    .field__disabled-icon {
      flex-shrink: 0;
      margin-right: $space-1s;
    }
  }
}
</style>
