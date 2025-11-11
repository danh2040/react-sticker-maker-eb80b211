<template>
  <div>
    <ERadios
      v-model="value"
      name="test"
      required
      :options="[{value: '1', label: 'First option'}, {'value': '2', label: 'Second option'}]"
    />
    <p>
      Selected option: {{ value || 'none' }}
    </p>
  </div>
</template>

<script>
import ERadios from './index.vue';

export default {
  name: 'BaseRadios', // Title for storybook
  statusId: 'Forms/Radios',
  components: { ERadios },
  data() {
    return {
      value: '',
    };
  },
};
</script>
