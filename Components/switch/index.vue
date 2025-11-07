<template>
  <div
    :class="`switch switch--${value ? 'on' : 'off'}`"
  >
    <EField
      type="checkbox"
      :name="name"
      :label="label"
      :value="value"
      @input="update"
    >
      <template #description>
        <div> {{ description }} </div>
      </template>
    </EField>
    <slot />
  </div>
</template>

<script>
import EField from '@ecosia/common-vue2/components/field/index.vue';

export default {
  name: 'ESwitch',
  components: {
    EField,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    update(val) {
      this.$emit('update', val);
    },
  },
};
</script>

<style lang="scss">
  .switch {
    .checkbox::before {
      width: $icon-size-m;
      height: $icon-size-m;
      margin: 3px;

      transform: translate(2px, 0);
      transition: transform $timing-1s, background $timing-1s;

      border-width: $border-width-l;
      border-radius: $border-radius-full;
      border-color: var(--color-form-border-default);
    }

    .field__input-wrapper {
      margin: $space-2s 0;
    }

    .field--type-checkbox {
      .field__details {
        order: 0;
        margin-right: $space-m;
        margin-left: 0;
      }

      .field__input-wrapper {
        align-items: center;
      }

      .field__input {
        width: 54px;
        height: 32px;

        transition: background .2s;

        border: $border-width solid var(--color-form-border-default);
        border-radius: $border-radius-1l;

        background: var(--color-button-content-primary);

        &:hover {
          border-color: var(--color-form-border-hover);
        }
      }
    }

    .checkbox__icon {
      position: absolute;
      top: 5px;
      left: 27px;

      transition: none;

      opacity: 0;
    }

    .checkbox--checked {
      &.field__input {
        background: var(--color-brand-primary);
      }

      &::before {
        transform: translate(22px, 0);

        background: var(--color-background-elevation-2);
      }

      .checkbox__input {
        left: $space-1s;
      }

      .checkbox__icon {
        transition: opacity $timing-1s;
        transition-delay: $timing-1s;

        opacity: 1;
      }

      .checkbox__check {
        color: var(--color-brand-primary);
      }
    }

    .checkbox {
      &.checkbox--checked::before {
        border-width: $border-width;
      }
    }
  }
</style>
