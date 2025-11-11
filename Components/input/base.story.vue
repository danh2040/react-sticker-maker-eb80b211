<template>
  <div class="example-wrapper">
    <label for="text">Text field</label>
    <EInput id="text" placeholder="e.g. John Doe" />
    <label for="num">Number field</label>
    <EInput id="num" placeholder="e.g. 123.456" />
    <label for="date">Date field</label>
    <EInput id="date" />
    <label for="dis">Disabled field</label>
    <EInput id="dis" placeholder="this field is disabled" />
    <label for="inv">Invalid field</label>
    <EInput id="inv" name="test" invalid placeholder="this field is invalid" />
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
