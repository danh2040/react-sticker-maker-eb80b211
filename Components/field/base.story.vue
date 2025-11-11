<template>
  <div>
    <EField
      type="select"
      :options="['Option 1', 'Option 2', 'Option 3']"
      placeholder="Choose an option"
      name="test"
      label="Field Label"
      required
    >
      <template #description>
        <div>This is the field description.</div>
      </template>
    </EField>
    <EField
      v-model="value"
      type="checkbox"
      placeholder="Choose an option"
      name="test-checkbox"
      label="Checkbox Field"
      required
    >
      <template #description>
        <div>This is the field description.</div>
      </template>
    </EField>
    <EField
      v-model="valueLeft"
      type="checkbox"
      placeholder="Choose an option"
      name="test-checkbox-left"
      label="Left aligned checkbox field"
      :label-left="true"
    />
    <EField
      type="text"
      placeholder="Type some text"
      name="text-field"
      label="Disabled Field"
      :disabled="true"
    >
      <template #description>
        <div>
          This is a field description with a warning.
          Ullamco aliqua voluptate laborum nostrud eu enim consectetur
          in eiusmod minim ex laboris Lorem.
        </div>
      </template>
    </EField>
    <EField
      type="button"
      name="text-field"
      variant="outline"
      label="Button Field"
    >
      <template #description>
        <div>
          This is a field description with a very long text.
          Ullamco aliqua voluptate laborum nostrud eu enim consectetur
          in eiusmod minim ex laboris Lorem.
        </div>
      </template>
      <template #input-content>
        Button label
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
      value: false,
      valueLeft: true,
    };
  },
};
</script>
