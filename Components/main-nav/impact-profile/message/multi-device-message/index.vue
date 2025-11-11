<template>
  <EMainNavImpactProfileImageMessageWrapper
    v-intersect="onIntersect"
    :close-button-aria-label="$t('common.header.menu.impact.messages.multidevice.button.close')"
    @close="onClose"
  >
    <template #image>
      <DevicesSVG />
    </template>

    <h4>{{ $t('common.header.menu.impact.messages.multidevice.header') }}</h4>
    <p>{{ $t('common.header.menu.impact.messages.multidevice.body') }}</p>
  </EMainNavImpactProfileImageMessageWrapper>
</template>

<script>
import '@ecosia/common-vue2/directives/intersect.js';

import EMainNavImpactProfileImageMessageWrapper from '../image-message-wrapper.vue';
import DevicesSVG from './Devices.svg';

export default {
  name: 'EMainNavImpactProfileMultiDeviceMessage',
  components: {
    DevicesSVG,
    EMainNavImpactProfileImageMessageWrapper,
  },
  methods: {
    onClose() {
      this.$emit('dismiss-message');
    },
    onIntersect() {
      this.$emit('impression');
    },
  },
};
</script>
