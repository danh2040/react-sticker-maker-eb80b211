import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import ENotificationPill from '@ecosia/common-vue2/components/notification-pill/index.vue';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import { useNavMenuMessagesStore } from './impact-profile/message/store.js';
import EMainNavMenuButtonImpactCounter from './menu-button-impact-counter.vue';

const pinia = createTestingPinia({
  stubActions: false,
});

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const options = {
  localVue,
  pinia,
};

const impactStore = useImpactStore(pinia);
const navMenuMessagesStore = useNavMenuMessagesStore(pinia);
const userStore = useUserStore(pinia);

describe('EMainNavMenuButtonImpactCounter', () => {
  beforeEach(() => {
    impactStore.$reset();
    navMenuMessagesStore.$reset();
    userStore.$reset();
    vi.clearAllMocks();
  });

  describe("doesn't have a notification", () => {
    beforeEach(() => {
      vi.spyOn(navMenuMessagesStore, 'hasNotification', 'get')
        .mockReturnValue(false);
    });

    it("doesn't show a notification pill", async () => {
      const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
      await wrapper.vm.$nextTick();
      const notificationPillComponent = wrapper.findComponent(ENotificationPill);
      expect(notificationPillComponent.isVisible()).toBe(false);
    });
  });

  describe('has a notification', () => {
    beforeEach(() => {
      vi.spyOn(navMenuMessagesStore, 'hasNotification', 'get')
        .mockReturnValue(true);
    });

    it('shows the notification pill', async () => {
      const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
      await wrapper.vm.$nextTick();
      const notificationPillComponent = wrapper.findComponent(ENotificationPill);
      expect(notificationPillComponent.isVisible()).toBe(true);
    });
  });

  describe('signed-out', () => {
    beforeEach(() => {
      userStore.$patch({ isSignedIn: false });
    });

    describe('has a modified seed total', () => {
      beforeEach(() => {
        impactStore.$patch({
          seeds: {
            totalAmount: 3,
            previousTotalAmount: 2,
            isModified: true,
          },
        });
      });

      it('disables the animations', () => {
        const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
        const menuButtonImpactCounter = wrapper.find(byTestId('menu-button-impact-counter'));
        expect(
          menuButtonImpactCounter.classes('menu-button-impact-counter--is-animation-disabled'),
        ).toBe(false);
      });

      it('shows the seed balance change animation', () => {
        const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
        const balanceChange = wrapper.find(byTestId('menu-button-impact-counter-total-seed-amount-change'));
        expect(balanceChange.exists()).toBe(true);
      });

      describe('the seed balance is malformed and the string is empty', () => {
        beforeEach(() => {
          impactStore.$patch({
            seeds: {
              totalAmount: null,
            },
          });
        });

        it("doesn't show the total change animation", () => {
          const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
          const balanceChange = wrapper.find(byTestId('menu-button-impact-counter-total-seed-amount-change'));
          expect(balanceChange.exists()).toBe(false);
        });
      });
    });

    describe('has an unmodified total', () => {
      beforeEach(() => {
        impactStore.$patch({
          totalAmount: 3,
          previousTotalAmount: 3,
          isModified: false,
        });
      });

      it('disables the animations', () => {
        const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
        const menuButtonImpactCounter = wrapper.find(byTestId('menu-button-impact-counter'));
        expect(
          menuButtonImpactCounter.classes('menu-button-impact-counter--is-animation-disabled'),
        ).toBe(true);
      });

      it("doesn't show the total seed change animation", () => {
        const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
        const balanceChange = wrapper.find(byTestId('menu-button-impact-counter-total-seed-amount-change'));
        expect(balanceChange.exists()).toBe(false);
      });
    });

    describe('seeds earned are fewer than the level up amount', () => {
      beforeEach(() => {
        impactStore.$patch({
          seeds: {
            totalAmount: 1,
          },
          level: { seedsEarned: 1, seedsToEarn: 3 },
        });
      });

      it("doesn't show a locked symbol", () => {
        const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
        expect(wrapper.find(byTestId('animated-lock-icon')).exists()).toBe(false);
      });
    });

    describe('seeds earned are the same as the level up amount', () => {
      beforeEach(() => {
        impactStore.$patch({
          seeds: {
            totalAmount: 3,
          },
          level: { seedsEarned: 3, seedsToEarn: 3 },
        });
      });

      it('shows a locked symbol', () => {
        const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
        expect(wrapper.find(byTestId('animated-lock-icon')).exists()).toBe(true);
      });
    });
  });

  describe('signed-in', () => {
    beforeEach(() => {
      userStore.$patch({ isSignedIn: true });
    });

    describe('seeds earned are the same as the level up amount', () => {
      beforeEach(() => {
        impactStore.$patch({
          seeds: {
            totalAmount: 3,
          },
          level: { seedsEarned: 3, seedsToEarn: 3 },
        });
      });

      it("doesn't show a locked symbol", () => {
        const wrapper = mount(EMainNavMenuButtonImpactCounter, options);
        expect(wrapper.find(byTestId('animated-lock-icon')).exists()).toBe(false);
      });
    });
  });
});
