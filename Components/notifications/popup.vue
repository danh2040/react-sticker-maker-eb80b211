<template>
  <transition name="fade">
    <div
      v-if="visible"
      v-on-clickaway="hide"
      class="notifications-popup"
    >
      <ENotificationItem
        :locale="locale"
        :notification="notification"
        :date-visible="false"
        class="notifications-popup__item"
        event-origin="popup"
        data-test-id="notifications-popup-item"
        @click="onClick"
      />
      <EButton
        class="notifications-popup__close"
        size="s"
        icon="close"
        icon-size="s"
        variant="bare"
        data-test-id="notifications-popup-close"
        aria-label="Close the popup"
        @click="onClose"
      />
    </div>
  </transition>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';
import { mapActions, mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getCookieOptions, isDateInLastDays } from '@ecosia/common-js/universal/utils.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';

import { LAST_DISCARDED_NOTIFICATION as LAST_DISCARDED_NOTIFICATION_COOKIE } from '@ecosia/constants/cookies.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useNotificationsStore } from '@ecosia/store/notifications/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import {
  MIN_TREE_COUNT_POPUP,
  NOTIFICATION_DAYS_POPUP,
  NOTIFICATION_LEVEL_POPUP,
} from './constants.js';
import ENotificationItem from './item.vue';

export default {
  name: 'ENotificationPopup',
  components: {
    EButton,
    ENotificationItem,
  },
  mixins: [clickaway],
  data() {
    return {
      impressionEventSent: false,
    };
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useUserStore, [
      'lastDiscardedNotification',
      'notificationEnabled',
      'treeCount',
    ]),
    ...mapState(useNotificationsStore, [
      'popupVisible',
      'getByLevel',
    ]),
    notification() {
      return this.getByLevel(NOTIFICATION_LEVEL_POPUP);
    },
    visible() {
      return this.popupVisible;
    },
  },
  watch: {
    notification: {
      handler: 'setVisibility',
      immediate: true,
    },
  },
  mounted() {
    this.unwatch = this.$watch('visible', this.sendImpressionEvent.bind(this), { immediate: true });
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  },
  methods: {
    ...mapActions(useNotificationsStore, ['setPopupVisible']),
    ...mapActions(useUserStore, ['set']),
    sendEvent(name) {
      sendCoreAnalyticsEvent(name, {
        origin: 'popup',
        level: NOTIFICATION_LEVEL_POPUP,
        trackingname: this.notification.tracking_name,
      });
    },
    sendImpressionEvent(visible) {
      if (visible && !this.impressionEventSent) {
        this.sendEvent('all_notification_impression');
        this.impressionEventSent = true;
      }
    },
    setVisibility(notification) {
      if (!notification) {
        return;
      }
      const minTreeCount = this.treeCount >= MIN_TREE_COUNT_POPUP;
      const publishDate = new Date(notification.publish_date).getTime();
      const publishedRecently = isDateInLastDays(publishDate, NOTIFICATION_DAYS_POPUP);
      const neverSeen = (
        !this.lastDiscardedNotification ||
        (
          this.lastDiscardedNotification &&
          new Date(this.lastDiscardedNotification.popup) < publishDate
        )
      );

      if (
        this.notificationEnabled &&
        minTreeCount &&
        publishedRecently &&
        neverSeen
      ) {
        this.setPopupVisible(true);
      }
    },
    sendDismissEvent() {
      this.sendEvent('all_notification_dismiss');
    },
    storeLastDiscarded() {
      const key = LAST_DISCARDED_NOTIFICATION_COOKIE;
      const value = {
        banner: this.lastDiscardedNotification?.banner ?? null,
        popup: Date.now(),
      };
      const options = getCookieOptions();
      this.set({ lastDiscardedNotification: value });
      this.$cookieManager.set(key, value, options);
    },
    hide() {
      this.setPopupVisible(false);
      this.storeLastDiscarded();
    },
    onClick() {
      this.hide();
    },
    onClose() {
      this.hide();
      this.sendDismissEvent();
    },
  },
};
</script>

<style lang="scss" scoped>
$notification-banner-height: $space-4l;
$top: $space-4l + $space-2l;
$top-with-banner: $top + $notification-banner-height;

.notifications-popup {
  @include elevation(1);

  display: none;
  position: absolute;
  z-index: $z-index-1l;
  top: $top;
  right: -$space-4l;
  width: 400px;
  overflow: hidden;

  border-radius: $border-radius-l;

  @include tablet {
    display: block;
  }
}

.notifications-popup__close {
  position: absolute;
  top: $space-2s;
  right: $space-2s;
  width: $space-2l;
  height: $space-2l;
  padding: 0;

  transform: scale($scale-3s);

  line-height: $space-2l;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $timing-1s ease-in;
}
</style>
