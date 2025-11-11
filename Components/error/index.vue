<template>
  <div v-if="$slots.default" class="error" v-bind="$attrs" v-on="$listeners">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'EError',
};
</script>

<style lang="scss" scoped>
.error {
  color: var(--color-error);
  font-family: $family;
  font-size: $font-m;
  line-height: $line-height-m;
}
</style>
