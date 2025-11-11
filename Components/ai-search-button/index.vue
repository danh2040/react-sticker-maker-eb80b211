<template>
  <EButton
    as="a"
    icon="twinkle"
    icon-size="s"
    class="ai-search-button"
    :href="url"
    data-test-id="ai-search-button"
    variant="solid-white"
    :tooltip-text="tooltipText"
    @click.prevent="onClick"
  >
    <template v-if="isDesktopUp">
      {{ aiSearchLabel }}
    </template>
  </EButton>
</template>

<script>

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import screen from '@ecosia/common-vue2/mixins/screen.js';

export default {
  name: 'EAISearchButton',
  components: {
    EButton,
  },
  mixins: [screen],
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  computed: {
    aiSearchLabel() {
      return this.$t('common.header.verticals.ai_search');
    },
    tooltipText() {
      return this.isDesktopUp ? '' : this.aiSearchLabel;
    },
  },
  methods: {
    onClick() {
      sendCoreAnalyticsEvent('aiSearchButtonClick');

      setTimeout(() => {
        window.location.href = this.url;
      }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.ai-search-button {
  margin-right: $space-1s;
}
</style>
