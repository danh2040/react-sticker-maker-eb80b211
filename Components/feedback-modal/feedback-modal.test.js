import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import flushPromises from 'flush-promises';
import createFetchMock from 'vitest-fetch-mock';

import EFeedbackModal from './index.vue';

vi.useFakeTimers();
const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const query = 'ecosia';
const propsData = {
  active: true,
  errorMessage: 'Oops, there was an error sending the feedback',
  options: [
    { label: 'I like the feature', value: 'helpful' },
    { label: 'Something is missing', value: 'missing' },
    { label: 'I don\'t find this useful', value: 'not_helpful' },
    { label: 'I don\'t understand this', value: 'wrong' },
  ],
  query,
  submitText: 'Send',
  successTitle: 'Thank you for your time?',
  successMessage: 'Your feedback will help us improve ecosia',
  textareaLabel: 'Tell us more (optional)',
  title: 'What is your feedback?',
  url: 'http://localhost',
};
const fetchMock = createFetchMock(vi);

describe('EFeedbackModal', () => {
  const pinia = createTestingPinia();
  const options = { localVue, propsData, pinia };

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  itRendersAndIsVisible(mount(EFeedbackModal, options), 'div', 'feedback-modal');

  it('propagates option-select event upwards', async () => {
    const value = 'test';
    const wrapper = mount(EFeedbackModal, options);
    const form = wrapper.find(byTestId('feedback-modal-form'));
    form.vm.$emit('option-select', value);
    const [[selectedOption]] = wrapper.emitted('option-select');

    expect(selectedOption).toBe(value);
  });

  it('closes on feedback successfully sent', async () => {
    fetch.mockClear();
    fetch.mockResolvedValue({ ok: true });

    const wrapper = mount(EFeedbackModal, options);
    const form = wrapper.find(byTestId('feedback-form-element'));
    await wrapper.find(byTestId('radio-input')).trigger('click');
    form.trigger('submit.prevent');
    await flushPromises();
    vi.runAllTimers();

    expect(wrapper.emitted('close')).toBeTruthy();
  });
});
