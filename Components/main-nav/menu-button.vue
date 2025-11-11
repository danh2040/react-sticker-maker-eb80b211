<template>
  <EBaseButton
    v-if="isSignedIn"
    data-test-id="menu-button-avatar"
    class="menu-button"
    variant="solid-white"
    size="m"
    :force-hover="isMenuExpanded"
    :aria-haspopup="ariaHasPopup"
    :aria-expanded="ariaExpanded"
    :aria-label="menuButtonAriaLabel"
    :aria-controls="menuButtonAriaControlsId"
    v-on="$listeners"
  >
    <EAvatar />
  </EBaseButton>
  <EButton
    v-else
    data-test-id="menu-button-hamburger"
    class="menu-button"
    icon="hamburger"
    variant="solid-white"
    :aria-label="menuButtonAriaLabel"
    :aria-haspopup="ariaHasPopup"
    :aria-expanded="ariaExpanded"
    :force-hover="isMenuExpanded"
    v-on="$listeners"
  />
</template>

<script>
import EAvatar from '@ecosia/common-vue2/components/avatar/index.vue';
import EBaseButton from '@ecosia/common-vue2/components/button/base.vue';
import EButton from '@ecosia/common-vue2/components/button/index.vue';

export default {
  name: 'EMainNavMenuButton',
  components: {
    EAvatar,
    EBaseButton,
    EButton,
  },
  props: {
    isMenuExpanded: {
      type: Boolean,
      default: false,
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    menuButtonAriaLabel: {
      type: String,
      default: '',
    },
    menuButtonAriaControlsId: {
      type: String,
      default: '',
    },
    showMenuAsSheet: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ariaHasPopup() {
      return this.showMenuAsSheet ? 'dialog' : 'false';
    },
    ariaExpanded() {
      return this.isMenuExpanded ? 'true' : 'false';
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-button {
  @extend %increase-target-size;

  display: flex;
  position: relative;
  padding: 0;
}
</style>
