<template>
  <div>
    <p>Size: small (S)</p>
    <EButtonGroup>
      <EButton variant="solid-green" size="s">
        Solid green
      </EButton>
      <EButton variant="outline" size="s">
        Outline
      </EButton>
      <EButton variant="outline" size="s" disabled>
        Outline disabled
      </EButton>
    </EButtonGroup>

    <p>Size: medium (M) - default</p>
    <EButtonGroup>
      <EButton variant="solid-green">
        Solid green
      </EButton>
      <EButton variant="outline">
        Outline
      </EButton>
      <EButton variant="outline" disabled>
        Outline disabled
      </EButton>
    </EButtonGroup>

    <p>Size: large (L)</p>
    <EButtonGroup>
      <EButton variant="solid-green" size="l">
        Solid green
      </EButton>
      <EButton variant="outline" size="l">
        Outline
      </EButton>
      <EButton variant="outline" size="l" disabled>
        Outline disabled
      </EButton>
    </EButtonGroup>

    <p class="danger">
      <Icon icon="close" /> Sizes should not be mixed
    </p>
    <div>
      <EButton variant="solid-green" size="l">
        Large
      </EButton>
      <EButton variant="outline" size="m">
        Medium
      </EButton>
      <EButton variant="outline" size="s">
        Small
      </EButton>
    </div>

    <p class="danger">
      <Icon icon="close" /> Text and Button size should match
    </p>
    <EButtonGroup>
      <EButton variant="solid-green" size="l" text-size="l" icon="close">
        Large
      </EButton>
      <EButton variant="outline" size="l" text-size="m" icon="close">
        Medium
      </EButton>
      <EButton variant="outline" size="l" text-size="s" icon="close">
        Small
      </EButton>
    </EButtonGroup>

    <p class="danger">
      <Icon icon="close" /> Button styles should not mix in the same group
    </p>
    <EButtonGroup>
      <EButton variant="solid-green">
        Standard button
      </EButton>
      <EButton variant="bare">
        Bare button
      </EButton>
      <EButton variant="outline">
        Outline button
      </EButton>
    </EButtonGroup>
  </div>
</template>

<script>
import EButton from '@ecosia/common-vue2/components/button/index.vue';
import Icon from '@ecosia/common-vue2/components/icon/index.vue';

import EButtonGroup from './index.vue';

export default {
  name: 'ButtonStandard',
  statusId: 'Button',
  components: { EButtonGroup, Icon, EButton },
};
</script>

<style lang="scss" scoped>
.danger {
  color: var(--color-error);
}
</style>
