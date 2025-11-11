<template>
  <ELink
    v-if="os"
    target="_blank"
    rel="noopener"
    :href="href"
    @click="onClick(href)"
  >
    <component
      :is="badge"
      :aria-labelledby="labelId"
      data-test-id="mobile-badge"
    />
    <span
      :id="labelId"
      class="sr-only"
    >
      {{ title }}
    </span>
  </ELink>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getAppUrl } from '@ecosia/common-js/universal/url-utils.js';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

import { IOS, mobileOs } from '@ecosia/constants/browsers.js';
import { DEFAULT_LOCALE, locales } from '@ecosia/constants/i18n';

export default {
  name: 'EMobileBadge',
  components: {
    ELink,
  },
  props: {
    locale: {
      default: DEFAULT_LOCALE,
      type: String,
      validator: (value) => locales.includes(value),
    },
    os: {
      required: true,
      type: String,
      validator: (value) => mobileOs.includes(value),
    },
  },
  data() {
    return {
      labelId: '',
    };
  },
  computed: {
    badge() {
      const store = this.store.toLowerCase();
      return async () => (await import(
        `../../assets/mobile-badges/${store}-store-${this.locale}.svg`
      )).default;
    },
    href() {
      return getAppUrl(this.os, this.locale);
    },
    store() {
      return this.os === IOS ? 'App' : 'Play';
    },
    title() {
      return `${this.store} store download`;
    },
  },
  mounted() {
    this.labelId = this.$id('mobile-badge').toString();
  },
  methods: {
    onClick(url) {
      sendCoreAnalyticsEvent('footerMobileBadgeClicked', { url });
    },
  },
};
</script>
