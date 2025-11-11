import { shallowMount } from '@vue/test-utils';

import ELoading from './index.vue';

describe('ELoading', () => {
  itRendersAndIsVisible(shallowMount(ELoading), 'div', 'loading');

  it('renders icon and spinner', () => {
    const wrapper = shallowMount(ELoading);
    expect(wrapper.find(byTestId('loading-icon')).exists()).toBe(true);
    expect(wrapper.find(byTestId('loading-spinner')).exists()).toBe(true);
  });
});
