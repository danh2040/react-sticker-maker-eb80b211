<template>
  <span v-show="hasNotification" class="notification-pill" />
</template>

<script>
export default {
  name: 'ENotificationPill',
  props: {
    hasNotification: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.notification-pill {
  position: absolute;
  z-index: $z-index-l;
  top: 0;
  right: 0;
  width: $space-s;
  height: $space-s;

  border: $border-width solid var(--color-background-elevation-1);
  border-radius: $border-radius-full;

  background-color: $n-red-300;
  box-shadow: $elevation-1;

  pointer-events: none;
}
</style>
