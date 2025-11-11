<template lang="">
  <div class="panel-story">
    <div>
      <button type="button" @click="left = !left">
        Toggle left panel
      </button>
      <EPanel :visible="left">
        <button type="button" @click="left = !left">
          Close left panel
        </button>
      </EPanel>
    </div>

    <div>
      <button type="button" @click="right = !right">
        Toggle right panel
      </button>
      <EPanel side="right" :visible="right">
        <button type="button" @click="right = !right">
          Toggle right panel
        </button>
      </EPanel>
    </div>
  </div>
</template>

<script>
import EPanel from './index.vue';

export default {
  name: 'Panel',
  components: { EPanel },
  data() {
    return {
      right: false,
      left: false,
    };
  },
};
</script>

<style>
  .panel-story {
    display: flex;
    justify-content: center;
    height: 200px;
  }

  .panel-story button {
    margin: 1em;
  }
</style>
