<template>
  <div>
    <ECheckbox v-model="value" name="checkbox-test" />
    <p>The value is {{ value }}</p>
  </div>
</template>

<script>
import ECheckbox from './index.vue';

export default {
  name: 'BaseCheckbox', // Title for storybook
  statusId: 'Forms/Checkboxes',
  components: { ECheckbox },
  data() {
    return {
      value: null,
    };
  },
};
</script>
