<template>
  <component
    :is="fallback"
    v-bind="fallbackProps"
    v-if="isFallback"
  />
  <ELink
    v-else
    :href="link"
    :target="config.target"
    class="doodle"
  >
    <component
      :is="doodleImage"
      :aria-label="$t(`common.doodle.alt.${config.id}`)"
      role="img"
      class="doodle__picture"
      @click="onClick"
    />
  </ELink>
</template>

<script>
import { mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import ELink from '@ecosia/common-vue2/components/link/index.vue';
import ELogoCompact from '@ecosia/common-vue2/components/logos/logo-compact.svg';
import ELogoColor from '@ecosia/common-vue2/components/logos/logo-ecosia.svg';

import upperFirst from '@ecosia/js-utils/upper-first.js';

import { doodle } from '@ecosia/constants/feature-flags.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import config from './config.json';

const IMAGES = ['', 'compact', 'color'];

export default {
  name: 'EDoodle',
  components: {
    ELink,
    ELogoColor,
    ELogoCompact,
  },
  props: {
    fallbackProps: {
      type: Object,
      default: () => ({ href: '#' }),
    },
    fallbackToImage: {
      type: String,
      default: '',
      validator: (value) => IMAGES.includes(value),
    },
  },
  computed: {
    ...mapState(useUnleashStore, ['isActiveToggleValue']),
    ...mapState(useGlobalStore, ['locale']),
    config() {
      return config;
    },
    fallback() {
      if (this.fallbackToImage) {
        return `ELogo${upperFirst(this.fallbackToImage)}`;
      }
      return () => import(
        '../logo/index.vue'
      );
    },
    isFallback() {
      return !this.isActiveToggleValue(doodle.flag, doodle.enabled);
    },
    doodleImage() {
      return () => import(
        `../../assets/doodles/${config.id}/${config.file}.svg`
      );
    },
    link() {
      const locales = ['de', 'fr'];
      const enLocale = 'en';
      const linkLocale = locales.includes(this.locale) ? this.locale : enLocale;
      return config.href[linkLocale];
    },
  },
  methods: {
    onClick() {
      sendCoreAnalyticsEvent('doodleClicked', {
        label: config.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.doodle {
  display: inline-block;
  position: relative;
  height: 70px;

  background-repeat: no-repeat;
  background-position: 50%;
  background-size: contain;
}

.doodle__picture {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 140%;
}

.doodle__image {
  width: 100%;
}
</style>
