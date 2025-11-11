<template>
  <div
    v-if="isVisible"
    class="sheet"
    role="dialog"
    :aria-label="ariaLabel"
    data-test-id="sheet"
  >
    <div class="sheet__close-button">
      <EButton
        ref="close-button"
        :aria-label="closeButtonAriaLabel || $t('common.generic.close')"
        data-test-id="sheet-close-button"
        icon="close"
        variant="bare"
        @click.stop="onClose"
      />
    </div>
    <slot />
  </div>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import trapFocusMixin from '@ecosia/common-vue2/mixins/trap-focus.js';

export default {
  name: 'ESheet',
  components: {
    EButton,
  },
  mixins: [trapFocusMixin],
  props: {
    ariaLabel: {
      type: String,
      required: true,
    },
    closeButtonAriaLabel: {
      type: String,
      default: '',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    isVisible() {
      this.isVisibleHandler();
    },
  },
  mounted() {
    if (this.isVisible) {
      // When the sheet is rendered as visible we execute the handler
      this.isVisibleHandler();
    }
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    isVisibleHandler() {
      if (this.isVisible) {
        this.trapFocus();
      } else {
        this.unTrapFocus();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .sheet {
    position: fixed;
    z-index: $z-index-2l;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;

    background: var(--color-background-elevation-2);
  }

  .sheet__close-button {
    position: absolute;
    top: $space-s;
    right: $space-s;
  }
</style>
