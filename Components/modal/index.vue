<template>
  <transition
    name="modal"
    enter-class="modal--enter"
    enter-active-class="modal--enter-active"
    leave-class="modal--leave"
    leave-active-class="modal--leave-active"
  >
    <div
      v-if="active"
      class="modal"
      aria-modal="true"
      :role="role"
      :class="allClasses"
      @click.self.stop="onClickaway"
      @keyup.esc="onEscapeKeyUp"
    >
      <div v-on-clickaway="onClickaway" class="modal__dialog">
        <div
          v-if="hasFeature"
          class="modal__feature"
          :class="`modal__feature--${featureSize}`"
          data-test-id="modal-feature"
        >
          <slot name="feature" />
        </div>
        <div class="modal__header" :class="{ 'modal__header--with-button': closeButton }">
          <div
            v-if="closeButton"
            class="modal__close"
          >
            <EButton
              :aria-label="$t('common.generic.close')"
              icon="close"
              data-test-id="close"
              variant="solid-white"
              @click.stop="onClose('button')"
            />
          </div>
          <slot v-if="hasHeader" name="header" />
        </div>
        <div
          ref="content"
          class="modal__content"
          :class="{
            'modal__content--with-header': hasHeader,
            'modal__content--with-footer': hasFooter,
          }"
          @click.stop
          @scroll="onScroll"
        >
          <slot />
        </div>
        <div
          v-if="hasFooter"
          class="modal__footer"
          :class="{ 'modal__footer--with-shadow': isContentScrollable }"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mixin as clickaway } from 'vue-clickaway';

import EButton from '@ecosia/common-vue2/components/button/index.vue';
import classes, { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';
import screen from '@ecosia/common-vue2/mixins/screen.js';
import trapFocusMixin from '@ecosia/common-vue2/mixins/trap-focus.js';
import { addScrollLock, removeScrollLock } from '@ecosia/common-vue2/utils/screen.js';

import debounce from '@ecosia/js-utils/debounce.js';

import { RESIZE_DEBOUNCE_DELAY as DEBOUNCE_DELAY } from '@ecosia/constants/events.js';

const sizes = ['s', 'm', 'l', 'xl'];
const ariaModalModes = ['dialog', 'alertdialog'];

export default {
  name: 'EModal',
  components: {
    EButton,
  },
  mixins: [clickaway, classes, screen, trapFocusMixin],
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    closeButton: {
      type: Boolean,
      default: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    elevationBackground: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    featureSize: {
      type: String,
      default: 'm',
      validator: (size) => ['s', 'm'].includes(size),
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    padding: {
      type: String,
      default: '4l',
      validator: (padding) => ['none', 'm', '2l', '4l'].includes(padding),
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    size: {
      type: String,
      cssClass: true,
      default: 'm',
      validator: (size) => sizes.includes(size),
    },
    role: {
      type: String,
      default: 'dialog',
      validator: (role) => ariaModalModes.includes(role),
    },
    scrollableBody: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrolled: false,
      keyBoardFocus: null,
      isContentScrollable: false,
    };
  },
  computed: {
    allClasses() {
      const allClasses = [...this.classes];
      if (this.scrolled) {
        allClasses.push(getModifierClass('modal', 'scrolled'));
      }
      return allClasses;
    },
    hasFeature() {
      return !!this.$slots.feature;
    },
    hasHeader() {
      return !!this.$slots.header;
    },
    hasFooter() {
      return !!this.$slots.footer;
    },
  },
  watch: {
    active() {
      this.activeHandler();
    },
  },
  mounted() {
    if (this.active) {
      // When the modal is rendered as active we execute the handler
      this.activeHandler();
    }
    if (this.hasFooter) {
      this.footerShadowHandler();
      this.onResize = debounce(this.footerShadowHandler, DEBOUNCE_DELAY);
      window.addEventListener('resize', this.onResize);
    }
  },
  beforeDestroy() {
    // ensure the modal does not prevent page scrolling once it's destroyed
    removeScrollLock('modal__no-scroll');
    // ensure keyboard trap is removed if modal is destroyed
    if (this.keyBoardFocus) {
      this.keyBoardFocus?.untrap();
      this.keyBoardFocus = null;
    }
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    footerShadowHandler() {
      if (this.active && this.hasFooter) {
        // When we show a footer we want to enable a shadow
        // for when the content is scrollable
        const contentElement = this.$refs.content;
        this.isContentScrollable = contentElement?.clientHeight < contentElement?.scrollHeight;
      }
    },
    activeHandler() {
      // While the modal is active, we want to disable body scrolling
      this.setScrollLock(this.active);
      if (this.active) {
        if (this.isDesktopUp) {
          this.trapFocus();
        }
        this.$emit('modal-display');
      } else {
        // When the modal is hidden:
        // we want to remain at the top of the scroll position
        // we want to untrap keyboard
        this.unTrapFocus();
      }
    },
    setScrollLock(shouldLock) {
      if (!this.scrollableBody) {
        if (shouldLock) {
          addScrollLock('modal__no-scroll');
        } else {
          removeScrollLock('modal__no-scroll');
        }
      }
    },
    onClose(flag) {
      this.$emit('close', flag);
    },
    onClickaway() {
      this.onClose('clickaway');
    },
    onEscapeKeyUp() {
      this.onClose('esc');
    },
    onScroll() {
      this.scrolled = this.$refs.content?.scrollTop > 0;
    },
  },
};
</script>

<style lang="scss" scoped>
$widths: (
  s: 400px,
  m: 480px,
  l: 524px,
  xl: 700px,
);

$paddings: (
  s: $space-m,
  m: $space-m,
  2l: $space-2l,
  4l: $space-4l,
);

$feature-heights: (
  m: 300px,
  s: 180px,
);

.modal {
  display: flex;
  position: fixed;
  z-index: $z-index-overlay;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;

  transition: opacity $timing-s ease;

  opacity: 1;
  background: var(--color-overlay-primary);
}

.modal__dialog {
  @include elevation(1);

  display: flex;
  position: relative;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: auto;
  max-height: 90vh;
  margin: 0 $space-1s;

  border-radius: $border-radius-l;

  background: var(--color-background-primary);

  @include mobile-l {
    height: auto;
    margin: initial;
  }
}

.modal--elevation-background .modal__dialog {
  background: var(--color-background-elevation-1);
}

@each $name, $width in $widths {
  .modal--size-#{$name} {
    .modal__dialog {
      width: $width;
    }
  }
}

.modal__feature {
  display: flex;
  position: relative;
  width: 100%;
  overflow: hidden;

  border-top-left-radius: $border-radius-l;
  border-top-right-radius: $border-radius-l;
}

@each $size, $height in $feature-heights {
  .modal__feature--#{$size} {
    height: $height;
  }
}

.modal__close {
  display: flex;
  position: absolute;
  z-index: $z-index-l;
  top: $space-3s;
  right: $space-3s;
  flex-direction: row;
  justify-content: right;
  width: 100%;
  padding: $space-1s $space-1s 0;

  border-radius: $border-radius-l $border-radius-l 0 0;
}

.modal__header {
  width: 100%;
  padding-bottom: $space-m;
}

.modal__header--with-button {
  width: 100%;
  padding-top: $space-1l;
  padding-bottom: $space-1l;
}

.modal--scrolled .modal__header {
  @include elevation(1);
}

.dark .modal--scrolled .modal__header {
  box-shadow: inset 0 -1px 0 var(--color-decorative-border-1);
}

.modal__content {
  width: 100%;
  padding-top: $space-m;
  padding-bottom: $space-m;
  overflow-x: hidden;
  overflow-y: scroll;

  border-radius: 0 0 $border-radius-l $border-radius-l;

  @include mobile-l {
    height: 100%;
    overflow-y: auto;
  }

  @include tablet {
    padding-bottom: $space-3l;
  }
}

.modal__content--with-header {
  padding-top: 0;
}

.modal__content--with-footer {
  padding-bottom: 0;
}

.modal__footer {
  width: 100%;
  padding-top: $space-m;

  &.modal__footer--with-shadow {
    @include elevation(1-inverted);
  }
}

.dark .modal__footer--with-shadow {
  box-shadow: inset 0 1px 0 var(--color-decorative-border-1);
}

@each $name, $padding in $paddings {
  .modal--padding-#{$name} .modal__header,
  .modal--padding-#{$name} .modal__content,
  .modal--padding-#{$name} .modal__footer {
    padding-right: $space-m;
    padding-left: $space-m;

    @include desktop {
      padding-right: $padding;
      padding-left: $padding;
    }
  }

  // Add the top and bottom padding to header and footer only
  .modal--padding-#{$name} .modal__footer {
    padding-bottom: $space-m;

    @include tablet {
      padding-bottom: $padding;
    }
  }
  .modal--padding-#{$name} .modal__header:not(.modal__header--with-button) {
    padding-top: $space-m;

    @include tablet {
      padding-top: $padding;
    }
  }
}

// No padding is a special case because we need to reset the whole padding
/* stylelint-disable-next-line no-descending-specificity */
.modal--padding-none .modal__header,
.modal--padding-none .modal__content,
.modal--padding-none .modal__footer {
  padding: 0;
}

// Has to account for the close button, which is absolutely positioned
.modal--padding-none .modal__header--with-button {
  min-height: $space-4l;
}

.modal--enter,
.modal--leave-active {
  opacity: 0;
}
</style>

<style lang="scss">
.modal__no-scroll {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
