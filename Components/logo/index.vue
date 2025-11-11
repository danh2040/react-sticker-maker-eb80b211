<template>
  <a
    :href="href"
    :data-env="envVariant"
    :class="classes"
    :aria-label="logoTitle"
    rel="noopener"
    @click="onClick"
  >
    <component
      :is="logoVariant"
      class="logo__icon"
      aria-hidden="true"
      :data-test-id="`logo-icon${variant !== 'color' ? `-${variant}` : ''}`"
    />
  </a>
</template>

<script>

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import ELogoCompact from '@ecosia/common-vue2/components/logos/logo-compact.svg';
import ELogoColor from '@ecosia/common-vue2/components/logos/logo-ecosia.svg';
import classes from '@ecosia/common-vue2/mixins/classes.js';

import upperFirst from '@ecosia/js-utils/upper-first.js';

export const variants = ['color', 'compact'];

export default {
  name: 'ELogo',
  components: {
    ELogoColor,
    ELogoCompact,
  },
  mixins: [classes],
  props: {
    href: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: 'color',
      validator: (variant) => variants.includes(variant),
      cssClass: true,
    },
    // TODO: remove this when paddings are applied per-use-case base
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    padding: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    envVariant() {
      if (this.$config.isProd) {
        return false;
      }
      return this.$config.environment;
    },
    logoTitle() {
      return this.title || this.$t('common.logo.titletag');
    },
    logoVariant() {
      return `ELogo${upperFirst(this.variant)}`;
    },
  },
  methods: {
    onClick() {
      sendCoreAnalyticsEvent('logoClicked', {
        href: this.href,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  display: block;
  position: relative;

  color: var(--color-brand-primary);
}

.logo__icon {
  max-width: 100%;
  height: 100%;
}

.logo--padding {
  .logo__icon {
    padding: $space-1s;
  }
}

.logo--compact::after {
  content: none;
}
</style>
