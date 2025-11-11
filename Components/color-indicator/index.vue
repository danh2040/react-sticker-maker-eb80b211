<template>
  <div :class="classes">
    <div
      class="color-indicator__color"
      :style="{ '--color-indicator-color': color }"
    />
    <EIcon
      v-show="!active && showPlus"
      class="color-indicator__icon color-indicator__icon--plus"
      icon="plus"
      :size="size"
    />
    <EIcon
      v-show="active"
      class="color-indicator__icon color-indicator__icon--check"
      icon="check-circle"
      :color="color"
      :size="size"
    />
  </div>
</template>

<script>
import EIcon, { sizes } from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export { sizes };

export default {
  name: 'EColorIndicator',
  components: {
    EIcon,
  },
  mixins: [classes],
  props: {
    active: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    color: {
      type: String,
      required: true,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    darkIcons: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    showPlus: {
      type: Boolean,
      default: true,
    },
    size: EIcon.props.size,
  },
};
</script>

<style lang="scss" scoped>
$sizes: (
  s: 16px,
  m: 22px,
);

.color-indicator {
  position: relative;
  overflow: hidden;

  border-radius: $border-radius-full;

  color: white;

  @each $name, $size in $sizes {
    &--size-#{$name} {
      width: $size;
      height: $size;
    }
  }
}

.color-indicator__color {
  width: 100%;
  height: 100%;

  background: var(--color-indicator-color);
}

.color-indicator__icon {
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  color: white;

  pointer-events: none;
}

.color-indicator__icon--plus {
  transition: opacity $timing-2s;

  opacity: 0;

  .color-indicator:hover &,
  .color-indicator:focus & {
    opacity: 1;
  }
}

// Not using semantic colors here
// This color is used regardless of theme
.color-indicator--dark-icons .color-indicator__icon {
  color: $c-gray-50;
}
</style>
