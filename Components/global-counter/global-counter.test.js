import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import ECounter from '@ecosia/common-vue2/components/counter/index.vue';

import EGlobalCounter from './index.vue';

vi.mock('@ecosia/common-js/universal/projection.js', () => ({
  investmentProjection: vi.fn(() => 2000000),
  treesProjection: vi.fn(() => 2000000),
}));

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const options = {
  localVue,
  pinia: createTestingPinia(),
};

describe('EGlobalCounter', () => {
  itRendersAndIsVisible(mount(EGlobalCounter, options), 'div', 'global-counter');

  it('has two counters by default', () => {
    const wrapper = mount(EGlobalCounter, options);
    const counters = wrapper.findAllComponents(ECounter);
    expect(counters).toHaveLength(2);
  });

  it('sets formatted number for counter prop', () => {
    const wrapper = mount(EGlobalCounter, options);
    const counters = wrapper.findAllComponents(ECounter);
    expect(counters.at(0).props().count).toBe('2,000,000');
    expect(counters.at(1).props().count).toBe('€2,000,000');
  });

  it('has a tree counter', () => {
    const wrapper = mount(EGlobalCounter, options);
    const treeCounter = wrapper.find(byTestId('tree-counter'));
    expect(treeCounter.exists()).toBe(true);
  });

  it('has a investments counter', () => {
    const wrapper = mount(EGlobalCounter, options);
    const investmentsCounter = wrapper.find(byTestId('investments-counter'));
    expect(investmentsCounter.exists()).toBe(true);
  });

  describe('test always vertical', () => {
    it('is false by default', () => {
      const wrapper = mount(EGlobalCounter, options);
      expect(wrapper.classes('global-counter--always-vertical')).toBe(false);
    });

    it('renders full when full was set to true', () => {
      const wrapper = mount(EGlobalCounter, {
        ...options,
        propsData: { alwaysVertical: true },
      });

      expect(wrapper.classes('global-counter--always-vertical')).toBe(true);
    });
  });

  describe('with border', () => {
    it('is false by default', () => {
      const wrapper = mount(EGlobalCounter, options);
      expect(wrapper.classes('global-counter--with-border')).toBe(false);
    });

    it('renders with border when withBorder is set to true', () => {
      const wrapper = mount(EGlobalCounter, {
        ...options,
        propsData: { withBorder: true },
      });

      expect(wrapper.classes('global-counter--with-border')).toBe(true);
    });
  });
});
