<template>
  <div
    v-intersect="showForest"
    :class="allClasses"
  >
    <div
      class="forest-section__forest"
      :class="{ 'forest-section__forest--visible': forestVisible }"
      data-test-id="forest-section-forest"
    />
    <EWaveSeparator
      v-if="showWave"
      :variant="waveVariant"
      class="forest-section__wave"
      data-test-id="forest-section-wave"
    />
  </div>
</template>

<script>
import EWaveSeparator from '@ecosia/common-vue2/components/wave-separator/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';
import variantProp, { variantTypes } from '@ecosia/common-vue2/mixins/variant-prop.js';

export default {
  name: 'EForestSection',
  components: {
    EWaveSeparator,
  },
  mixins: [
    classes,
    variantProp('background', 'primary', variantTypes.slice(0, 3)),
  ],
  props: {
    bypassLazyLoading: {
      type: Boolean,
      default: false,
    },
    showWave: {
      type: Boolean,
      default: false,
    },
    waveVariant: {
      type: String,
      default: 'secondary',
    },
  },
  data() {
    return {
      forestVisible: false,
    };
  },
  computed: {
    allClasses() {
      return [...this.classes];
    },
  },
  created() {
    if (this.bypassLazyLoading) {
      this.showForest();
    }
  },
  methods: {
    showForest() {
      this.forestVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
$forest-width-desktop: 1368px;
$forest-height-desktop: 350px;
$forest-width-tablet: 900px;
$forest-height-tablet: 230px;

.forest-section {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  overflow-x: hidden;
  overflow-y: visible;

  background-color: var(--color-background-primary);
}

.forest-section--background-secondary {
  background-color: var(--color-background-secondary);
}

.forest-section--background-tertiary {
  background-color: var(--color-background-brand-secondary-alt);
}

.forest-section__wave {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.forest-section__forest {
  width: $forest-width-tablet;
  height: $forest-height-tablet;

  background-repeat: no-repeat;

  @include desktop {
    width: $forest-width-desktop;
    height: $forest-height-desktop;
  }
}

.forest-section__forest--visible {
  background-image: url("@ecosia/common-vue2/assets/forest/forest.svg?asPath");
}

.dark .forest-section__forest--visible {
  background-image: url("@ecosia/common-vue2/assets/forest/forest-dark.svg?asPath");
}
</style>
