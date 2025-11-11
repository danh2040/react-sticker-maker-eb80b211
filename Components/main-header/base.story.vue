<template>
  <EMainHeader />
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
