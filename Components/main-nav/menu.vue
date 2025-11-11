<template>
  <div :class="classNames">
    <EMainNavImpactProfile
      v-if="isImpactExperimentEnabled && shouldShowAccountsFeatures"
      class="main-nav-menu__impact-profile"
    />
    <div class="main-nav-menu__links">
      <EMenuLinks :is-signed-in="isSignedIn" :is-impact-experiment-enabled="isImpactExperimentEnabled" />
      <EMainNavMenuSignInOutButton
        v-if="shouldShowSignInOutButton"
        class="main-nav-menu__sign-in-out-button"
        :is-signed-in="isSignedIn"
      />
      <div class="main-nav-menu__footer-links">
        <ELink
          v-for="link in footerLinks"
          :key="link.key"
          :href="link.url"
          rel="noopener"
          :data-test-id="`main-nav-footer-link-${link.key}`"
          @click="onMenuLinkClick(link.url)"
        >
          {{ $t(`common.header.menu.${link.key}`) }}
        </ELink>
        <ELink
          v-show="showFeedbackLink"
          data-test-id="main-nav-feedback-link"
          @click="onFeedbackClick"
        >
          {{ $t('common.footer.feedback') }}
        </ELink>
      </div>
    </div>
  </div>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getMainMenuFooterLinks } from '@ecosia/common-js/universal/menus.js';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

import EMainNavImpactProfile from './impact-profile/index.vue';
import EMenuLinks from './menu-links.vue';
import EMainNavMenuSignInOutButton from './sign-in-out-button.vue';

export default {
  name: 'EMainNavMenu',
  components: {
    EMenuLinks,
    ELink,
    EMainNavImpactProfile,
    EMainNavMenuSignInOutButton,
  },
  props: {
    isAccountsEnabled: {
      type: Boolean,
      default: false,
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    isImpactExperimentEnabled: {
      type: Boolean,
      default: false,
    },
    showFeedbackLink: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classNames() {
      return {
        'main-nav-menu': true,
        'main-nav-menu--with-impact-counter': this.isImpactExperimentEnabled,
      };
    },
    footerLinks() {
      return getMainMenuFooterLinks(this.$config.baseUrl);
    },
    shouldShowSignInOutButton() {
      if (this.isImpactExperimentEnabled) {
        return this.isSignedIn && this.shouldShowAccountsFeatures;
      }

      return this.shouldShowAccountsFeatures;
    },
    shouldShowAccountsFeatures() {
      return this.isAccountsEnabled;
    },
  },
  methods: {
    onMenuLinkClick(href) {
      sendCoreAnalyticsEvent('menuNavMenuClicked', {
        href,
      });
    },
    onFeedbackClick() {
      this.$emit('open-feedback-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
.main-nav-menu {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;

  color: var(--color-text-primary);
  font-size: $font-m;
}

.main-nav-menu__links {
  padding: $space-s $space-m;
  padding-top: $space-4l;

  .list-item:not(&__title) {
    padding: 0;
  }

  @include tablet {
    padding: $space-m;
  }

  .main-nav-menu--with-impact-counter & {
    padding-top: $space-s;
  }
}

.main-nav-menu__sign-in-out-button {
  width: 100%;
  margin-bottom: $space-m;
}

.main-nav-menu__footer-links {
  display: flex;
  gap: $space-l;
  justify-content: center;
  padding-block: $space-m;
}
</style>
