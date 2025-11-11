import { config, createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import EBadge from '@ecosia/common-vue2/components/badge/index.vue';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import ELevelDetails from './index.vue';

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
const userStore = useUserStore(pinia);

describe('ELevelDetails', () => {
  beforeEach(() => {
    userStore.$reset();
    impactStore.$reset();

    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
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

      describe('if theres no level', () => {
        it('doesnt render anything', () => {
          const wrapper = shallowMount(ELevelDetails, options);
          expect(wrapper).not.toBeVisible();
        });
      });

      describe('badge variant', () => {
        beforeEach(() => {
          if (isSeedsLevelsV2UIEnabled) {
            impactStore.$patch({
              growthPoints: {
                level: { number: 1 },
              },
            });
          } else {
            impactStore.$patch({
              level: { number: 1 },
            });
          }
        });

        it('sets variant to be neutral', () => {
          const wrapper = mount(ELevelDetails, options);
          const levelBadge = wrapper.findComponent(EBadge);
          expect(levelBadge.props().variant).toBe('neutral');
        });

        describe('signed-in', () => {
          beforeEach(() => {
            userStore.$patch({
              isSignedIn: true,
            });
          });

          it('sets variant to be accent yellow', () => {
            const wrapper = mount(ELevelDetails, options);
            const levelBadge = wrapper.findComponent(EBadge);
            expect(levelBadge.props().variant).toBe('accent-yellow');
          });
        });
      });

      describe('levels', () => {
        let testOptions;

        beforeEach(() => {
          testOptions = { ...options, $t: config.mocks.$t };
        });

        it('renders level one', () => {
          if (isSeedsLevelsV2UIEnabled) {
            impactStore.$patch({
              growthPoints: {
                level: { number: 1 },
              },
            });
          } else {
            impactStore.$patch({
              level: { number: 1 },
            });
          }

          const wrapper = shallowMount(ELevelDetails, testOptions);
          const number = wrapper.find(byTestId('impact-profile-level-number'));
          expect(number.text()).toEqual('common.header.menu.impact.levelnumber {"number":1}');
          const name = wrapper.find(byTestId('impact-profile-level-name'));
          expect(name.text()).toEqual('common.header.menu.impact.level.1');
        });

        it('renders level two', () => {
          if (isSeedsLevelsV2UIEnabled) {
            impactStore.$patch({
              growthPoints: {
                level: { number: 2 },
              },
            });
          } else {
            impactStore.$patch({
              level: { number: 2 },
            });
          }

          const wrapper = shallowMount(ELevelDetails, options);
          const number = wrapper.find(byTestId('impact-profile-level-number'));
          expect(number.text()).toEqual('common.header.menu.impact.levelnumber {"number":2}');
          const name = wrapper.find(byTestId('impact-profile-level-name'));
          expect(name.text()).toEqual('common.header.menu.impact.level.2');
        });

        it('renders level ten', () => {
          if (isSeedsLevelsV2UIEnabled) {
            impactStore.$patch({
              growthPoints: {
                level: { number: 10 },
              },
            });
          } else {
            impactStore.$patch({
              level: { number: 10 },
            });
          }

          const wrapper = shallowMount(ELevelDetails, options);
          const number = wrapper.find(byTestId('impact-profile-level-number'));
          expect(number.text()).toEqual('common.header.menu.impact.levelnumber {"number":10}');
          const name = wrapper.find(byTestId('impact-profile-level-name'));
          expect(name.text()).toEqual('common.header.menu.impact.level.10');
        });
      });
    },
  );
});
