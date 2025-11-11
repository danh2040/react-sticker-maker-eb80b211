<template>
  <div class="footer-menu">
    <h2 class="footer-menu__title">
      {{ $t(`common.footer.${titleKey}`) }}
    </h2>
    <slot name="default">
      <ul>
        <li
          v-for="item in items"
          :key="item.key"
          class="footer-menu__link"
        >
          <ELink
            color="secondary"
            :data-test-id="titleKey"
            :href="item.url"
            rel="noopener"
            @click="onClick(item.url)"
          >
            {{ $t(`common.footer.${item.key}`) }}
          </ELink>
        </li>
        <li
          v-if="!!$slots.extra"
          class="footer-menu__link"
        >
          <slot name="extra" />
        </li>
      </ul>
    </slot>
  </div>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

export default {
  name: 'EFooterMenu',
  components: {
    ELink,
  },
  props: {
    items: {
      required: false,
      type: Array,
      default: () => [],
    },
    titleKey: {
      required: true,
      type: String,
    },
  },
  methods: {
    onClick(url) {
      sendCoreAnalyticsEvent('footerLinkClicked', { url });
    },
  },
};
</script>

<style lang="scss">
.footer-menu {
  color: var(--color-text-secondary);
  font-family: $family;
  white-space: nowrap;

  ul {
    margin: 0;
    padding: 0;

    font-size: $font-m;
    list-style: none;
  }
}

.footer-menu__link {
  margin-bottom: $space-m;

  &:last-child {
    margin-bottom: 0;
  }
}

.footer-menu__title {
  margin-top: $space-3l;
  margin-bottom: $space-m;

  font-size: $font-l;
  font-weight: $font-weight-700;
  text-transform: uppercase;

  @include desktop {
    margin-top: 0;
  }
}
</style>
