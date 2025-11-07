<template>
  <div class="story">
    <EPopover :side="side" :visible="visible">
      New feature!
      <template #content>
        <div class="popover__content-title">
          <EBadge variant="featured">
            New
          </EBadge>
          <EHeading as="h6" styled-as="p">
            Popover Heading
          </EHeading>
        </div>
        Gumbo beet greens corn soko endive gumbo gourd.
      </template>
    </EPopover>
  </div>
</template>

<script>
import EBadge from '@ecosia/common-vue2/components/badge/index.vue';
import EHeading from '@ecosia/common-vue2/components/heading/index.vue';

import EPopover from './index.vue';

export default {
  name: 'BasePopover',
  statusId: 'BasePopover',
  components: { EHeading, EPopover, EBadge },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    side: {
      type: String,
      default: 'right-top',
    },
  },
};
</script>

<style lang="scss" scoped>
.story {
  margin-top: 1rem;
}

.popover__content-title {
  display: flex;
  gap: $space-1s;
  align-items: center;
  margin-bottom: $space-1s;

  h6 {
    color: var(--color-text-inverse-primary)
  }

}
</style>
