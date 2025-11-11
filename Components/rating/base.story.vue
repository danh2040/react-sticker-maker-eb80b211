<template>
  <div class="container">
    <ERating
      :value="5"
    />
    <ERating
      :value="3"
    />
    <ERating
      :value="2.7"
    />
    <ERating
      :value="0"
    />
  </div>
</template>

<script>
import ERating from './index.vue';

export default {
  name: 'BaseRating', // Title for storybook
  components: { ERating },
  statusId: 'Forms/Rating',
  mockStoreModules: ['global'],
};
</script>
