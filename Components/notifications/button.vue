<template>
  <div class="notification-pill-wrapper">
    <EButton
      icon="bell"
      icon-size="s"
      variant="solid-white"
      :force-hover="isMenuExpanded"
      :is-active="isMenuExpanded"
      :tooltip-text="$t('common.header.notifications.unread')"
      v-on="$listeners"
      @click="onClick"
    />
    <ENotificationPill :has-notification="hasNotification" />
  </div>
</template>

<script>
import { mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getCookieOptions } from '@ecosia/common-js/universal/utils.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import ENotificationPill from '@ecosia/common-vue2/components/notification-pill/index.vue';

import { LAST_READ_NOTIFICATION as LAST_READ_NOTIFICATION_COOKIE } from '@ecosia/constants/cookies.js';
import { useNotificationsStore } from '@ecosia/store/notifications/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import {
  MIN_TREE_COUNT_PILL,
  NOTIFICATION_LEVEL_PILL,
} from './constants.js';

export default {
  name: 'ENotificationButton',
  components: {
    EButton,
    ENotificationPill,
  },
  props: {
    isMenuExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dismissed: false,
      impressionEventSent: false,
    };
  },
  computed: {
    ...mapState(useUserStore, [
      'lastReadNotificationTimestamp',
      'notificationEnabled',
      'treeCount',
    ]),
    ...mapState(useNotificationsStore, [
      'getByLevel',
    ]),
    notification() {
      return this.getByLevel(NOTIFICATION_LEVEL_PILL);
    },
    hasNotification() {
      if (this.dismissed || !this.notification) {
        return false;
      }
      const minTreeCount = this.treeCount >= MIN_TREE_COUNT_PILL;
      const publishDate = new Date(this.notification.publish_date).getTime();
      const neverSeen = (
        !this.lastReadNotificationTimestamp ||
        (
          this.lastReadNotificationTimestamp &&
          new Date(this.lastReadNotificationTimestamp) < publishDate
        )
      );

      return (
        this.notificationEnabled &&
        minTreeCount &&
        neverSeen
      );
    },
  },
  mounted() {
    this.unwatch = this.$watch('hasNotification', this.sendImpressionEvent.bind(this), { immediate: true });
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  },
  methods: {
    sendImpressionEvent(hasNotification) {
      if (hasNotification && !this.impressionEventSent) {
        sendCoreAnalyticsEvent('all_notification_impression', { origin: 'center' });
        this.impressionEventSent = true;
      }
    },
    storeLastRead() {
      const key = LAST_READ_NOTIFICATION_COOKIE;
      const value = Date.now();
      const options = getCookieOptions();
      this.$cookieManager.set(key, value, options);
    },
    onClick() {
      this.dismissed = true;
      this.storeLastRead();
    },
  },
};
</script>

<style lang="scss">
.notification-pill-wrapper {
  display: inline-block;
  position: relative;
}
</style>
