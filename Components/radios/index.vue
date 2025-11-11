<template>
  <div
    :class="allClasses"
    v-on="listeners"
  >
    <ERadio
      v-for="option in opts"
      :key="option.value"
      :model-value="modelValue"
      :value="option.value"
      v-bind="{ ...$attrs, name, required, size, disabled, id: null }"
      data-test-id="radios-radio"
      class="radios__radio"
      @input="onInput"
    >
      {{ option.label }}
      <span v-if="option.description" class="radio__description">
        {{ option.description }}
      </span>
    </ERadio>
  </div>
</template>

<script>
import ERadio from '@ecosia/common-vue2/components/radio/index.vue';
import classes, { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';

/**
 * The radio button is a custom wrapper around the native browser
 * input, and include it's label. There is no use case for a single
 * radio button component to be used, unless you're building a new
 * radio button group component. The radio button group should
 * be always used otherwise.
 *
 * The radio button group is a component that can render a list of
 * options as radio buttons accompanied by their respective input control.
 */
export default {
  name: 'ERadios',
  components: {
    ERadio,
  },
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
    options: {
      type: Array,
      default: () => [],
      validator: (value) => value.every((item) => {
        if (typeof item === 'object') {
          return ['label', 'value'].every((property) => property in item);
        }
        return typeof item === 'string';
      }),
    },
    name: {
      type: [String, Number],
      default: '',
    },
    size: {
      type: String,
      default: 'm',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dirty: false,
    };
  },
  computed: {
    opts() {
      return this.options.map((option) => (
        typeof option !== 'object' ?
            { label: option, value: option } :
          option
      ));
    },
    listeners() {
      const { input, ...rest } = this.$listeners;
      return rest;
    },
    allClasses() {
      const allClasses = [...this.classes];
      if (this.disabled) {
        allClasses.push(getModifierClass('radios', 'disabled'));
      }
      if (this.dirty) {
        allClasses.push(getModifierClass('radios', 'dirty'));
      }
      return allClasses;
    },
  },
  watch: {
    modelValue() {
      this.dirty = true;
    },
  },
  methods: {
    onInput(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss">
.radio__description {
  display: block;

  font-size: $font-m;
}
</style>
