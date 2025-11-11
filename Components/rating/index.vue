<template>
  <data
    class="rating"
    :class="{'rating--variant-tripadvisor': variant === 'tripadvisor'}"
    :value="value"
    :aria-label="ariaLabel"
  >
    <div
      v-if="showValue"
      class="rating__value"
      data-test-id="rating-value"
    >
      {{ formattedValue }}
    </div>
    <div class="rating__stars" aria-hidden="true">
      <EIcon
        v-for="index in range"
        :key="index"
        :icon="getIcon(index)"
        size="s"
        class="rating__star"
        :data-test-id="`rating-${getIcon(index)}`"
      />
    </div>
    <div
      v-if="reviews"
      class="rating__reviews"
      data-test-id="rating-reviews"
      @click="$emit('reviews-click')"
    >
      <span v-if="parens">(</span>
      <ELink
        v-if="reviewsUrl"
        :color="reviewsLinkColor"
        :href="reviewsUrl"
        rel="noopener"
        :target="linkTarget"
        data-test-id="rating-reviews-link"
        class="rating-reviews__text"
      >
        {{ formattedReviews }}
      </ELink>
      <span
        v-else
        data-test-id="rating-reviews-text"
        class="rating-reviews__text"
      >
        {{ formattedReviews }}
      </span>
      <span v-if="parens">)</span>
    </div>
  </data>
</template>

<script>
import { mapState } from 'pinia';

import { localisePlainNumber } from '@ecosia/common-js/universal/intl.js';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

const max = 5;
const roundDecimal = 0.5;
const roundMultiplier = 1 / roundDecimal;
const icons = {
  '': 'star',
  'tripadvisor': 'tripadvisor-rating',
};

export default {
  name: 'ERating',
  components: {
    EIcon,
    ELink,
  },
  props: {
    /**
     * Whether to show parentheses
     */
    parens: {
      type: Boolean,
      default: true,
    },
    reviews: {
      type: Number,
      default: null,
    },
    reviewsLinkColor: {
      type: String,
      default: 'bare',
    },
    reviewsText: {
      type: Boolean,
      default: false,
    },
    reviewsUrl: {
      type: String,
      default: '',
    },
    showValue: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Number,
      required: true,
      validator: (value) => value <= max && value >= 0,
    },
    variant: {
      type: String,
      default: '',
      validator: (value) => Object.keys(icons).includes(value),
    },
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useUserStore, ['linkTarget']),
    range() {
      return Array.from(Array(max).keys(), (index) => index + 1);
    },
    rounded() {
      return Math.round(this.value * roundMultiplier) / roundMultiplier;
    },
    formattedValue() {
      const value = parseFloat(this.value.toFixed(1));

      // we want to force decimals for trip advisor ratings only
      if (this.variant === 'tripadvisor') {
        return localisePlainNumber(this.locale, value, { minimumFractionDigits: 1 });
      }
      return localisePlainNumber(this.locale, value) || value;
    },
    localisedReviews() {
      return localisePlainNumber(this.locale, this.reviews) || this.reviews;
    },
    translatedLocalisedReviews() {
      return this.$t('common.search.rating.reviews.text', { reviews: this.localisedReviews });
    },
    formattedReviews() {
      return this.reviewsText ? this.translatedLocalisedReviews : this.localisedReviews;
    },
    ariaLabel() {
      const { value } = this;
      const label = this.$t('common.search.rating.label', { value, max });
      return this.reviews ?
        `${label} (${this.translatedLocalisedReviews})` :
        label;
    },
  },
  methods: {
    getIcon(index) {
      const adjustedIndex = index - roundDecimal;
      const prefix = icons[this.variant];
      if (this.rounded < adjustedIndex) {
        return prefix;
      }
      if (this.rounded <= adjustedIndex) {
        return `${prefix}-half`;
      }
      return `${prefix}-fill`;
    },
  },
};
</script>

<style lang="scss" scoped>
$star-vertical-space: 2px;

.rating {
  display: flex;
  align-items: center;
  padding-top: $star-vertical-space;

  color: var(--color-text-secondary);
}

.rating__value {
  margin-right: $space-2s;
}

.rating__stars {
  display: flex;
  align-items: center;
  // makes the star align vertically to the baseline of
  // rating__value and rating__reviews text elements
  margin-top: -$star-vertical-space;
}

.rating__star {
  color: $c-red-30;
}

.rating__reviews {
  @extend %ellipsis;

  margin-left: $space-2s;
}

.rating-reviews__text {
  display: inline-flex;
}

.rating--variant-tripadvisor .rating__star {
  color: var(--color-tripadvisor-rating);
}
</style>
