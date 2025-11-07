import { shallowMount } from '@vue/test-utils';

import EBadge, { variants } from './index.vue';

describe('EBadge', () => {
  itRendersAndIsVisible(shallowMount(EBadge), 'span');

  it('renders content', () => {
    const text = 'Test';
    const wrapper = shallowMount(EBadge, { slots: { default: `<span>${text}</span>` } });
    expect(wrapper.text()).toBe(text);
  });

  describe('Variant', () => {
    it.each(variants)('renders with variant %s', (variant) => {
      const wrapper = shallowMount(EBadge, { propsData: { variant } });
      expect(wrapper.classes(`badge--variant-${variant}`)).toBe(true);
    });

    it('warns on invalid variant', () => {
      expect(() => shallowMount(EBadge, { propsData: { variant: 'slimy' } }))
        .toHaveInvalidProp('variant');
    });
  });
});
