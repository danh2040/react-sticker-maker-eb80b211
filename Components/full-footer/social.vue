<template>
  <div class="footer-social">
    <ul class="footer-social__list">
      <li
        v-for="item in menu"
        :key="item.key"
        class="footer-social__item"
      >
        <ELink
          :href="item.url"
          target="_blank"
          color="secondary"
          rel="noopener noreferrer"
          class="footer-social__link"
          data-test-id="footer-social__link"
          @click="onClick(item.url)"
        >
          <EIcon
            :icon="item.label"
            class="footer-social__icon"
          />
          <span class="sr-only">
            {{ item.label }}
          </span>
        </ELink>
      </li>
    </ul>
    <p
      v-safe-html="$t('common.footer.legal')"
      class="footer-social__legal"
    />
  </div>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

export default {
  name: 'EFooterSocial',
  components: {
    EIcon,
    ELink,
  },
  props: {
    menu: {
      required: true,
      type: Array,
    },
  },
  methods: {
    onClick(url) {
      sendCoreAnalyticsEvent('footerSocialLinkClicked', { url });
    },
  },
};
</script>

<style lang="scss">
$disclaimer-max-width: 736px;
$icon-size: 36px;

.footer-social {
  display: block;
  margin: 0 auto;
  padding: $space-3l 0 0;

  border-top: 1px solid var(--color-decorative-border-1);

  text-align: center;
}

.footer-social__list {
  display: flex;
  justify-content: center;
  height: $icon-size;
  margin: 0;
  padding: 0;

  list-style: none;
}

.footer-social__link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $icon-size;
  height: $icon-size;
}

.footer-social__item:not(:last-of-type) {
  margin-right: $space-1s;

  @include desktop {
    margin-right: $space-m;
  }
}

.footer-social__icon {
  transform: scale($scale-4l);
}

.footer-social__legal {
  max-width: $disclaimer-max-width;
  margin: $space-2l auto 0;

  color: var(--color-text-secondary);
  font-family: $family;
  font-size: $font-s;
  font-weight: $font-weight-400;
  text-align: center;

  a {
    color: var(--color-link-primary);
    text-decoration: underline;
  }
}
</style>
