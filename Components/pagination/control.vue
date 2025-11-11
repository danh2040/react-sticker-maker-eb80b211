<template>
  <EButton
    v-bind="$attrs"
    :icon="icon"
    as="a"
    icon-size="s"
    variant="bare"
    v-on="$listeners"
  />
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';

export const sides = ['left', 'right'];

export default {
  name: 'EPaginationControl',
  components: {
    EButton,
  },
  props: {
    side: {
      type: String,
      validator: (value) => sides.includes(value),
      default: sides[0],
    },
  },
  computed: {
    icon() {
      return `chevron-${this.side}`;
    },
  },
};
</script>
