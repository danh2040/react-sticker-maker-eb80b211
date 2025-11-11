import { shallowMount } from '@vue/test-utils';

import EStatusMessage from './index.vue';

const propsData = { icon: 'question-circle' };

describe('EStatusMessage', () => {
  itRendersAndIsVisible(shallowMount(EStatusMessage, { propsData }), 'div');

  it('renders content', () => {
    const title = '<span>Title</span>';
    const message = '<span>Message</span>';
    const wrapper = shallowMount(EStatusMessage, {
      propsData,
      slots: {
        title,
        message,
      },
    });
    expect(wrapper.find(byTestId('title')).text()).toBe('Title');
    expect(wrapper.find(byTestId('message')).text()).toBe('Message');
  });
});
