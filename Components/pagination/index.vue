<template>
  <nav
    v-if="pages > 1"
    :class="classes"
    :aria-label="$t('rebrand.common.pagination.heading')"
  >
    <div class="pagination__control">
      <EPaginationControl
        v-if="!isFirst"
        v-bind="getControlProps('previous')"
        @click="onClick(previous)"
      />
    </div>
    <div class="pagination__pages">
      <template v-for="page in shownPages">
        <EButton
          v-if="page !== current"
          :key="page"
          variant="bare"
          v-bind="getPageProps(page)"
          @click="onClick(page)"
        >
          <span class="pagination__page-label">
            <span class="pagination__page-text">
              {{ $t('common.pagination.page') }}
            </span>
            {{ formatPage(page) }}
          </span>
        </EButton>
        <div
          v-else
          :key="page"
          class="pagination__page pagination__page--current"
          :aria-label="getPageAriaLabel(page)"
          data-test-id="pagination-current"
          aria-current="page"
        >
          <span class="pagination__page-label">
            <span class="pagination__current-text">
              {{ $t('common.pagination.page') }}
            </span>
            {{ formatPage(page) }}
          </span>
        </div>
      </template>
    </div>
    <div class="pagination__control">
      <EPaginationControl
        v-if="!isLast"
        v-bind="getControlProps('next')"
        @click="onClick(next)"
      />
    </div>
  </nav>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

import { isNaturalNumber, isPositiveNumber } from '@ecosia/universal/validators.js';

import EPaginationControl from './control.vue';

const firstIndex = 0;

export const MAX_SHOWN_PAGES = 5;
export const invalidCurrentError = 'Current page cannot be higher or equal than pages.';

export default {
  name: 'EPagination',
  components: {
    EButton,
    EPaginationControl,
  },
  mixins: [classes],
  props: {
    /**
     * 0-based index
     */
    current: {
      type: Number,
      required: true,
      validator: isNaturalNumber,
    },
    pages: {
      type: Number,
      required: true,
      validator: isPositiveNumber,
    },
  },
  computed: {
    isFirst() {
      return this.current === firstIndex;
    },
    isLast() {
      return this.current === this.pages - 1;
    },
    next() {
      return this.current + 1;
    },
    previous() {
      return this.current - 1;
    },
    formattedCurrent() {
      return this.current + 1;
    },
    shownPages() {
      const min = 0;
      const max = this.pages;
      const length = Math.min(max, MAX_SHOWN_PAGES);

      let start = this.current - Math.floor(length / 2);
      start = Math.max(start, min);
      start = Math.min(start, min + max - length);
      return Array.from({ length }, (value, index) => index + start);
    },
  },
  created() {
    const valid = ['current', 'pages'].every((prop) => this.$options.props[prop].validator(this[prop]));
    if (valid && this.current > this.pages - 1) {
      console.error(invalidCurrentError);
    }
  },
  methods: {
    getControlProps(label) {
      const isPrevious = label === 'previous';
      const page = isPrevious ? this.previous : this.next;
      return {
        ...this.getLinkProps(page),
        'aria-label': this.$t(`common.pagination.${label}`),
        'data-test-id': `pagination-control-${label}`,
        'side': isPrevious ? 'left' : 'right',
      };
    },
    getPageProps(page) {
      return {
        ...this.getLinkProps(page),
        'aria-label': this.getPageAriaLabel(page),
        'data-test-id': 'pagination-page',
        'class': 'pagination__page',
      };
    },
    getLinkProps(page) {
      const query = { ...this.$route.query, p: page };
      const resolvedQuery = this.$router.resolve({ query });
      return {
        as: 'a',
        href: resolvedQuery.href,
      };
    },
    getPageAriaLabel(page) {
      return `${this.$t('common.pagination.page')} ${this.formatPage(page)}`;
    },
    onClick(page) {
      this.$emit('page', page);
    },
    formatPage(page) {
      return page + 1;
    },
  },
};
</script>

<style lang="scss" scoped>
$control-size: $space-3l;

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 320px;
  margin-right: auto;
  margin-left: auto;

  font-size: $font-m;

  @include desktop {
    justify-content: center;
    max-width: none;
  }
}

.pagination__control {
  width: $control-size;
  height: $control-size;
}

.pagination__pages {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding-right: $space-1s;
  padding-left: $space-1s;

  text-align: center;

  @include desktop {
    flex-grow: 0;
  }
}

.pagination__page {
  margin-right: $space-l;
  padding: ($space-s + 1) $space-s $space-s;

  font-size: $font-l;
  line-height: $line-height-m;

  &:not(.pagination__page--current) {
    display: none;

    @include desktop {
      display: inline-flex;
    }

    // Minimum tapable area
    &::before {
      content: '';

      position: absolute;
      min-width: $tappable-area-size-mobile;
      min-height: $tappable-area-size-mobile;
    }
  }
}

.pagination__page:last-child {
  margin-right: 0;
}

.pagination__page--current {
  position: relative;
  flex-grow: 1;
  min-width: 0;

  @include desktop {
    flex-grow: 0;
    min-width: min-content;
    overflow: visible;

    color: var(--color-button-content-secondary);
    font-weight: $font-weight-700;
  }

  // highlight style
  .pagination__page-label::after {
    @include desktop {
      content: "";

      position: absolute;
      z-index: 1;
      right: 0;
      bottom: 0;
      left: 0;
      height: $space-2s;

      border-radius: $border-radius-full;

      background: var(--color-brand-primary);
    }
  }
}

.pagination__page-text {
  @extend %sr-only;
}

.pagination__current-text {
  @include desktop {
    // sr-only, could not extend it inside a media query
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(0 100% 100% 0);

    border: 0;

    white-space: nowrap;
  }
}
</style>
