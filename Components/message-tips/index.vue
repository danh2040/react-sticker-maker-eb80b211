<template>
  <section class="message-tips">
    <p class="message-tips__title" data-test-id="message-tips-message">
      <slot />
    </p>
    <div v-if="hasTips" class="message-tips__content" data-test-id="message-tips-content">
      <span v-if="tipsMessage" data-test-id="message-tips-tips-message">{{ tipsMessage }}</span>
      <ul v-if="multipleTips" class="message-tips__tips" data-test-id="message-tips-tips">
        <li v-for="tip in tips" :key="tip">
          {{ tip }}
        </li>
      </ul>
      <span v-else data-test-id="message-tips-tip">
        {{ tips[0] }}
      </span>
    </div>
  </section>
</template>

<script>
import { isArrayOfStrings } from '@ecosia/universal/validators.js';

export default {
  name: 'EMessageTips',
  props: {
    tipsMessage: {
      type: String,
      default: null,
    },
    tips: {
      type: Array,
      required: true,
      validator: isArrayOfStrings,
    },
  },
  computed: {
    hasTips() {
      return this.tips?.length > 0;
    },
    multipleTips() {
      return this.tips?.length > 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.message-tips {
  font-size: $font-m;
}

.message-tips__title,
.message-tips__content {
  margin: 0;
}

.message-tips__title {
  @include desktop {
    font-size: $font-l;
  }
}

.message-tips__content {
  margin-top: $space-m;
}

.message-tips__tips {
  margin: $space-1s 0 0;
  padding: 0 0 0 $space-1s;
  list-style-position: inside;
}
</style>
