<template>
  <div class="button-example">
    <EButton
      icon="bell"
      variant="solid-green"
      size="m"
      tooltip-text="Icon button with tooltip"
    />
  </div>
</template>

<script>
import EButton from './index.vue';

export default {
  name: 'TooltipIconButton',
  statusId: 'TooltipIconButton',
  components: { EButton },
};
</script>

<style lang="scss" scoped>
.button-example {
  display: flex;
  justify-content: center;
}
</style>
