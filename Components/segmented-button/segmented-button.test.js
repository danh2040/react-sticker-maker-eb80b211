import { shallowMount } from '@vue/test-utils';

import ESegmentedButton from './index.vue';

const options = {
  propsData: {
    name: 'test',
    segments: [
      {
        label: 'segment 1',
      },
      {
        label: 'segment 2',
      },
      {
        label: 'segment 3',
      },
    ],
  },
};

describe('ESegmentedButton', () => {
  itRendersAndIsVisible(shallowMount(ESegmentedButton, options), 'div', 'segmented-button');

  it('renders segments with correct labels', () => {
    const wrapper = shallowMount(ESegmentedButton, options);
    const buttons = wrapper.findAll(byTestId('segmented-button-segment'));
    const { segments } = options.propsData;

    expect(buttons.length).toBe(segments.length);

    segments.forEach((segment, index) => {
      const button = buttons.at(index);
      expect(button.text()).toBe(segment.label);
    });
  });

  it('should have a default size of "l" when the size prop is undefined', () => {
    const wrapper = shallowMount(ESegmentedButton, {
      ...options,
      propsData: {
        ...options.propsData,
        // Undefined because of the conditional styling needed in
        // `common/vue2/components/field/index.vue`
        size: undefined,
      },
    });
    expect(wrapper.classes()).toContain('segmented-button--l');
  });

  it('should have the correct class when size is defined', () => {
    const wrapper = shallowMount(ESegmentedButton, {
      ...options,
      propsData: {
        ...options.propsData,
        size: 's',
      },
    });
    expect(wrapper.classes()).toContain('segmented-button--s');
  });
});
