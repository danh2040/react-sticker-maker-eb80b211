<template>
  <ETooltip
    v-if="showTooltip"
    v-bind="tooltipProps"
    size="s"
    :focusable="false"
  >
    <EBaseButton
      v-bind="$attrs"
      :size="size"
      :class="buttonClasses"
      :aria-label="showTooltip ? tooltipText : $attrs['aria-label']"
      class="button"
      v-on="$listeners"
    >
      <EButtonContent
        :icon="icon"
        :icon-position="iconPosition"
        :computed-icon-size="computedIconSize"
        :icon-classes="iconClasses"
        :has-text="Boolean($slots.default)"
      >
        <slot />
      </EButtonContent>
    </EBaseButton>
    <template #content>
      <span class="button__tooltip-text">{{ tooltipText }}</span>
    </template>
  </ETooltip>
  <EBaseButton
    v-else
    v-bind="$attrs"
    :size="size"
    :class="buttonClasses"
    class="button"
    v-on="$listeners"
  >
    <EButtonContent
      :icon="icon"
      :icon-position="iconPosition"
      :icon-rotated="iconRotated"
      :computed-icon-size="computedIconSize"
      :icon-classes="iconClasses"
      :has-text="Boolean($slots.default)"
    >
      <slot />
    </EButtonContent>
  </EBaseButton>
</template>

<script>
import ETooltip, { sides } from '@ecosia/common-vue2/components/tooltip/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

import EBaseButton from './base.vue';
import EButtonContent from './button-content.vue';

export const iconPositions = ['start', 'end'];
export const iconSizeDefaults = {
  xs: 's',
  s: 's',
  m: 's',
  l: 'm',
};

export default {
  name: 'EButton',
  components: {
    EBaseButton,
    EButtonContent,
    ETooltip,
  },
  mixins: [classes],
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    iconRotated: {
      type: Boolean,
      default: false,
    },
    iconSize: {
      type: String,
      default: '',
    },
    /**
     * one of `start`, `end`
     */
    iconPosition: {
      type: String,
      default: 'start',
      cssClass: true,
      validator: (position) => iconPositions.includes(position),
    },
    /**
     * Whether text should be move below icon on mobile
     */
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    mobileStack: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    size: {
      type: String,
      default: 'm',
    },
    tooltipText: {
      type: String,
      default: '',
    },
    tooltipSide: {
      type: String,
      default: 'center-bottom',
      validator: (value) => sides.includes(value),
    },
  },
  computed: {
    buttonClasses() {
      return this.classes.concat(
        this.icon && !this.$slots.default ? 'button-icon' : [],
      );
    },
    iconClasses() {
      const prefix = 'button__icon';
      return {
        [`${prefix}--icon-${this.icon}`]: true,
        [`${prefix}--size-${this.iconSize}`]: true,
        [`${prefix}--rotated`]: this.iconRotated,
      };
    },
    computedIconSize() {
      return this.iconSize || iconSizeDefaults[this.size] || 's';
    },
    tooltipProps() {
      return {
        padding: true,
        side: this.tooltipSide,
        closeOnMouseLeave: true,
      };
    },
    showTooltip() {
      const hasTooltipText = this.tooltipText && this.tooltipText.length > 0;
      const hasNoText = !this.$slots.default;

      // Hide tooltip if button is active
      if (this.isActive) {
        return false;
      }

      // Or if aria-expanded $attrs is set to true
      if (this.$attrs['aria-expanded'] === 'true') {
        return false;
      }

      return hasTooltipText && hasNoText;
    },
  },
};
</script>
