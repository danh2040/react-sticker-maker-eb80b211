<template>
  <div>
    <h3>Default Order</h3>
    <ERadio v-model="value" value="🌳">
      Big tree
    </ERadio>
    <ERadio v-model="value" value="🌲">
      Spikey tree
    </ERadio>
    <ERadio v-model="value" value="🌱">
      Small tree
    </ERadio>
    <br>

    <h3>Reversed Order</h3>
    <ERadio v-model="value" value="🎄" :is-reversed-order="true">
      Christmas tree
    </ERadio>
    <ERadio v-model="value" value="🌴" :is-reversed-order="true">
      Palm tree
    </ERadio>
    <ERadio v-model="value" value="🌵" :is-reversed-order="true">
      Cactus
    </ERadio>
    <br>

    <div>
      The value is {{ value || 'none' }}.
    </div>
    <br>
  </div>
</template>

<script>
import ERadio from './index.vue';

/**
 * Following are examples of using the individual
 * radio button. Note that usually the radio button
 * group would be used instead as shown above.
 */
export default {
  name: 'BaseRadio', // Title for storybook
  statusId: 'Forms/Radios',
  components: { ERadio },
  data() {
    return {
      value: null,
    };
  },
};
</script>
