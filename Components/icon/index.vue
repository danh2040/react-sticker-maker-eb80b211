<template>
  <component
    :is="component"
    v-if="component"
    v-bind="$attrs"
    :class="classes"
    v-on="$listeners"
  />
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';

export const sizes = ['l', 'm', 's'];

export default {
  name: 'EIcon',
  mixins: [classes],
  props: {
    /**
     * available icons, see examples
     */
    icon: {
      type: String,
      required: true,
      cssClass: true,
    },
    /**
     * `s, m, l`
     */
    size: {
      type: String,
      default: 'm',
      validator: (value) => sizes.includes(value),
      cssClass: true,
    },
  },
  computed: {
    component() {
      // IMPORTANT! do not remove this line
      // accessing the reactive properties of the component VM here
      // ensures that the computed is updated when they change.
      // Calling `this[property]` inside the import statement does not count,
      // because when Vue tries to figure out the "dependencies" of this computed,
      // it will not execute the returned function
      const { icon, size } = this;

      if (!this.$options.props.size.validator(this.size)) {
        return null;
      }

      return async () => (await import(
        /* webpackMode: "lazy-once", webpackChunkName: "icons" */
        `../icons/${size}/${icon}.svg`
      )).default;
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  vertical-align: middle;

  &.icon--icon-check-circle.icon--size-l path {
    animation: e-svg-stroke 0.5s ease-out forwards;

    stroke-dasharray: 29;
    stroke-dashoffset: 29;
  }

  &--icon-spinner {
    animation: e-spin 0.9s linear both infinite;
  }
}
</style>
