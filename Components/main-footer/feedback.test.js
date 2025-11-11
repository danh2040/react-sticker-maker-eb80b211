import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { SUPPORT_DOMAINS } from '@ecosia/common-js/universal/support-url-utils';
import EFeedbackModal from '@ecosia/common-vue2/components/feedback-modal/index.vue';

import { SUPPORT_PATHS } from '@ecosia/constants/urls';
import { useUserStore } from '@ecosia/store/user';

import EFeedback from './feedback.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));
const pinia = createTestingPinia({
  stubActions: false,
});

const options = {
  pinia,
};

setActivePinia(pinia);

describe('EFeedback', () => {
  const userStore = useUserStore();

  beforeAll(() => {
    userStore.$patch({ language: 'en' });
  });

  itRendersAndIsVisible(mount(EFeedback, options), 'div', 'main-footer-feedback');

  it('should send an analytics event when the helper link is clicked', async () => {
    const wrapper = mount(EFeedback, options);
    // syntheticallyset set data to show modal and quality helper link
    await wrapper.setData({
      active: true,
      helperShown: true,
    });

    const link = wrapper.find(byTestId('main-footer-feedback-quality-helper-link'));

    expect(link.exists()).toBe(true);

    link.trigger('click');
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('feedbackReportingResultLink');
  });

  it('sets helperShown on feedback modal option select', async () => {
    const wrapper = mount(EFeedback, options);
    await wrapper.setData({ active: true });

    const feedbackModal = wrapper.findComponent(EFeedbackModal);
    feedbackModal.vm.$emit('option-select', wrapper.vm.options.options[0].value);
    expect(wrapper.vm.helperShown).toBe(true);
  });

  it('sets active to true on button click', async () => {
    const wrapper = mount(EFeedback, options);
    const button = wrapper.find(byTestId('main-footer-feedback-link'));
    await button.trigger('click');
    expect(wrapper.vm.active).toBe(true);
  });

  it('sets active to false on feedback modal close', async () => {
    const wrapper = mount(EFeedback, options);
    const feedbackModal = wrapper.findComponent(EFeedbackModal);
    await wrapper.setData({ active: true });
    feedbackModal.vm.$emit('close');
    expect(wrapper.vm.active).toBe(false);
  });

  describe('support link', () => {
    it.each([
      ['en', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.CONTENT_AD_REMOVAL.en}`],
      ['de', `${SUPPORT_DOMAINS.de}/article/${SUPPORT_PATHS.CONTENT_AD_REMOVAL.de}`],
      ['fr', `${SUPPORT_DOMAINS.fr}/article/${SUPPORT_PATHS.CONTENT_AD_REMOVAL.fr}`],
      ['es', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.CONTENT_AD_REMOVAL.en}`], // Fallback to English
    ])('should have correct href for language %s', async (language, expectedHref) => {
      userStore.$patch({ language });

      const wrapper = mount(EFeedback, options);

      // syntheticallyset set data to show modal and quality helper link
      await wrapper.setData({
        active: true,
        helperShown: true,
      });

      const supportLink = wrapper.find(byTestId('main-footer-feedback-quality-helper-link'));
      expect(supportLink.element.href).toBe(expectedHref);
    });
  });
});
