<template>
  <EDropdown
    v-focus-away="onFocusAway"
    v-bind="{ visible, 'data-test-id': 'dropdown-wrapper', ...$attrs }"
    :class="classes"
    :aria-hidden="!visible"
    :side="isDesktopUp ? side : 'left'"
    @click="onClose"
  >
    <section
      class="modal-dropdown__content"
      @click.stop="() => {}"
      @keyup.escape="onClose"
    >
      <slot />
      <footer class="modal-dropdown__footer" data-test-id="modal-dropdown-footer">
        <span>{{ title }}</span>
        <div class="modal-dropdown__close">
          <EButton
            icon="close"
            size="s"
            variant="bare"
            icon-size="s"
            data-test-id="close-button"
            @click.stop="onClose"
          />
        </div>
      </footer>
    </section>
  </EDropdown>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EDropdown from '@ecosia/common-vue2/components/dropdown/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';
import screen from '@ecosia/common-vue2/mixins/screen.js';
import { focusFocusableChild } from '@ecosia/common-vue2/utils/keyboard-utils.js';
import { DESKTOP_DOWN_CLASS, toggleScrollLock } from '@ecosia/common-vue2/utils/screen.js';

export const sizes = ['m', 'l'];
/**
 * Like Dropdown, but looks like a modal on mobile
 */
export default {
  name: 'EModalDropdown',
  components: {
    EDropdown,
    EButton,
  },
  mixins: [classes, screen],
  props: {
    title: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * one of `m`, `l`
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    size: {
      cssClass: true,
      type: String,
      default: sizes[0],
      validator: (size) => sizes.includes(size),
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    footerAlwaysShown: {
      cssClass: true,
      type: Boolean,
      default: false,
    },
    side: EDropdown.props.side,
  },
  watch: {
    visible(value) {
      // When the modal is shown, we want a fixed body
      // so the body won't scroll
      // When the modal is hidden,
      // we want to remain at the top of the scroll position
      toggleScrollLock(value, DESKTOP_DOWN_CLASS);

      // we also want to focus on the first child element
      // if modal is visible
      if (value) {
        this.$nextTick(() => {
          focusFocusableChild(this.$el);
        });
      }
    },
  },
  methods: {
    onFocusAway() {
      this.$emit('closeOnFocusAway');
    },
    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
$sizes: (
  m: (
    default: (
      min-width: 300px,
      max-width: 300px,
    ),
    desktop: (
      min-width: 140px,
      max-width: 180px,
    ),
  ),
  l: (
    default: (
      min-width: 300px,
      max-width: 300px,
    ),
    desktop: (
      min-width: 240px,
      max-width: none,
    ),
  ),
);

.modal-dropdown {
  min-width: 0;

  @include desktop-down {
    display: flex;
    position: fixed;
    z-index: $z-index-overlay;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    animation: e-fade-in $timing-1s forwards;

    border-radius: 0;

    background: var(--color-overlay-primary);
    box-shadow: none;
  }
}

.modal-dropdown__content {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - #{$space-3l});
  overflow: hidden;

  @include desktop-down {
    @include elevation(2);
    margin: $space-l;

    animation: e-slide-top $timing-1s forwards;

    border-radius: $border-radius-l;

    background: var(--color-background-primary);
  }
}

@each $size, $config in $sizes {
  .modal-dropdown--size-#{$size} {
    .modal-dropdown__content {
      min-width: map.get(map.get($config, 'default'), 'min-width');
      max-width: map.get(map.get($config, 'default'), 'max-width');

      @include desktop {
        min-width: map.get(map.get($config, 'desktop'), 'min-width');
        max-width: map.get(map.get($config, 'desktop'), 'max-width');
      }
    }
  }
}

.modal-dropdown__close {
  display: inherit;
}

.modal-dropdown__footer {
  @include divider('bottom');

  // special value to accomodate the icon-button in xs size
  $padding-vertical: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  order: -1;
  height: $space-4l;
  padding: $padding-vertical $space-m;

  background: var(--color-background-secondary);

  font-size: $font-l;

  @include desktop {
    display: none;

    .modal-dropdown--footer-always-shown & {
      display: flex;

      .modal-dropdown__close {
        display: none;
      }
    }
  }
}
</style>
