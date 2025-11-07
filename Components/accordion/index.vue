<template>
  <div class="accordion">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'EAccordion',
  props: {
    defaultOpenIndex: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      activeIndex: this.defaultOpenIndex,
    };
  },
  provide() {
    return {
      getActiveItemIndex: () => this.activeIndex,
      update: this.update,
    };
  },
  methods: {
    update(key) {
      this.activeIndex = key;
    },
  },
};
</script>

<style lang="scss" scoped>
.accordion {
  width: 100%;
  height: 100%;
}
</style>
