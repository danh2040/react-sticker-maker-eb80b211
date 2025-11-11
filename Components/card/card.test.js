import { shallowMount } from '@vue/test-utils';

import { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';

import ECard from './index.vue';

describe('ECard', () => {
  const props = [
    'border',
    'padding',
    'overflowVisible',
  ];

  itRendersAndIsVisible(shallowMount(ECard), 'div', 'card');

  it.each(props)('sets classes correctly with %s prop', (prop) => {
    const propClass = getModifierClass('card', prop);
    const wrapper = shallowMount(ECard, { propsData: { [prop]: true } });
    expect(wrapper.classes(propClass)).toBe(true);
  });

  it('renders as a with rel noopener attributed', () => {
    const tag = 'a';
    const wrapper = shallowMount(ECard, { propsData: { as: tag } });
    expect(wrapper.element.tagName.toLowerCase()).toBe(tag);
    expect(wrapper.classes('card--as-a')).toBe(true);
    expect(wrapper.attributes('rel')).toBe('noopener');
  });

  it('renders content', () => {
    const text = 'Text';
    const wrapper = shallowMount(ECard, { slots: { default: `<span>${text}</span>` } });
    expect(wrapper.text()).toBe(text);
  });

  it('sets the href correctly', () => {
    const url = 'https://www.ecosia.org';
    const wrapper = shallowMount(ECard, { propsData: { href: url } });
    expect(wrapper.attributes('href')).toBe(url);
  });
});
