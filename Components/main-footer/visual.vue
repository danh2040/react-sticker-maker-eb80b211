<template>
  <div class="main-footer-visual">
    <div class="main-footer-visual__content">
      <div v-if="showCards" class="main-footer-visual__cards">
        <EFooterCard
          v-for="card in cards"
          :key="card.id"
          :image-tag="card.imageTag"
          :image-url="card.imageUrl"
          :url="card.url"
          :title="card.title"
          :link-text="card.linkText"
          :data-test-id="`main-footer-card-${card.id}`"
          v-on="{ ...$listeners, ...userEngagementListeners(card) }"
        />
      </div>
      <!--
        Warning: due to hydration issues the `loading` attribute
        must be above the `src` attribute. See /docs/frontend/VueImageLazyLoading.md
      -->
      <picture class="main-footer-visual__background">
        <source
          media="(min-width: 1080px)"
          srcset="../../assets/images/footer-leaves-2880.avif 2880w, ../../assets/images/footer-leaves-1920.avif 1920w"
          sizes="100vw"
          type="image/avif"
        >
        <source
          media="(min-width: 768px)"
          srcset="../../assets/images/footer-leaves-1920.avif 1920w, ../../assets/images/footer-leaves-960.avif 960w"
          sizes="100vw"
          type="image/avif"
        >
        <source
          srcset="../../assets/images/footer-leaves-960.avif 960w"
          sizes="100vw"
          type="image/avif"
        >
        <img
          class="main-footer-visual__background-image"
          loading="lazy"
          src="../../assets/images/footer-leaves.jpg"
          alt="background_image"
        >
      </picture>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia';

import { getFinancialReportURL, getTreeUpdatesURL } from '@ecosia/common-js/universal/url-utils.js';
import EFooterCard from '@ecosia/common-vue2/components/footer-card/index.vue';

import { useUserEngagementStore } from '@ecosia/user-engagement-client2/user-engagement.store.js';

export default {
  components: {
    EFooterCard,
  },
  props: {
    showCards: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState(useUserEngagementStore, [
      'enabled',
      'cardsError',
      'footerCards',
    ]),

    useUserEngagementCards() {
      // UE module may not be installed and enabled
      // depending on the app that renders this component
      if (!this.$pinia?.state.value.userEngagement) {
        return false;
      }

      return this.enabled && !this.cardsError;
    },
    cards() {
      return this.useUserEngagementCards ?
        this.footerCards :
        this.defaultCards;
    },
    defaultCards() {
      return [{
        id: 'financialreports',
        imageTag: 'financialreports',
        url: getFinancialReportURL(this.locale),
        title: this.$t('common.footer.card.financialreports.title'),
        linkText: this.$t('common.footer.card.financialreports.link'),
      }, {
        id: 'treeupdates',
        imageTag: 'treeupdates',
        url: getTreeUpdatesURL(this.locale),
        title: this.$t('common.footer.card.treeupdates.title'),
        linkText: this.$t('common.footer.card.treeupdates.link'),
      }];
    },
  },
  methods: {
    userEngagementListeners(card) {
      return this.useUserEngagementCards && this.$trackUserEngagementCardEvent ?
          {
            click: () => this.$trackUserEngagementCardEvent('click', card),
            impression: () => this.$trackUserEngagementCardEvent('impression', card),
          } :
          {};
    },
  },
};
</script>

<style lang="scss" scoped>
.main-footer-visual__content {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 384px;

  background-color: var(--color-background-featured-static);

  @include tablet {
    height: 224px;
  }

  @include desktop {
    padding-top: 0;
  }

  &::before {
    content: '';

    position: absolute;
    width: 100%;
    height: $space-3l;

    border-bottom-right-radius: $border-radius-2l;
    border-bottom-left-radius: $border-radius-2l;

    background-color: var(--color-background-primary);
  }
}

.main-footer-visual__cards {
  display: flex;
  position: absolute;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  height: 100%;

  @include tablet {
    bottom: $space-3l;
    flex-wrap: unset;
    height: initial;
    margin: 0 $space-l;
  }

  @include desktop {
    left: $space-1l;
    margin: 0;
  }
}

.main-footer-visual__background {
  width: 100%;
  height: 100%;
}

.main-footer-visual__background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left bottom;
}
</style>
