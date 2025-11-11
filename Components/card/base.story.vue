<template>
  <ECard>
    <p>Here lies content</p>
  </ECard>
</template>

<script>
import ECard from './index.vue';

export default {
  name: 'BaseCard',
  statusId: 'Card',
  components: { ECard },
};
</script>
