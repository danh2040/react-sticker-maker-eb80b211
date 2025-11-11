<template>
  <ECard class="image-message-wrapper" border>
    <div
      v-if="hasImage"
      class="image-message-wrapper__image"
      data-test-id="image-message-wrapper-image"
      aria-hidden="true"
    >
      <slot name="image" />
    </div>

    <div class="image-message-wrapper__message">
      <slot />

      <ELinkExternal
        v-if="linkUrl && linkText"
        class="image-message-wrapper__link"
        :href="linkUrl"
        :data-test-id="linkTestId"
        @click="linkClick"
      >
        {{ linkText }}
      </ELinkExternal>
    </div>

    <EButton
      class="image-message-wrapper__close-button"
      data-test-id="image-message-wrapper-close-btn"
      :aria-label="closeButtonAriaLabel"
      icon="close"
      variant="bare"
      @click.stop="onClose"
    />
  </ECard>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import ECard from '@ecosia/common-vue2/components/card/index.vue';
import ELinkExternal from '@ecosia/common-vue2/components/link-external/index.vue';

export default {
  name: 'EMainNavImpactProfileImageMessageWrapper',
  components: {
    EButton,
    ECard,
    ELinkExternal,
  },
  props: {
    linkTestId: {
      type: String,
      default: null,
    },
    linkText: {
      type: String,
      default: null,
    },
    linkUrl: {
      type: String,
      default: null,
    },
    closeButtonAriaLabel: {
      type: String,
      required: true,
    },
  },
  computed: {
    hasImage() {
      return !!this.$slots.image;
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    linkClick() {
      this.$emit('link-click');
    },
  },
};
</script>

<style lang="scss" scoped>
.image-message-wrapper {
  display: flex;
  position: relative;
  margin-top: $space-m;
  padding: $space-m;

  background: var(--color-background-primary);
}

.image-message-wrapper__image {
  flex-shrink: 0;
  width: $space-7l;
  height: 100%;
  margin-right: $space-m;
  overflow: hidden;

  border-radius: $border-radius-s;

  ::v-deep {
    img, svg {
      width: 100%;
    }
  }
}

.image-message-wrapper__message {
  flex-grow: 1;

  ::v-deep {
    h4, p {
      margin: 0;
    }

    h4 {
      margin-bottom: $space-1s;

      font-size: $font-l;
      font-weight: $font-weight-700;
    }
  }
}

.image-message-wrapper__link {
  display: inline-block;
  margin-top: $space-s;
}
</style>
