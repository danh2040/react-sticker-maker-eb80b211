<template>
  <div class="story">
    <EStatusMessage icon="exclamation-circle">
      <template #title>
        Title
      </template>
      <template #message>
        Message
      </template>
    </EStatusMessage>
    <hr>
    <EStatusMessage icon="retry" stacked>
      <template #title>
        Stacked variant
      </template>
      <template #message>
        Message
      </template>
    </EStatusMessage>
  </div>
</template>

<script>
import EStatusMessage from './index.vue';

export default {
  name: 'BaseStatusMessage',
  statusId: 'StatusMessage',
  components: { EStatusMessage },
};
</script>

<style lang="scss" scoped>
.story {
  font-size: $font-m;
}
</style>
