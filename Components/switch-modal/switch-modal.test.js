import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { locales } from '@ecosia/constants/i18n';
import { useGlobalStore } from '@ecosia/store/global/index.js';

import ESwitchModal from './index.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const options = {
  localVue,
  pinia: createTestingPinia({
    stubActions: false,
  }),
};

describe('ESwitchModal', () => {
  let globalStore;

  let wrapper;

  beforeEach(() => {
    globalStore = useGlobalStore();
  });

  describe('renders correctly', () => {
    itRendersAndIsVisible(mount(ESwitchModal, { ...options, propsData: { active: true } }), 'div');

    it('renders if showSwitchModal is true', () => {
      wrapper = mount(ESwitchModal, { ...options, propsData: { active: true } });
      expect(wrapper.find('.switch-modal').exists()).toBe(true);
    });

    it('renders the correct title', () => {
      wrapper = mount(ESwitchModal, { ...options, propsData: { active: true } });
      expect(wrapper.find('.switch-modal__header').text()).toBe('common.switchmodal.title');
    });

    it.each(locales)('renders the gif corresponding to the right locale', (locale) => {
      globalStore.$patch({ locale });
      wrapper = mount(ESwitchModal, { ...options, propsData: { active: true } });
      expect(wrapper.find(`.switch-modal__gif--${locale}`).exists()).toBe(true);
    });

    it('displays an empty DOM if showSwitchModal is false', () => {
      wrapper = mount(ESwitchModal, { ...options, propsData: { active: false } });
      expect(wrapper.find('.switch-modal').exists()).toBe(false);
    });
  });

  describe('Modal gets dismissed correctly', () => {
    it('removes modal from DOM when clicking on button', async () => {
      const listeners = { close: vi.fn() };

      wrapper = mount(ESwitchModal, { ...options, propsData: { active: true }, listeners });
      const dismissButton = wrapper.find('.switch-modal__dismiss');
      await dismissButton.trigger('click');
      expect(listeners.close).toHaveBeenCalled();
    });
  });
});
