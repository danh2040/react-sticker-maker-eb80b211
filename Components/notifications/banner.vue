<template>
  <div
    v-if="bannerVisible"
    class="banner"
    data-test-id="banner"
  >
    <div
      data-test-id="banner-content"
      class="banner__content"
    >
      <EIcon
        class="banner__icon"
        icon="bell"
        size="m"
      />
      <a
        v-safe-html="notificationText"
        class="banner__link"
        data-test-id="banner-link"
        target="_blank"
        :href="notification.target_url"
        rel="noopener"
        @click="onClick"
      />
    </div>
    <EButton
      class="banner__close"
      data-test-id="banner-close"
      icon="close"
      icon-size="s"
      size="m"
      variant="solid-gray"
      :aria-label="$t('common.generic.close')"
      @click="onClose"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getCookieOptions, isDateInLastDays } from '@ecosia/common-js/universal/utils.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

import { LAST_DISCARDED_NOTIFICATION as LAST_DISCARDED_NOTIFICATION_COOKIE } from '@ecosia/constants/cookies.js';
import { useNotificationsStore } from '@ecosia/store/notifications/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import { NOTIFICATION_DAYS_BANNER, NOTIFICATION_LEVEL_BANNER } from './constants.js';

export default {
  components: {
    EButton,
    EIcon,
  },
  data() {
    return {
      impressionEventSent: false,
    };
  },
  computed: {
    ...mapState(useUserStore, [
      'lastDiscardedNotification',
      'notificationEnabled',
    ]),
    ...mapState(useNotificationsStore, ['bannerVisible', 'getByLevel']),
    notification() {
      return this.getByLevel(NOTIFICATION_LEVEL_BANNER);
    },
    notificationText() {
      return this.notification.text;
    },
  },
  watch: {
    notification: {
      handler: 'setVisibility',
      immediate: true,
    },
  },
  mounted() {
    this.unwatch = this.$watch('bannerVisible', this.sendImpressionEvent.bind(this), { immediate: true });
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  },
  methods: {
    ...mapActions(useNotificationsStore, ['setBannerVisible']),
    ...mapActions(useUserStore, ['set']),
    sendEvent(name) {
      sendCoreAnalyticsEvent(name, {
        origin: 'banner',
        level: NOTIFICATION_LEVEL_BANNER,
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
      const publishDate = new Date(notification.publish_date).getTime();
      const publishedRecently = isDateInLastDays(publishDate, NOTIFICATION_DAYS_BANNER);
      const neverSeen = (
        !this.lastDiscardedNotification ||
        (
          this.lastDiscardedNotification &&
          new Date(this.lastDiscardedNotification.banner) < publishDate
        )
      );

      if (
        this.notificationEnabled &&
        publishedRecently &&
        neverSeen
      ) {
        this.setBannerVisible(true);
      }
    },
    sendClickEvent() {
      this.sendEvent('all_notification_click');
    },
    sendDismissEvent() {
      this.sendEvent('all_notification_dismiss');
    },
    storeLastDiscarded() {
      const key = LAST_DISCARDED_NOTIFICATION_COOKIE;
      const value = {
        banner: Date.now(),
        popup: this.lastDiscardedNotification?.popup ?? null,
      };
      const options = getCookieOptions();
      this.set({ lastDiscardedNotification: value });
      this.$cookieManager.set(key, value, options);
    },
    hide() {
      this.setBannerVisible(false);
      this.storeLastDiscarded();
    },
    onClick() {
      this.hide();
      this.sendClickEvent();
    },
    onClose() {
      this.hide();
      this.sendDismissEvent();
    },
  },
};
</script>

<style lang="scss" scoped>
$notification-banner-height: 64px;

.banner {
  display: flex;
  position: relative;
  align-items: center;
  min-height: $notification-banner-height;
  padding: $space-s;

  background-color: var(--color-button-border);

  @include desktop {
    height: $notification-banner-height;
    padding: 0;
  }
}

.banner__icon {
  margin-right: $space-s;

  color: var(--color-button-content-primary);
}

.banner__content {
  flex-grow: 0;
  flex-shrink: 1;
  padding: 0 $space-4l 0 $space-m;

  @include mobile-l {
    flex-grow: 1;
    padding: 0 $space-4l 0 $space-m;

    text-align: center;
  }

}

.banner__link {
  color: var(--color-text-inverse-primary);
  font-size: $font-m;
  text-overflow: ellipsis;

  overflow-wrap: break-word;

  @include desktop {
    font-size: $font-l;
  }

}

.banner__close {
  position: absolute;
  z-index: $z-index-l;
  top: $space-m;
  right: $space-m;

  border: none;

  background: none;

  @include tablet {
    right: $space-m;
  }

  @include desktop {
    top: 50%;
    right: $space-1l;

    transform: translate(0, -50%);
  }
}
</style>
