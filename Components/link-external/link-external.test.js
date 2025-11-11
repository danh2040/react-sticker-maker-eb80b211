import { mount } from '@vue/test-utils';

import ELinkExternal from './index.vue';

const propsData = { href: '#' };

describe('ELinkExternal', () => {
  itRendersAndIsVisible(mount(ELinkExternal, { propsData }), 'a');

  it('renders content', () => {
    const text = 'Test';
    const wrapper = mount(ELinkExternal, { propsData, slots: { default: `<span>${text}</span>` } });
    expect(wrapper.text()).toBe(text);
  });
});
