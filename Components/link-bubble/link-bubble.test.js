import { mount } from '@vue/test-utils';

import ELinkBubble from './index.vue';

const propsData = { href: '#' };

describe('LinkBubble', () => {
  itRendersAndIsVisible(mount(ELinkBubble, { propsData }), 'a');

  it('renders content', () => {
    const text = 'Test';
    const wrapper = mount(ELinkBubble, { propsData, slots: { default: `<span>${text}</span>` } });
    expect(wrapper.text()).toBe(text);
  });
});
