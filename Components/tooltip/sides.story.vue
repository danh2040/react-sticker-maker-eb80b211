<template>
  <div class="grid">
    <div v-for="side in sides" :key="side">
      <ETooltip :side="side">
        {{ side }}
        <template #content>
          Search results with this icon guide you to greener, more sustainable choices.
        </template>
      </ETooltip>
    </div>
  </div>
</template>

<script>
import ETooltip, { sides } from './index.vue';

export default {
  name: 'SidesTooltip',
  statusId: 'Tooltip',
  components: { ETooltip },
  computed: {
    sides: () => sides,
  },
};
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
  gap: $space-8l;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  padding: $space-8l;

  font-size: $font-m;

  &:not(:first-child) {
    padding-top: 0;
  }
}
</style>
