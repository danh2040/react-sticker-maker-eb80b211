<template>
  <nav class="main-nav" :aria-labelledby="idHeading" data-test-id="main-nav">
    <h2 :id="idHeading" class="sr-only">
      {{ $t('common.header.navigationmenu.heading') }}
    </h2>

    <Component
      :is="
        isImpactMenuButtonEnabled ?
          'EMainNavMenuButtonImpactCounter' :
          'EMainNavMenuButton'
      "
      ref="menuButton"
      data-test-id="main-nav-toggle"
      :menu-button-aria-label="menuButtonAriaLabel"
      :show-menu-as-sheet="showMenuAsSheet"
      :is-menu-expanded="isMenuExpanded"
      :is-signed-in="isSignedIn"
      :menu-button-aria-controls-id="id"
      @click="toggleMenu"
    />
    <ESheet
      v-if="showMenuAsSheet"
      :id="id"
      data-test-id="main-nav-sheet"
      :is-visible="isMenuExpanded"
      :aria-label="$t('common.header.navigationmenu.heading')"
      :close-button-aria-label="$t('common.header.navigationmenu.close')"
      @close="hideMenu"
    >
      <EMainNavMenu
        v-bind="menuProps"
        @open-feedback-modal="onOpenFeedbackModal"
      />
    </ESheet>
    <EDropdown
      v-else
      :id="id"
      v-on-clickaway="clickAway"
      :visible="isMenuExpanded"
      class="main-nav__dropdown"
      :class="{'main-nav__dropdown--cie': isImpactMenuButtonEnabled }"
      side="right"
      data-test-id="main-nav-dropdown"
    >
      <EMainNavMenu
        v-bind="menuProps"
        @open-feedback-modal="onOpenFeedbackModal"
      />
    </EDropdown>
  </nav>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';
import { mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EDropdown from '@ecosia/common-vue2/components/dropdown/index.vue';
import ESheet from '@ecosia/common-vue2/components/sheet/index.vue';
import screen from '@ecosia/common-vue2/mixins/screen.js';
import { toggleScrollLock } from '@ecosia/common-vue2/utils/screen.js';

import { isCieExperimentEnabled } from '@ecosia/accounts-impact-client/utils/cie-experiment.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import EMainNavMenu from './menu.vue';
import EMainNavMenuButton from './menu-button.vue';
import EMainNavMenuButtonImpactCounter from './menu-button-impact-counter.vue';

export default {
  name: 'EMainNav',
  components: {
    EDropdown,
    EMainNavMenuButton,
    EMainNavMenuButtonImpactCounter,
    EMainNavMenu,
    ESheet,
  },
  mixins: [clickaway, screen],
  props: {
    showFeedbackLink: {
      type: Boolean,
      default: false,
    },
    enableImpactExperiment: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isMenuExpanded: false,
  }),
  computed: {
    ...mapState(useUserStore, ['isAccountsEnabled', 'isSignedIn']),
    menuButtonAriaLabel() {
      return this.isMenuExpanded ?
        this.$t('common.header.navigationmenu.hide') :
        this.$t('common.header.navigationmenu.show');
    },
    id() {
      return 'navigation-menu';
    },
    idHeading() {
      return 'navigation-menu-heading';
    },
    isImpactExperimentEnabled() {
      const unleashStore = useUnleashStore();
      return isCieExperimentEnabled(unleashStore);
    },
    isImpactMenuButtonEnabled() {
      return this.isImpactExperimentEnabled && this.enableImpactExperiment;
    },
    menuProps() {
      return {
        isImpactExperimentEnabled: this.isImpactMenuButtonEnabled,
        isAccountsEnabled: this.isAccountsEnabled,
        isSignedIn: this.isSignedIn,
        name: this.name,
        showFeedbackLink: this.showFeedbackLink,
      };
    },
    showMenuAsSheet() {
      return !this.isTabletUp;
    },
  },
  watch: {
    // when a user resizes their viewport
    showMenuAsSheet(newShowMenuAsSheet) {
      // we don't need to change scroll if the menu is closed
      if (!this.isMenuExpanded) {
        return;
      }

      toggleScrollLock(newShowMenuAsSheet);
    },
  },
  mounted() {
    document.addEventListener('keyup', this.onKeyUp);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.onKeyUp);
  },
  methods: {
    setIsMenuExpanded(value) {
      this.isMenuExpanded = value;

      /*
        When the menu is shown with panel, we want a
        fixed body so the body doesn't scroll
      */
      if (this.showMenuAsSheet) {
        toggleScrollLock(this.isMenuExpanded);
      }
    },
    onKeyUp({ which, keyCode }) {
      const code = keyCode || which;
      // Esc
      if (code === 27) {
        this.hideMenu();
      }
    },
    clickAway({ target }) {
      const { $el } = this.$refs.menuButton;
      if (target !== $el && !$el.contains(target)) {
        this.hideMenu();
      }
    },
    hideMenu() {
      this.setIsMenuExpanded(false);

      // focus the nav menu button
      if (this.$el.contains(document.activeElement)) {
        this.$refs.menuButton.$el.focus();
      }
    },
    toggleMenu() {
      sendCoreAnalyticsEvent('mainNavToggled', {
        isSignedIn: this.isSignedIn,
      });
      this.setIsMenuExpanded(!this.isMenuExpanded);
    },
    onOpenFeedbackModal() {
      this.hideMenu();
      this.$emit('open-feedback-modal');
    },
  },
};
</script>

<style lang="scss" scoped>
.main-nav {
  position: relative;
}

.main-nav__dropdown {
  right: -$space-s;
  width: $screen-mobile;
  max-height: 75vh;
  margin-top: $space-s;
  overflow-y: auto;

  border: $border-width solid var(--color-decorative-border-1);
  border-radius: $border-radius-1l;

  box-shadow: $elevation-2;

  &--cie {
    height: 600px;
  }
}
</style>
