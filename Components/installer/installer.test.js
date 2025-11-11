import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import EInstaller from './index.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const options = {
  localVue,
  propsData: { visible: true },
  pinia: createTestingPinia({
    stubActions: false,
    initialState: {
      user: {
        browserDisplay: 'Firefox',
      },
    },
  }),
};

describe('EInstaller', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(EInstaller, options);
  });

  itRendersAndIsVisible(
    mount(EInstaller, {
      ...options,
      propsData: { visible: true },
    }),
    'div',
  );

  describe('Events', () => {
    it('emits closeInstaller event on overlay click', async () => {
      expect(wrapper.emitted()['installer-closed']).not.toBeDefined();
      await wrapper.trigger('click');
      expect(wrapper.emitted()['installer-closed']).toBeDefined();
    });

    it('emits closeInstaller event on close click', async () => {
      expect(wrapper.emitted()['installer-closed']).not.toBeDefined();
      await wrapper.find(byTestId('installer-close')).trigger('click');
      expect(wrapper.emitted()['installer-closed']).toBeDefined();
    });
  });
});
