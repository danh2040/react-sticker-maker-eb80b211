<template>
  <div>
    <EHeading as="h1" styled-as="h2" class="heading">
      Variants
    </EHeading>
    <div class="global-counter-variants">
      <div>
        <EHeading as="h4" class="heading">
          Default - solid
        </EHeading>
        <EGlobalCounter />
        <EHeading as="h4" class="heading">
          Glass
        </EHeading>
        <EGlobalCounter glass />
        <EHeading as="h4" class="heading">
          Vertical
        </EHeading>
        <EGlobalCounter
          always-vertical="true"
        />
        <EHeading as="h4" class="heading">
          With border
        </EHeading>
        <EGlobalCounter
          :with-border="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EHeading from '@ecosia/common-vue2/components/heading/index.vue';

import EGlobalCounter from './index.vue';

export default {
  title: 'GlobalCounterVariants',
  statusId: 'GlobalCounterVariants',
  components: { EHeading, EGlobalCounter },
};
</script>

<style lang="scss" scoped>
.heading {
  margin: $space-m 0 $space-s;
}

.global-counter-variants {
  display: flex;
  gap: $space-l;
  flex-direction: column;
  padding: $space-m;
}

</style>
