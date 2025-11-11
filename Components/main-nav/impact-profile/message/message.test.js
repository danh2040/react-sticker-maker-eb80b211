import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';
import { useUserEngagementStore } from '@ecosia/user-engagement-client2/user-engagement.store.js';

import EMainNavImpactProfileMessage from './index.vue';
import EMainNavMenuProfileOnboardingMessage from './onboarding-message/index.vue';
import { useNavMenuMessagesStore } from './store.js';

const pinia = createTestingPinia({
  stubActions: true,
});

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const options = {
  localVue,
  pinia,
};

const impactStore = useImpactStore(pinia);
const userStore = useUserStore(pinia);
const unleashStore = useUnleashStore(pinia);
const userEngagementStore = useUserEngagementStore(pinia);
const navMenuMessagesStore = useNavMenuMessagesStore(pinia);

describe('EMainNavImpactProfileMessage', () => {
  beforeEach(() => {
    localStorage.clear();
    impactStore.$reset();
    userStore.$reset();
    unleashStore.$reset();
    userEngagementStore.$reset();
    navMenuMessagesStore.$reset();
    vi.clearAllMocks();
  });

  describe('has a message', () => {
    it('renders a component', async () => {
      const wrapper = mount(EMainNavImpactProfileMessage, options);
      await wrapper.vm.$nextTick();
      const onboardingMessageComponent = wrapper.findComponent(EMainNavMenuProfileOnboardingMessage);
      expect(onboardingMessageComponent.exists()).toBe(true);
    });
  });

  describe('doesnt have a message', () => {
    beforeEach(() => {
      vi.spyOn(navMenuMessagesStore, 'message', 'get')
        .mockReturnValueOnce(null);
    });

    it('doesnt render a component', async () => {
      const wrapper = mount(EMainNavImpactProfileMessage, options);
      await wrapper.vm.$nextTick();
      expect(wrapper.isVisible()).toBe(false);
    });
  });

  describe('if message is seen', () => {
    it('calls setMessageAsSeen with the correct message id', async () => {
      const wrapper = mount(EMainNavImpactProfileMessage, options);
      await wrapper.vm.$nextTick();
      const onboardingMessageComponent = wrapper.findComponent(EMainNavMenuProfileOnboardingMessage);
      await onboardingMessageComponent.vm.$emit('impression');
      expect(navMenuMessagesStore.setMessageAsSeen).toHaveBeenLastCalledWith(
        'onboarding',
      );
    });
  });

  describe('if message is dismissed', () => {
    it('calls setMessageAsDismissed with the correct message id', async () => {
      const wrapper = mount(EMainNavImpactProfileMessage, options);
      await wrapper.vm.$nextTick();
      const onboardingMessageComponent = wrapper.findComponent(EMainNavMenuProfileOnboardingMessage);
      await onboardingMessageComponent.vm.$emit('dismiss-message');
      expect(navMenuMessagesStore.setMessageAsDismissed).toHaveBeenLastCalledWith(
        'onboarding',
      );
    });
  });
});
