<template>
  <div v-if="hasNotifications" class="notifications">
    <ENotificationButton
      ref="toggle"
      v-on-clickaway="hideList"
      aria-haspopup="true"
      :aria-controls="listId"
      :aria-expanded="visible ? 'true': 'false'"
      :is-menu-expanded="visible"
      @click="toggle"
    />
    <ENotificationList
      :id="listId"
      ref="list"
      role="menu"
      :visible="visible"
      :blog-url="blogUrl"
      :read-more-label="readMoreLabel"
    />
    <ENotificationPopup />
  </div>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';
import { mixin as focus } from 'vue-focus';
import { mapActions, mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import mockNotifications from '@ecosia/common-vitest/mocks/notifications';

import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useNotificationsStore } from '@ecosia/store/notifications/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import ENotificationButton from './button.vue';
import ENotificationList from './list.vue';
import ENotificationPopup from './popup.vue';
import { getNotifications } from './utils.js';

export default {
  name: 'ENotifications',
  components: {
    ENotificationList,
    ENotificationButton,
    ENotificationPopup,
  },
  mixins: [clickaway, focus],
  props: {
    blogUrl: {
      type: String,
      required: true,
    },
    readMoreLabel: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      listId: this.$id('notifications-list'),
    };
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useUserStore, [
      'bingMarketCode',
      'defaultMarket',
      'browser',
    ]),
    ...mapState(useNotificationsStore, ['notifications']),
    hasNotifications() {
      return this.notifications && this.notifications.length > 0;
    },
    isMocked() {
      return this.$route?.query.mocked === 'true';
    },
  },
  beforeMount() {
    const market = this.bingMarketCode || this.defaultMarket;

    if (this.hasNotifications) {
      return;
    }

    this.getNotificationsPromise({ market })
      .then((response) => {
        this.setNotifications(response);
      })
      .catch((err) => this.$sentry.captureException(err));
  },
  methods: {
    ...mapActions(useNotificationsStore, ['setNotifications']),
    getNotificationsPromise({ market }) {
      if (this.$config.isDev || this.isMocked) {
        return Promise.resolve(mockNotifications);
      }

      return getNotifications({
        locale: this.locale,
        market,
        browser: this.browser,
        apiUrl: this.$config.apiUrl,
      });
    },
    setVisible(value) {
      this.visible = value;
      if (this.visible) {
        this.$emit('visible');
      }
    },
    toggle() {
      const visible = !this.visible;
      this.setVisible(visible);
      if (visible) {
        this.$nextTick(() => (this.$refs.list.focus()));
        sendCoreAnalyticsEvent('all_notification_toggleNotificationCenter', { origin: 'center' });
      }
    },
    hideList({ target }) {
      const { $el } = this.$refs.toggle;
      if (target !== $el && !$el.contains(target)) {
        this.setVisible(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.notifications {
  position: relative;
}
</style>
