<template>
  <component
    :is="as"
    :type="buttonType"
    :class="[classes, textSizeClass]"
    :disabled="disabled"
    v-bind="$attrs"
    :role="buttonRole"
    v-on="$listeners"
  >
    <slot />
  </component>
</template>

<script>
import classes, { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';

export const elevations = ['0', '1', '2'];
export const sizes = ['xs', 's', 'm', 'l'];
export const textSizes = ['xs', 's', 'm', 'l'];
export const tags = ['button', 'span', 'a'];
export const variants = [
  'bare',
  'solid-gray',
  'solid-green',
  'solid-grellow',
  'solid-white',
  'outline',
  'outline-inverse',
  'negative',
];

export default {
  name: 'EBaseButton',
  mixins: [classes],
  props: {
    /**
     * `button, a`
     */
    as: {
      type: String,
      default: 'button',
      validator: (value) => tags.includes(value),
    },
    type: {
      type: String,
      default: 'button',
    },
    role: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    /**
     * bare, solid-white, solid-green, outline, outline-inverse, negative
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    variant: {
      type: String,
      validator: (value) => variants.includes(value),
      cssClass: true,
      required: true,
    },
    /**
     * `s, m, l` The size of the button
     */
    size: {
      type: String,
      default: 'm',
      validator: (value) => sizes.includes(value),
      cssClass: true,
    },
    /**
     * `s, m, l` The size of the text (default: same as `size`)
     */
    textSize: {
      type: [String, null],
      validator: (value) => textSizes.includes(value),
      default: null,
    },
    /**
     * `0, 1, 2`
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    elevation: {
      type: String,
      default: '0',
      validator: (value) => elevations.includes(value),
      cssClass: true,
    },
    /**
     * Can be used to force the hover state in situations where
     * the button is only used decoratively inside an element which already
     * provides the intended interaction.
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    forceHover: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
  },
  computed: {
    buttonType() {
      if (this.as === 'a') {
        return null;
      }

      return this.type;
    },
    buttonRole() {
      // pass through any defined roles
      if (this.role) {
        return this.role;
      }

      // don't set a role for links or buttons
      if (this.as === 'a' || this.as === 'button') {
        return null;
      }

      // everything else is a button role
      return 'button';
    },
    textSizeClass() {
      const realSize = this.textSize || this.size;
      return getModifierClass(this.baseClass, `text-size-${realSize}`);
    },
  },
};
</script>

<style lang="scss" scoped>
$sizes: (
  xs: (
    height: $space-l,
    padding: $space-s - $border-width,
  ),
  s: (
    height: $space-2l,
    padding: $space-s - $border-width,
  ),
  m: (
    height: $space-3l,
    padding: $space-m - $border-width,
  ),
  l: (
    height: $space-4l,
    padding: $space-l - $border-width,
  )
);

$font-sizes: (
  xs: $font-1s,
  s: $font-m,
  m: $font-l,
  l: $font-1l,
);

$variants: (
  bare: (
    color: var(--color-button-content-secondary),
    active-background-color: var(--color-button-background-transparent-active),
    hover-background-color: var(--color-button-background-transparent-hover),
  ),
    solid-gray: (
    color: var(--color-button-content-primary),
    background-color: var(--color-button-background-primary),
    border-color: var(--color-button-background-primary),
    hover-background-color: var(--color-button-background-primary-hover),
    hover-border-color: var(--color-button-background-primary-hover),
    active-background-color: var(--color-button-background-primary-active),
    active-border-color: var(--color-button-background-primary-active),
    disabled-background-color: var(--color-disabled),
    disabled-color: var(--color-button-content-secondary),
    disabled-border-color: var(--color-disabled),
  ),
  // This variant is being sunset, please use 'solid-gray' or 'solid grellow'.
  solid-green: (
    color: var(--color-button-content-primary),
    background-color: var(--color-button-background-primary),
    border-color: var(--color-button-background-primary),
    hover-background-color: var(--color-button-background-primary-hover),
    hover-border-color: var(--color-button-background-primary-hover),
    active-background-color: var(--color-button-background-primary-active),
    active-border-color: var(--color-button-background-primary-active),
  ),
  solid-grellow: (
    color: var(--color-button-content-secondary-static),
    background-color: var(--color-button-background-featured),
    border-color: var(--color-button-background-featured),
    hover-background-color: var(--color-button-background-featured-hover),
    hover-border-color: var(--color-button-background-featured-hover),
    active-background-color: var(--color-button-background-featured-active),
    active-border-color: var(--color-button-background-featured-active),
    disabled-color: var(--color-button-content-secondary),
    disabled-background-color: var(--color-disabled),
    disabled-border-color: var(--color-disabled),
  ),
  solid-white: (
    color: var(--color-button-content-secondary),
    background-color: var(--color-button-background-secondary),
    border-color: var(--color-button-background-secondary),
    hover-background-color: var(--color-button-background-secondary-hover),
    hover-border-color: var(--color-button-background-secondary-hover),
    active-background-color: var(--color-button-background-secondary-active),
    active-border-color: var(--color-button-background-secondary-active),
  ),
  outline: (
    color: var(--color-button-content-secondary),
    background-color: transparent,
    border-color: var(--color-button-border),
    hover-background-color: var(--color-button-background-transparent-hover),
    active-background-color: var(--color-button-background-transparent-active),
    background-color-icon: var(--color-button-background-secondary),
    active-background-color-icon: var(--color-button-background-secondary-active),
    hover-background-color-icon: var(--color-button-background-secondary-hover),
  ),
  outline-inverse: (
    color: var(--color-text-inverse-primary),
    background-color: transparent,
    border-color: var(--color-button-inverse-border),
    hover-background-color: var(--color-button-background-transparent-hover),
    active-background-color: var(--color-button-background-transparent-active),
    background-color-icon: var(--color-button-background-secondary),
    active-background-color-icon: var(--color-button-background-secondary-active),
    hover-background-color-icon: var(--color-button-background-secondary-hover),
  ),
  negative: (
    color: var(--color-button-content-primary),
    background-color: var(--color-button-background-negative),
    border-color: transparent,
    hover-background-color: var(--color-button-background-negative-hover),
    active-background-color: var(--color-button-background-negative-active),
    background-color-icon: var(--color-button-content-primary),
    active-background-color-icon: var(--color-button-content-primary),
    hover-background-color-icon: var(--color-button-content-primary),
  )
);

.base-button {
  display: inline-flex;
  appearance: none;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 0;

  transition: all $timing-2s $easing;

  border: none;
  border-radius: $border-radius-full;

  background-color: transparent;

  font-family: $family;
  letter-spacing: 0.1px;
  text-align: center;
  white-space: nowrap;

  cursor: pointer;

  -webkit-tap-highlight-color: transparent;

  &,
  &:hover,
  &:focus {
    text-decoration: none;
  }

  &:focus {
    @extend %keyboard-nav-focus;
  }
}

@each $name, $map in $sizes {
  .base-button--size-#{$name} {
    // the Button should always be at least square
    min-width: map.get($map, height);
    height: map.get($map, height);
    padding-right: map.get($map, padding);
    padding-left: map.get($map, padding);
  }
}

@each $size, $fs in $font-sizes {
  .base-button--text-size-#{$size} {
    font-size: $fs;
  }
}

@each $name, $map in $variants {
  $color: map.get($map, color);
  $background-color: map.get($map, background-color);
  $border-color: map.get($map, border-color);
  $hover-background-color: map.get($map, hover-background-color);
  $hover-border-color: map.get($map, hover-border-color);
  $active-background-color: map.get($map, active-background-color);
  $active-border-color: map.get($map, active-border-color);

  .base-button--variant-#{$name} {
    background-color: $background-color;

    color: $color;

    @if $border-color {
      border: $border-width solid $border-color;
    }

    &:hover,
    &.base-button--force-hover {
      background-color: $hover-background-color;

      @if $hover-border-color {
        border-color: $hover-border-color;
      }
    }

    &:active {
      background-color: $active-background-color;

      @if $active-border-color {
        border-color: $active-border-color;
      }
    }

    // Background only for icon-button variant
    @if map.get($map, background-color-icon) {
      &.button-icon {
        background-color: map.get($map, background-color-icon);

        &:hover {
          background-color: map.get($map, hover-background-color-icon);
        }

        &:active {
          background-color: map.get($map, active-background-color-icon);
        }
      }
    }
  }
}

@each $name, $elevation in $elevations {
  .base-button--elevation-#{$name} {
    @include elevation($name);
  }
}

.base-button--disabled,
.base-button--disabled:hover,
.base-button--disabled:focus,
.base-button--disabled:active {
  border-color: var(--color-disabled);

  background-color: var(--color-disabled);

  color: var(--color-text-static-light);

  cursor: not-allowed;
}
</style>
