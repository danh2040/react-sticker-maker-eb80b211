<template>
  <component :is="as" :class="classes">
    <div
      v-if="sources.length > 0"
      class="rc-footer__left"
      data-test-id="rc-footer-sources-container"
    >
      <span class="rc-footer__sources">
        <template v-if="poweredByEcosia">
          <span class="rc-footer__powered-by-ecosia" data-test-id="powered-by-ecosia">
            {{ $t('common.footer.poweredbyecosia') }}
          </span>
        </template>
        <template v-else>
          <span>{{ $t('common.footer.source') }}:&nbsp;</span>
        </template>
        <span
          v-for="(source, index) in sources"
          :key="source.title"
          class="rc-footer__source"
        >
          <ELink
            v-if="source.url"
            target="_blank"
            :href="source.url"
            color="secondary"
            rel="noopener"
            :data-test-id="`rc-footer-link-${index}`"
            @click="() => onSourceClick(source)"
          >
            {{ source.title }}
          </ELink>
          <span v-else :data-test-id="`rc-footer-no-link-${index}`">
            {{ source.title }}
          </span>
        </span>
      </span>
      <div v-if="$slots.default" class="rc-footer__extra">
        <slot />
      </div>
    </div>
    <template v-else-if="poweredByEcosia">
      <span data-test-id="powered-by-ecosia">{{ $t('common.footer.poweredbyecosia') }}</span>
    </template>
    <slot name="left" />
    <!-- TODO: Make accessible without mouse  -->
    <div
      v-if="feedbackLink"
      class="rc-footer__right"
      data-test-id="rc-footer-feedback-container"
    >
      <slot name="right" />
      <slot name="feedback">
        <EFeedbackLink v-bind="feedbackLink" data-test-id="rc-footer-feedback">
          {{ $t('common.footer.feedback') }}
        </EFeedbackLink>
      </slot>
    </div>
  </component>
</template>

<script>
import EFeedbackLink from '@ecosia/common-vue2/components/feedback-link/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';
import classes from '@ecosia/common-vue2/mixins/classes.js';

const sourceProperties = [
  'url', // optional
  'title', // required
];
export const validateSource = (link) => (
  Object.keys(link).every((key) => sourceProperties.includes(key)) &&
  !!link.title
);

export const verticalAlignments = ['start', 'end', 'center'];

export default {
  name: 'ERCFooter',
  components: {
    EFeedbackLink,
    ELink,
  },
  mixins: [classes],
  props: {
    as: {
      type: String,
      default: 'div',
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    footerVerticalAlign: {
      type: String,
      default: 'end',
      validator: (value) => verticalAlignments.includes(value),
      cssClass: true,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    responsive: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    sources: {
      type: Array,
      default: () => [],
      validator: (value) => (Array.isArray(value) && value.every(validateSource)),
    },
    feedbackLink: {
      type: Object,
      default: null,
    },
    // eslint-disable-next-line vue/no-unused-properties -- used in classes mixin
    divider: {
      type: Boolean,
      default: true,
      cssClass: true,
    },
    poweredByEcosia: {
      type: Boolean,
      default: false,
    },
    onSourceClick: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="scss" scoped>
.rc-footer {
  display: flex;
  justify-content: space-between;
  padding: $space-1s $space-l;

  color: var(--color-text-secondary);
  font-size: $font-s;
}

.rc-footer--divider {
  @include divider('top');
}

.rc-footer--responsive {
  padding: $space-1s $space-m;

  @include desktop {
    padding: $space-1s $space-m;

    &.rc-footer--divider {
      padding: $space-1s $space-m;
    }
  }
}

.rc-footer__left {
  flex-grow: 1;
}

.rc-footer__right {
  display: inline-flex;
  justify-content: flex-end;
  // ensure the right column doesn't take too much space on mobile
  max-width: 30%;
  margin-left: auto;

  @include tablet {
    max-width: none;
  }
}

.rc-footer__sources {
  display: inline-flex;
  flex-wrap: wrap;
}

.rc-footer__powered-by-ecosia,
.rc-footer__source {
  display: inline-flex;

  &:not(:last-of-type)::after {
    content: "·";

    display: inline-block;
    margin: 0 $space-2s;

    &:hover,
    &:focus {
      text-decoration: none;
    }
  }
}

.rc-footer__source {
  white-space: nowrap;
}

.rc-footer--footer-vertical-align-center {
  align-items: center;
}

.rc-footer--vertical-align-start {
  align-items: flex-start;
}

.rc-footer--vertical-align-end {
  align-items: flex-end;
}
</style>
