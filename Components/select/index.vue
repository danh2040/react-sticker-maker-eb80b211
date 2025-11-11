<template>
  <div
    v-on-clickaway="clickAway"
    :class="allClasses"
    v-bind="$attrs"
    v-on="$listeners"
    @blur.prevent="close"
    @keydown="startUsingKeyboard"
    @keyup="startUsingKeyboard"
    @keydown.prevent.arrow-up="arrowUp()"
    @keydown.prevent.arrow-down="arrowDown()"
    @keyup.home="navigateToStart()"
    @keyup.end="navigateToEnd()"
    @keyup.enter.space.stop.prevent="onEnter"
    @keyup.escape="close"
    @keydown.enter.stop.prevent="() => {}"
    @keypress="onTypeAhead($event.key)"
  >
    <EInput
      class="select__input"
      :as-button="!searchable"
      :value="selectedLabel"
      :placeholder="placeholder"
      :disabled="disabled"
      :invalid="invalid"
      :icon="inputIcon"
      icon-size="s"
      :role="searchable ? 'combobox' : null"
      :aria-autocomplete="searchable ? 'list' : null"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-label="ariaLabel"
      :aria-controls="$id('select-options')"
      :aria-activedescendant="activeDescendantId()"
      :data-test-id="name"
      @focus="onFocus"
      @mousedown="toggleOpen"
      @blur.prevent="onBlur"
      @keyup="onSearch"
    />
    <div
      v-if="isOpen"
      v-show="opts.length > 0"
      class="select__options"
    >
      <div
        :id="$id('select-options')"
        ref="options"
        class="select-options__list"
        tabindex="-1"
        role="listbox"
        :style="{ '--shown': optionsShown !== 'all' ? optionsShown - 0.5 : null }"
        data-test-id="select-options"
        @mousedown="onMousedown"
      >
        <EList role="none">
          <EListItem
            v-for="(option, index) in opts"
            :id="descendantId(option.value)"
            :key="option.value"
            :ref="`option-${index}`"
            :transition="false"
            :highlighted="usingKeyboard && isHighlighted(index)"
            class="select__option"
            :class="{ 'select__option--selected': isSelected(option.value) }"
            role="option"
            :aria-selected="isHighlighted(index)"
            :data-test-id="option.label"
            @click.stop="selectAndClose(option.value)"
          >
            <slot name="list-item" :option="option">
              {{ option.label }}
              <EIcon
                v-if="isSelected(option.value)"
                class="select__option-icon"
                icon="check"
                size="s"
              />
            </slot>
          </EListItem>
        </EList>
      </div>
    </div>
    <select
      :id="id"
      :ref="selectRef"
      v-model="selectedValue"
      class="select__element"
      :aria-label="ariaLabel"
      tabindex="-1"
      :required="required"
      :disabled="disabled"
      :name="name"
      @input.stop="select($event.target.value)"
    >
      <option v-if="placeholder" disabled value="" data-test-id="select-element-option">
        {{ placeholder }}
      </option>
      <option
        v-for="option in opts"
        :key="option.value"
        :value="option.value"
        data-test-id="select-element-option"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';

import { clamp } from '@ecosia/common-js/universal/utils.js';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import EInput from '@ecosia/common-vue2/components/input/index.vue';
import EList from '@ecosia/common-vue2/components/list/index.vue';
import EListItem from '@ecosia/common-vue2/components/list-item/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';
import typeAhead from '@ecosia/common-vue2/mixins/type-ahead.js';

const stepFromDirection = (direction) => {
  switch (direction) {
    case 'up':
      return -1;
    case 'down':
      return 1;
    default:
      return 0;
  }
};

/**
 * An accessible `<select>` box compliant with WAI ARIA `listbox`
 */
export default {
  name: 'ESelect',
  components: {
    EInput,
    EIcon,
    EList,
    EListItem,
  },
  mixins: [classes, typeAhead, clickaway],
  props: {
    id: {
      type: [String, null],
      default: null,
    },
    value: {
      type: [String, Number, Boolean, Object],
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    /**
     * The list of options in the select.
     */
    options: {
      type: Array,
      default: () => [],
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    ariaLabel: {
      type: String,
      default: '',
    },
    optionsShown: {
      type: [Number, String],
      default: 4,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    noIcon: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    mobileNative: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
  },
  data() {
    return {
      selectRef: this.$id('select'),
      highlightedIndex: null,
      selectedValue: this.value !== null ? this.value : '',
      usingKeyboard: false,
      // TODO: rename to 'open'
      isOpen: false,
      optionsClicked: false,
      dirty: false,
      searchTerm: (() => {
        if (this.value === null) {
          return '';
        }

        const selectedOption = this.options.find(
          (option) => option.value === this.value,
        );

        return selectedOption?.inputLabel ?? selectedOption?.label;
      })(),
    };
  },
  computed: {
    opts() {
      return this.options.map((option) => (typeof option !== 'object' ?
          { value: option, label: option } :
        option
      ));
    },
    valueToLabel() {
      return this.opts.reduce(
        (acc, { value, label, inputLabel }) => ({ ...acc, [value]: inputLabel ?? label }),
        {},
      );
    },
    selectedLabel() {
      // The ternary avoids the component glitching while searching.
      // Otherwise the component sometimes updates to null while typing.
      return this.searchable ? this.searchTerm : this.valueToLabel[this.selectedValue];
    },
    selectedIndex() {
      const index = this.opts.findIndex((option) => option.value === this.selectedValue);
      return index >= 0 ? index : null;
    },
    allClasses() {
      const allClasses = [...this.classes];
      if (this.isOpen && this.hasOptions) {
        allClasses.push('select--open');
      }
      if (this.dirty) {
        allClasses.push('select--dirty');
      }
      return allClasses;
    },
    inputIcon() {
      if (this.noIcon) {
        return null;
      }

      return this.isOpen ? 'chevron-mini-up' : 'chevron-mini-down';
    },
    hasOptions() {
      return this.options.length > 0;
    },
  },
  watch: {
    value(val) {
      this.selectedValue = val;
    },
  },
  methods: {
    dispatchSelectChange() {
      const selectElement = this.$refs[this.selectRef];
      selectElement.dispatchEvent(new Event('change'));
    },
    isSelected(value) {
      return this.selectedValue === value;
    },
    isHighlighted(index) {
      return this.highlightedIndex === index;
    },
    onMousedown() {
      this.optionsClicked = true;
    },
    onBlur() {
      if (!this.optionsClicked) {
        this.close();
      }
      this.optionsClicked = false;
    },
    onFocus(event) {
      if (this.searchable) {
        // Select all text on focus
        this.$nextTick(() => {
          event.target.select();
        });
      }
    },
    toggleOpen() {
      // When field is searchable, clicking on it shouldn't toggle,
      // but keep it open instead.
      if (!this.searchable && this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    open() {
      if (!this.isOpen) {
        this.$emit('open');
      }
      if (!this.disabled) {
        this.isOpen = true;
      }
      if (this.highlightedIndex === null) {
        this.highlightedIndex = this.selectedIndex || 0;
      }
      // defer till next tick, because at this point the options won't have rendered yet
      this.$nextTick(() => this.navigate());
    },
    clickAway() {
      // This function used to avoid errors with Jest when it overrides the close() method
      // TODO: check if this is the case with Vitest
      this.close();
    },
    async close() {
      if (this.isOpen) {
        this.usingKeyboard = false;
        this.isOpen = false;
        this.highlightedIndex = this.selectedIndex || 0;
      }
      this.$emit('close');

      this.searchTerm = this.valueToLabel[this.selectedValue];
    },
    select(value) {
      this.dirty = true;
      this.selectedValue = value;
      this.searchTerm = this.valueToLabel[this.selectedValue];
      // Avoid trigerring the native event 'input' unless using
      // the select component directly to avoid conflicts with
      // the native behavior. The 'input' event is necessary
      // for 'v-model' to work when using select directly.
      this.$emit(this.searchable ? 'option-selected' : 'input', value);
    },
    selectAndClose(value) {
      this.select(value);
      this.$nextTick(this.dispatchSelectChange);
      this.close();
    },
    arrowUp() {
      // the user may have closed the dropdown with Esc
      // so we need to open it (without navigating up or down)
      if (!this.isOpen) {
        this.open();
        return;
      }
      this.$nextTick(() => this.navigate('up'));
    },
    arrowDown() {
      if (!this.isOpen) {
        this.open();
        return;
      }
      this.$nextTick(() => this.navigate('down'));
    },
    navigate(direction) {
      const step = stepFromDirection(direction);
      const nextIndex = this.highlightedIndex + step;
      this.highlightedIndex = clamp(nextIndex, 0, this.options.length - 1);
      const element = this.$refs[`option-${this.highlightedIndex}`]?.[0];
      // in unit tests, the ref isn't always retained after $nextTick
      if (element) {
        element.scrollIntoParentView();
      }
    },
    navigateToStart() {
      this.highlightedIndex = 0;
      this.navigate();
    },
    navigateToEnd() {
      this.highlightedIndex = this.options.length - 1;
      this.navigate();
    },
    onEnter(event) {
      if (this.searchable && event.code === 'Space') {
        // We don't want the space key to act on selection
        // when the select is searchable.
        return;
      }

      if (!this.isOpen) {
        this.open();
      } else {
        this.selectCurrentOptionAndClose();
      }
    },
    selectCurrentOptionAndClose() {
      const value = this.opts[this.highlightedIndex]?.value;
      if (value) {
        this.selectAndClose(value);
      }
    },
    handleTypeAheadSequence(sequence) {
      const resultIndex = this.opts.findIndex(({ label }) => {
        const normalisedOption = label.replace(/\s/g, '').toLowerCase();
        return normalisedOption.startsWith(sequence);
      });

      this.highlightedIndex = resultIndex;
      this.navigate();
      this.typeAheadMemory = [];
    },
    startUsingKeyboard() {
      this.usingKeyboard = true;
    },
    onSearch(event) {
      if (this.searchable) {
        this.$emit('search', event.target.value);
        this.startUsingKeyboard();
        if (event.target.value) {
          this.open();
        }
      }
    },
    descendantId(value) {
      if (!value) {
        return null;
      }

      return this.$id(`descendant-${value}`);
    },
    activeDescendantId() {
      const highlightedOption = this.opts[this.highlightedIndex];
      return this.descendantId(highlightedOption?.value);
    },
  },
};
</script>

<style lang="scss" scoped>
$icon-padding-right: $space-s;
// 4.5 because 4 options should be visually visible in their entirety + only half of the 5th one

.select {
  position: relative;
}

.select__options {
  @include elevation(1);

  position: absolute;
  // TODO: check if this can be turned into $z-index-3l (from 999 to 4)
  z-index: $z-index-overlay - 1;
  top: 100%;
  right: 0;
  left: 0;
  overflow: hidden;

  border-right: $border-width solid var(--color-form-border-default);
  border-left: $border-width solid var(--color-form-border-default);
  border-bottom-right-radius: $border-radius-l;
  border-bottom-left-radius: $border-radius-l;

  background: var(--color-background-primary);
}

.dark .select__options {
  border-bottom: $border-width solid var(--color-form-border-default);
  // FE-666: temporary fix for dark-mode until Color System V2 is ready.
  background-color: var(--color-background-elevation-2);
}

.select-options__list {
  position: relative;
  max-height: calc(#{$select-option-height} * var(--shown));
  overflow: auto;
}

.select__option {
  position: relative;

  &--selected {
    padding-right: $space-1l + $icon-padding-right;

    font-weight: $font-weight-700;
  }
}

.select__option-icon {
  position: absolute;
  top: 50%;
  right: $icon-padding-right;

  transform: translateY(-50%);

  pointer-events: none;
}

.select__element {
  display: none;

  .select--mobile-native & {
    display: block;
    appearance: none;
    position: absolute;
    z-index: $z-index-l;
    top: 0;
    width: 100%;
    height: 100%;

    border: none;

    opacity: 0;
    // the large font-size ensures mobile browsers
    // won't zoom in on the hidden <select>, because
    // it's font size is the same as body text
    font-size: 1rem;

    @include tablet {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.select {
  .input__element {
    border: solid $border-width var(--color-form-border-default);

    &:hover {
      border-color: var(--color-form-border-hover);
    }

    &:focus {
      @extend %keyboard-nav-focus;

      border-color: var(--color-form-border-primary-active);
    }
  }

  &.select--open .input__element {
    // using the focus colour here because we want to convey the whole
    // component having focus (not just the options)
    border: solid $border-width var(--color-form-border-primary-active);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
