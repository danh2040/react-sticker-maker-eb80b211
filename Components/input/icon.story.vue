<template>
  <div class="example-wrapper">
    <label for="text">Default icon size is M</label>
    <EInput name="test" icon-size="m" icon="search" value="tree" />

    <label for="text">With Icon size S</label>
    <EInput name="test" icon-size="s" icon="search" value="baum" />

    <label for="text">With Icon size L</label>
    <EInput name="test" icon-size="l" icon="search" value="árbol" />
  </div>
</template>

<script>
import EInput from './index.vue';

export default {
  components: {
    EInput,
  },
};
</script>

<style lang="scss">
.example-wrapper {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
  max-width: 500px;
}
</style>
