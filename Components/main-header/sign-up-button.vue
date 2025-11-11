<template>
  <EButton
    class="sign-up-button"
    as="a"
    :href="url"
    :variant="buttonVariant"
    rel="noopener"
    icon="sign-in"
    icon-size="s"
    size="m"
    data-test-id="main-header-sign-up-button"
    @click="onButtonClick"
  >
    {{ $t('common.header.menu.impact.signup') }}
  </EButton>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import useIsServerSideRendered from '@ecosia/common-vue2/composables/is-server-side-rendered.js';

import { createAccountSignUpURL } from '../main-nav/utils.js';

export default {
  name: 'EMainHeaderSignUpButton',
  components: {
    EButton,
  },
  props: {
    isACtaComponentVisible: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    url: '',
  }),
  computed: {
    buttonVariant() {
      /*
        to avoid the button from 'flashing' from
        green to white we always set the button to
        white on serverside render
      */
      if (
        this.isServerSideRendered ||
        this.isACtaComponentVisible
      ) {
        return 'solid-white';
      }

      return 'solid-grellow';
    },
  },
  setup() {
    const isServerSideRendered = useIsServerSideRendered();
    return { isServerSideRendered };
  },
  mounted() {
    this.setUrl();
  },
  methods: {
    onButtonClick() {
      sendCoreAnalyticsEvent('accountsSignUpButtonClicked', {
        buttonVariant: this.buttonVariant,
      });
    },
    setUrl() {
      this.url = createAccountSignUpURL(this.$config);
    },
  },
};
</script>

<style lang="scss" scoped>
// Join classnames to increase specificity so these styles override others
.sign-up-button.base-button--size-m {
  @extend %increase-target-size;

  ::v-deep .button__icon {
    display: none;
  }

  @include mobile-l-down {
    // remove padding so that the button is a circle
    padding: 0;

    ::v-deep .button__icon {
      display: flex;
    }

    ::v-deep .button__text {
      // sr-only, could not extend it inside a media query
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      overflow: hidden;
      clip-path: inset(0 100% 100% 0);

      border: 0;

      white-space: nowrap;
    }
  }
}
</style>
