<template>
  <section
    class="section-wrapper"
    :class="classes"
  >
    <div
      class="section-wrapper__content"
      :class="classes"
    >
      <slot />
    </div>
  </section>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';
import variantProp, { variantTypes } from '@ecosia/common-vue2/mixins/variant-prop.js';

export default {
  name: 'ESectionWrapper',
  mixins: [
    variantProp('variant', 'primary', [...variantTypes.slice(0, 3), 'featured']),
    classes,
  ],
  props: {
    compact: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
  },
  data() {
    return { isCompact: this.compact, getVariant: this.variant };
  },
};
</script>

<style lang="scss" scoped>
.section-wrapper {
  position: relative;
  padding: $space-3l $space-l;

  background: var(--color-background-primary);

  @include mobile-l {
    padding: $space-3l $space-7l;
  }
}

.section-wrapper--variant-secondary {
  background: var(--color-background-secondary);
}

.section-wrapper--variant-tertiary {
  background: var(--color-background-brand-secondary-alt);
}

.section-wrapper--variant-featured {
  background: var(--color-background-featured);
}

.section-wrapper__content {
  max-width: 280px;
  margin: 0 auto;

  @include mobile {
    max-width: 400px;
  }

  @include tablet {
    max-width: 100%;
  }

  @include desktop-l {
    padding: 0 $space-m;
  }
}

.section-wrapper--compact {
  position: relative;
  align-self: center;
  width: 100%;
  max-width: $screen-desktop-l;
  margin: 0 auto;
  padding: 0 $space-m;

  @include desktop {
    padding: 0 $space-3l;
  }
}

.section-wrapper__content--compact {
  width: 100%;
  max-width: $screen-desktop-l;
  margin: 0 auto;

}
</style>
