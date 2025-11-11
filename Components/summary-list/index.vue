<template>
  <ul class="summary-list">
    <li
      v-for="item in items"
      :key="item.id"
      class="summary-list__row"
      :class="{ 'summary-list__row--has-link': item.link }"
      data-test-id="summary-list-row"
    >
      <span class="summary-list__info">
        <span class="summary-list__label-wrapper">
          <h2
            class="summary-list__label"
            data-test-id="summary-list-row-info-label"
          >
            {{ item.label }}
          </h2>
          <p
            v-if="item.hint"
            class="summary-list__hint"
            data-test-id="summary-list-row-info-hint"
          >
            {{ item.hint }}
          </p>
        </span>
        <p
          class="summary-list__value"
          data-test-id="summary-list-row-info-value"
        >
          {{ item.value }}
        </p>
      </span>
      <a
        v-if="item.link"
        :href="item.link.url"
        class="summary-list__link"
        data-test-id="summary-list-row-link"
      >
        <span class="sr-only">{{ item.link.text }}</span>
        <EIcon icon="chevron-right" size="s" aria-hidden="true" />
      </a>
    </li>
  </ul>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

export default {
  name: 'ESummaryList',
  components: {
    EIcon,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.summary-list {
  margin: 0;
  padding: 0;
  overflow: hidden;

  border-radius: $border-radius-l;

  background-color: var(--color-background-secondary);
}

.summary-list__row {
  display: flex;
  position: relative;
  padding: $space-s;

  border-bottom: $border-width solid var(--color-decorative-border-1);

  list-style: none;

  &:last-child {
    border-bottom: none;
  }
}

.summary-list__row--has-link:hover,
.summary-list__row--has-link:active {
  background-color: $transparent-green-32;
}

.summary-list__label-wrapper {
  display: block;
  margin-bottom: $space-1s;
}

.summary-list__label,
.summary-list__value {
  margin: 0;
  padding: 0;

  font-size: $font-l;
}

.summary-list__label {
  font-weight: $font-weight-700;
}

.summary-list__hint {
  margin: 0;

  color: var(--color-text-secondary);
  font-size: $font-s;
}

.summary-list__link {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: flex-end;
  padding: $space-1l;

  &:focus {
    @extend %keyboard-nav-focus-in;
  }
}
</style>
