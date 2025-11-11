<template>
  <ESectionWrapper

    v-intersect="showClaims"
    :variant="variant"
    class="claims-section"
    data-test-id="claims-section"
    :compact="compact"
  >
    <ESectionHeader
      class="claims-section__header"
      :title="title"
      :subtitle="subtitle"
      center
      large
    />
    <ol
      class="claims-section__claims"
    >
      <li
        v-for="(claim, index) in claims"
        :key="index"
        class="claims-section__claim"
        data-test-id="claims-section-item"
      >
        <div
          v-if="claimsVisible"
          class="claims-section__claim-icon"
        >
          <div
            class="claims-values-section__image"
            :class="`claims-values-section__image--${claim.icon}`"
            data-test-id="claims-section-image"
          />
        </div>
        <div class="claims-section__claim-content">
          <h4 class="claims-section__claim-title">
            {{ claim.title }}
          </h4>
          <p class="claims-section__claim-description">
            {{ claim.description }}
          </p>
        </div>
      </li>
    </ol>
  </ESectionWrapper>
</template>

<script>
import ESectionHeader from '@ecosia/common-vue2/components/section/header.vue';
import ESectionWrapper from '@ecosia/common-vue2/components/section/wrapper.vue';
export default {
  name: 'EClaims',
  components: {
    ESectionWrapper,
    ESectionHeader,
  },
  props: {
    claims: {
      type: Array,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      claimsVisible: false,
    };
  },
  methods: {
    showClaims() {
      this.claimsVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
$icon-size: 120px;
$claim-content-width: calc(100% - #{$icon-size} - #{$space-2l});

.claims-section {
  font-family: $family-brand;
}

.claims-section__header {
  margin-bottom: $space-3l;
}

.claims-section__claims {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;

  list-style: none;
  text-align: center;

  @include tablet {
    flex-direction: row;
    flex-wrap: wrap;

    text-align: left;
  }
}

.claims-section__claim {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: $space-3l;

  @include tablet {
    flex-direction: row;
    width: 100%;
    padding-left: 0;
  }

  @include desktop {
    width: 50%;
    padding-left: $space-2l;
  }
}

.claims-section__claim-icon {
  display: block;
  flex-shrink: 0;
  width: $icon-size;
  height: $icon-size;
  margin: 0 auto $space-s;

  animation: e-fade-in $timing-2l;

}

.claims-values-section__image {
  width: 100%;
  height: 100%;

  animation: e-fade-in $timing-s;

  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%;
}

.claims-section__claim-content {
  position: relative;

  @include desktop {
    width: $claim-content-width;
  }
}

.claims-section__claim-title {
  margin-top: 0;
  margin-bottom: $space-s;

  color: var(--color-text-primary);
  font-size: $font-3l;
}

.claims-section__claim-description {
  margin: 0;

  color: var(--color-text-primary);
  font-family: $family;
  font-size: $font-l;
}
</style>
