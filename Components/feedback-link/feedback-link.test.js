import { mount, shallowMount } from '@vue/test-utils';

import EFeedbackModal from '@ecosia/common-vue2/components/feedback-modal/index.vue';
import EModal from '@ecosia/common-vue2/components/modal/index.vue';

import EFeedbackLink from './index.vue';

const propsData = {
  active: true,
  errorMessage: 'Oops, there was an error sending the feedback',
  options: [
    { label: 'I like the feature', value: 'helpful' },
    { label: 'Something is missing', value: 'missing' },
    { label: 'I don\'t find this useful', value: 'not_helpful' },
    { label: 'I don\'t understand this', value: 'wrong' },
  ],
  query: '',
  submitText: 'Send',
  successMessage: 'Your feedback will help us improve ecosia',
  successTitle: 'Thank you for your time?',
  textareaLabel: 'Tell us more (optional)',
  title: 'What is your feedback?',
  url: 'http://localhost',
};

describe('EFeedbackLink', () => {
  itRendersAndIsVisible(shallowMount(EFeedbackLink, { propsData }), 'div');

  it('opens modal on click', async () => {
    const wrapper = shallowMount(EFeedbackLink, { propsData });
    await wrapper.trigger('click');
    expect(wrapper.findComponent(EFeedbackModal)).toBeVisible();
  });

  it('closes modal on modal close', async () => {
    const wrapper = mount(EFeedbackLink, { propsData });
    const modal = wrapper.findComponent(EModal);

    await wrapper.find(byTestId('feedback-link')).trigger('click');
    expect(modal.props('active')).toBe(true);

    modal.vm.$emit('close');
    await wrapper.vm.$nextTick();
    expect(modal.props('active')).toBe(false);
  });
});
