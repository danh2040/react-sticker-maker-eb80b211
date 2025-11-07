<template>
  <span class="ad-pill">{{ $t('common.search.ad') }}</span>
</template>

<script>
export default {
  name: 'EAdPill',
};
</script>

<style lang="scss" scoped>
.ad-pill {
  padding: 0 $space-3s;

  border: 1px solid var(--color-text-secondary);
  border-radius: $border-radius-s;

  color: var(--color-text-secondary);

  /*
    intentionally not using a design system font variable

    this font-size is not as accessible
    and it's an intentional decision :-(
  */
  font-size: 9px;
  text-align: center;
  text-transform: uppercase;
}
</style>
