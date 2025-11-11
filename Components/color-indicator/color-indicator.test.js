import { shallowMount } from '@vue/test-utils';

import EColorIndicator, { sizes } from './index.vue';

const color = 'teal';
const propsData = { color };

describe('EColorIndicator', () => {
  itRendersAndIsVisible(
    shallowMount(EColorIndicator, { propsData }),
    'div',
    `color-indicator--color-${color}`,
  );

  describe('size', () => {
    it.each(sizes)('renders with size %s', (size) => {
      const wrapper = shallowMount(EColorIndicator, { propsData: { ...propsData, size } });
      expect(wrapper.classes(`color-indicator--size-${size}`)).toBe(true);
    });

    it('warns on invalid size', () => {
      expect(() => shallowMount(EColorIndicator, { propsData: { ...propsData, size: 'xl' } }))
        .toHaveInvalidProp('size');
    });
  });
});
