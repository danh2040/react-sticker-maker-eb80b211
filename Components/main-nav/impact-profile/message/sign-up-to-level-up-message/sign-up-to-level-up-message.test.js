import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EButton from '@ecosia/common-vue2/components/button/index.vue';

import { useImpactStore } from '@ecosia/accounts-impact-client/store';

import EMainNavImpactProfileSignUpToLevelUpMessage from './index.vue';

const intersectionObserver = mockIntersectionObserver();

vi.mock('@ecosia/common-js/client/analytics.js');

const pinia = createTestingPinia();

const impactStore = useImpactStore(pinia);

describe('EMainNavImpactProfileSignUpToLevelUpMessage', () => {
  let wrapper;

  afterEach(() => {
    impactStore.$reset();
    vi.restoreAllMocks();
  });

  it('shows v1 message by default', async () => {
    wrapper = mount(EMainNavImpactProfileSignUpToLevelUpMessage);
    await wrapper.vm.$nextTick();
    const body = wrapper.find('p');
    expect(body.text()).toBe('common.header.menu.impact.messages.signup.message');
  });

  it('shows v2 message when feature flag is enabled', async () => {
    vi.spyOn(impactStore, 'isSeedsLevelsV2UIEnabled', 'get')
      .mockReturnValue(true);
    wrapper = mount(EMainNavImpactProfileSignUpToLevelUpMessage);
    await wrapper.vm.$nextTick();
    const body = wrapper.find('p');
    expect(body.text()).toBe('common.header.menu.impact.messages.signup.message.seedslevelsv2');
  });

  it('sends analytics', async () => {
    wrapper = mount(EMainNavImpactProfileSignUpToLevelUpMessage);
    await wrapper.vm.$nextTick();
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('accountsSignupToLevelUpDisplay');
  });

  describe('on click of the close button', () => {
    beforeEach(async () => {
      await wrapper.findComponent(EButton).trigger('click');
    });

    it('sends analytics when dismissed', async () => {
      await wrapper.vm.$nextTick();
      expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
      expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('accountsSignupToLevelUpDismiss');
    });

    it('emits the dismiss-message event', async () => {
      expect(wrapper.emitted()).toHaveProperty('dismiss-message');
    });
  });

  describe('when seen', () => {
    it('emits impression event', async () => {
      wrapper = mount(EMainNavImpactProfileSignUpToLevelUpMessage);
      await intersectionObserver.enterNode(wrapper.element);
      expect(wrapper.emitted()).toHaveProperty('impression');
    });
  });
});
