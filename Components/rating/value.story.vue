<template>
  <div class="container">
    <ERating :value="value" :show-value="false" />
    <ERating :value="value" highlight-value />
  </div>
</template>

<script>
import ERating from './index.vue';

export default {
  name: 'ValueRating', // Title for storybook
  components: { ERating },
  statusId: 'Forms/Rating',
  mockStoreModules: ['global'],
  computed: {
    value() {
      return 3.5;
    },
  },
};
</script>
