<template>
  <div
    class="counter-image"
    :class="classes"
  >
    <EIcon
      v-if="iconName"
      :icon="iconName"
      :size="size === 'l' ? 'l' : 'm'"
      aria-hidden="true"
      class="counter-image__icon"
    />
  </div>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const images = [
  'money',
  'tree',
];

export const imagesSizes = ['s', 'm', 'l'];

export default {
  name: 'ECounterImage',
  components: { EIcon },
  mixins: [classes],
  props: {
    image: {
      type: String,
      default: '',
      validator: (value) => images.includes(value),
      cssClass: true,
    },

    size: {
      type: String,
      default: 's',
      cssClass: true,
      validator: (size) => imagesSizes.includes(size),
    },
  },
  computed: {
    iconName() {
      if (!this.image) {
        return null;
      }
      return this.image === 'tree' ? 'tree-new-brand' : this.image;
    },
  },
};
</script>

<style lang="scss" scoped>
$image-sizes: (
  s: 40px,
  m: 48px,
  l: 60px
);

.counter-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.counter-image__icon {
  display: flex;
  width: 100%;
  height: 100%;
}

.counter-image__icon.icon svg {
  width: 100%;
  height: 100%;
}

@each $size, $value in $image-sizes {
  .counter-image--size-#{$size} {
    width: $value;
    height: $value;
  }
}
</style>
