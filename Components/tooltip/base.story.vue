<template>
  <div class="story">
    <ETooltip side="center-top">
      Click me
      <template #content>
        Gumbo beet greens corn soko endive gumbo gourd. Parsley shallot courgette.
      </template>
    </ETooltip>
  </div>
</template>

<script>
import ETooltip from './index.vue';

export default {
  name: 'BaseTooltip',
  statusId: 'Tooltip',
  components: { ETooltip },
};
</script>

<style lang="scss" scoped>
.story {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: $space-8l 0 0 0;
}
</style>
