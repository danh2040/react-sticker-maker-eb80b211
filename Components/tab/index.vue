<template>
  <component
    :is="as"
    :class="[classes, ...iconClasses]"
    :href="href"
    :rel="rel"
    :target="target"
    role="menuitem"
    tabindex="0"
    v-on="$listeners"
  >
    <EIcon
      v-if="icon"
      :icon="icon"
      size="s"
      class="tab__icon"
      data-test-id="tab-icon"
      :class="{ 'tab__icon--mobile': mobileIcon }"
    />
    <slot />
  </component>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

export default {
  name: 'ETab',
  components: {
    EIcon,
  },
  mixins: [classes],
  props: {
    as: {
      type: String,
      default: 'a',
    },
    icon: {
      type: [String, null],
      default: null,
    },
    mobileIcon: {
      type: Boolean,
      default: false,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    highlighted: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    highlightBar: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    linkTarget: {
      type: String,
      default: '_self',
    },
    url: {
      type: [String, null],
      default: null,
    },
  },
  computed: {
    iconClasses() {
      const iconClasses = [];

      if (this.icon) {
        iconClasses.push('tab--icon');
      }

      return iconClasses;
    },
    isAnchor() {
      return this.as === 'a';
    },
    href() {
      return this.isAnchor ? this.url : undefined;
    },
    rel() {
      return this.isAnchor ? 'noopener' : undefined;
    },
    target() {
      return this.isAnchor ? this.linkTarget : undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
$tab-highlight-width: $space-2s;

.tab {
  display: flex;
  position: relative;
  gap: $space-2s;
  align-items: center;
  margin: 0;
  padding: $space-s $space-1s $space-m;

  transition: color $timing-2s $easing;

  background: transparent;

  color: var(--color-button-content-secondary);
  font-size: $font-m;
  font-weight: $font-weight-500;

  cursor: pointer;

  &:focus {
    @extend %keyboard-nav-focus;

    border-radius: $border-radius-s;
  }

  @include desktop {
    // bottom padding adjusted for the thickness of the highlight pseudo-element
    $padding-bottom: $space-m - $tab-highlight-width + 1px;

    padding: 0 $space-1s $padding-bottom;

    // asymmetrical horizontal padding is to balance the icon <-> text axis,
    // since the icon has some minor internal padding
    // which makes the text appear off on the right side of the tab
    &.tab--icon {
      padding: 0 $space-2s $padding-bottom 0;
    }
  }
}

.tab--highlight-bar {
  --tab-highlight-color: transparent;

  &::after {
    content: '';

    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: $tab-highlight-width;

    transform: scaleY(0);
    transition: opacity $timing-2s $easing, transform $timing-1s $easing;

    border-top-left-radius: $border-radius-full;
    border-top-right-radius: $border-radius-full;

    opacity: 0;
    background-color: var(--tab-highlight-color);
  }

  &:hover,
  &:focus-within {
    --tab-highlight-color: var(--color-button-content-secondary);

    &::after {
      transform: scaleY(1);

      opacity: 1;
    }
  }
}

.tab--highlighted,
.tab--highlighted:hover,
.tab--highlighted:focus-within {
  --tab-highlight-color: var(--color-button-content-secondary);

  color: var(--color-brand-primary);

  &::after {
    transform: scaleY(1);

    opacity: 1;
  }
}

.tab__icon:not(.tab__icon--mobile) {
  display: none;

  @include desktop {
    display: unset;
  }
}
</style>
