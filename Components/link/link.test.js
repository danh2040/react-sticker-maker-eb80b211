import { shallowMount } from '@vue/test-utils';

import ELink, { variants } from './index.vue';

const propsData = { href: '#' };

describe('Link', () => {
  itRendersAndIsVisible(shallowMount(ELink, { propsData }), 'a');

  it('renders content', () => {
    const text = 'Test';
    const wrapper = shallowMount(ELink, { propsData, slots: { default: `<span>${text}</span>` } });
    expect(wrapper.text()).toBe(text);
  });

  it.each(variants)('renders with variants %s', (variant) => {
    const wrapper = shallowMount(ELink, { propsData: { ...propsData, variant } });
    expect(wrapper.classes(`link--variant-${variant}`)).toBe(true);
  });

  it.each(variants)('handles deprecated use of color instead of variant %s', (color) => {
    const wrapper = shallowMount(ELink, { propsData: { ...propsData, color } });
    expect(wrapper.classes(`link--color-${color}`)).toBe(true);
  });

  it('renders as button', () => {
    const wrapper = shallowMount(ELink, { propsData: { ...propsData, as: 'button' } });
    expect(wrapper.element).toHaveHtmlTag('button');
    expect(wrapper.classes('link--as-button')).toBe(true);
  });

  it('warns on invalid color', () => {
    expect(() => shallowMount(ELink, { propsData: { ...propsData, variant: 'black' } }))
      .toHaveInvalidProp('variant');
  });
});
