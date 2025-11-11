<template>
  <div>
    <p>
      <label for="text">When are you travelling?</label>
    </p>
    <ESegmentedInput>
      <EInput name="date1" type="date" icon="arrow-right" icon-size="s" />
      <EInput name="date2" type="date" icon="arrow-left" icon-size="s" />
    </ESegmentedInput>
  </div>
</template>

<script>
import EInput from './index.vue';
import ESegmentedInput from './segmented-input.vue';

export default {
  components: {
    EInput,
    ESegmentedInput,
  },
};
</script>
