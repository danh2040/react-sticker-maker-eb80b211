import { createLocalVue, mount, shallowMount } from '@vue/test-utils';

import ETab from './index.vue';

const propsData = {
  url: 'http://example.com',
  icon: 'search',
};
const localVue = createLocalVue();
const options = { localVue, propsData };

describe('ETab', () => {
  itRendersAndIsVisible(shallowMount(ETab, options), 'a');

  it('renders links with rel noopener attribute', () => {
    const wrapper = shallowMount(ETab, options);
    expect(wrapper.element.rel).toBe('noopener');
    expect(wrapper.element.target).toBe('_self');
  });

  it('sets link target', () => {
    const linkTarget = '_blank';
    const wrapper = shallowMount(
      ETab,
      { ...options, propsData: { ...propsData, linkTarget } },
    );
    expect(wrapper.element.target).toBe(linkTarget);
  });

  it('sets the icon class correctly', () => {
    const wrapper = mount(ETab, options);
    expect(wrapper.classes()).toContain('tab--icon');
  });
});
