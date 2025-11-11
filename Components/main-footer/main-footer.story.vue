<template>
  <div>
    <section class="main-footer-story__section">
      <EHeading styled-as="h3">
        Default
      </EHeading>
      <EMainFooter />
    </section>
    <section class="main-footer-story__section">
      <EHeading styled-as="h3">
        Without Settings (only used at setting page)
      </EHeading>
      <EMainFooter :settings-link="false" />
    </section>
  </div>
</template>

<script>
import EHeading from '@ecosia/common-vue2/components/heading/index.vue';

import EMainFooter from './index.vue';

export default {
  name: 'MainFooter',
  components: { EHeading, EMainFooter },
  statusId: 'MainFooter',
  mockStoreModules: ['experience', 'userEngagement'],
};
</script>

<style lang="scss" scoped>
.main-footer-story__section {
  padding-bottom: $space-1l;

  & + & {
    padding: $space-1l 0;

    @include divider('top');
  }
}
</style>
