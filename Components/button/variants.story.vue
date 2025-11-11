<template>
  <div>
    <EHeading as="h1" styled-as="h2" class="heading">
      Variants
    </EHeading>
    <EButtonGroup class="button-variants">
      <EButton variant="solid-gray">
        solid-gray
      </EButton>
      <EButton variant="solid-grellow">
        solid-grellow
      </EButton>
      <EButton variant="bare">
        bare
      </EButton>

      <EButton variant="solid-white">
        solid-white
      </EButton>
      <EButton variant="outline">
        outline
      </EButton>
    </EButtonGroup>
    <EButtonGroup class="button-variants">
      <p>Solid green is still be supported but should not be used. Prefer </p>
      <EButton variant="solid-gray">
        solid-gray
      </EButton>
    </EButtonGroup>
    <EButtonGroup class="button-variants">
      <EButton variant="negative">
        negative
      </EButton>
      <EButton variant="negative" disabled>
        negative disabled
      </EButton>
      <EButton variant="negative" icon="search">
        negative icon
      </EButton>
    </EButtonGroup>
    <div class="button-variants button-variants--dark">
      <EButtonGroup>
        <EButton variant="solid-green">
          solid-green
        </EButton>
        <EButton variant="solid-white">
          solid-white
        </EButton>
        <EButton variant="solid-gray">
          solid-gray
        </EButton>
        <EButton variant="solid-grellow">
          solid-grellow
        </EButton>
      </EButtonGroup>
    </div>
    <EHeading as="h1" styled-as="h2" class="heading">
      Sizes
    </EHeading>
    <div class="button-variants">
      <EButton variant="outline" icon="search" size="xs">
        size xs
      </EButton>
      <EButton variant="outline" icon="search" size="s">
        size s
      </EButton>
      <EButton variant="outline" icon="search" size="m">
        size m
      </EButton>
      <EButton variant="outline" icon="search" size="l">
        size l
      </EButton>
    </div>
    <EHeading as="h1" styled-as="h2" class="heading">
      Disabled
    </EHeading>
    <EButtonGroup class="button-variants">
      <EButton icon="search" variant="bare" disabled>
        bare
      </EButton>
      <EButton icon="search" variant="solid-green" disabled>
        solid-green
      </EButton>
      <EButton icon="search" variant="solid-white" disabled>
        solid-white
      </EButton>
      <EButton icon="search" variant="outline" disabled>
        outline
      </EButton>
    </EButtonGroup>
    <EHeading as="h1" styled-as="h2" class="heading">
      Transparent buttons
    </EHeading>
    <div class="button--variants">
      <EButtonGroup class="button-variants">
        <EButton variant="outline" size="m">
          Outline text button
        </EButton>
        <EButton variant="outline" icon="search" size="m">
          Outline icon text button
        </EButton>
        <EButton variant="outline" icon="search" size="m" />
      </EButtonGroup>
    </div>
    <div class="dark">
      <EButtonGroup class="button-variants button-variants--dark">
        <EButton variant="outline" size="m">
          Outline text button
        </EButton>
        <EButton variant="outline" icon="search" size="m">
          Outline icon text button
        </EButton>
        <EButton variant="outline" icon="search" size="m" />
      </EButtonGroup>
    </div>
  </div>
</template>

<script>
import EButtonGroup from '@ecosia/common-vue2/components/button-group/index.vue';
import EHeading from '@ecosia/common-vue2/components/heading/index.vue';

import EButton from './index.vue';

export default {
  name: 'ButtonVariants',
  statusId: 'ButtonVariants',
  components: { EButtonGroup, EButton, EHeading },
};
</script>

<style lang="scss" scoped>
.heading {
  margin: $space-m 0 $space-s;
}

.button-variants {
  padding: $space-m;

  background: repeating-linear-gradient(
    -45deg,
    var(--color-background-primary),
    var(--color-background-primary) 8px,
    var(--color-background-secondary) 8px,
    var(--color-background-secondary) 16px
  );
}
</style>
