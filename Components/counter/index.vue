<template>
  <div :class="classes">
    <ECounterImage
      v-if="image"
      :size="imageSize"
      :image="image"
      aria-hidden="true"
      class="counter__image"
    />
    <div data-test-id="counter-count" class="counter__count">
      {{ count }}
    </div>
    <div
      v-if="description"
      class="counter__description"
      data-test-id="counter-description"
    >
      {{ description }}
    </div>
  </div>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

import ECounterImage, { images, imagesSizes } from './image.vue';

export default {
  name: 'ECounter',
  components: {
    ECounterImage,
  },
  mixins: [classes],
  props: {
    count: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
      validator: (value) => value === '' || images.includes(value),
    },
    imageSize: {
      type: String,
      default: 's',
      validator: (size) => size === '' || imagesSizes.includes(size),
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    withTransition: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
  },
};
</script>

<style lang="scss" scoped>
$counter-width: 290px;

.counter {
  display: grid;
  gap: 0 $space-1s;
  grid-template-areas: 'image count' 'image description';
  grid-template-columns: max-content;
  flex: 1;
  width: auto;
  min-height: $space-4l;
  padding: $space-m;

  color: var(--color-text-primary);
  font-family: $family;
  text-align: left;

  @include tablet {
    min-height: 69px;
  }

  &__image {
    grid-area: image;
    align-self: center;
  }

  &__count {
    display: flex;
    grid-area: count;
    align-items: center;

    font-size: $font-2l;
    font-weight: $font-weight-700;
    white-space: nowrap;
  }

  &__description {
    grid-area: description;
    margin-bottom: 0;

    color: var(--color-text-secondary);
    font-size: $font-m;
    font-weight: $font-weight-400;
  }
}

.counter--with-transition {
  @include class-opacity-transition('counter--with-transition');
}

</style>
