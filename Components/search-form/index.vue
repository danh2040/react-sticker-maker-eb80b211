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
    <div
      class="search-form__mobile-wrapper"
      :class="{ 'search-form__mobile-wrapper--expanded': mobileWrapperVisible }"
    >
      <div
        class="search-form__search-field"
        data-test-id="search-form-search-field"
      >
        <input
          v-for="(value, key) in hidden"
          :key="key"
          type="hidden"
          :name="key"
          :value="value"
          :data-test-id="`search-form-param-${key}`"
        >
        <div
          class="search-form__input-wrapper"
          :class="{ 'search-form__input-wrapper--highlight': highlightInputWrapper }"
        >
          <EButton
            v-if="mobileWrapperVisible"
            class="search-form__back"
            variant="bare"
            icon="arrow-left"
            icon-class="search-form__reset-icon"
            :aria-label="$t('common.search.searchbox.back')"
            data-test-id="search-form-back"
            @click="closeMobileOverlay"
          />
          <input
            ref="input"
            :value="viewInputText"
            :placeholder="placeholder"
            :aria-label="ariaLabel"
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
            @input="onInput"
            @keydown="onKeydown"
            @focus="onFocus"
            @blur="onBlur"
          >
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
              data-test-id="search-form-suggestions"
              @suggestionClicked="onSuggestionItemClicked"
              @focusout="onBlur"
            />
          </div>
          <EButton
            ref="reset"
            class="search-form__reset"
            :class="{ 'search-form__reset--active': isResetVisible }"
            type="reset"
            variant="bare"
            icon="close"
            icon-class="search-form__reset-icon"
            :aria-label="$t('common.search.searchbox.clear')"
            data-test-id="search-form-reset"
          />
        </div>
        <EButton
          ref="submit"
          class="search-form__submit"
          type="submit"
          variant="bare"
          icon="search"
          icon-class="searchf-form__submit-icon"
          :icon-size="variant === VARIANT_LARGE && isTabletUp ? 'm' : 's'"
          :aria-label="$t('common.search.searchbox.search')"
          data-test-id="search-form-submit"
          @blur="onBlur"
          @click="onSearchIconClick"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { UNITED_STATES_ENGLISH } from '@ecosia/common-js/universal/market-codes.js';
import { getUrlQuery } from '@ecosia/common-js/universal/search.js';
import { sanitizeHTML, sleep } from '@ecosia/common-js/universal/utils.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import classes, { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';
import screen from '@ecosia/common-vue2/mixins/screen.js';
import { toggleScrollLock } from '@ecosia/common-vue2/utils/screen.js';

import debounce from '@ecosia/js-utils/debounce.js';

import {
  adMarketplaceExperiment,
  adMarketplaceGhostPhase,
  aiSearchAutocomplete,
  aiSearchMvp,
  autocompleteDebounceDelayExp,
  system1,
} from '@ecosia/constants/feature-flags.js';
import { AI_SEARCH_ENTRY_POINT } from '@ecosia/constants/query-params.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { getOverrides } from '@ecosia/universal/get-flag-overrides.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import {
  AI_SEARCH_ORIGIN_PREFIX,
  AI_SEARCH_PATH,
  allowedVariants,
  AUTOCOMPLETE_DEBOUNCE_DELAY,
  AUTOCOMPLETE_DEBOUNCE_DELAY_SHORT,
  MAX_SUGGESTIONS_AI_DESKTOP,
  MAX_SUGGESTIONS_AI_MOBILE,
  MAX_SUGGESTIONS_DESKTOP,
  MAX_SUGGESTIONS_MOBILE,
  TYPE_NAVIGATION,
  VARIANT_LARGE,
  VARIANT_MEDIUM,
} from './constants.js';
import { useAutocompleteStore } from './stores/autocomplete/index.js';
import ESuggestionList from './suggestion-list.vue';

export default {
  name: 'ESearchForm',
  components: {
    EButton,
    ESuggestionList,
  },
  mixins: [classes, screen],
  props: {
    /**
     * Supported variants are `medium` (default) and `large`
     */
    variant: {
      type: String,
      default: VARIANT_MEDIUM,
      validator: (variant) => allowedVariants.includes(variant),
      cssClass: true,
    },
    ariaLabel: {
      type: String,
      default: '',
    },
    autocompleteUrl: {
      type: String,
      default: '',
    },
    hiddenInputs: {
      type: Object,
      default: () => ({}),
    },
    market: {
      type: String,
      default: UNITED_STATES_ENGLISH,
    },
    origin: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      required: true,
    },
    hasAutoFocus: {
      type: Boolean,
      default: false,
    },
    disableOverlay: {
      type: Boolean,
      default: false,
    },
    /**
     * if enabled, the form will render with a pre-filled query
     * taken from the `q` URL parameter
     */
    prefillQuery: {
      type: Boolean,
      default: false,
    },
  },
  constants: {
    VARIANT_LARGE,
  },
  data() {
    return {
      highlightInputWrapper: false,
      viewInputText: '',
      inputText: '',
      mobileWrapperVisible: false,
      inputHasFocus: false,
    };
  },
  computed: {
    ...mapState(useAutocompleteStore, ['selectedSuggestion', 'suggestions']),
    ...mapWritableState(useAutocompleteStore, ['selectedIndex']),
    ...mapState(useUserStore, ['autoSuggest', 'consentGiven']),
    ...mapState(useUnleashStore, [
      'getFeatureToggleValue',
      'isActiveToggleValue',
      'isActiveToggleValueOneOf',
    ]),
    allClasses() {
      const allClasses = [...this.classes];

      if (this.areSuggestionsVisible) {
        allClasses.push(getModifierClass('search-form', 'suggestions-visible'));
      }

      return allClasses;
    },
    query() {
      // $route is not set in the web-extensions
      const query = this.$route?.query.originalQuery || this.$route?.query.q;
      return query?.toString() || '';
    },
    hidden() {
      // TODO: allow params to preserve to come from props
      const verticalParams = [
        'freshness',
        'resolution',
        'videoLength',
        'size',
        'color',
        'imageType',
        'freshness',
        'aspect',
        'license',
      ];
      const params = [
        ...verticalParams,
        'canary',
        'mocked',
        'forceProvider',
        'sfs',
        'sfn',
        'forceMarket',
        'tt',
        'tts',
        'addon',
        'addonversion',
      ];

      const query = this.$route?.query || {};
      const overrides = Object.fromEntries(getOverrides(query));
      const userStore = useUserStore(this.$pinia);
      return {
        ...getUrlQuery(query, userStore, params),
        ...overrides,
        ...this.hiddenInputs,
      };
    },
    submitUrl() {
      return this.action;
    },
    useAutocomplete() {
      return this.autoSuggest && this.autocompleteUrl;
    },
    inputHasTextEntered() {
      return Boolean(this.inputText?.trim());
    },
    isAISuggestionVisible() {
      return this.showAiEntryPoint && this.inputHasTextEntered && this.inputHasFocus;
    },
    isResetVisible() {
      // on resolutions below tablet we want the reset to stay visible to be accessible
      return this.inputHasTextEntered && (this.inputHasFocus || !this.isTabletUp);
    },
    areSuggestionsVisible() {
      return this.suggestions?.length > 0 || this.isAISuggestionVisible;
    },
    selectedOptionId() {
      return this.selectedIndex === -1 ? null : `search-form-suggestion-option-${this.selectedIndex}`;
    },
    isExpanded() {
      // Convert to string since boolean attributes is not being rendered by Vue
      // aria-expanded is a required attribute for a11y
      return String(this.areSuggestionsVisible);
    },
    shouldRedirectNotSubmit() {
      return this.selectedSuggestion?.type === TYPE_NAVIGATION && this.selectedSuggestion?.url;
    },
    shouldAutoFocus() {
      return this.hasAutoFocus && this.consentGiven;
    },
    showAiEntryPoint() {
      return this.isActiveToggleValueOneOf(
        aiSearchMvp.flag,
        [aiSearchMvp.enabled, aiSearchMvp.userTesting],
      ) && this.getFeatureToggleValue(aiSearchAutocomplete.flag) === aiSearchAutocomplete.enabled;
    },
    maxDesktopSuggestions() {
      return this.showAiEntryPoint ? MAX_SUGGESTIONS_AI_DESKTOP : MAX_SUGGESTIONS_DESKTOP;
    },
    maxMobileSuggestions() {
      return this.showAiEntryPoint ? MAX_SUGGESTIONS_AI_MOBILE : MAX_SUGGESTIONS_MOBILE;
    },
    displayedSuggestionsLength() {
      // if AI entry point is shown, we need to account for it in the suggestions length
      return this.showAiEntryPoint ? this.suggestions.length + 1 : this.suggestions.length;
    },
    debounceDelay() {
      return this.isActiveToggleValue(
        autocompleteDebounceDelayExp.flag,
        autocompleteDebounceDelayExp.enabled,
      ) ?
        AUTOCOMPLETE_DEBOUNCE_DELAY_SHORT :
        AUTOCOMPLETE_DEBOUNCE_DELAY;
    },
  },
  watch: {
    '$route.query.q': 'onQueryUpdate',
    // React when the selected index changes (includes AI item)
    'selectedIndex': 'onSelectedSuggestionChange',
  },
  created() {
    if (this.prefillQuery) {
      this.setInputTexts(this.query);
    }
    if (this.useAutocomplete) {
      this.debouncedWatchInputText = debounce(this.triggerAutocompleteSearch, this.debounceDelay);
    }
  },
  methods: {
    ...mapActions(useAutocompleteStore, ['clearSuggestions', 'getSuggestions', 'setAiSuggestion', 'clearAiSuggestion']),
    setInputTexts(value) {
      this.viewInputText = value;
      this.inputText = value;
    },
    onInput({ target: { value } }) {
      this.setInputTexts(value);

      // return early if autocomplete is not active
      if (!this.useAutocomplete) {
        return;
      }

      // if the current input text came from a
      // selected autocomplete item, we need to reset
      if (this.selectedSuggestion) {
        this.clearSuggestions();
      }

      // trigger the autocomplete search with a debounce
      this.debouncedWatchInputText();
    },
    onKeydown(event) {
      if (!this.useAutocomplete) {
        return;
      }

      const { key } = event;

      const allowedKeys = [
        'ArrowDown',
        'ArrowUp',
        'Escape',
      ];

      if (allowedKeys.includes(key)) {
        event.preventDefault();

        switch (key) {
          case 'Escape':
            this.clearSuggestions();
            break;
          case 'ArrowUp':
            this.selectedIndex =
              (this.selectedIndex - 1 + this.displayedSuggestionsLength) % this.displayedSuggestionsLength;
            break;
          case 'ArrowDown':
            this.selectedIndex = (this.selectedIndex + 1) % this.displayedSuggestionsLength;
            break;
          default:
            return;
        }
      }
    },
    onFocus() {
      this.$emit('input-focused');
      this.inputHasFocus = true;
      if (!this.useAutocomplete) {
        return;
      }
      // sync text so autocomplete suggestions correspond to input
      this.inputText = this.viewInputText;
      this.triggerAutocompleteSearch();
      // Open overlay and lock body scroll in small screens
      this.mobileWrapperVisible = !this.isTabletUp && !this.disableOverlay;
      toggleScrollLock(!this.isTabletUp);
    },
    async onBlur(event) {
      // if autocomplete is not used at all or if we show the
      // mobile wrapper, we don't need to do anything
      if (!this.useAutocomplete || this.mobileWrapperVisible) {
        return;
      }

      // if the related target is within the suggestions container,
      // we don't want to reset the focus, so the click can propagate
      if (this.hasSuggestionRelatedFocusTarget(event)) {
        return;
      }

      // Safari users who have the "reduced motion" accessibility setting
      // would not be able to use the reset button, because the input field blur handler
      // makes it inactive too early and the click event on the actual reset button never fires.
      // We fix this by delaying the blur handler till the next event loop cycle.
      await sleep();

      this.inputHasFocus = false;

      // only hide autocomplete suggestions on non-mobile resolutions
      if (this.isTabletUp) {
        this.hideSuggestions(event);
      }
    },
    onSearchIconClick(event) {
      // We only track mouse and touch events
      if (event.detail === 0) {
        return;
      }
      this.$emit('search-icon-click');
    },
    hasSuggestionRelatedFocusTarget(event) {
      // important notes:
      // the checks are different, because "suggestions" is a list,
      // while "input", "reset" and "submit" are refs to single components.
      // "input" is a native component and does not need the $el - otherwise the check breaks.
      return (this.$refs.suggestions && this.$refs.suggestions.contains(event?.relatedTarget)) ||
        (this.$refs.input && this.$refs.input === event?.relatedTarget) ||
        (this.$refs.reset && this.$refs.reset.$el === event?.relatedTarget) ||
        (this.$refs.submit && this.$refs.submit.$el === event?.relatedTarget);
    },
    async triggerAutocompleteSearch() {
      if (!this.useAutocomplete) {
        return;
      }

      const params = {
        q: this.inputText?.trim(),
        mkt: this.market,
        limit: this.isDesktopUp ? this.maxDesktopSuggestions : this.maxMobileSuggestions,
      };
      const ampExpVal = this.getFeatureToggleValue(adMarketplaceExperiment.flag) || adMarketplaceExperiment.disabled;
      const ampGhostVal = this.getFeatureToggleValue(adMarketplaceGhostPhase.flag) || adMarketplaceGhostPhase.disabled;

      params[system1.flag] = this.getFeatureToggleValue(system1.flag) || system1.disabled;
      params[adMarketplaceExperiment.flag] = ampExpVal;
      params[adMarketplaceGhostPhase.flag] = ampGhostVal;

      const mocked = this.$route?.query['mocked-autocomplete'] || false;

      try {
        await this.getSuggestions(this.autocompleteUrl, params, mocked);
      } catch (error) {
        this.$sentry ? this.$sentry.captureException(error) : console.error(error);
      }
    },
    hideSuggestions() {
      this.clearSuggestions();
      this.mobileWrapperVisible = false;
      toggleScrollLock(false);
    },
    trackSuggestionUsage() {
      // only track if an autocomplete suggestion was used to search
      if (this.selectedSuggestion) {
        // Bing does not provide a 'type' for suggestions,
        // so we always set it to 'QUERY' for tracking.
        sendCoreAnalyticsEvent('autocompleteSuggestionUsage', {
          provider: this.selectedSuggestion?.provider || 'unknown',
          type: this.selectedSuggestion?.type || 'QUERY',
        });
      }
    },
    getAiSearchUrl(prefix = AI_SEARCH_ORIGIN_PREFIX) {
      const url = new URL(AI_SEARCH_PATH, this.$config.baseUrl || 'https://ecosia.org');
      if (this.inputText) {
        url.searchParams.set('q', this.inputText);
      }

      const overrides = getOverrides(this.$route?.query || {});
      overrides.forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
      if (this.origin) {
        url.searchParams.set(
          AI_SEARCH_ENTRY_POINT,
          prefix.concat(this.origin),
        );
      }
      return url.toString();
    },
    setAiSuggestionData(displayText) {
      const url = this.getAiSearchUrl();

      this.setAiSuggestion({
        title: displayText,
        type: TYPE_NAVIGATION,
        url: url.toString(),
      });
    },
    onSelectedSuggestionChange() {
      let displayText = this.selectedSuggestion?.q ?? this.inputText;

      // if AI entry point experiment is enabled and the selected index is the last one,
      // we set the aiSuggestionData
      if (this.showAiEntryPoint && this.selectedIndex === this.displayedSuggestionsLength - 1) {
        this.setAiSuggestionData(displayText);
      } else {
        // we clear the AI suggestion if it was set
        this.clearAiSuggestion();
      }

      if (this.shouldRedirectNotSubmit) {
        // for navigational suggestion items, we want to display the title instead of the query
        displayText = this.selectedSuggestion.title;

        // only append the description if it exists on the item
        if (this.selectedSuggestion.description) {
          // the description can contain HTML, so we need to clean it first
          displayText = `${displayText} - ${sanitizeHTML(this.selectedSuggestion.description)}`;
        }
      }

      this.viewInputText = displayText;
    },
    handleSuggestionRedirect() {
      if (this.selectedSuggestion) {
        // redirect to the suggestion URL
        window.location.href = this.selectedSuggestion.url;
      }
    },
    async onSuggestionItemClicked() {
      // we need to use $nextTick to make sure the input has been updated before proceeding.
      await this.$nextTick();

      // this action does trigger onSubmit, so we also need to handle tracking
      // and possible redirect instead of executing a search
      this.trackSuggestionUsage();

      if (this.shouldRedirectNotSubmit) {
        this.handleSuggestionRedirect();
      } else {
        this.$refs.form.submit();
      }
    },
    onReset() {
      this.clearSuggestions();
      this.setInputTexts('');
      this.$refs.input.focus();
    },
    onSubmit(event) {
      // check if usage should be tracked
      this.trackSuggestionUsage();
      if (this.shouldRedirectNotSubmit) {
        event.preventDefault();
        this.handleSuggestionRedirect();
      }
    },
    closeMobileOverlay(event) {
      // the event needs to be set on the outer HTML element for it to work
      // properly, but we only want it to be actually executed when it's below
      // tablet resolution to prevent unwanted side effects
      if (this.mobileWrapperVisible) {
        this.inputHasFocus = false;
        // we want to reset the input text so it corresponds to the shown suggestions
        this.setInputTexts(this.query);
        this.hideSuggestions(event);
      }
    },
    onQueryUpdate() {
      window?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      this.setInputTexts(this.query);
      this.$refs.input.focus();
      this.highlightInputWrapper = true;
      setTimeout(() => {
        this.highlightInputWrapper = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-form__search-field {
  @include elevation(1);

  display: flex;
  position: relative;
  z-index: $z-index-l;
  align-items: center;
  justify-content: space-around;
  height: $space-3l;
  margin: 0 auto;

  border-radius: $border-radius-1l;

  background-color: var(--color-background-elevation-2);

  text-align: left;
}

.search-form__input-wrapper {
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  align-items: center;
  height: 100%;
  padding-left: $space-s;

  transition: background-color $timing-s $easing;

  border: solid $border-width var(--color-form-border-default);
  border-right: none;
  border-radius: $border-radius-1l 0 0 $border-radius-1l;

  &.search-form__input-wrapper--highlight {
    background-color: var(--color-highlight-primary);
  }

  @include tablet {
    padding-left: $space-m;
  }
}

.search-form__submit {
  height: 100%;

  transition: all $timing-2s $easing;

  border: $border-width solid var(--color-form-border-default);
  border-left: 0;
  border-radius: 0 $border-radius-full $border-radius-full 0;

  background-color: transparent;

  color: var(--color-button-content-tertiary);
}

.search-form--variant-large {
  @include tablet {
    .search-form__search-field {
      height: $space-5l;

      border-radius: $border-radius-2l;
    }

    .search-form__input-wrapper {
      padding-left: $space-l;

      border-radius: $border-radius-2l 0 0 $border-radius-2l;
    }

    &.search-form--suggestions-visible {
      .search-form__input-wrapper {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 0;
      }

      .search-form__search-field {
        border-bottom-left-radius: 0;
      }
    }

    .search-form__submit {
      min-width: $space-5l;
    }
  }
}

.search-form__input {
  width: 100%;
  height: 100%;
  padding: 0;

  border: none;

  background-color: transparent;

  color: var(--color-text-primary);
  font-size: $font-l;

  &::placeholder {
    opacity: 1;

    color: var(--color-text-secondary);
    text-overflow: ellipsis;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }

  &:focus {
    outline: none;
  }

  &:required {
    box-shadow: none;
  }

  &:invalid {
    box-shadow: none;
  }
}

.search-form__reset {
  margin-right: $space-m;

  opacity: 0;
}

.search-form__reset,
.search-form__reset:focus {
  min-width: $space-2l;
  height: $space-2l;
  margin-right: $space-1s;
}

.search-form .search-form__reset {
  &:focus {
    opacity: 1;
  }

  @include desktop {
    opacity: 0;
  }
}

.search-form:focus-within:valid .search-form__reset,
.search-form:hover:valid .search-form__reset {
  @include desktop {
    opacity: 1;
  }
}

.search-form__reset--active {
  opacity: 1;
}

// keeps submit button the same size as the adjacent input
$outline-difference: 6px;
// not replicated! Needs this in order to not break when it's focused by a mouse interaction
.search-form__submit:focus {
  height: calc(100% - #{$outline-difference});

  outline: solid 2px var(--color-focused);
  outline-offset: 1px;
}

.search-form__submit:hover {
  border-color: var(--color-button-background-primary-hover);

  background-color: var(--color-button-background-primary-hover);

  color: var(--color-button-content-primary);
}

.search-form:focus-within .search-form__submit {
  border-color: var(--color-button-background-primary);

  background-color: var(--color-button-background-primary);

  color: var(--color-button-content-primary);

  &:hover {
    border-color: var(--color-button-background-primary-hover);

    background-color: var(--color-button-background-primary-hover);
  }
}

// TODO: implement this for all buttons of all sizes in the Button component
$tapable-button-margin: $space-2s;

.search-form .button::before {
  content: '';

  position: absolute;
  min-width: $tappable-area-size-mobile;
  min-height: $tappable-area-size-mobile;
  margin: -$tapable-button-margin;
}
</style>

<style lang="scss">
.search-form--suggestions-visible {
  .search-form__input-wrapper,
  .search-form__search-field {
    border-top-left-radius: $border-radius-1l;
    border-bottom-left-radius: 0;
  }
}

.search-form__mobile-wrapper--expanded {
  position: fixed;
  z-index: $z-index-1l;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: $space-1s $space-m 0;

  animation: e-slide-up;
  animation-duration: $timing-2s;
  animation-timing-function: ease-out;

  background: var(--color-background-primary);

  .search-form__input-wrapper,
  .search-form__search-field {
    border-bottom-left-radius: $border-radius-1l;
  }

  .search-form__input-wrapper {
    padding-left: 0;
  }

  .search-form {
    margin-bottom: $space-1s;

    transition: box-shadow;

    border-radius: $border-radius-1l;
  }

  .suggestion-list {
    position: absolute;
    right: - $space-m;

    // Occupy the whole width:
    left: - $space-m;
    width: 100vw;

    border: none;

    background: none;
    box-shadow: none;
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
