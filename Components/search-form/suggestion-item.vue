<template>
  <li
    :class="allClasses"
    :aria-selected="ariaSelected"
    data-test-id="suggestion-item"
    role="option"
    :aria-label="suggestion"
    @focus="onFocus"
  >
    <div
      class="suggestion-item__image-container"
    >
      <img
        v-if="getContextValue('imageUrl')"
        class="suggestion-item__image"
        data-test-id="suggestion-item-image"
        :src="getContextValue('imageUrl')"
        :alt="$t('common.search.suggestions.imagealt', { suggestion })"
      >
      <EIcon
        v-else-if="isAiSuggestion"
        icon="ai-search"
        data-test-id="suggestion-item-ai-icon"
        size="s"
        class="suggestion-item__icon suggestion-item__icon--ai-search"
      />
      <EIcon
        v-else
        icon="search"
        size="s"
        class="suggestion-item__icon"
        data-test-id="suggestion-item-icon"
      />
    </div>
    <a
      class="suggestion-link"
      :class="{ 'suggestion-link--ai-suggestion': isAiSuggestion }"
      :href="getSuggestionUrl()"
      tabindex="0"
      data-test-id="suggestion-link"
      rel="noopener"
      @click.prevent="onLinkClick"
    >
      <div class="suggestion-link__content">
        <span
          v-safe-html="markHtml(displayValue)"
          data-test-id="suggestion-link-text"
          class="suggestion-link__text"
        />
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="suggestion-link__description"
          data-test-id="suggestion-link-description"
          v-html="getContextValue('description')"
        />
        <EBadge
          v-if="isAiSuggestion"
          variant="featured"
          class="suggestion-item__ai-badge"
          data-test-id="suggestion-item-ai-badge"
        >
          <EIcon icon="twinkle" size="s" />
          {{ $t('common.header.verticals.ai_search') }}
        </EBadge>
      </div>
    </a>
    <div
      v-if="isNavigational"
      class="suggestion-item__navigational"
      data-test-id="suggestion-item-navigational"
    >
      <EAdPill />
    </div>
  </li>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia';

import { createMarkHtml } from '@ecosia/common-js/universal/utils.js';
import EAdPill from '@ecosia/common-vue2/components/ad-pill/index.vue';
import EBadge from '@ecosia/common-vue2/components/badge/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

import { AI_SEARCH_ENTRY_POINT } from '@ecosia/constants/query-params.js';
import { getOverrides } from '@ecosia/universal/get-flag-overrides.js';

import {
  AI_SEARCH_ORIGIN_PREFIX,
  AI_SEARCH_PATH,
  SEARCH_PATH,
  TYPE_NAVIGATION,
} from './constants.js';
import { useAutocompleteStore } from './stores/autocomplete/index.js';

export default {
  name: 'ESuggestionItem',
  components: {
    EAdPill,
    EIcon,
    EBadge,
  },
  mixins: [classes],
  props: {
    index: {
      type: Number,
      required: true,
    },
    inputText: {
      type: String,
      default: '',
    },
    origin: {
      type: String,
      default: '',
    },
    searchPath: {
      type: String,
      default: SEARCH_PATH,
    },
    isAiSuggestion: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    compact: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
  },
  computed: {
    ...mapState(useAutocompleteStore, ['contextData', 'wasImpressionAlreadySent', 'suggestions']),
    ...mapWritableState(useAutocompleteStore, ['selectedIndex']),
    allClasses() {
      const allClasses = [...this.classes];

      if (this.selected) {
        allClasses.push('selected');
      }

      return allClasses;
    },
    clickUrl() {
      return this.getContextValue('clickUrl');
    },
    impressionUrl() {
      return this.getContextValue('impressionUrl');
    },
    selected() {
      return this.selectedIndex === this.index;
    },
    ariaSelected() {
      return String(this.selected);
    },
    suggestion() {
      // if the item is of type AI, we want to show the input text
      if (this.isAiSuggestion) {
        return this.inputText;
      }

      return this.suggestions[this.index] ?? '';
    },
    markHtml() {
      return createMarkHtml(this.inputText, 'suggestion-highlight', 'suggestion-highlight');
    },
    isNavigational() {
      return this.getContextValue('type') === TYPE_NAVIGATION;
    },
    displayValue() {
      // if the result is navigational, we want to show the title instead of the suggested term
      const title = this.getContextValue('title');
      if (this.isNavigational && title) {
        return title;
      }
      return this.suggestion;
    },
  },
  async mounted() {
    if (this.isNavigational && !this.wasImpressionAlreadySent(this.impressionUrl)) {
      await this.trackImpression();
    }
  },
  methods: {
    ...mapActions(useAutocompleteStore, ['setSentImpression']),
    getContextValue(key) {
      return this.contextData[this.index]?.[key] ?? '';
    },
    onFocus() {
      this.selectedIndex = this.index;
    },
    async trackImpression() {
      if (!this.impressionUrl) {
        return;
      }
      const params = new URLSearchParams([['impressionUrl', this.impressionUrl]]);
      try {
        await fetch(`${this.$config.admarketplaceUrl}/trackImpression/?${params.toString()}`);
        this.setSentImpression(this.impressionUrl);
      } catch {
        console.error('Failed to send impression:', this.impressionUrl);
      }
    },
    async trackClick() {
      if (!this.clickUrl) {
        return;
      }
      const params = new URLSearchParams([['clickUrl', this.clickUrl]]);
      try {
        await fetch(`${this.$config.admarketplaceUrl}/trackClick/?${params.toString()}`);
      } catch {
        console.error('Failed to send click:', this.clickUrl);
      }
    },
    async onLinkClick() {
      this.selectedIndex = this.index;
      await this.trackClick();
      this.$emit('linkClicked');
    },
    // We don't actually use the `<a>` elements in the list
    // to navigate to the new search, but we still want them to have
    // valid search URLs as `href` - that way, for example, users on iOS
    // can force-touch on the suggestions and already see a preview
    // of the SERP with the new results.
    getSuggestionUrl() {
      const redirectUrl = this.getContextValue('url');
      if (this.isNavigational && redirectUrl) {
        return redirectUrl;
      }
      // If the item is of type AI, we currently use the ai-search path.
      const path = this.isAiSuggestion ? AI_SEARCH_PATH : this.searchPath;
      try {
        const url = new URL(path, this.$config.searchUrl || 'https://ecosia.org');
        url.searchParams.set('q', this.suggestion);

        const overrides = getOverrides(this.$route?.query || {});
        overrides.forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });

        if (this.isAiSuggestion && this.origin) {
          url.searchParams.set(
            AI_SEARCH_ENTRY_POINT,
            AI_SEARCH_ORIGIN_PREFIX.concat(this.origin),
          );
        }

        return url.toString();
      } catch (err) {
        return '#';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.suggestion-item {
  display: flex;
  gap: $space-1s;
  flex-direction: row;
  padding-right: $space-m;
  padding-left: $space-1s;

  color: var(--color-text-primary);

  &.selected {
    a {
      color: var(--color-text-primary);
    }
  }

  &:hover,
  &:active,
  &.selected {
    background: var(--color-highlight-primary);
  }
}

.suggestion-item__image-container {
  display: flex;
  justify-content: center;
  min-width: $space-2l;
  height: $space-2l;
  margin: auto;
}

.suggestion-item__image {
  max-width: $space-2l;
  height: 100%;
}

.suggestion-item__icon {
  align-self: center;

  &--ai-search {
    color: var(--color-brand-primary);
  }
}

.suggestion-item__navigational {
  display: flex;
  justify-content: center;
  min-width: fit-content;
  margin: auto;

  img {
    display: none;
  }
}

.suggestion-link {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  padding: 0 $space-m;

  color: var(--color-text-primary);
  font-weight: $font-weight-700;
  line-height: $space-4l;
  text-decoration: none;

  cursor: pointer;

  &:hover,
  &:visited,
  &:active {
    color: var(--color-text-primary);
    text-decoration: none;
  }

  @include tablet {
    line-height: $space-3l;

    .suggestion-list--variant-medium & {
      padding-left: $space-m;
    }
  }
}

.suggestion-item--compact {
  gap: 0;

  .suggestion-link {
    padding-left: 0;
  }
}

.suggestion-link__content {
  display: flex;
  gap: $space-1s;
  // keep everything on one line
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  // allow children to shrink
  min-width: 0;
}

.suggestion-item__ai-badge {
  flex: 0 0 auto;
  flex-shrink: 0;
  order: 0;
  height: $space-1l;
  margin-left: $space-1s;
}

.suggestion-item .suggestion-link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: $space-4l;
  padding-right: 0;

  font-weight: initial;
  line-height: initial;

  @include tablet {
    height: $space-3l;

    line-height: initial;

    .suggestion-list--variant-medium & {
      padding-left: 0;
    }
  }
}

.suggestion-link__text {
  display: block;

  // Ensure long, unbroken text doesn't push the badge
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;

  font-weight: $font-weight-700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suggestion-link__description {
  color: var(--color-text-secondary);
}
</style>

<style lang="scss">
.suggestion-highlight {
  background: transparent;

  color: inherit;
  font-weight: $font-weight-400;
}

// needs to be not scoped to this component,
// because the description returned from the provider
// can contain HTML and image tags
.suggestion-link__description img {
  max-height: $icon-size-s;
  margin: auto;
}
</style>
