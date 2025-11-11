<template>
  <div class="banner">
    <div v-if="showImage" class="banner__image">
      <slot name="image" />
    </div>
    <div class="banner__text">
      <EHeading as="h2" styled-as="h5" class="banner__headline">
        {{ headline }}
      </EHeading>
      <p v-safe-html="description" class="banner__description" />
    </div>
    <div v-if="showActions" class="banner__actions">
      <slot name="actions" />
    </div>
    <EButton
      v-if="hasCloseAction"
      icon="close"
      variant="bare"
      class="banner__close"
      data-test-id="close"
      @click.stop="onClose"
    />
  </div>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EHeading from '@ecosia/common-vue2/components/heading/index.vue';

export default {
  name: 'EBanner',
  components: {
    EButton,
    EHeading,
  },
  props: {
    headline: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    hasCloseAction: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    showImage() {
      return !!this.$slots.image;
    },
    showActions() {
      return !!this.$slots.actions;
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.banner {
  @include elevation(2);

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  padding: $space-l;

  background: var(--color-background-primary);

  @include desktop {
    padding: $space-m $space-3l;
  }
}

.banner__image {
  width: 50px;
  margin-right: $space-l;
}

.banner__text {
  display: contents;
  width: 100%;
  margin-top: $space-m;

  @include desktop {
    display: block;
    width: auto;
    max-width: 50%;
    margin-top: 0;
  }
}

.banner__headline {
  margin: 0;

  line-height: $line-height-l;

  @include desktop {
    font-size: $font-l;
  }
}

.banner__description {
  width: 100%;
  margin-top: $space-s;
  margin-bottom: 0;

  font-size: $font-m;

  @include desktop {
    width: auto;
    margin-top: 0;
  }
}

.banner__close {
  margin-left: auto;
}

.banner__actions {
  width: 100%;
  margin-top: $space-m;
  margin-left: auto;

  + .banner__close {
    margin-left: 0;
  }

  @include desktop {
    width: auto;
    margin-top: 0;
  }
}
</style>
