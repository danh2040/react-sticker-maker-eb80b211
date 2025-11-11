import { mount } from '@vue/test-utils';

import ESegmentedInput from './segmented-input.vue';

describe('ESegmentedInput', () => {
  itRendersAndIsVisible(mount(ESegmentedInput, {}), 'div');

  it('renders with correct class', () => {
    const wrapper = mount(ESegmentedInput, {});
    expect(wrapper.classes()).toContain('segmented-input');
  });

  it('renders slots', () => {
    const wrapper = mount(ESegmentedInput, {
      slots: {
        default: '<div class="segmented-input__item">Item 1</div><div class="segmented-input__item">Item 2</div>',
      },
    });
    expect(wrapper.findAll('.segmented-input__item').length).toBe(2);
  });
});
