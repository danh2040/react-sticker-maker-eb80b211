<template>
  <div class="wrapper">
    <EMainHeader
      :disable-features="['install-cta']"
      :border="false"
      transparent
    />
  </div>
</template>

<script>
import mockNotifications from '@ecosia/common-vitest/mocks/notifications.js';

import EMainHeader from './index.vue';

export default {
  name: 'MainHeader',
  components: { EMainHeader },
  statusId: 'MainHeader',
  mockStoreModules: ['global', 'notifications', 'search', 'user'],
  beforeMount() {
    this.$store.commit('notifications/setNotifications', mockNotifications);
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: $space-5l * 3;

  background: linear-gradient(45deg, green, blue);
}
</style>
