<template>
  <div class="story">
    <EHeading>Default headline is h1</EHeading>
    <div v-for="tag in allowedTags" :key="tag">
      <EHeading :as="tag">
        {{ tag }} headline
      </EHeading>
    </div>
  </div>
</template>

<script>
import EHeading, { allowedTags } from './index.vue';

export default {
  name: 'Base',
  statusId: 'Heading',
  components: { EHeading },
  data() {
    return {
      allowedTags,
    };
  },
};
</script>
