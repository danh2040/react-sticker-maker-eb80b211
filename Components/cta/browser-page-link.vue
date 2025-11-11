<template>
  <ELink
    class="cta__link"
    :href="$config.browserUrl"
    :color="linkColorVariant"
    data-test-id="cta-link-to-browser-page"
    @click="onBrowserPageLink"
  >
    {{ $t('common.install.cta.linktobrowserpage') }}
  </ELink>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

export default {
  name: 'EBrowserPageLink',
  components: {
    ELink,
  },
  props: {
    linkColorVariant: {
      type: String,
      default: 'primary',
    },
    positionTracking: {
      type: String,
      required: true,
    },
  },
  methods: {
    onBrowserPageLink() {
      sendCoreAnalyticsEvent('ctaBrowserInstall', this.positionTracking);
    },
  },
};
</script>

<style lang="scss" scoped>
.cta__link {
  font-size: $font-m;
}
</style>
