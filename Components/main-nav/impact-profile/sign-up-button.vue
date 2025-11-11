<template>
  <EButton
    as="a"
    :href="url"
    rel="noopener"
    variant="solid-green"
    size="m"
    class="main-nav-sign-up-button"
    data-test-id="main-nav-sign-up-button"
    @click="onButtonClick"
  >
    {{ $t('common.header.menu.impact.signup') }}
  </EButton>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';

import { createAccountSignUpURL } from '../utils.js';

export default {
  name: 'EMainNavMenuSignUpButton',
  components: {
    EButton,
  },
  data: () => ({
    url: '',
  }),
  mounted() {
    this.setUrl();
  },
  methods: {
    onButtonClick() {
      sendCoreAnalyticsEvent('accountsMainNavMenuSignUpButtonClicked', {
        isSignedIn: false,
      });
    },
    setUrl() {
      this.url = createAccountSignUpURL(this.$config);
    },
  },
};
</script>

<style lang="scss" scoped>
/*
  TODO: ideally we should not be overriding the
  button styles in this way

  we need to do this to support longer strings wrapping
  as the default button styles don't allow for that

  if the a/b test for the longer string is succesful
  as part of the clean-up we need to incorporate these changes
  into the button component somehow
*/
.main-nav-sign-up-button {
  height: auto;
  min-height: $space-3l;
}

.main-nav-sign-up-button ::v-deep .button__text {
  padding: $space-2s 0;

  line-height: $line-height-s;
  white-space: normal;
}
</style>
