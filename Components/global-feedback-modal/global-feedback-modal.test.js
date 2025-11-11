import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useFeedbackModalStore } from '@ecosia/store/feedback-modal/index.js';

import EGlobalFeedbackModal from './index.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({ stubActions: false });

const options = {
  localVue,
  pinia,
};

describe('EGlobalFeedbackModal', () => {
  const feedbackModalStore = useFeedbackModalStore(pinia);

  afterEach(() => {
    feedbackModalStore.$reset();
  });

  it('does not render if data is invalid', () => {
    expect(() => feedbackModalStore.init('', null)).toThrowError();
    const wrapper = mount(EGlobalFeedbackModal, options);

    expect(wrapper.isVisible()).toBeFalsy();
  });

  it('renders if data is valid', () => {
    feedbackModalStore.init(
      {
        widgetType: 'widgetType',
        settings: {
          origin: 'origin',
          query: 'query',
          submitText: 'submitText',
          errorMessage: 'errorMessage',
          successMessage: 'successMessage',
          successTitle: 'successTitle',
          textareaLabel: 'textareaLabel',
          title: 'title',
          provider: 'provider',
          internalMessage: 'internalMessage',
          options: [{ label: 'First option', value: 'option1' }, { label: 'Second option', value: 'option2' }],
        },
        onClose: null,
      },
    );
    feedbackModalStore.open();
    const wrapper = mount(EGlobalFeedbackModal, options);

    expect(wrapper.isVisible()).toBeTruthy();
  });
});
