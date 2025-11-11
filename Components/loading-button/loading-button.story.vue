<template>
  <ELoadingButton :loading="loading" @click="load">
    Loading button
  </ELoadingButton>
</template>

<script>
import ELoadingButton from './index.vue';

export default {
  name: 'Base',
  statusId: 'Button',
  components: { ELoadingButton },
  data() {
    return { loading: false };
  },
  methods: {
    load() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
  },
};
</script>
