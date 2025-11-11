import { shallowMount } from '@vue/test-utils';

import EMessageTips from './index.vue';

const message = 'Test';
const tipsMessage = 'Test title';
const tips = ['Tip1', 'Tip2'];
const propsData = { tipsMessage, tips };
const options = { propsData, slots: { default: message } };

describe('MessageTips', () => {
  itRendersAndIsVisible(shallowMount(EMessageTips, options), 'section', 'message-tips');

  it('renders props data', () => {
    const wrapper = shallowMount(EMessageTips, options);
    expect(wrapper.find(byTestId('message-tips-message')).text()).toBe(message);
    expect(wrapper.find(byTestId('message-tips-tips-message')).text()).toBe(tipsMessage);
    expect(wrapper.find(byTestId('message-tips-tips')).text().replace(/\s/g, '')).toBe(tips.join(''));
  });

  it('does not render tips if none given', () => {
    const wrapper = shallowMount(EMessageTips, {
      ...options,
      propsData: {
        ...propsData,
        tips: [],
      },
    });

    expect(wrapper.find(byTestId('message-tips-content')).element).not.toBeDefined();
  });

  it('renders a list when multiple tips are provided', () => {
    const wrapper = shallowMount(EMessageTips, options);

    expect(wrapper.find(byTestId('message-tips-tip')).element).not.toBeDefined();
    expect(wrapper.find(byTestId('message-tips-tips'))).toBeVisible();
  });

  it('renders single tip when only one tip provided', () => {
    const wrapper = shallowMount(EMessageTips, {
      ...options,
      propsData: {
        ...propsData,
        tips: [tips[0]],
      },
    });

    expect(wrapper.find(byTestId('message-tips-tips')).element).not.toBeDefined();
    expect(wrapper.find(byTestId('message-tips-tip'))).toBeVisible();
  });
});
