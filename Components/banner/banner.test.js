import { mount, shallowMount } from '@vue/test-utils';

import EBanner from './index.vue';

const propsData = {
  headline: 'Ecosia the search engine plants trees',
  description: 'Ecosia uses the ad revenue from your searches to plant trees.',
};

describe('EBanner', () => {
  itRendersAndIsVisible(mount(EBanner, { propsData }), 'div', 'banner');

  it('emits close event on close click', () => {
    const wrapper = mount(EBanner, { propsData });
    wrapper.find(byTestId('close')).trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('does not render a close button if closeButton is false', () => {
    const wrapper = shallowMount(EBanner, {
      propsData: { ...propsData, hasCloseAction: false },
    });
    expect(wrapper.element.querySelector(byTestId('close'))).toBe(null);
  });
});
