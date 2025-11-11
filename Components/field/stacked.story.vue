<template>
  <div>
    <EField
      v-model="value1"
      type="text"
      name="test"
      label="Name"
      required
      :error="!value1 ? 'Your name can\' be empty' : null"
    >
      <template #description>
        <div>Please provide your fullname. This text field isn't stacked.</div>
      </template>
    </EField>
    <EField
      v-model="value2"
      type="text"
      name="test"
      label="Address"
      required
      :force-stacked="true"
      :error="!value2 ? 'Your address can\'t be empty' : null"
    >
      <template #description>
        <div>Please provide your address. This text field is force-stacked.</div>
      </template>
    </EField>
  </div>
</template>

<script>
import EField from './index.vue';

export default {
  components: {
    EField,
  },
  data() {
    return {
      value1: '',
      value2: '',
    };
  },
};
</script>
