<template>
  <EButton
    as="a"
    :href="url"
    rel="noopener"
    :variant="variant"
    size="m"
    :data-test-id="testId"
    @click="onButtonClick"
  >
    <EIcon
      class="sign-in-out-button__icon"
      :icon="showSignInButton ? 'sign-in' : 'sign-out'"
      size="s"
      aria-hidden="true"
    />
    {{
      showSignInButton
        ? $t('common.header.accounts.signin')
        : $t('common.header.accounts.signout')
    }}
  </EButton>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

import { createAccountSignInURL, createAccountSignOutURL } from './utils.js';

export default {
  name: 'EMainNavMenuSignInOutButton',
  components: {
    EButton,
    EIcon,
  },
  props: {
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String,
      default: 'bare',
    },
  },
  data: () => ({
    url: '',
  }),
  computed: {
    testId() {
      if (this.showSignInButton) {
        return 'sign-in-button';
      }

      return 'sign-out-button';
    },
    showSignInButton() {
      // if user isn't signed-in show the sign-in button
      return !this.isSignedIn;
    },
  },
  mounted() {
    this.setUrl();
  },
  methods: {
    setUrl() {
      this.url = this.showSignInButton ?
        createAccountSignInURL(this.$config) :
        createAccountSignOutURL(this.$config);
    },
    onButtonClick() {
      if (this.showSignInButton) {
        sendCoreAnalyticsEvent('accountsSignInButtonClicked');
        return;
      }

      sendCoreAnalyticsEvent('accountsSignOutButtonClicked');
    },
  },
};
</script>

<style lang="scss" scoped>
.sign-in-out-button__icon {
  margin-right: $space-2s;
}
</style>
