<template>
  <div class="container">
    <ERating :value="value" :reviews="reviews" />
    <ERating :value="value" :reviews="reviews" :reviews-url="url" />
    <ERating :value="value" :reviews="reviews" :reviews-url="url" reviews-link-color="primary" />
    <ERating
      :value="value"
      :reviews="reviews"
      :reviews-url="url"
      reviews-text
      reviews-link-color="primary"
    />
  </div>
</template>

<script>
import ERating from './index.vue';

export default {
  name: 'SlotRating', // Title for storybook
  components: { ERating },
  statusId: 'Forms/Rating',
  mockStoreModules: ['global'],
  computed: {
    value() {
      return 3.5;
    },
    reviews() {
      return 475;
    },
    url() {
      return 'http://local.ecosia.org';
    },
  },
};
</script>
