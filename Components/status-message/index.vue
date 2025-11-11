<template>
  <div
    :class="classes"
    v-on="$listeners"
  >
    <div class="status-message__left">
      <EIcon :icon="icon" />
    </div>
    <div>
      <p class="status-message__title" data-test-id="title">
        <slot name="title" />
      </p>
      <p v-if="$slots.message" class="status-message__message" data-test-id="message">
        <slot name="message" />
      </p>
    </div>
  </div>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export default {
  name: 'EStatusMessage',
  components: {
    EIcon,
  },
  mixins: [classes],
  props: {
    icon: {
      type: String,
      required: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    stacked: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.status-message {
  display: flex;
  align-items: center;
  padding: $space-m $space-l;

  @include mobile {
    padding: $space-l $space-2l;
  }
}

.status-message--stacked {
  flex-direction: column;
  justify-content: center;

  text-align: center;
}

.status-message__left {
  margin-right: $space-s;

  .status-message--stacked & {
    margin: 0 0 $space-s;
  }
}

.status-message__title,
.status-message__message {
  margin: 0;
}

.status-message__title {
  font-weight: $font-weight-700;
}

.status-message__message {
  margin-top: $space-1s;
}
</style>
