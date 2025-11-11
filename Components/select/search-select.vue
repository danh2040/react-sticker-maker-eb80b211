<template>
  <ESelect
    :value="fieldValue"
    class="search-select"
    :class="{ 'search-select--single-line-options' : singleLineOptions }"
    v-bind="{...$attrs, ...$props}"
    :options="autosuggest ? options : filteredOptions"
    searchable
    :type-ahead="false"
    :mobile-native="mobileNative"
    @search="onSearch"
    @option-selected="onSelect"
    @close="onClose"
    @open="onOpen"
  >
    <template #list-item="slotProps">
      <slot name="list-item" :option="slotProps.option">
        {{ slotProps.option.label }}
      </slot>
    </template>
  </ESelect>
</template>

<script>
import ESelect from './index.vue';

export default {
  name: 'ESearchSelect',
  components: {
    ESelect,
  },
  props: {
    /**
     * The list of options in the select.
     * Format: String[] or {value: String, label: String}[]
     */
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: null,
    },
    /**
     * If true, the options filtering is external,
     * and the event 'search' should be listened to.
     */
    autosuggest: {
      type: Boolean,
      default: false,
    },
    mobileNative: {
      type: Boolean,
      default: false,
    },
    /**
    * If true, each option is limited to
    * one line only and applied ellipisis at the end
    */
    singleLineOptions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchTerm: '',
      fieldValue: this.value,
      filteredOptions: this.options,
    };
  },
  computed: {
    deduplicatedOptions() {
      return this.options.reduce((acc, current) => {
        if (!acc.find((option) => {
          const optionLabel = option.label || option;
          const currentLabel = current.label || current;

          return optionLabel === currentLabel;
        })) {
          acc.push(current);
        }
        return acc;
      }, []);
    },
  },
  watch: {
    value(val) {
      this.fieldValue = val;
    },
  },
  methods: {
    /**
     * @param {string} searchTerm
     */
    onSearch(searchTerm) {
      this.$emit('search', searchTerm);
      this.searchTerm = searchTerm;
      if (!this.autosuggest) {
        this.filteredOptions = this.defaultFilterFunction(this.searchTerm);
      }
    },
    defaultFilterFunction(searchTerm) {
      return this.deduplicatedOptions.filter((option) => {
        const label = option.label || option;
        return label.toLowerCase().includes(searchTerm.toLowerCase());
      });
    },
    resetSearch() {
      this.searchTerm = '';
      this.filteredOptions = this.options;
    },
    onClose() {
      this.resetSearch();
      this.$emit('close');
    },
    onOpen() {
      this.resetSearch();
      this.$emit('open');
    },
    onSelect(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style lang="scss">
.search-select--single-line-options {
  .list-item__content {
    @extend %ellipsis;
  }
}
</style>
