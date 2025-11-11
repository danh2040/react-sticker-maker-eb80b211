<template>
  <EInlineAlert
    class="error-message"
    variant="negative"
    :title="$t('common.header.menu.impact.messages.error.heading')"
    title-component="h4"
    subtle
  >
    <p>{{ $t('common.header.menu.impact.messages.error.message') }}</p>
  </EInlineAlert>
</template>

<script>
import EInlineAlert from '@ecosia/common-vue2/components/inline-alert/index.vue';

export default {
  name: 'EMainNavImpactProfileErrorMessage',
  components: {
    EInlineAlert,
  },
};
</script>

<style lang="scss" scoped>
.error-message {
  margin-top: 16px;

  h4,
  p {
    margin-top: 0;
    margin-bottom: 4px;
  }

  h4 {
    font-size: $font-l;
    font-weight: $font-weight-700;
  }
}
</style>
