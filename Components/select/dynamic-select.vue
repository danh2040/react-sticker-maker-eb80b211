<template>
  <ESearchSelect
    v-bind="{...$attrs, ...$props}"
    :options="filteredOptions"
    autosuggest
    :no-icon="!showToggleIcon"
    :name="name"
    @search="onSearch"
    @input="onSelect"
  >
    <template #list-item="slotProps">
      <slot name="list-item" :option="slotProps.option">
        {{ slotProps.option.label }}
      </slot>
    </template>
  </ESearchSelect>
</template>

<script>
import debounce from '@ecosia/js-utils/debounce.js';

import ESearchSelect from './search-select.vue';

const AUTOSUGGEST_DEBOUNCE_DELAY = 250;

export default {
  components: {
    ESearchSelect,
  },
  props: {
    /**
     * Initial value. Requires setting the
     * `options` prop as well.
     */
    value: {
      type: [String, Number, Boolean, Object],
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    /**
     * Function that receives a search term
     * and returns a promise that resolves
     * to an array of options.
     * Each option must contain at least
     * `value` and `label`.
     */
    searchFunction: {
      type: Function,
      required: true,
    },
    /**
     * Time to wait after last `search` event
     * before running a search.
     */
    debounceTime: {
      type: Number,
      default: AUTOSUGGEST_DEBOUNCE_DELAY,
    },
    /**
     * Minimum search term length to
     * trigger the search.
     */
    minLength: {
      type: Number,
      default: 1,
    },
    /**
     * Optional initial list of values.
     * Necessary if setting the `value` prop.
     */
    options: {
      type: Array,
      default: () => [],
    },
    /**
     * Optional display of chevron
     * to communicate dropdown state
     */
    showToggleIcon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filteredOptions: this.options,
      searchTerm: '',
    };
  },
  mounted() {
    this.debouncedFunction = debounce(
      async () => {
        this.filteredOptions = await this.searchFunction(this.searchTerm);
      },
      this.debounceTime,
    );
  },
  methods: {
    /**
     * @param {string} searchTerm
     */
    onSearch(searchTerm) {
      if (searchTerm) {
        this.searchTerm = searchTerm;
        this.debouncedFunction();
      } else {
        this.clear();
      }
    },
    clear() {
      this.searchTerm = '';
      this.filteredOptions = [];
    },
    onSelect(value) {
      const selectedOption = this.filteredOptions.find((option) => option.value === value);
      this.$emit('select', selectedOption);
    },
  },
};
</script>

<style lang="scss">
.select__option {
  display: none;
  height: auto;
}
</style>
