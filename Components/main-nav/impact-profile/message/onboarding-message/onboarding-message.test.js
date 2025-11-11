import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';

import { useUserStore } from '@ecosia/store/user/index.js';

import EMainNavImpactProfileOnboardingMessage from './index.vue';

vi.mock('@ecosia/common-js/client/analytics.js');

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({ stubActions: false });
const options = { pinia };

const userStore = useUserStore();

const intersectionObserver = mockIntersectionObserver();

describe('EMainNavImpactProfileOnboardingMessage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    userStore.$reset();
  });

  it('links to the helpscout article', async () => {
    const wrapper = mount(EMainNavImpactProfileOnboardingMessage, options);
    await wrapper.vm.$nextTick();

    const learnMoreCta = wrapper.find(byTestId('onboarding-learn-more-cta'));

    expect(learnMoreCta.attributes('href')).toBe(
      'https://support.ecosia.org/article/844-seed-counter',
    );
  });

  it.each([
    { isSignedIn: true },
    { isSignedIn: false },
  ])('triggers analytics correctly on learn more click if isSignedIn is $isSignedIn', async ({ isSignedIn }) => {
    userStore.$patch({ isSignedIn });
    const wrapper = mount(EMainNavImpactProfileOnboardingMessage, options);
    await wrapper.vm.$nextTick();
    const learnMoreCta = wrapper.find(byTestId('onboarding-learn-more-cta'));

    // JSDOM doesn't implement full navigation - replace the href to prevent navigation
    learnMoreCta.element.setAttribute('href', '#');

    await learnMoreCta.trigger('click');

    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('accountsMainNavSeedLearnMoreButtonClick', {
      isSignedIn,
    });
  });

  describe('on click of the close button', () => {
    it('emits the dismiss-message event', async () => {
      const wrapper = mount(EMainNavImpactProfileOnboardingMessage, options);
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EButton).trigger('click');
      expect(wrapper.emitted()).toHaveProperty('dismiss-message');
    });
  });

  describe('when seen', () => {
    it('emits impression event', async () => {
      const wrapper = mount(EMainNavImpactProfileOnboardingMessage, options);
      await intersectionObserver.enterNode(wrapper.element);
      expect(wrapper.emitted()).toHaveProperty('impression');
    });
  });
});
