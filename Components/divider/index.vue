<template>
  <hr class="divider">
</template>

<script>
export default {
  name: 'EDivider',
};
</script>

<style lang="scss" scoped>
.divider {
  border: none;

  @include divider('top');
}
</style>
