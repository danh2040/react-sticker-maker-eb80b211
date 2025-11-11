import { shallowMount } from '@vue/test-utils';

import EScrollableContent from './index.vue';

describe('EScrollableContent', () => {
  itRendersAndIsVisible(shallowMount(EScrollableContent), 'div');

  it('renders content', () => {
    const fixed = 'Test';
    const scrollable = 'Scrollable';
    const wrapper = shallowMount(EScrollableContent, {
      slots: {
        fixed: `<span>${fixed}</span>`,
        scrollable: `<span>${scrollable}</span>`,
      },
    });
    expect(wrapper.find(byTestId('fixed')).text()).toBe(fixed);
    expect(wrapper.find(byTestId('scrollable')).text()).toBe(scrollable);
  });

  it('removes event listener on destroy', async () => {
    const fixed = 'Test';
    const scrollable = 'Scrollable';
    const wrapper = shallowMount(EScrollableContent, {
      slots: {
        fixed: `<span>${fixed}</span>`,
        scrollable: `<span>${scrollable}</span>`,
      },
    });

    const scrollableElement = wrapper.find(byTestId('scrollable')).element;
    const scrollableSpy = vi.spyOn(scrollableElement, 'removeEventListener');
    await wrapper.destroy();
    expect(scrollableSpy).toHaveBeenCalled();
  });
});
