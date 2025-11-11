import { shallowMount } from '@vue/test-utils';

import EBox, { paddings } from './index.vue';

describe('EBox', () => {
  itRendersAndIsVisible(shallowMount(EBox), 'div');

  it('renders with custom tag', () => {
    const as = 'article';
    const wrapper = shallowMount(EBox, { propsData: { as } });
    expect(wrapper.element.tagName.toLowerCase()).toBe(as);
  });

  it('renders content', () => {
    const text = 'Test';
    const wrapper = shallowMount(EBox, { slots: { default: `<span>${text}</span>` } });
    expect(wrapper.text()).toBe(text);
  });

  it('renders paddings', () => {
    paddings
      .forEach((padding) => {
        const wrapper = shallowMount(EBox, { propsData: { padding } });
        expect(wrapper.classes(`box--padding-${padding}`)).toBe(true);
      });
  });

  it('throws on invalid padding', () => {
    expect(() => shallowMount(EBox, { propsData: { padding: 'abc' } }))
      .toHaveInvalidProp('padding');
  });
});
