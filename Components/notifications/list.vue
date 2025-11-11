<template>
  <EDropdown
    :visible="visible"
    class="notifications-dropdown"
    side="right"
  >
    <ENotificationItem
      v-for="notification in notifications"
      ref="items"
      :key="notification.id"
      :locale="locale"
      :notification="notification"
      event-origin="center"
      class="notification"
    />
    <ELink :href="blogUrl" class="more">
      {{ readMoreLabel }}
    </ELink>
  </EDropdown>
</template>

<script>
import { mapState } from 'pinia';

import EDropdown from '@ecosia/common-vue2/components/dropdown/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';

import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useNotificationsStore } from '@ecosia/store/notifications/index.js';

import ENotificationItem from './item.vue';

export default {
  name: 'ENotificationList',
  components: {
    EDropdown,
    ELink,
    ENotificationItem,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    blogUrl: {
      type: String,
      required: true,
    },
    readMoreLabel: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useNotificationsStore, ['notifications']),
  },
  methods: {
    focus() {
      this.$refs.items[0].focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.notifications-dropdown {
  top: 100%;
  right: 0;

  border: $border-width solid var(--color-decorative-border-1);
  border-radius: $border-radius-1l;

  box-shadow: $elevation-2;

  @include tablet {
    top: calc(100% + #{$space-s});
    right: -$space-s;
  }

  &::after,
  &::before {
    right: $space-4l + $space-2s;
  }
}

.notification {
  @include divider('bottom');

  &:last-of-type {
    border-bottom: 0;
  }
}

.more {
  @include divider('top');
  display: block;
  padding: $space-s 0;

  border-radius: 0 0 $border-radius-l $border-radius-l;

  color: var(--color-text-primary);
  font-size: $font-m;
  font-weight: $font-weight-500;
  text-align: center;

  &:hover,
  .keyboard-mode &:focus {
    background-color: var(--color-highlight-primary);
  }
}
</style>
