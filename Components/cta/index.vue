<template>
  <div class="cta">
    <ESwitchModal
      v-if="displaySwitchGifInModal"
      data-test-id="cta-switch-modal"
      :active="showSwitchModal"
      @close="closeSwitchModal"
    />
    <EInstaller
      :visible="showOverlay"
      @installer-closed="closeInstaller"
    />
    <EButton
      :variant="variant"
      class="cta__button"
      data-test-id="cta-button"
      :size="buttonSize"
      v-bind="ctaProps"
      @click="ctaClick"
    >
      <ECtaIcon
        :size="iconSize"
        data-test-id="cta-button-icon"
      />
      {{ buttonText }}
    </EButton>
    <EBrowserPageLink
      v-if="hasLinkToBrowserPage"
      data-test-id="cta-link-to-browser-page"
      :link-color-variant="linkColorVariant"
      :position-tracking="positionTracking"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getCtaUrl } from '@ecosia/common-js/universal/url-utils.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EInstaller from '@ecosia/common-vue2/components/installer/index.vue';
import ESwitchModal from '@ecosia/common-vue2/components/switch-modal/index.vue';
import screen from '@ecosia/common-vue2/mixins/screen.js';

import { CHROME, FIREFOX } from '@ecosia/constants/browsers.js';
import { DEFAULT_SWITCH as CTA_PROMOTION_DEFAULT_SWITCH } from '@ecosia/constants/cta-promotions.js';
import { chromeDefaultSwitchGif } from '@ecosia/constants/feature-flags.js';
import { useExperienceStore } from '@ecosia/store/experience/index.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import EBrowserPageLink from './browser-page-link.vue';
import ECtaIcon from './icon.vue';

export default {
  name: 'ECta',
  components: {
    EButton,
    ECtaIcon,
    EInstaller,
    ESwitchModal,
    EBrowserPageLink,
  },
  mixins: [screen],
  props: {
    positionTracking: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: undefined,
    },
    variant: {
      type: String,
      default: 'solid-grellow',
    },
    hasLinkToBrowserPage: {
      type: Boolean,
      default: false,
    },
    linkColorVariant: {
      type: String,
      default: 'primary',
    },
    customTarget: {
      type: Boolean,
      default: false,
    },
    targetOpener: {
      type: String,
      default: '_self',
    },
  },
  data() {
    return {
      showOverlay: false,
      showSwitchModal: false,
    };
  },
  computed: {
    ...mapState(useUnleashStore, ['isActiveToggleValue']),
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useExperienceStore, ['ctaPromotion']),
    ...mapState(useUserStore, [
      'browser',
      'browserOs',
    ]),
    buttonText() {
      return `${this.$t('common.install.cta.switch')}`;
    },
    buttonSize() {
      if (this.size) {
        return this.size;
      }
      return this.isTabletUp ? 'l' : 'm';
    },
    iconSize() {
      if (this.buttonSize === 'l') {
        return 'm';
      }
      return 's';
    },
    hasOverlay() {
      return this.browser === FIREFOX;
    },
    ctaProps() {
      if (this.displaySwitchGifInModal) {
        return {};
      }

      const base = {
        href: this.url,
        as: 'a',
        rel: 'noopener',
      };

      if (!this.hasOverlay) {
        if (this.customTarget) {
          base.target = this.targetOpener;
        } else {
          base.target = '_blank';
        }
      }

      return base;
    },
    url() {
      return getCtaUrl({
        os: this.browserOs,
        browser: this.browser,
        ctaPromotion: this.ctaPromotion,
        locale: this.locale,
        baseUrl: this.$config.baseUrl,
      });
    },
    displaySwitchGifInModal() {
      return (
        this.isActiveToggleValue(chromeDefaultSwitchGif.flag, chromeDefaultSwitchGif.displayGifInModal) &&
        this.ctaPromotion === CTA_PROMOTION_DEFAULT_SWITCH &&
        this.browser === CHROME &&
        this.isDesktopUp
      );
    },
  },
  mounted() {
    this.updateExperienceState({ isACtaComponentVisible: true });

    sendCoreAnalyticsEvent('ctaDisplayed', {
      position: this.positionTracking,
      usage: this.ctaPromotion,
    });
  },
  methods: {
    ...mapActions(useExperienceStore, {
      updateExperienceState: 'set',
    }),
    openSwitchModal() {
      this.showSwitchModal = true;
    },
    closeSwitchModal() {
      this.showSwitchModal = false;
    },
    closeInstaller() {
      this.showOverlay = false;
    },
    ctaClick() {
      if (window.gtag_report_conversion) {
        window.gtag_report_conversion();
      }

      if (window.mntn_report_conversion) {
        window.mntn_report_conversion();
      }

      sendCoreAnalyticsEvent('ctaClicked', {
        position: this.positionTracking,
        usage: this.ctaPromotion,
      });

      if (this.displaySwitchGifInModal) {
        this.openSwitchModal();
        return;
      }
      this.showOverlay = this.hasOverlay;
    },
  },
};
</script>

<style lang="scss" scoped>
.cta {
  display: inline-flex;
  gap: $space-s;
  flex-direction: column;
}

.cta__button {
  @include class-opacity-transition('cta__button');
}
</style>
