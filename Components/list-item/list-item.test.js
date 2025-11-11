import { mount, shallowMount } from '@vue/test-utils';

import EListItem from './index.vue';

describe('EListItem', () => {
  itRendersAndIsVisible(shallowMount(EListItem, { }), 'li');

  it('renders highlight class', () => {
    const className = 'list-item--highlighted';
    const wrapper = mount(EListItem, { props: { highlighted: true } });
    wrapper.classes().includes(className);
  });
});
