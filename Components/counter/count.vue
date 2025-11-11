<template>
  <div v-if="count" class="count notranslate">
    <div
      v-if="unit"
      class="count__digit"
      data-test-id="count-unit"
    >
      {{ unit }}
    </div>
    <div
      v-for="(digit, index) in digits"
      :key="index"
      :class="`count__digit--digit-${digit}`"
      class="count__digit"
      data-test-id="count-digit"
      aria-hidden="true"
    >
      <div class="count__inner">
        <div
          v-for="tenth in range"
          :key="`${digit}-${tenth}`"
          class="count__number"
          data-test-id="count-number"
        >
          {{ tenth }}{{ shouldShowSeparator(index) ? separator : '' }}
        </div>
      </div>
    </div>
    <span class="count__raw" data-test-id="count-raw">{{ count }}</span>
  </div>
</template>

<script>
import { getNumberSeparator } from '@ecosia/common-js/universal/utils.js';

import { isPositiveNumber } from '@ecosia/universal/validators.js';

export default {
  name: 'ECount',
  props: {
    count: {
      type: Number,
      required: true,
      validator: isPositiveNumber,
    },
    locale: {
      type: String,
      default: 'en',
    },
    unit: {
      type: String,
      default: '',
    },
  },
  computed: {
    digits() {
      return this.count.toString().split('');
    },
    range() {
      return Array.from(Array(10).keys()).reverse();
    },
  },
  created() {
    this.separator = getNumberSeparator(this.locale);
  },
  methods: {
    shouldShowSeparator(index) {
      // We need to check every fourth number to put the separator on its right
      // But we are counting right to left so we need to invert the index
      const invertedIndex = this.digits.length - index;
      return invertedIndex % 3 === 1 && invertedIndex > 1;
    },
  },
};
</script>

<style lang="scss" scoped>
$height: $space-4l;
$descender-compensation: $space-2s;

.count {
  --counter-digit-height: #{$height};

  font-family: $family-brand;

  &__digit {
    display: inline-block;
    height: calc(var(--counter-digit-height) + #{$descender-compensation});
    overflow: hidden;

    color: var(--color-brand-secondary);
    font-size: var(--counter-digit-height);
    font-weight: $font-weight-500;
    letter-spacing: -0.5px;
    // Non-standard line-height required for proper counter animation rendering.
    line-height: var(--counter-digit-height);

    @include tablet {
      height: calc(var(--counter-digit-height) + #{$descender-compensation});

      font-size: var(--counter-digit-height);
      // Non-standard line-height required for proper counter animation rendering.
      line-height: var(--counter-digit-height);
    }

    &:last-of-type::before {
      display: none;
    }
  }

  &__inner {
    display: flex;
    flex-direction: column;

    transition: transform $timing-s $easing;
  }

  @for $number from 0 through 9 {
    &__digit--digit-#{$number} {
      .count__inner {
        transform: translateY(-(9 - $number) * 10%);
      }
    }
  }

  &__raw {
    @extend %sr-only;
  }
}
</style>
