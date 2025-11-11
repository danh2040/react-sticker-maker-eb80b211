<template>
  <div class="container">
    <ERating
      variant="tripadvisor"
      :value="5"
    />
    <ERating
      variant="tripadvisor"
      :value="3"
    />
    <ERating
      variant="tripadvisor"
      :value="2.7"
    />
    <ERating
      variant="tripadvisor"
      :value="0"
    />
  </div>
</template>

<script>
import ERating from './index.vue';

export default {
  name: 'TARating', // Title for storybook
  components: { ERating },
  statusId: 'Forms/Rating',
  mockStoreModules: ['global'],
};
</script>
