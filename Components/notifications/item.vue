<template>
  <article class="notifications-item" v-on="$listeners">
    <a
      ref="link"
      :href="notification.target_url"
      class="notifications-item__link"
      data-test-id="notifications-item-link"
      rel="noopener"
      @click="onClick"
    >
      <div
        v-if="notification.has_background"
        class="notifications-item__image notifications-item__background"
      />
      <!--
        Warning: due to hydration issues the `loading` attribute
        must be above the `src` attribute. See /docs/frontend/VueImageLazyLoading.md
      -->
      <img
        v-else-if="imageVisible"
        loading="lazy"
        :src="notification.image_url"
        class="notifications-item__image"
        alt=""
      >
      <ELogoColor
        v-else
        class="notifications-item__image notifications-item__logo"
      />
      <p class="notifications-item__text" data-test-id="notifications-item-text">
        <span v-safe-html="notificationText" class="notifications-item__content" />
        <time
          v-if="dateVisible"
          :datetime="notification.publish_date"
          class="notifications-item__date"
          data-test-id="notifications-item-date"
        >
          {{ formattedDate }}
        </time>
      </p>
    </a>
  </article>
</template>

<script>
import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import ELogoColor from '@ecosia/common-vue2/components/logos/logo-ecosia.svg';

import { localiseDate, localiseTimeFromNow } from '@ecosia/universal/datetime.js';

export default {
  name: 'ENotificationItem',
  components: {
    ELogoColor,
  },
  props: {
    locale: {
      type: String,
      required: true,
    },
    notification: {
      type: Object,
      required: true,
    },
    eventOrigin: {
      type: String,
      required: true,
    },
    dateVisible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fallbackVisible: false,
    };
  },
  computed: {
    formattedDate() {
      return this.dateVisible ?
        this.formatDate(new Date(this.notification.publish_date)) :
        '';
    },
    notificationText() {
      return this.notification.text.replace(/<(?!\/?strong)[^>]+>/g, '');
    },
    imageVisible() {
      return !!this.notification.image_url && !this.fallbackVisible;
    },
  },
  beforeMount() {
    this.handler = ({ src }) => {
      if (src === this.notification.image_url) {
        this.fallbackVisible = true;
      }
    };
  },
  methods: {
    onClick() {
      sendCoreAnalyticsEvent('all_notification_click', {
        origin: this.eventOrigin,
        level: this.notification.level,
        trackingname: this.notification.tracking_name,
      });
    },
    formatDate(date) {
      return localiseTimeFromNow(this.locale, date) ??
        localiseDate(this.locale, date, { month: 'short' }) ??
        '';
    },
    focus() {
      this.$refs.link.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
$image-size: 90px;

.notifications-item {
  width: 400px;

  background-color: var(--color-background-elevation-2);

  font-size: $font-m;
}

.notifications-item__link {
  display: flex;
  position: relative;
  padding: $space-m;

  transition: background-color $timing-2s $easing;

  &,
  &:visited {
    color: var(--color-text-primary);
  }

  &:hover,
  .keyboard-mode &:focus {
    background-color: var(--color-highlight-primary);
  }
}

.notifications-item__image {
  width: $image-size;
  min-width: $image-size;
  height: $image-size;

  border-radius: $border-radius-l;

  background-color: var(--color-background-secondary);
  background-size: contain;
}

.notifications-item__logo {
  padding: $space-1s;

  color: var(--color-brand-primary);
}

.notifications-item__background {
  background-image:
    url("@ecosia/common-vue2/assets/notification/static-notification-light.svg?asPath");
}

.dark {
  .notifications-item__background {
    background-image:
      url("@ecosia/common-vue2/assets/notification/static-notification-dark.svg?asPath");
  }
}

.notifications-item__text {
  display: block;
  margin: 0;
  padding: $space-1s $space-m 0 $space-m;

  line-height: $line-height-s;
}

.notifications-item__content {
  @include line-clamp(3);
}

.notifications-item__date {
  display: block;
  margin-top: $space-2s;

  color: var(--color-text-secondary);
  font-size: $font-s;
}
</style>
