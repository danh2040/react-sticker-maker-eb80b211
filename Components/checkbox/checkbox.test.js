import { mount, shallowMount } from '@vue/test-utils';

import ECheckbox from './index.vue';

describe('ECheckbox', () => {
  itRendersAndIsVisible(shallowMount(ECheckbox), 'div');

  describe('interactions', () => {
    it('triggers the input event on click', () => {
      const input = vi.fn();
      const wrapper = mount(ECheckbox, {
        propsData: {
          name: 'checkbox-test',
          value: false,
        },
        listeners: {
          input,
        },
      });
      wrapper.find(byTestId('checkbox-input')).trigger('click');
      expect(input).toHaveBeenCalledWith(true);
    });

    it.each(['Enter', ' '])('triggers the input event when %s is pressed', (key) => {
      const input = vi.fn();
      const wrapper = mount(ECheckbox, {
        propsData: {
          name: 'checkbox-test',
          value: false,
        },
        listeners: {
          input,
        },
      });
      wrapper.trigger('keydown', { key });
      expect(input).toHaveBeenCalledWith(true);
    });
  });
});
