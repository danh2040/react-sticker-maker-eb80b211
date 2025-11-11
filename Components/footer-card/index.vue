<template>
  <ECard
    v-intersect="onIntersect"
    :as="as"
    class="footer-card"
    data-test-id="footer-card"
    :href="url"
    target="_blank"
    rel="noopener"
    :border="true"
    @click="onClick"
  >
    <img
      v-if="imageUrl"
      :src="imageUrl"
      class="footer-card__illustration"
      aria-hidden="true"
      width="72"
      height="72"
      data-test-id="footer-card-illustration-custom"
    >
    <!--
      Warning: due to hydration issues the `loading` attribute
      must be above the `src` attribute. See /docs/frontend/VueImageLazyLoading.md
    -->
    <img
      v-else
      loading="lazy"
      :src="illustrationURL"
      class="footer-card__illustration"
      :data-test-id="`footer-card-illustration-${imageTag}`"
      aria-hidden="true"
    >
    <div class="footer-card__body">
      <div
        class="footer-card__title"
        data-test-id="footer-card-title"
      >
        {{ title }}
      </div>
      <p v-if="bodyText" data-test-id="footer-card-body-text">
        {{ bodyText }}
      </p>
      <ELink
        as="button"
        color="primary"
        class="footer-card__link"
        data-test-id="footer-card-link"
        :href="url"
        target="_blank"
        rel="noopener"
        tabindex="-1"
        @click.stop="onClick"
      >
        {{ linkText }}
      </ELink>
    </div>
  </ECard>
</template>

<script>
import '@ecosia/common-vue2/directives/intersect.js';

import ChatSearch from '@ecosia/common-vue2/assets/images/ai-chat-illustration.as-path.svg';
import FinancialReports from '@ecosia/common-vue2/assets/images/footer-card-financialreports-illustration.as-path.svg';
import TreeUpdates from '@ecosia/common-vue2/assets/images/footer-card-treeupdates-illustration.as-path.svg';
import ECard from '@ecosia/common-vue2/components/card/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

export default {
  name: 'EFooterCard',
  components: {
    ECard,
    ELink,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    linkText: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imageTag: {
      type: String,
      default: '',
    },
    bodyText: {
      type: String,
      default: '',
    },
  },
  computed: {
    illustrationURL() {
      switch (this.imageTag) {
        case 'financialreports':
          return FinancialReports;
        case 'search-chat':
          return ChatSearch;
        case 'treeupdates':
        default:
          return TreeUpdates;
      }
    },
    as() {
      return this.url ? 'a' : 'div';
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
    onIntersect() {
      this.$emit('impression');
    },
  },
};
</script>

<style lang="scss" scoped>
.footer-card {
  display: flex;
  place-self: center;
  align-self: stretch;
  width: 100%;
  margin: 0 $space-s $space-m;

  background: var(--color-background-primary);

  @include tablet {
    margin: $space-m;
    margin-left: 0;

    &:last-child {
      margin-right: 0;
    }
  }

  @include desktop {
    max-width: 400px;
    margin: 0;
    margin-right: $space-m;
  }
}

.footer-card__body {
  margin: $space-m;
  margin-left: 0;

  @include tablet {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.footer-card__title {
  color: var(--color-text-primary);
  font-size: $font-l;
  font-weight: $font-weight-700;
}

.footer-card__link {
  display: inline-flex;
  margin-top: $space-2s;

  font-size: $font-m;
}

.footer-card__illustration {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  margin: $space-m;
}

/* stylelint-disable no-duplicate-selectors */
.footer-card {
  &:hover,
  &:focus {
    .footer-card__link {
      text-decoration: underline;
    }
  }
}
/* stylelint-enable no-duplicate-selectors */
</style>
