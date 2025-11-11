import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import flushPromises from 'flush-promises';

import { useImpactStore } from '@ecosia/accounts-impact-client/store';

import EMainNavMenuButtonImpactCounterSparkles from './sparkles.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({ stubActions: true });
const options = { pinia };

const impactStore = useImpactStore(pinia);

describe('EMainNavMenuButtonImpactCounterSparkles', () => {
  beforeEach(() => {
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

        it('the component is visible', async () => {
          const wrapper = mount(EMainNavMenuButtonImpactCounterSparkles, options);
          await wrapper.vm.$nextTick();
          await vi.runAllTimers();
          expect(wrapper).toBeVisible();
        });

        it("when animation hasn't run yet it has default classnames", async () => {
          const wrapper = mount(EMainNavMenuButtonImpactCounterSparkles, options);
          await wrapper.vm.$nextTick();
          expect(wrapper.classes()).toStrictEqual([
            'menu-button-impact-counter-sparkles',
          ]);
        });

        it('when animation has run it has animate classname', async () => {
          const wrapper = mount(EMainNavMenuButtonImpactCounterSparkles, options);
          await wrapper.vm.$nextTick();
          await vi.runAllTimers();
          await flushPromises();
          await wrapper.vm.$nextTick();
          expect(wrapper.classes()).toStrictEqual([
            'menu-button-impact-counter-sparkles',
            'menu-button-impact-counter-sparkles--is-animating',
          ]);
        });
      });

      describe("level up ui isn't visible", () => {
        beforeEach(() => {
          impactStore.getIsLevelUpUIVisible.mockReturnValue(false);
        });

        it("the component isn't visible", async () => {
          const wrapper = mount(EMainNavMenuButtonImpactCounterSparkles, options);
          await wrapper.vm.$nextTick();
          await vi.runAllTimers();
          expect(wrapper).not.toBeVisible();
        });
      });
    },
  );
});
