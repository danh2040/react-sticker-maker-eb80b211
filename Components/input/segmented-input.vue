<template>
  <div class="segmented-input">
    <slot />
  </div>
</template>

<script>

export default {
  name: 'ESegmentedInput',
};
</script>

<style lang="scss">
.segmented-input {
  display: flex;

  > .input,
  > .select {
    flex-basis: 50%;
    flex-grow: 1;
  }

  // Because the 2 inputs share a border
  .input {
    position: relative;

    &:hover {
      z-index: 1;
    }

    // Focus trumps hover
    &:focus-within {
      z-index: 2;
    }
  }
}

.segmented-input > :first-child:not(:last-child) .input__element {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.segmented-input > :last-child:not(:first-child) .input__element {
  margin-left: -1px;

  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.segmented-input > :only-child {
  // Necessary because of the overlapping border
  // And to prevent the input moving 1 pixel when one of the fields disappears.
  padding-right: 1px;
}
</style>
