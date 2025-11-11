<template>
  <form
    ref="form"
    v-focus-away="closeMobileOverlay"
    :action="submitUrl"
    method="GET"
    role="search"
    :class="allClasses"
    autocomplete="off"
    @reset.prevent.stop="onReset"
    @submit="onSubmit"
  >
    <input
      v-for="(value, key) in hidden"
      :key="key"
      type="hidden"
      :name="key"
      :value="value"
      :data-test-id="`search-form-param-${key}`"
    >
    <div class="search-form__wrapper">
      <div
        class="search-form__search-field"
        data-test-id="search-form-search-field"
      >
        <slot name="left-section">
          <div class="search-form__left-section-wrapper">
            <EButton
              ref="submit"
              class="search-form__submit"
              type="submit"
              variant="bare"
              icon="search"
              size="s"
              :aria-label="$t('common.search.searchbox.search')"
              data-test-id="search-form-submit"
              @blur="onBlur"
              @click="onSearchIconClick"
            />
          </div>
        </slot>
        <div
          class="search-form__input-wrapper"
          :class="{ 'search-form__input-wrapper--highlight': highlightInputWrapper }"
        >
          <EPromptTextarea
            ref="input"
            v-model="viewInputText"
            :placeholder="placeholder"
            :aria-label="ariaLabel"
            :max-length="3000"
            role="combobox"
            aria-autocomplete="both"
            aria-controls="search-form-suggestion-list"
            :aria-expanded="isExpanded"
            aria-haspopup="listbox"
            :aria-activedescendant="selectedOptionId"
            class="search-form__input"
            type="search"
            name="q"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            spellcheck="false"
            :autofocus="shouldAutoFocus"
            required
            data-test-id="search-form-input"
            @input="(value) => onInput({ target: { value } })"
            @keydown="onKeydown"
            @focus="onFocus"
            @blur="onBlur"
            @multiline-change="(value) => isMultiline = value"
          />
        </div>
        <div class="search-form__right-section-wrapper">
          <EButton
            ref="reset"
            size="s"
            class="search-form__reset"
            :class="{ 'search-form__reset--active': isResetVisible }"
            type="reset"
            variant="bare"
            icon="close"
            icon-class="search-form__reset-icon"
            :aria-label="$t('common.search.searchbox.clear')"
            data-test-id="search-form-reset"
          />
          <EButton
            ref="aiSearch"
            size="s"
            class="search-form__ai-search"
            variant="outline"
            icon="twinkle"
            :aria-label="$t('common.header.verticals.ai_search')"
            data-test-id="search-form-ai-search"
            @click="onAiSearchClick"
          >
            {{ $t('common.header.verticals.ai_search') }}
          </EButton>
        </div>
      </div>
      <div
        v-if="useAutocomplete || showAiEntryPoint"
        ref="suggestions"
        class="search-form__suggestions"
      >
        <ESuggestionList
          class="search-form__suggestions-list"
          :input-text="inputText"
          :variant="variant"
          :search-path="submitUrl"
          :input-has-focus="inputHasFocus"
          :origin="origin"
          :add-ai-entry-point="false"
          data-test-id="search-form-suggestions"
          full-width
          compact
          @suggestionClicked="onSuggestionItemClicked"
          @focusout="onBlur"
        />
      </div>
    </div>
  </form>
</template>

<script>
/**
 * The omnibox is a variant of the search form implemented as part of the AI2-222 experiment.
 * This component extends the search form (ESearchForm) component, and reuses all its properties,
 * computed properties, methods, and lifecycle hooks.
 */

import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EPromptTextarea from '@ecosia/common-vue2/components/prompt-textarea/index.vue';
import { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';

import { AI_SEARCH_ENTRY_POINT } from '@ecosia/constants/query-params.js';

import ESearchForm from './index.vue';
import ESuggestionList from './suggestion-list.vue';

export default {
  name: 'EOmnibox',
  components: {
    EButton,
    ESuggestionList,
    EPromptTextarea,
  },
  extends: ESearchForm,
  data() {
    return {
      isMultiline: false,
    };
  },
  computed: {
    aiSearchUrl() {
      const query = this.inputText ? { q: this.inputText } : {};
      query[AI_SEARCH_ENTRY_POINT] = 'omnibox';
      return this.$router.resolve({ path: '/ai-search', query }).href;
    },
    allClasses() {
      const allClasses = [...this.classes];

      if (this.areSuggestionsVisible) {
        allClasses.push(getModifierClass('search-form', 'suggestions-visible'));
      }

      if (this.inputHasTextEntered && (this.inputHasFocus || this.isMultiline)) {
        allClasses.push(getModifierClass('search-form', 'squared'));
      }

      return allClasses;
    },
    showAiEntryPoint() {
      return false;
    },
  },
  methods: {
    onAiSearchClick() {
      window.location.href = this.aiSearchUrl;
    },
    hasSuggestionRelatedFocusTarget(event) {
      // Override to properly handle PromptInput component
      // In search-form component, this.$refs.input is a native input element
      // In omnibox, this.$refs.input is the PromptInput Vue component
      return (this.$refs.suggestions && this.$refs.suggestions.contains(event?.relatedTarget)) ||
        (this.$refs.input?.$el?.contains(event?.relatedTarget)) ||
        (this.$refs.reset?.$el === event?.relatedTarget) ||
        (this.$refs.submit?.$el === event?.relatedTarget);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-form__wrapper {
  position: relative;
}

.search-form__search-field {
  @include elevation(1);

  display: flex;
  position: relative;
  z-index: $z-index-l;
  justify-content: space-around;
  min-height: $space-5l;
  margin: 0 auto;

  border: solid $border-width var(--color-form-border-default);
  border-radius: $border-radius-2l;

  background-color: var(--color-background-elevation-2);

  text-align: left;
}

.search-form--squared {
  .search-form__search-field {
    border-radius: $border-radius-1l
  }
}

.search-form__left-section-wrapper {
  position: relative;
  width: $space-3l;

  .search-form__submit {
    position: absolute;
    top: $space-s;
    right: 0;

    transition: all $timing-2s $easing;
  }
}

.search-form__right-section-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-top: $space-s;
  padding-right: $space-s;
}

.search-form__input-wrapper {
  display: flex;
  flex: 1 1 auto;
  align-items: center;

  transition: background-color $timing-s $easing;

  &.search-form__input-wrapper--highlight {
    background-color: var(--color-highlight-primary);
  }
}

.search-form__input {
  // 3 lines of text
  max-height: calc($line-height-m * $font-l * 3);
  margin: $space-m $space-m $space-m $space-1s;
  padding: 0;

  font-size: $font-l;
  font-weight: $font-weight-400;
  line-height: $line-height-m;
}

.search-form__reset {
  opacity: 0;
}

.search-form__reset--active {
  opacity: 1;
}

.search-form__reset,
.search-form__reset:focus {
  min-width: $space-2l;
  height: $space-2l;
  margin-right: $space-1s;
}

.search-form:focus-within:valid .search-form__reset,
.search-form:hover:valid .search-form__reset {
  @include desktop {
    opacity: 1;
  }
}

.search-form__suggestions-list {
  border-bottom-right-radius: $border-radius-1l;
  border-bottom-left-radius: $border-radius-1l;
}

.search-form--suggestions-visible {
  .search-form__search-field {
    border-top-left-radius: $border-radius-1l;
    border-top-right-radius: $border-radius-1l;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
}

@keyframes e-slide-up {
  0% {
    // The height of header icons, plus top and bottom margins
    padding-top: $space-3l + $space-1s + $space-1s;
  }

  100% {
    padding-top: $space-1s;
  }
}
</style>
