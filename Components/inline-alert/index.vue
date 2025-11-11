<template>
  <component
    :is="component"
    :href="href"
    :class="alertClasses"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <EIcon
      :icon="icon"
      size="m"
      class="inline-alert__icon"
      data-test-id="inline-alert-icon"
    />
    <div class="inline-alert__body">
      <component
        :is="titleComponent"
        v-if="title"
        class="inline-alert__header"
      >
        <span class="inline-alert__title" data-test-id="inline-alert-title">
          {{ title }}
        </span>
        <span v-if="count > 1" class="inline-alert__count" data-test-id="inline-alert-count">
          ({{ count }})
        </span>
      </component>
      <slot />
    </div>
    <div v-if="actionIcon || action" :class="actionThemeClass" class="inline-alert__action">
      <EButton
        v-if="!action"
        v-bind="buttonProps"
        @click="actionClick"
      />
      <EButton
        v-else
        v-bind="buttonProps"
        @click="actionClick"
      >
        {{ action }}
      </EButton>
    </div>
  </component>
</template>

<script>
import { isDarkMode } from '@ecosia/common-js/universal/theme-detector.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

const variants = ['info', 'positive', 'warning', 'negative'];
const variantIcons = {
  info: 'info-circle',
  warning: 'exclamation-circle',
  positive: 'check-circle',
  negative: 'problem',
};

export default {
  name: 'EInlineAlert',
  components: {
    EIcon,
    EButton,
  },
  mixins: [classes],
  props: {
    title: {
      type: String,
      default: null,
    },
    titleComponent: {
      type: String,
      default: 'h3',
    },
    count: {
      type: Number,
      default: 1,
    },
    variant: {
      type: String,
      required: true,
      validator: (value) => variants.includes(value),
      cssClass: true,
    },

    subtle: {
      type: Boolean,
      default: false,
      cssClass: true,
    },
    action: {
      type: String,
      default: null,
    },
    actionAssistiveTechOnly: {
      type: String,
      default: null,
    },
    actionIcon: {
      type: String,
      default: '',
    },
    // Overrides the page theme
    theme: {
      type: String,
      default: null,
      validator: (value) => ['dark', 'light'].includes(value),
    },
    href: {
      type: String,
      default: null,
    },
  },
  computed: {
    component() {
      return this.href ? 'a' : 'div';
    },
    buttonComponent() {
      return this.href ? 'span' : 'button';
    },
    buttonProps() {
      const props = {
        'as': this.buttonComponent,
        'icon': this.actionIcon,
        'variant': 'bare',
        'size': 's',
        'data-test-id': 'inline-alert-action',
      };

      if (this.actionAssistiveTechOnly) {
        props['aria-label'] = this.actionAssistiveTechOnly;
      }

      return props;
    },
    icon() {
      return variantIcons[this.variant];
    },
    themeClass() {
      // Applies to children of this component.
      // The background "darkness"
      // is the opposite of the alert theme.
      return this.alertTheme === 'dark' ? 'light' : 'dark';
    },
    actionThemeClass() {
      // All subtle and warning variants require the opposite theme
      // class to be passed to the action.
      if (!this.subtle && this.variant !== 'warning') {
        return this.themeClass;
      }
      return this.themeClass === 'dark' ? 'light' : 'dark';
    },
    alertTheme() {
      return this.theme || (isDarkMode() ? 'dark' : 'light');
    },
    alertClasses() {
      return [
        ...this.classes,
        `inline-alert--${this.alertTheme}`,
        this.themeClass,
      ];
    },
  },
  methods: {
    actionClick() {
      this.$emit('action');
    },
  },
};
</script>

<style lang="scss">
.inline-alert__icon {
  flex-shrink: 0;
}

.inline-alert__header {
  display: flex;
  margin: 0;

  font-size: 1em;
}

.inline-alert__title {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.inline-alert {
  display: inline-grid;
  gap: $space-1s;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: $space-1s;
  overflow: hidden;

  border-radius: $border-radius-m;

  background: var(--alert-background);

  color: var(--alert-text);
}

.inline-alert--light {
  --alert-text: #{$white};
  --alert-negative-background: #{$n-red-700};
  --alert-positive-background: #{$c-green-70};
  --alert-warning-background: #{$n-yellow-200};
  --alert-info-background: #{$c-blue-70};

  &.inline-alert--subtle {
    --alert-text: #{$black};
    --alert-negative-background: #{$n-red-200};
    --alert-positive-background: #{$n-light-green-50};
    --alert-warning-background: #{$n-yellow-100};
    --alert-info-background: #{$n-blue-100};
  }
}

.inline-alert--dark {
  --alert-text: #{$black};
  --alert-negative-background: #{$n-red-200};
  --alert-positive-background: #{$n-light-green-50};
  --alert-warning-background: #{$n-yellow-100};
  --alert-info-background: #{$n-blue-100};

  &.inline-alert--subtle {
    --alert-text: #{$white};
    --alert-negative-background: #{$n-red-900};
    --alert-positive-background: #{$n-green-800};
    --alert-warning-background: #{$n-yellow-800};
    --alert-info-background: #{$n-blue-900};
  }
}

.inline-alert__body {
  overflow: hidden;
}

.inline-alert a {
  font-weight: $font-weight-700;
  text-decoration: underline;
}

.inline-alert--variant-info {
  --alert-background: var(--alert-info-background);
}

.inline-alert--variant-positive {
  --alert-background: var(--alert-positive-background);
}

.inline-alert--variant-warning {
  // Yellow background requires black text always
  --alert-text: #{$black};
  --alert-background: var(--alert-warning-background);
}

.inline-alert--variant-negative {
  --alert-background: var(--alert-negative-background);
}

.inline-alert__action {
  place-self: flex-start;
}
</style>
