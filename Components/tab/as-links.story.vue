<template lang="">
  <div class="tab-story">
    <ETab url="#" icon="search">
      Link Tab
    </ETab>
    <ETab url="#" icon="shopping" highlighted>
      Highlighted Link Tab
    </ETab>
    <ETab as="div" icon="news">
      Tab without link
    </ETab>
  </div>
</template>

<script>
import ETab from './index.vue';

export default {
  components: {
    ETab,
  },
};
</script>

<style lang="scss">
.tab-story {
  display: flex;
  gap: $space-1s;
}
</style>
