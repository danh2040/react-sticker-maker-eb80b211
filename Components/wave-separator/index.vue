<template>
  <div
    v-intersect="show"
    :class="allClasses"
    data-test-id="wave-separator"
  />
</template>

<script>
import classes, { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';
import variantProp, { variantTypes } from '@ecosia/common-vue2/mixins/variant-prop.js';

const variants = [...variantTypes.slice(0, 3), 'secondary-alternate', 'secondary-engt-1922'];

export default {
  name: 'EWaveSeparator',
  mixins: [
    classes,
    variantProp('variant', 'primary', variants),
  ],
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    allClasses() {
      const allClasses = [...this.classes];
      if (this.visible) {
        allClasses.push(getModifierClass('wave-separator', 'visible'));
      }
      return allClasses;
    },
  },
  methods: {
    show() {
      this.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
$height-primary-l: 238px;
$height-primary-s: 153px;
$aspect-ratio-primary-l: math.round(math.div(238, 1200) * 100%);
$aspect-ratio-primary-s: math.round(math.div(153, 768) * 100%);

$height-secondary-l: 115px;
$height-secondary-s: 73px;
$aspect-ratio-secondary-l: math.round(math.div(115, 1200) * 100%);
$aspect-ratio-secondary-s: math.round(math.div(73, 768) * 100%);

$height-tertiary-l: 190px;
$height-tertiary-s: 122px;
$aspect-ratio-tertiary-l: math.round(math.div(190, 1200) * 100%);
$aspect-ratio-tertiary-s: math.round(math.div(122, 768) * 100%);

$wave-variants: "primary", "secondary", "secondary-alternate", "secondary-engt-1922", "tertiary";

.wave-separator {
  position: relative;
  width: 100%;
  overflow: hidden;

  background-color: transparent;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;

  background-position-y: $space-2s;
}

@each $variant in $wave-variants {
  .dark .wave-separator--variant-#{$variant} {
    &.wave-separator--visible {
      background-image: url("@ecosia/common-vue2/assets/waves/#{$variant}-s-dark.svg?asPath");

      @include tablet {
        background-image: url("@ecosia/common-vue2/assets/waves/#{$variant}-l-dark.svg?asPath");
      }
    }
  }

  .wave-separator--variant-#{$variant} {
    &.wave-separator--visible {
      background-image: url("@ecosia/common-vue2/assets/waves/#{$variant}-s.svg?asPath");

      @include tablet {
        background-image: url("@ecosia/common-vue2/assets/waves/#{$variant}-l.svg?asPath");
      }
    }
  }
}

.wave-separator--variant-primary {
  height: $height-primary-s;
  padding-bottom: $aspect-ratio-primary-l;

  @include tablet {
    height: $height-primary-l;
    padding-bottom: $aspect-ratio-primary-l;
  }
}

.wave-separator--variant-secondary,
.wave-separator--variant-secondary-alternate,
.wave-separator--variant-secondary-engt-1922 {
  height: $height-secondary-s;
  padding-bottom: $aspect-ratio-secondary-s;

  @include tablet {
    height: $height-secondary-l;
    padding-bottom: $aspect-ratio-secondary-l;
  }
}

.wave-separator--variant-tertiary {
  height: $height-tertiary-s;
  padding-bottom: $aspect-ratio-tertiary-s;

  background-position-y: -$space-2s;

  @include tablet {
    height: $height-tertiary-l;
    padding-bottom: $aspect-ratio-tertiary-l;
  }
}
</style>
