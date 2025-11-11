<template>
  <div
    class="section-header"
    :class="{ 'section-header--center': center }"
  >
    <h2
      v-if="title"
      :id="headingId"
      class="section-header__title"
      :class="{ 'section-header__title--variant': isVariant }"
    >
      {{ title }}
    </h2>
    <h3
      v-if="subtitle"
      class="section-header__subtitle"
      :class="{
        'section-header__subtitle--large': large,
        'section-header__subtitle--variant': isVariant,
      }"
    >
      {{ subtitle }}
    </h3>
  </div>
</template>

<script>
const variants = ['primary', 'secondary'];

export default {
  props: {
    center: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => variants.includes(value),
    },
    // used by the section parent in order to be identified as a landmark
    headingId: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  computed: {
    isVariant() {
      return this.variant === 'secondary';
    },
  },
};
</script>

<style lang="scss" scoped>
.section-header {
  position: relative;
  width: 100%;
  margin-bottom: $space-2l;

  text-align: left;
}

.section-header--center {
  text-align: center;
}

.section-header__title {
  margin: 0 0 $space-s;

  color: var(--color-text-primary);
  font-family: $family;
  font-size: $font-m;
  font-style: normal;
  font-weight: $font-weight-700;
  line-height: $line-height-m;
  text-transform: uppercase;
}

.section-header__title--variant {
  color: var(--color-text-overline-secondary);
}

.dark {
  .section-header__title--variant {
    color: var(--color-text-primary);
  }
}

.section-header__subtitle {
  margin: 0;

  color: var(--color-text-primary);
  font-family: $family-brand;
  font-size: $font-4l;
  font-style: normal;
  font-weight: $font-weight-700;
  line-height: $line-height-s;
}

.section-header__subtitle--variant {
  color: var(--color-text-static-light);
}

.section-header__subtitle--large {
  @include desktop {
    font-size: $font-6l;
  }
}

</style>
