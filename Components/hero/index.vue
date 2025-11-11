<template>
  <section :class="classes">
    <div class="hero__section">
      <div class="hero__content">
        <h1
          v-if="title"
          :class="classNames"
          data-test-id="hero-title"
        >
          {{ title }}
        </h1>
        <h2
          v-if="subtitle"
          class="hero__subtitle"
          data-test-id="hero-subtitle"
        >
          {{ subtitle }}
        </h2>
        <slot name="content" />
      </div>
    </div>
    <div v-if="isDivided" class="hero__right" data-test-id="hero-right">
      <slot name="right" />
      <div class="hero__wave" />
    </div>
  </section>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';
import screen from '@ecosia/common-vue2/mixins/screen.js';
import variantProp from '@ecosia/common-vue2/mixins/variant-prop.js';

const heroVariants = ['secondary', 'tertiary', 'quaternary'];

export default {
  name: 'EHero',
  mixins: [
    classes,
    screen,
    variantProp('variant', 'tertiary', heroVariants),
  ],
  props: {
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    contentLeft: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    isDivided: {
      type: Boolean,
      default: false,
    },
    subtitle: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  /*
   * This is a workaround for the rare edge case where long, one-word titles
   * (specifically 'Nutzungsbedingungen') are too long for the container.
   * Detecting this via string length is a band-aid fix for this one case. We
   * should make the solution more robust if and when a second case emerges.
   */
  computed: {
    classNames() {
      return {
        'hero__title': true,
        'hero__title--long': this.isLongTitle,
      };
    },
    isLongTitle() {
      return this.title.length > 18 && this.title.split(' ').length === 1;
    },
  },
};
</script>

<style lang="scss" scoped>
.hero {
  display: flex;
  position: relative;
  width: 100%;
  min-height: 640px;
  overflow: hidden;
}

.hero__section,
.hero__right {
  @include desktop {
    width: 50%;

    transition: width $timing-m $easing;
  }
}

.hero__section {
  width: 100%;
  padding: 0 $space-l;

  @include desktop {
    padding: 0;
  }
}

.hero__content {
  display: flex;
  gap: $space-1l;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 380px;
  height: 100%;
  margin: auto;

  color: var(--color-text-brand-secondary);
  text-align: center;

  @include desktop {
    max-width: 800px;
  }
}

.hero__title,
.hero__subtitle {
  color: var(--color-text-brand-secondary);
  font-family: $family-brand;
  line-height: $line-height-1s;
}

.hero__title {
  margin: 0;

  font-size: $font-4l;

  @include tablet {
    font-size: $font-6l;
  }

  @include desktop-l {
    font-size: $font-7l;
  }
}

.hero__title--long {
  @include desktop {
    font-size: $font-6l;
  }

  @include desktop-1l {
    font-size: $font-7l;
  }
}

.hero__subtitle {
  margin: 0 0 $space-1s;

  line-height: $line-height-s;

  @include desktop-l {
    font-size: $font-4l;
  }
}

.hero__wave {
  display: none;
  position: absolute;
  top: 0;
  right: calc(90% + 1px);
  width: 10%;
  height: 100%;

  mask-image: url("@ecosia/common-vue2/assets/images/vertical-divider-wave.svg?asPath");
  mask-repeat: no-repeat;
  mask-size: auto 100%;

  @include desktop {
    display: block;
  }
}

.hero__right {
  display: none;
  overflow: hidden;

  @include desktop {
    display: block;
    position: relative;
    width: 100%;
  }
}

$variants: (
  secondary,
  tertiary,
  quaternary,
);

.hero--variant-secondary {
  &,
  .hero__wave {
    background-color: var(--color-background-secondary);
  }
}

.hero--variant-quaternary {
  &,
  .hero__wave {
    background-color: var(--color-background-brand-secondary-alt);
  }

  .hero__title,
  .hero__subtitle {
    color: $white;
  }
}

.hero--content-left .hero__content {
  @include desktop {
    align-items: flex-start;
    max-width: 380px;
    padding: 0;

    text-align: left;
  }

  @include desktop-l {
    max-width: 485px;
  }
}
</style>
