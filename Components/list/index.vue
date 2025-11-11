<template>
  <component :is="listType" class="list">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'EList',
  props: {
    /**
     * Whether the HTML element should render as `ol` or `ul`
     */
    ordered: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    listType() {
      return this.ordered ? 'ol' : 'ul';
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>
