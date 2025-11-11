<template>
  <div :class="classes">
    <ECounter
      v-if="!hideTreeCounter"
      :count="counts.tree"
      :description="$t('common.counter.trees')"
      :with-transition="withTransition"
      :image-size="imageSize"
      image="tree"
      data-test-id="tree-counter"
    />
    <div
      v-if="!hideTreeCounter && !alwaysVertical"
      class="global-counter__divider"
      aria-hidden="true"
    />
    <ECounter
      :count="counts.investments"
      :description="$t('common.counter.investments')"
      :with-transition="withTransition"
      :image-size="imageSize"
      image="money"
      data-test-id="investments-counter"
    />
  </div>
</template>

<script>
import { mapState } from 'pinia';

import { formatCurrency, formatNumber } from '@ecosia/common-js/universal/intl.js';
import { investmentProjection, treesProjection } from '@ecosia/common-js/universal/projection.js';
import ECounter from '@ecosia/common-vue2/components/counter/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

import { useGlobalStore } from '@ecosia/store/global/index.js';

export default {
  name: 'EGlobalCounter',
  components: {
    ECounter,
  },
  mixins: [classes],
  props: {
    hideTreeCounter: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    glass: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    imageSize: {
      type: String,
      default: 's',
      validator: (size) => ['s', 'm', 'l'].includes(size),
    },
    alwaysVertical: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    withTransition: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    withBorder: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    counts() {
      return {
        investments: formatCurrency(investmentProjection(new Date()), this.locale),
        tree: formatNumber(treesProjection(), this.locale),
      };
    },
  },
};
</script>

<style lang="scss" scoped>

.global-counter {
  display: flex;
  flex-direction: column;

  border: none;
  border-radius: $border-radius-l;

  background: var(--color-background-elevation-1);

  @include tablet {
    flex-direction: row;
  }
}

.global-counter__divider {
  position: relative;
  flex: 0 0 auto;
  // Horizontal rule for all stacked widths (< tablet)
  width: calc(100% - 32px); // 16px inset on both sides
  height: $border-width;
  margin: 0 $space-m;

  border: none;

  background: transparent;

  pointer-events: none;

  &::after {
    content: '';

    position: absolute;
    inset: 0;

    background: var(--color-decorative-border-1);
  }
}

.global-counter--always-vertical {
  flex-direction: column;
  width: 100%;

  border: none;

  .counter__description {
    text-align: left;
  }
}

.global-counter--glass {
  border: none;

  background: var(--color-background-glass);

  backdrop-filter: blur(24px);

  .global-counter__divider {
    background: transparent;

    &::after {
      background: var(--color-border-glass-static);
    }
  }

  ::v-deep .counter__description {
    color: var(--color-text-static-light);
  }

  ::v-deep .counter {
    color: var(--color-text-static-light);
  }
}

.global-counter--with-border {
  border: $border-width solid var(--color-decorative-border-1);
}

.global-counter--glass.global-counter--with-border {
  border: $border-width solid var(--color-border-glass-static);
}

@include tablet {
  .global-counter__divider {
    // Switch to vertical bar when layout becomes row
    width: $border-width;
    height: 48px;
    margin: $space-m 0;

    &::after {
      inset: 0;

      background: var(--color-decorative-border-1);
    }
  }
}

.global-counter--with-transition {
  @include class-opacity-transition('global-counter--with-transition');
}

</style>
