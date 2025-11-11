import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import flushPromises from 'flush-promises';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';

import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EFeedbackForm from './index.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

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
    { label: 'I have a suggestion to make', messageRequired: true, value: 'suggestion' },
  ],
  query,
  submitText: 'Send',
  successTitle: 'Thank you for your time?',
  successMessage: 'Your feedback will help us improve ecosia',
  textareaLabel: 'Tell us more (optional)',
  title: 'What is your feedback?',
};

const options = {
  localVue,
  propsData,
  pinia: createTestingPinia({
    stubActions: false,
  }),
};

const expectFormBehaviours = async (wrapper) => {
  const submit = wrapper.find(byTestId('feedback-form-submit'));
  const form = wrapper.find(byTestId('feedback-form-element'));
  expect(submit.attributes('disabled')).not.toBe('disabled');

  // Check if some option was selected, and show error
  form.trigger('submit.prevent');
  await wrapper.vm.$nextTick();
  expect(wrapper.find(byTestId('field-error')).text()).toBe('common.header.feedback.bulletserror');

  wrapper.find(byTestId('radio-input')).trigger('click');
  await flushPromises();
  expect(wrapper.find(byTestId('radio-input')).element.checked).toBe(true);
  expect(submit.attributes('disabled')).not.toBe('disabled');
  form.trigger('change'); // Just clicking the radio button doesn't trigger this in the test
  await wrapper.vm.$nextTick();
  expect(wrapper.find(byTestId('field-error')).exists()).toBe(false);

  // Check if text are is empty, because the "suggestion" requires it, and show error
  wrapper.find(`${byTestId('radio-input')}[value="suggestion"]`).trigger('click');
  await flushPromises();
  form.trigger('submit.prevent');
  await wrapper.vm.$nextTick();
  expect(wrapper.find(byTestId('field-error')).exists()).toBe(true);
  expect(wrapper.find(byTestId('field-error')).text()).toBe('common.header.feedback.tellmoreerror');

  wrapper.find(`${byTestId('radio-input')}[value="helpful"]`).trigger('click');
  await flushPromises();
  const textAreaSelector = byTestId('feedback-form-message');
  const input = wrapper.find(`${textAreaSelector} textarea`);
  await input.setValue('Test feedback');
  await wrapper.vm.$nextTick();

  expect(submit.attributes('disabled')).not.toBe('disabled');
  form.trigger('submit.prevent');
  await wrapper.vm.$nextTick();
};

describe('EFeedbackForm', () => {
  const userStore = useUserStore();
  const globalStore = useGlobalStore();

  afterEach(() => {
    userStore.$reset();
    globalStore.$reset();
    vi.clearAllMocks();
  });

  itRendersAndIsVisible(mount(EFeedbackForm, options), 'div', 'feedback-form');

  it('renders form props', () => {
    const text = 'Form footer';
    const wrapper = mount(EFeedbackForm, {
      ...options,
      slots: {
        'form-footer': text,
      },
    });

    expect(wrapper.find(byTestId('feedback-form-title')).text()).toBe(propsData.title);
    expect(wrapper.find(byTestId('feedback-form-submit')).text()).toBe(propsData.submitText);
    expect(wrapper.html()).toContain(text);
  });

  it.each([
    ['does not pre-select', ''],
    ['pre-selects', 'helpful'],
  ])('%s an option when selectedOption is set to "%s"', (action, selectedOption) => {
    const wrapper = mount(EFeedbackForm, {
      ...options,
      propsData: {
        ...propsData,
        selectedOption,
      },
    });
    // Not ideal way to check the pre-selected input value,
    // but sadly the JSDOM `RadioNodeList` implementation seems to be broken
    // and it returns the value of the first radio input in the list even if it's not selected.
    if (action === 'pre-selects') {
      expect(wrapper.vm.answer).toBe(selectedOption);
    } else {
      expect(wrapper.vm.answer).toBe(null);
    }
  });

  it('emits an option-select event on an answer changed', async () => {
    const [{ value }] = propsData.options;
    const wrapper = mount(EFeedbackForm, options);
    await wrapper.setData({ answer: value });
    const field = wrapper.find(byTestId('feedback-form-answer'));
    field.vm.$emit('change');
    const [[selectedOption]] = wrapper.emitted('option-select');

    expect(selectedOption).toBe(value);
  });

  it('prevents from saving feedback with no message when required', async () => {
    const wrapper = mount(EFeedbackForm, {
      ...options,
      propsData: {
        ...propsData,
        isMessageRequired: true,
      },
    });
    await wrapper.vm.$nextTick();

    const submit = wrapper.find(byTestId('feedback-form-submit'));
    expect(submit.attributes('disabled')).not.toBe('disabled');

    wrapper.find(byTestId('radio-input')).trigger('click');
    await flushPromises();
    expect(wrapper.find(byTestId('radio-input')).element.checked).toBe(true);
    expect(submit.attributes('disabled')).not.toBe('disabled');

    const textAreaSelector = byTestId('feedback-form-message');
    const input = wrapper.find(`${textAreaSelector} textarea`);
    await input.setValue('Test feedback');
    await wrapper.vm.$nextTick();

    expect(submit.attributes('disabled')).not.toBe('disabled');
  });

  it('allows saving feedback with no message data when not required', async () => {
    const wrapper = mount(EFeedbackForm, options);
    const submit = wrapper.find(byTestId('feedback-form-submit'));
    expect(submit.attributes('disabled')).not.toBe('disabled');

    wrapper.find(byTestId('radio-input')).trigger('click');
    await flushPromises();
    expect(wrapper.find(byTestId('radio-input')).element.checked).toBe(true);

    expect(submit.attributes('disabled')).not.toBe('disabled');
  });

  it('renders checkboxes if `hasMultipleAnswers` is true', async () => {
    const wrapper = mount(EFeedbackForm, {
      ...options,
      propsData: {
        ...propsData,
        hasMultipleAnswers: true,
      },
    });
    await wrapper.vm.$nextTick();

    const answers = wrapper.findAll(byTestId('checkbox-input'));
    const first = answers.at(0);
    const second = answers.at(1);
    const fourth = answers.at(3);

    await first.trigger('click');

    expect(wrapper.vm.selectedAnswers.map(({ selected }) => selected))
      .toEqual([true, false, false, false, false]);

    await second.trigger('click');
    await fourth.trigger('click');

    expect(wrapper.vm.selectedAnswers.map(({ selected }) => selected))
      .toEqual([true, true, false, true, false]);

    await first.trigger('click');
    await second.trigger('click');
    await fourth.trigger('click');

    expect(wrapper.vm.selectedAnswers.map(({ selected }) => selected))
      .toEqual([false, false, false, false, false]);
  });

  describe('Tracking event', () => {
    const expectedPayload = {
      answer: propsData.options[0].value,
      message: 'Test feedback',
      multiple_answers: null,
      market: userStore.bingMarketCode,
      query,
      widget_type: '',
      origin: '',
      provider: '',
      source: '',
    };

    it('sends tracking event', async () => {
      const wrapper = mount(EFeedbackForm, options);
      await expectFormBehaviours(wrapper);

      expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('feedbackFormSubmit', expectedPayload);
      expect(wrapper.find(byTestId('feedback-form-success')).exists()).toBe(true);
      expect(wrapper.emitted('success')).toBeTruthy();
    });

    it('sends tracking event with custom provider', async () => {
      const provider = 'test';
      globalStore.$patch({ mainResultsProvider: provider });
      const wrapper = mount(EFeedbackForm, options);
      await expectFormBehaviours(wrapper);

      expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('feedbackFormSubmit', {
        ...expectedPayload,
        provider,
      });
      expect(wrapper.find(byTestId('feedback-form-success')).exists()).toBe(true);
      expect(wrapper.emitted('success')).toBeTruthy();
    });

    it('sends tracking event with custom internal message', async () => {
      const internalMessage = 'some internal message';
      const wrapper = mount(EFeedbackForm, {
        ...options,
        propsData: {
          ...propsData,
          internalMessage,
        },
      });
      await expectFormBehaviours(wrapper);

      expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('feedbackFormSubmit', {
        ...expectedPayload,
        message: `Test feedback {{internal: ${internalMessage}}}`,
      });
      expect(wrapper.find(byTestId('feedback-form-success')).exists()).toBe(true);
      expect(wrapper.emitted('success')).toBeTruthy();
    });

    it('sends tracking event with multiple selected answers', async () => {
      const wrapper = mount(EFeedbackForm, {
        ...options,
        propsData: {
          ...propsData,
          hasMultipleAnswers: true,
        },
      });

      const answers = wrapper.findAll(byTestId('checkbox-input'));
      answers.at(2).trigger('click'); // not_helpful
      answers.at(3).trigger('click'); // wrong
      await flushPromises();

      wrapper.find(byTestId('feedback-form-element')).trigger('submit.prevent');
      await wrapper.vm.$nextTick();

      expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('feedbackFormSubmit', {
        ...expectedPayload,
        answer: null,
        message: '',
        multiple_answers: ['not_helpful', 'wrong'],
      });
      expect(wrapper.find(byTestId('feedback-form-success')).exists()).toBe(true);
      expect(wrapper.emitted('success')).toBeTruthy();
    });

    it('sends custom tracking payload', async () => {
      const customTrackingPayload = { custom: 'payload', widget_type: 'custom_widget', provider: null };
      const wrapper = mount(EFeedbackForm, {
        ...options,
        propsData: {
          ...propsData,
          customTrackingPayload,
        },
      });
      await expectFormBehaviours(wrapper);

      expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('feedbackFormSubmit', {
        ...expectedPayload,
        ...customTrackingPayload,
      });
      expect(sendCoreAnalyticsEvent.mock.calls[0][1].widget_type).toBe(customTrackingPayload.widget_type);
      expect(sendCoreAnalyticsEvent.mock.calls[0][1].provider).toBe(null);
      expect(wrapper.find(byTestId('feedback-form-success')).exists()).toBe(true);
      expect(wrapper.emitted('success')).toBeTruthy();
    });
  });
});
