<template>
  <ul
    v-show="isVisible"
    id="search-form-suggestion-list"
    :class="classes"
    role="listbox"
    @focusout="onFocusOut"
  >
    <ESuggestionItem
      v-for="(suggestion, index) in suggestions"
      :id="`search-form-suggestion-option-${index}`"
      :key="`${suggestion}-${index}`"
      :index="index"
      :search-path="searchPath"
      :input-text="inputText"
      :compact="compact"
      @linkClicked="onItemLinkClicked"
    />
    <ESuggestionItem
      v-if="showAiEntryPoint"
      :id="`search-form-suggestion-option-${aiItemIndex}`"
      :index="aiItemIndex"
      data-test-id="search-form-ai-suggestion"
      :input-text="inputText"
      :is-ai-suggestion="true"
      :origin="origin"
      :compact="compact"
      @linkClicked="onItemLinkClicked"
    />
  </ul>
</template>

<script>
import { mapState } from 'pinia';

import classes from '@ecosia/common-vue2/mixins/classes.js';

import { aiSearchAutocomplete, aiSearchMvp } from '@ecosia/constants/feature-flags.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import { allowedVariants, VARIANT_MEDIUM } from './constants.js';
import { useAutocompleteStore } from './stores/autocomplete/index.js';
import ESuggestionItem from './suggestion-item.vue';

export default {
  name: 'ESuggestionList',
  components: {
    ESuggestionItem,
  },
  mixins: [classes],
  props: {
    inputText: {
      type: String,
      default: '',
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    variant: {
      type: String,
      cssClass: true,
      default: VARIANT_MEDIUM,
      validator: (variant) => allowedVariants.includes(variant),
    },
    searchPath: {
      type: String,
      required: true,
    },
    inputHasFocus: {
      type: Boolean,
      default: false,
    },
    origin: {
      type: String,
      default: '',
    },
    addAiEntryPoint: {
      type: Boolean,
      default: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    fullWidth: {
      cssClass: true,
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useUnleashStore, ['isActiveToggleValueOneOf', 'getFeatureToggleValue']),
    ...mapState(useAutocompleteStore, ['suggestions']),
    showAiEntryPoint() {
      if (!this.addAiEntryPoint) {
        return false;
      }
      return this.isActiveToggleValueOneOf(
        aiSearchMvp.flag,
        [aiSearchMvp.enabled, aiSearchMvp.userTesting],
      ) && this.getFeatureToggleValue(aiSearchAutocomplete.flag) === aiSearchAutocomplete.enabled;
    },
    inputHasTextEntered() {
      return Boolean(this.inputText?.trim());
    },
    shouldShowAiEntryPoint() {
      return this.showAiEntryPoint && this.inputHasTextEntered && this.inputHasFocus;
    },
    isVisible() {
      // Show suggestions if there are any or if the input text is not empty and AI entry point is enabled
      return this.suggestions.length > 0 || (this.shouldShowAiEntryPoint);
    },
    // The Ai suggestion index is necessary to select the item with the up and down arrows.
    aiItemIndex() {
      return this.suggestions.length ?? 0;
    },
  },
  methods: {
    onFocusOut(event) {
      // important: is fired for the focusout event
      // of every suggestion item
      this.$emit('focusout', event);
    },
    onItemLinkClicked() {
      this.$emit('suggestionClicked');
    },
  },
};
</script>

<style lang="scss" scoped>
.suggestion-list {
  @include elevation(1);

  position: absolute;
  z-index: $z-index-3l;
  top: 100%;
  left: 0;
  // Minus (width of the search button on the right side + border)
  width: calc(100% - #{$space-3l - $border-width});
  margin: 0 0 $space-s;
  padding: $space-1s 0;
  list-style-type: none;

  border: solid $border-width var(--color-form-border-default);
  border-top: 0;
  border-bottom-right-radius: $border-radius-l;
  border-bottom-left-radius: $border-radius-l;

  background-color: var(--color-background-elevation-2);

  font-size: $font-l;
  text-align: left;

  @include tablet {
    font-size: $font-l;
  }

  &.suggestion-list--variant-large {
  width: calc(100% - (#{$space-3l} - #{$border-width}));

    @include tablet {
      width: calc(100% - (#{$space-5l} - #{$border-width}));
    }
  }

  &.suggestion-list--full-width {
    width: 100%;
  }
}
</style>
