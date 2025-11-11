<template>
  <component :is="as" :class="classes" v-on="$listeners">
    <span class="list-item__content"><slot /></span>
    <slot name="right" />
  </component>
</template>

<script>
import classes from '@ecosia/common-vue2/mixins/classes.js';
import scrollIntoParentView from '@ecosia/common-vue2/mixins/scroll-into-parent-view.js';

export default {
  name: 'EListItem',
  mixins: [classes, scrollIntoParentView],
  props: {
    as: {
      type: String,
      default: 'li',
    },
    /**
     * Toggles the smooth active style transition
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    transition: {
      type: Boolean,
      cssClass: true,
      default: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    highlighted: {
      type: Boolean,
      cssClass: true,
      default: false,
    },
    // if true, the inner styling comes from the
    // content that is passed in as slot
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    contentStyle: {
      type: Boolean,
      cssClass: true,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin li-highlight {
  background-color: var(--color-highlight-primary);
}

.list-item {
  display: flex;
  align-items: center;
  min-height: $tappable-area-size-mobile;
  padding: 0 $space-s;
  list-style-type: none;

  font-size: $font-m;

  cursor: pointer;

  @include desktop {
    min-height: $space-3l;
  }

  &:hover,
  &:active {
    @include li-highlight;
  }

  &:focus,
  &:focus-within {
    @extend %keyboard-nav-focus;
  }

  a:focus-visible {
    outline: none;
  }

  // doubling up to have higher specificity because of the .keyboard-mode body class
  &.list-item:focus-within {
    outline-offset: -$space-2s;
  }
}

.list-item--highlighted {
  @include li-highlight;
}

.list-item--transition {
  transition: background-color $timing-2s $easing;
}

.list-item--content-style {
  &.list-item {
    min-height: initial;
    padding: 0;

    @include desktop {
      min-height: initial;
    }
  }
}

.list-item__content {
  flex-grow: 1;
}
</style>
