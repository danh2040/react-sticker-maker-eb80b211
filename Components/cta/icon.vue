<template>
  <span
    v-if="icon"
    data-test-id="cta-button-icon"
    class="cta__icon"
    :class="[
      `cta__icon--${icon}`,
      `cta__icon--${size}`,
    ]"
  />
</template>

<script>
import { mapState } from 'pinia';

import screen from '@ecosia/common-vue2/mixins/screen.js';

import { iconDesktopBrowsers, mobileOs } from '@ecosia/constants/browsers.js';
import { useUserStore } from '@ecosia/store/user/index.js';

export default {
  name: 'ECtaIcon',
  mixins: [screen],
  props: {
    size: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(useUserStore, [
      'browserName',
      'browserOs',
    ]),
    icon() {
      const os = this.browserOs?.toLowerCase();
      const browser = this.browserName?.toLowerCase();
      const hasIconBrowser = iconDesktopBrowsers.includes(browser);
      const hasIconOs = mobileOs.includes(os);
      const hasIcon = hasIconOs || hasIconBrowser;

      if (this.isTabletUp && hasIcon) {
        return hasIconOs ? os : browser;
      }

      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
$install-icons: (
  android,
  chrome,
  edge,
  firefox,
  ios,
  safari,
);

$sizes: (
  s: $icon-size-s,
  m: $icon-size-m,
);

.cta__icon {
  display: inline-block;
  margin: auto $space-2s auto 0;

  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

@each $size, $value in $sizes {
  .cta__icon--#{$size} {
    width: $value;
    height: $value;
  }
}

@each $icon in $install-icons {
  .cta__icon--#{$icon} {
    background-image: url(@ecosia/common-vue2/assets/cta-icons/#{$icon}.svg?asPath);
  }
}
</style>
