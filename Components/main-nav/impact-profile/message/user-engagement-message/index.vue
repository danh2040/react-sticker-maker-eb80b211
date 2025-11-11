<template>
  <EMainNavImpactProfileImageMessageWrapper
    v-intersect="onIntersect"
    :close-button-aria-label="$t('common.header.menu.impact.messages.userengagement.button.close')"
    :link-text="card.linkText"
    :link-url="card.url"
    @link-click="onLinkClick"
    @close="onClose"
  >
    <template v-if="card.imageUrl" #image>
      <!--
        Warning: due to hydration issues the `loading` attribute
        must be above the `src` attribute. See /docs/frontend/VueImageLazyLoading.md

        We're also assuming no one in Braze will author an image description and
        this will be a presentational image so we'll give it a empty alt to hide
        it from user using assistive technologies
      -->
      <img
        loading="lazy"
        :src="card.imageUrl"
        alt=""
        data-test-id="user-engagement-message-image"
      >
    </template>

    <h4
      v-if="card.title"
      data-test-id="user-engagement-message-title"
    >
      {{ card.title }}
    </h4>
    <p data-test-id="user-engagement-message-text">
      {{ card.description }}
    </p>
  </EMainNavImpactProfileImageMessageWrapper>
</template>

<script>
import '@ecosia/common-vue2/directives/intersect.js';

import { mapState } from 'pinia';

import { useUserEngagementStore } from '@ecosia/user-engagement-client2/user-engagement.store.js';

import EMainNavImpactProfileImageMessageWrapper from '../image-message-wrapper.vue';

export default {
  name: 'EMainNavImpactProfileUserEngagementMessage',
  components: {
    EMainNavImpactProfileImageMessageWrapper,
  },
  props: {
    card: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState(useUserEngagementStore, [
      'enabled',
      'cardsError',
    ]),
    useUserEngagementCards() {
      // UE module may not be installed and enabled
      // depending on the app that renders this component
      if (!this.$pinia?.state.value.userEngagement) {
        return false;
      }

      return this.enabled && !this.cardsError;
    },
  },
  methods: {
    onClose() {
      this.$emit('dismiss-message');
    },
    onLinkClick() {
      if (this.useUserEngagementCards && this.$trackUserEngagementCardEvent) {
        this.$trackUserEngagementCardEvent('click', this.card);
      }
    },
    onIntersect() {
      this.$emit('impression');

      if (this.useUserEngagementCards && this.$trackUserEngagementCardEvent) {
        this.$trackUserEngagementCardEvent('impression', this.card);
      }
    },
  },
};
</script>
