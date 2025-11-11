<template>
  <div>
    <EInlineAlert variant="info" :subtle="subtle">
      Info
    </EInlineAlert>
    <EInlineAlert variant="positive" :subtle="subtle">
      Positive
    </EInlineAlert>
    <EInlineAlert variant="warning" :subtle="subtle">
      Warning
    </EInlineAlert>
    <EInlineAlert variant="negative" :subtle="subtle">
      Negative
    </EInlineAlert>
  </div>
</template>

<script>
import EInlineAlert from './index.vue';

export default {
  components: {
    EInlineAlert,
  },
  props: {
    subtle: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.inline-alert + .inline-alert {
  margin-top: 1em;
}
</style>
