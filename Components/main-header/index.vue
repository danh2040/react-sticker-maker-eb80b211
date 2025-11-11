<template>
  <div
    :class="[classes, adjustedHeader]"
    data-test-id="main-header-content"
  >
    <template
      v-if="featureEnabled('notifications')"
    >
      <ENotificationBanner />
    </template>
    <header
      class="main-header__content"
      aria-label="Main header"
      data-test-id="main-header-content"
    >
      <div
        class="main-header__navigation"
      >
        <div v-if="featureEnabled('logo')" class="main-header__logo-wrapper">
          <div class="main-header__logo">
            <slot name="logo">
              <ELogo
                :href="logoUrl"
                :padding="false"
                class="main-header__logo-link"
                data-test-id="main-header-logo"
              />
            </slot>
          </div>
        </div>
        <ESearchForm
          v-if="searchEnabled && !isCompact"
          class="main-header__search"
          :aria-label="$t('common.search.searchbox.label')"
          :placeholder="$t('common.search.searchbox.placeholder')"
          :market="market"
          :action="searchUrl"
          :autocomplete-url="autocompleteUrl"
          :disable-overlay="searchDisableOverlay"
          :has-auto-focus="searchAutoFocus"
          :hidden-inputs="searchHiddenInputs"
          :origin="searchOrigin"
          prefill-query
          data-test-id="main-header-search-form"
          @input-focused="trackSearchBarClick()"
          @search-icon-click="$emit('search-icon-click')"
        />
        <div
          v-if="$slots.navigation && isCompact"
          class="main-header__search-navigation"
          data-test-id="compact-layout-search-navigation"
        >
          <slot name="navigation" />
        </div>
        <div class="main-header__space" />
        <transition name="fade-cta">
          <div v-if="shouldDisplayCTA" class="main-header__install-cta">
            <slot name="cta">
              <ECta
                position-tracking="header"
                size="m"
                data-test-id="main-header-install-cta"
                :custom-target="roundedLayout"
              />
            </slot>
          </div>
        </transition>
        <EMainHeaderSignUpButton
          v-if="shouldDisplaySignUpButton"
          :is-a-cta-component-visible="isACtaComponentVisible"
          class="main-header__sign-up-button"
        />
        <div
          class="main-header__sign-up-button-placeholder"
          data-test-id="main-header-sign-up-button-placeholder"
        />
        <slot name="ai-search-button" />
        <ENotifications
          v-if="featureEnabled('notifications') && isDesktopUp"
          class="main-header__notifications"
          :class="{'--notifications': isNotificationVisible}"
          :blog-url="blogUrl"
          :read-more-label="$t('common.header.notifications.readmore')"
          @visibility-change="onNotificationsVisibilityChange"
        />
        <EMainNav
          class="main-header__nav"
          panel-side="right"
          :show-feedback-link="showFeedbackLink"
          :enable-impact-experiment="enableImpactExperiment"
          @open-feedback-modal="onOpenFeedbackModal"
        />
      </div>
      <div v-if="$slots.navigation && !isCompact" class="main-header__search-navigation">
        <slot name="navigation" />
      </div>
    </header>
  </div>
</template>

<script>
// TODO: translate aria-label on .main-header__content
import { mapState } from 'pinia';

import { getBlogURL } from '@ecosia/common-js/universal/url-utils.js';
import ECta from '@ecosia/common-vue2/components/cta/index.vue';
import ELogo from '@ecosia/common-vue2/components/logo/index.vue';
import EMainNav from '@ecosia/common-vue2/components/main-nav/index.vue';
import ENotificationBanner from '@ecosia/common-vue2/components/notifications/banner.vue';
import ENotifications from '@ecosia/common-vue2/components/notifications/index.vue';
import ESearchForm from '@ecosia/common-vue2/components/search-form/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';
import screen from '@ecosia/common-vue2/mixins/screen.js';

import { isCieExperimentEnabled } from '@ecosia/accounts-impact-client/utils/cie-experiment.js';
import { headerHiddenBrowsers } from '@ecosia/constants/browsers.js';
import { useExperienceStore } from '@ecosia/store/experience';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { getOverrides } from '@ecosia/universal/get-flag-overrides.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import EMainHeaderSignUpButton from './sign-up-button.vue';

export const headerFeatures = [
  'logo',
  'search',
  'notifications',
  'install-cta',
];

// To disable search feature in future for ios, add ECOSIA_IOS from @ecosia/common-js/constants/browsers
export const disableSearchBrowsers = [];

const headerFeatureValidator = (features) => {
  return features.every((feature) => headerFeatures.includes(feature));
};

export default {
  name: 'EMainHeader',
  components: {
    ELogo,
    ECta,
    EMainNav,
    ENotifications,
    ENotificationBanner,
    ESearchForm,
    EMainHeaderSignUpButton,
  },
  mixins: [classes, screen],
  props: {
    /**
     * A list of features which will be disabled. All enabled by default.
     * One of `logo`, `search`, `notifications`, `install-cta`.
     */
    disableFeatures: {
      type: Array,
      default: () => [],
      validator: headerFeatureValidator,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    border: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    isAtTop: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    isSticky: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    isStickyMinimal: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    searchAutocomplete: {
      type: Boolean,
      default: true,
    },
    searchAutoFocus: {
      type: Boolean,
      default: false,
    },
    searchDisableOverlay: {
      type: Boolean,
      default: false,
    },
    searchHiddenInputs: {
      type: Object,
      default: () => ({}),
    },
    searchOrigin: {
      type: String,
      default: '',
    },
    trackSearchBarClickFunc: {
      type: Function,
      default: null,
    },
    /**
     * A compact layout without search input.
     * Currently in use in the chat vertical.
     */
    isCompact: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    showFeedbackLink: {
      type: Boolean,
      default: false,
    },
    enableImpactExperiment: {
      type: Boolean,
      default: true,
    },
    /**
     * For components using rounded components with a margin, in order to handle the transition of margin on scroll
     * Currently in use on Indexpage
     */
    roundedLayout: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isNotificationVisible: false,
    };
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useExperienceStore, ['isACtaComponentVisible']),
    ...mapState(useUserStore, [
      'addOn',
      'bingMarketCode',
      'defaultMarket',
      'browser',
      'isSignedIn',
      'isAccountsEnabled',
    ]),
    logoUrl() {
      // We want to keep only the features when navigating
      const query = Object.fromEntries(getOverrides(this.$route.query));
      return this.$router.resolve({ path: '/', query }).href;
    },
    searchUrl() {
      const { searchUrl } = this.$config;
      return searchUrl || this.$route.path;
    },
    shouldDisplaySignUpButton() {
      const unleashStore = useUnleashStore();
      return isCieExperimentEnabled(unleashStore) &&
        this.isAccountsEnabled &&
        !this.isSignedIn;
    },
    autocompleteUrl() {
      if (!this.searchAutocomplete) {
        return '';
      }

      return this.$config.autocompleteUrl ? this.$config.autocompleteUrl : '';
    },
    blogUrl() {
      return getBlogURL(this.locale);
    },
    market() {
      return this.bingMarketCode || this.defaultMarket;
    },
    searchEnabled() {
      return disableSearchBrowsers.includes(this.browser) ?
        false :
        this.featureEnabled('search');
    },
    shouldDisplayCTA() {
      return (
        !this.addOn &&
        this.isDesktopUp &&
        !headerHiddenBrowsers.includes(this.browser) &&
        this.featureEnabled('install-cta')
      );
    },
    adjustedHeader() {
      return {
        'main-header--rounded': this.roundedLayout,
        'main-header--rounded-notifications':
      this.roundedLayout && this.featureEnabled('notifications'),
      };
    },
  },
  methods: {
    featureEnabled(feature) {
      return !this.disableFeatures.includes(feature);
    },
    trackSearchBarClick() {
      if (this.trackSearchBarClickFunc) {
        this.trackSearchBarClickFunc();
      }
    },
    onOpenFeedbackModal() {
      this.$emit('open-feedback-modal');
    },
    onNotificationsVisibilityChange(isVisible) {
      this.isNotificationVisible = isVisible;
      if (isVisible && this.roundedLayout) {
        this.$emit('notifications-visibility-change', isVisible);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main-header__search {
  order: 4; // after tree counter, TBA
  width: 100%;
  margin-top: $space-s;

  @include desktop {
    flex-shrink: 1;
    order: unset;
    max-width: var(--page-container-width-desktop);
    margin-top: 0;
    margin-right: $space-1s;

    .main-header__logo + & {
      margin: 0;
      margin-right: $space-l;
    }
  }
}

.main-header__nav {
  order: 3;
}

.main-header__space {
  display: none;

  @include desktop {
    display: block;
    margin-left: auto;
  }
}

.main-header__notifications {
  flex-shrink: 0;
  order: unset;
  margin-right: $space-1s;
}

.main-header__sign-up-button,
.main-header__sign-up-button-placeholder {
  flex-shrink: 0;
  order: 1;

  @include desktop {
    order: unset;
    margin-right: $space-1s;
  }
}

.main-header__sign-up-button-placeholder {
  @include desktop {
    display: none;
  }
}

.main-header__install-cta {
  margin: 0 $space-1s;

  transition: opacity $timing-m;
}

.main-header__content {
  position: relative;
  z-index: $z-index-1l;
  padding: 0 $space-m;

  transition: background $timing-s $easing, box-shadow $timing-s $easing;

  & > * {
    flex-shrink: 0;
  }

  .main-header--border & {
    @include divider('bottom');
  }

  .main-header & {
    background-color: var(--color-background-primary);
  }

  @include desktop {
    padding: 0 $space-1l;
  }
}

.main-header__navigation {
  display: flex;
  position: relative;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: $space-1s;

  transition: padding $timing-1s $easing;

  // Applies when navbar is not used, e.g. Settings
  &:last-child {
    padding-bottom: $space-m;
  }

  @include desktop {
    flex-wrap: nowrap;
    padding-top: $space-m;
  }
}

.main-header__logo-wrapper {
  order: 2;

  @include desktop {
    flex-basis: calc(var(--page-container-left-space-desktop) - $space-1l);
    flex-shrink: 0; // Necessary to accomodate the install CTA button
    order: unset;
  }
}

/*
  we rely on the `.main-header__logo` container element's
  vertical alignment via flexbox so we
  do not set a `top` property here

  for the horizontal alignment we position relative to
  the `.main-header__navigation` element using the `left`
  and margin properties
*/
.main-header__logo {
  // can be overwritten like for the browser install logo
  --main-header-logo-width: 70px;
  --main-header-logo-height: 20px;
  display: flex;
  position: absolute;
  left: 50%;
  width: var(--main-header-logo-width);
  height: auto;
  margin-top: calc(-1 * (var(--main-header-logo-height) / 2));
  margin-left: calc(-1 * (var(--main-header-logo-width) / 2));

  @include desktop {
    position: relative;
    left: unset;
    margin-top: unset;
    margin-right: $space-1l;
    margin-left: unset;
  }

  @include desktop-2l {
    margin-left: auto;
  }
}

.main-header__logo-link {
  display: flex;
  width: var(--main-header-logo-width);
  height: var(--main-header-logo-height);
}

.main-header__search-navigation {
  width: auto;
  margin: $space-2s -1 * $space-m 0 -1 * $space-m;
  padding: 0 $space-m;

  transition: all $timing-1s $easing;

  @include desktop {
    width: 100%;
    height: $space-3l;
    margin: $space-1s 0 0;
    padding-left: calc(var(--page-container-left-space-desktop) - $space-1s);
  }
}

.main-header--is-compact .main-header__search-navigation {
  order: 5;
  width: 100%;
  margin: $space-2s 0 0;
  padding: 0;

  @extend %no-scrollbar;

  @include desktop {
    order: unset;
    width: max-content;
  }
}

$compact-vertical-max-cta-width: 1290px;

.main-header--is-compact .main-header__install-cta {
  @media only screen and (max-width: $compact-vertical-max-cta-width) {
    display: none;
  }
}

.main-header--is-compact .main-header__navigation {
  padding-bottom: 0;

  @include desktop {
    padding-top: 0;
  }
}

@mixin sticky-header {
  position: sticky;
  z-index: $z-index-2l;
  top: 0;

  .main-header__navigation {
    padding-bottom: $space-m;
  }
}

.main-header--is-sticky {
  @include sticky-header;

  &.main-header--is-at-top .main-header__content {
    background-color: transparent;
  }

  &:not(.main-header--is-at-top) {
    @include elevation(1);
  }
}

.dark .main-header--is-sticky:not(.main-header--is-at-top) {
  border-bottom: 1px solid var(--color-decorative-border-1);
}

/* New class to handle behavior for rounded layouts */
.main-header--rounded.main-header--is-sticky {
  .main-header__content {
    top: $space-1s;

    transition: top $timing-m ease;

    @include desktop {
      top: 0;
    }
  }
}

.main-header--rounded-notifications.main-header--is-sticky {
  .main-header__content {
    top: $space-1s;

    transition: top $timing-m ease;

    .main-header--is-at-top & {
      top: $space-1s;
    }

    @include desktop {
      top: 0;
    }
  }
}

.main-header--rounded.main-header--is-sticky:not(.main-header--is-at-top)
.main-header__content {
  top: 0;

  transition: top $timing-m ease;

}

.main-header--is-sticky-minimal:not(.main-header--is-at-top) {
  @include desktop {
    @include sticky-header;

    .banner,
    .main-header__search-navigation {
      height: 0;
      min-height: 0;
      margin: 0;
      overflow: hidden;

      opacity: 0;

      &:focus-within {
        height: auto;
        min-height: auto;
        overflow: initial;

        opacity: 1;
      }
    }
  }
}

.fade-cta-leave-active {
  opacity: 0;
}
</style>
