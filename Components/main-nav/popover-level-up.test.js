import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EMainNavMenuPopoverLevelUp from './popover-level-up.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({ stubActions: true });
const options = { pinia };

const impactStore = useImpactStore(pinia);
const userStore = useUserStore(pinia);

vi.mock('@ecosia/common-js/client/analytics.js');

const LEVEL_NUMBER = 3;

describe('EMainNavMenuPopoverLevelUp', () => {
  beforeEach(() => {
    userStore.$reset();
    impactStore.$reset();
    impactStore.$patch({ level: { number: LEVEL_NUMBER } });
    vi.restoreAllMocks();
    vi.useFakeTimers();
    window.localStorage.clear();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe.each([
    { isSeedsLevelsV2UIEnabled: false },
    { isSeedsLevelsV2UIEnabled: true },
  ])(
    'isSeedsLevelsV2UIEnabled is $isSeedsLevelsV2UIEnabled',
    ({
      isSeedsLevelsV2UIEnabled,
    }) => {
      beforeEach(() => {
        vi.spyOn(impactStore, 'isSeedsLevelsV2UIEnabled', 'get').mockReturnValue(
          isSeedsLevelsV2UIEnabled,
        );
      });

      describe('level up ui is visible', () => {
        beforeEach(() => {
          if (isSeedsLevelsV2UIEnabled) {
            impactStore.getIsGrowthPointsLevelUpUIVisible.mockReturnValue(true);
          } else {
            impactStore.getIsLevelUpUIVisible.mockReturnValue(true);
          }
        });

        it('shows the component', async () => {
          const wrapper = mount(EMainNavMenuPopoverLevelUp, options);
          await wrapper.vm.$nextTick();
          await vi.runAllTimers();
          expect(wrapper.find(byTestId('popover-content'))).toBeVisible();
        });

        it('triggers analytics if user is signed in', async () => {
          userStore.$patch({ isSignedIn: true });
          const wrapper = mount(EMainNavMenuPopoverLevelUp, options);
          await wrapper.vm.$nextTick();
          await vi.runAllTimers();
          expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('accountsUserLevelUpDisplay', {
            level: LEVEL_NUMBER,
          });
          expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
        });

        it("doesn't triggers analytics if user is signed out", async () => {
          const wrapper = mount(EMainNavMenuPopoverLevelUp, options);
          await wrapper.vm.$nextTick();
          await vi.runAllTimers();
          expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(0);
        });

        if (isSeedsLevelsV2UIEnabled) {
          it('shows new message', () => {
            const wrapper = mount(EMainNavMenuPopoverLevelUp, options);
            const messageElement = wrapper.find(byTestId('popover-level-up-message'));
            expect(messageElement.text()).toBe(
              'common.header.menu.impact.popoverlevelup.message.seedslevelsv2',
            );
          });
        } else {
        // TODO we don't need this test once seeds levels v2 is cleaned up
          it('shows normal message', () => {
            const wrapper = mount(EMainNavMenuPopoverLevelUp, options);
            const messageElement = wrapper.find(byTestId('popover-level-up-message'));
            expect(messageElement.text()).toBe(
              'common.header.menu.impact.popoverlevelup.message',
            );
          });
        }

        describe('on click of the close button', () => {
          it('doesnt show the component', async () => {
            const wrapper = mount(EMainNavMenuPopoverLevelUp, options);

            const closeButton = wrapper.find(byTestId('popover-level-up-close-button'));
            await closeButton.trigger('click');

            await wrapper.vm.$nextTick();

            expect(wrapper.find(byTestId('popover-content'))).not.toBeVisible();
          });
        });

        describe('on click of the cta link', () => {
          it('doesnt show the component', async () => {
            const wrapper = mount(EMainNavMenuPopoverLevelUp, options);

            const ctaLink = wrapper.find(byTestId('popover-level-up-cta-link'));
            // JSDOM doesn't implement full navigation - replace the href to prevent navigation errors
            ctaLink.element.setAttribute('href', '#');

            await ctaLink.trigger('click');

            await wrapper.vm.$nextTick();

            expect(wrapper.find(byTestId('popover-content'))).not.toBeVisible();
          });

          it('triggers analytics if user is signed in', async () => {
            userStore.$patch({ isSignedIn: true });
            const wrapper = mount(EMainNavMenuPopoverLevelUp, options);

            const ctaLink = wrapper.find(byTestId('popover-level-up-cta-link'));
            // JSDOM doesn't implement full navigation - replace the href to prevent navigation errors
            ctaLink.element.setAttribute('href', '#');

            await ctaLink.trigger('click');

            await wrapper.vm.$nextTick();
            expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('accountsUserLevelUpButtonClick', {
              level: LEVEL_NUMBER,
            });
          });

          it('doesn\'t triggers analytics if user is signed out', async () => {
            const wrapper = mount(EMainNavMenuPopoverLevelUp, options);

            const ctaLink = wrapper.find(byTestId('popover-level-up-cta-link'));
            // JSDOM doesn't implement full navigation - replace the href to prevent navigation errors
            ctaLink.element.setAttribute('href', '#');

            await ctaLink.trigger('click');

            await wrapper.vm.$nextTick();
            expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(0);
          });
        });
      });

      describe("level up ui isn't visible", () => {
        beforeEach(() => {
          if (isSeedsLevelsV2UIEnabled) {
            impactStore.getIsGrowthPointsLevelUpUIVisible.mockReturnValue(false);
          } else {
            impactStore.getIsLevelUpUIVisible.mockReturnValue(false);
          }
        });

        it('doesnt show the component', async () => {
          const wrapper = mount(EMainNavMenuPopoverLevelUp, options);
          await wrapper.vm.$nextTick();

          expect(wrapper.find(byTestId('popover-content'))).not.toBeVisible();
        });

        it('doesnt trigger analytics', async () => {
          const wrapper = mount(EMainNavMenuPopoverLevelUp, options);
          await wrapper.vm.$nextTick();

          expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(0);
        });
      });
    },
  );
});
