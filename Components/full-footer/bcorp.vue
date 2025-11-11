<template>
  <div class="footer-bcorp">
    <a
      :href="ecosiaURL"
      target="_blank"
      rel="noopener"
      class="footer-bcorp__logo"
      :class="{ 'footer-bcorp__logo--visible': showLogo }"
      data-test-id="footer-bcorp-logo"
    >
      <span class="sr-only">
        B-Corporation Certificate
      </span>
    </a>
    <ELink
      :href="certificationURL"
      color="bare"
      target="_blank"
      rel="noopener"
      class="footer-bcorp__certification"
      data-test-id="footer-bcorp-certification"
    >
      {{ $t('common.footer.bcorp.notice') }}
    </ELink>
  </div>
</template>

<script>
import ELink from '@ecosia/common-vue2/components/link/index.vue';

import { BCORP_CERTIFICATION, BCORP_ECOSIA } from '@ecosia/constants/urls.js';

export default {
  name: 'EFooterBcorp',
  components: {
    ELink,
  },
  props: {
    showLogo: {
      type: Boolean,
      default: false,
    },
  },
  constants: {
    certificationURL: BCORP_CERTIFICATION,
    ecosiaURL: BCORP_ECOSIA,
  },
};
</script>

<style lang="scss">
.footer-bcorp {
  display: flex;
  gap: $space-m;
  flex-direction: column;
  align-items: center;
  margin: 0 auto $space-3l;

  @include desktop {
    margin: $space-2s 0;
  }
}

.footer-bcorp__logo {
  display: block;
  width: 80px;
  height: 120px;

  background-size: cover;
}

.footer-bcorp__logo--visible {
  background-image: url("@ecosia/common-vue2/assets/images/b-corp.svg?asPath");
}

.dark .footer-bcorp__logo--visible {
  background-image: url("@ecosia/common-vue2/assets/images/b-corp-dark.svg?asPath");
}

.footer-bcorp__certification {
  font-size: $font-m;
}
</style>
