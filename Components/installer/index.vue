<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="installer"
      data-test-id="installer"
      @click="$emit('installer-closed')"
    >
      <EButton
        data-test-id="installer-close"
        class="installer__close"
        icon="close"
        variant="bare"
        size="l"
        @click="$emit('installer-closed')"
      />
      <div>
        <ELogoColor class="installer__logo" />
        <ol class="installer__points">
          <li
            v-for="translation in browserTranslations"
            :key="translation"
            v-safe-html="$t(translation)"
            class="installer__point"
          />
        </ol>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'pinia';

import EButton from '@ecosia/common-vue2/components/button/index.vue';
import ELogoColor from '@ecosia/common-vue2/components/logos/logo-ecosia.svg';

import { useUserStore } from '@ecosia/store/user/index.js';

const browserInstallTranslations = {
  firefox: [
    'common.install.overlay.firefox.point1',
    'common.install.overlay.firefox.point2',
    'common.install.overlay.firefox.point3',
  ],
  edge: [
    'common.install.overlay.edge.point1',
    'common.install.overlay.edge.point2',
    'common.install.overlay.edge.point3',
    'common.install.overlay.edge.point4',
    'common.install.overlay.edge.point5',
    'common.install.overlay.edge.point6',
  ],
};

export default {
  name: 'Install',
  components: {
    EButton,
    ELogoColor,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState(useUserStore, {
      browserName: 'browser',
    }),
    browserTranslations() {
      return browserInstallTranslations[this.browserName || ''];
    },
  },
};
</script>

<style lang="scss" scoped>
.installer {
  display: flex;
  position: fixed;
  z-index: $z-index-overlay;
  top: 0;
  left: 0;
  box-sizing: border-box;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: $space-l;
  overflow: auto;

  background-color: rgba($black, $opacity-1l); // Non-standard overlay

  color: var(--color-text-static-light);
  font-size: $font-1l;

  @include tablet {
    padding: $space-2l;

    font-size: $font-2l;
  }

  @include desktop {
    font-size: $font-3l;
  }
}

.installer__logo {
  display: block;
  width: 150px;
  height: 82px;
  // most of these pixel values were tailored for the old brand logo
  // TODO: adjust them for the new logo
  margin: 115px auto $space-1l;

  color: $white;

  @include tablet {
    width: 259px;
    height: 117px;
    margin-bottom: $space-4l;
  }
}

.installer__close {
  position: absolute;
  top: $space-l;
  right: $space-l;

  color: $c-gray-40;

  &:active,
  &:hover,
  &:focus {
    color: var(--color-text-static-light);
  }
}

.installer__points {
  margin: 0;
  padding-left: $font-m;

  text-align: left;
}

.installer__point {
  margin: 0 0 $space-s;
}

.install__close {
  transform: scale($scale-4l);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $timing-s $easing;
}
</style>
