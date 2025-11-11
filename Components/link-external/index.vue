<template>
  <component
    :is="linkComponent"
    class="link-external"
    :class="{ 'link-external--bubble': isBubble }"
    v-bind="$attrs"
    target="_blank"
    rel="noreferrer"
    v-on="$listeners"
  >
    <slot name="default" />
    <EIcon
      class="link-external__icon"
      icon="tab-open"
      size="s"
      :aria-label="$t('common.generic.opensinnewtab')"
    />
  </component>
</template>

<script>
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';
import ELinkBubble from '@ecosia/common-vue2/components/link-bubble/index.vue';

export default {
  name: 'ELinkExternal',
  components: {
    ELink,
    ELinkBubble,
    EIcon,
  },
  props: {
    isBubble: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    linkComponent() {
      return this.isBubble ? ELinkBubble : ELink;
    },
  },
};
</script>

<style lang="scss" scoped>
.link-external {
  display: inline;
}

.link-external--bubble {
  display: flex;
  align-content: center;

  color: var(--color-button-content-secondary);
}

.link-external__icon {
  margin-top: -$space-3s;

  .link-external--bubble & {
    margin-top: 0;
    margin-left: $space-2s;
  }
}
</style>
