<template>
  <div
    v-if="!isSignedIn"
    data-test-id="avatar-signed-out-placeholder"
    class="avatar avatar--signed-out-placeholder"
    aria-hidden="true"
    data-clarity-mask="true"
    :style="placeholderSizeStyle"
  >
    <EIcon icon="me" size="m" />
  </div>
  <EAvatarGoogle
    v-else-if="picture && !hasGoogleAvatarErrored"
    class="avatar"
    :image-src="picture"
    :size="SIZES[size]"
    @error="handleGoogleAvatarError"
  />
  <SignedInPlaceholderAvatarSVG
    v-else
    data-test-id="avatar"
    class="avatar"
    aria-hidden="true"
    :style="placeholderSizeStyle"
  />
</template>

<script>
import { mapState } from 'pinia';

import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

import { useUserStore } from '@ecosia/store/user/index.js';

import EAvatarGoogle from './avatar-google.vue';
import SignedInPlaceholderAvatarSVG from './SignedInPlaceholderAvatar.svg';

export const SIZES = {
  xs: 24,
  s: 32,
  m: 48,
  l: 64,
  xl: 96,
};

export default {
  name: 'EAvatar',
  components: {
    EIcon,
    EAvatarGoogle,
    SignedInPlaceholderAvatarSVG,
  },
  props: {
    size: {
      type: String,
      default: 's',
      validator: (size) => Object.keys(SIZES).includes(size),
    },
  },
  constants: {
    SIZES,
  },
  data() {
    return {
      hasGoogleAvatarErrored: false,
    };
  },
  computed: {
    ...mapState(useUserStore, ['isSignedIn', 'picture']),
    placeholderSizeStyle() {
      const sizePixels = `${SIZES[this.size]}px`;
      return {
        width: sizePixels,
        height: sizePixels,
      };
    },
  },
  methods: {
    handleGoogleAvatarError() {
      this.hasGoogleAvatarErrored = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  box-sizing: content-box;

  border-radius: 50%;
}

.avatar--signed-out-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--color-background-tertiary);
}

.avatar--signed-out-placeholder ::v-deep .icon {
  width: 50%;
  height: 50%;

  color: $white;
}
</style>
