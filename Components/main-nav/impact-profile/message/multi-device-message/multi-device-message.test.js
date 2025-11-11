import { mount } from '@vue/test-utils';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import EButton from '@ecosia/common-vue2/components/button/index.vue';

import EMainNavImpactProfileMultiDeviceMessage from './index.vue';

const intersectionObserver = mockIntersectionObserver();
import '@ecosia/common-vue2/directives/intersect.js';

describe('EMainNavImpactProfileMultiDeviceMessage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('on click of the close button', () => {
    it('emits the dismiss-message event', async () => {
      const wrapper = mount(EMainNavImpactProfileMultiDeviceMessage);
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EButton).trigger('click');
      expect(wrapper.emitted()).toHaveProperty('dismiss-message');
    });
  });

  describe('when seen', () => {
    it('emits impression event', async () => {
      const wrapper = mount(EMainNavImpactProfileMultiDeviceMessage);
      await intersectionObserver.enterNode(wrapper.element);
      expect(wrapper.emitted()).toHaveProperty('impression');
    });
  });
});
