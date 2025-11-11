<template>
  <div>
    <ETextarea
      placeholder="This is a placeholder text"
    />
  </div>
</template>

<script>
import ETextarea from './index.vue';

export default {
  name: 'BaseTextarea',
  components: {
    ETextarea,
  },
};
</script>
