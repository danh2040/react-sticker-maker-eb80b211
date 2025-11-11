import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';

import EMainNavMenuCounter from '../../counter.vue';
import ECircleProgress from './circle-progress.vue';
import ELevelProgressAvatar from './index.vue';

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

describe('ELevelProgressAvatar', () => {
  beforeEach(() => {
    impactStore.$reset();
    impactStore.$patch({
      seeds: {
        isModified: true,
        totalAmount: 1,
      },
      level: {
        seedsEarned: 1,
        seedsToEarn: 3,
      },
    });
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

        if (isSeedsLevelsV2UIEnabled) {
          impactStore.$patch({
            growthPoints: {
              isModified: true,
              totalAmount: 25,
              level: {
                number: 1,
                growthPointsEarnedTowardsNextLevel: 25,
                growthPointsToUnlockNextLevel: 75,
              },
            },
          });
        } else {
          impactStore.$patch({
            seeds: {
              isModified: true,
              totalAmount: 1,
            },
            level: {
              seedsEarned: 1,
              seedsToEarn: 3,
            },
          });
        }
      });

      it('sets default classes', () => {
        const wrapper = shallowMount(ELevelProgressAvatar, options);
        expect(wrapper.classes()).toEqual([
          'level-progress-avatar',
        ]);
      });

      it("doesn't disable the animations", () => {
        const wrapper = shallowMount(ELevelProgressAvatar, options);

        if (!isSeedsLevelsV2UIEnabled) {
          const counter = wrapper.findComponent(EMainNavMenuCounter);
          expect(counter.props().isTextAnimationDisabled).toBe(false);
        }

        const circleProgress = wrapper.findComponent(ECircleProgress);
        expect(circleProgress.props().isAnimationDisabled).toBe(false);
      });

      describe('the account has not been modified', () => {
        beforeEach(() => {
          if (isSeedsLevelsV2UIEnabled) {
            impactStore.$patch({ growthPoints: { isModified: false } });
          } else {
            impactStore.$patch({ seeds: { isModified: false } });
          }
        });

        it('disables the animations', () => {
          const wrapper = shallowMount(ELevelProgressAvatar, options);

          if (!isSeedsLevelsV2UIEnabled) {
            const counter = wrapper.findComponent(EMainNavMenuCounter);
            expect(counter.props().isTextAnimationDisabled).toBe(true);
          }

          const circleProgress = wrapper.findComponent(ECircleProgress);
          expect(circleProgress.props().isAnimationDisabled).toBe(true);
        });
      });

      describe('the user has seen the animation', () => {
        beforeEach(() => {
          impactStore.$patch({ hasUserSeenTheLevelProgressAnimation: true });
        });

        it('disables the animations', () => {
          const wrapper = shallowMount(ELevelProgressAvatar, options);

          if (!isSeedsLevelsV2UIEnabled) {
            const counter = wrapper.findComponent(EMainNavMenuCounter);
            expect(counter.props().isTextAnimationDisabled).toBe(true);
          }

          const circleProgress = wrapper.findComponent(ECircleProgress);
          expect(circleProgress.props().isAnimationDisabled).toBe(true);
        });
      });

      describe('is locked', () => {
        beforeEach(() => {
          if (isSeedsLevelsV2UIEnabled) {
            impactStore.$patch({
              growthPoints: {
                isModified: true,
                totalAmount: 75,
                level: {
                  number: 1,
                  growthPointsEarnedTowardsNextLevel: 75,
                  growthPointsToUnlockNextLevel: 75,
                },
              },
            });
          } else {
            impactStore.$patch({
              seeds: {
                isModified: true,
                totalAmount: 3,
              },
              level: {
                seedsEarned: 3,
                seedsToEarn: 3,
              },
            });
          }
        });

        it('sets the class to locked', () => {
          const wrapper = shallowMount(ELevelProgressAvatar, options);
          expect(wrapper.classes()).toContain('level-progress-avatar--is-locked');
        });
      });

      if (!isSeedsLevelsV2UIEnabled) {
        describe('the impact api failed and total seed amount is null', () => {
          beforeEach(() => {
            impactStore.$patch({
              seeds: {
                isModified: true,
                totalAmount: null,
              },
              level: {
                seedsEarned: null,
                seedsToEarn: 3,
              },
            });
          });

          it('hides the user picture bar and info', () => {
            const wrapper = mount(ELevelProgressAvatar, options);

            const AvatarBar = wrapper.find(byTestId('level-progress-avatar-bar'));
            const AvatarInfo = wrapper.find(byTestId('level-progress-avatar-info'));

            expect(AvatarBar.exists()).toBe(false);
            expect(AvatarInfo.exists()).toBe(false);
          });
        });
      }

      it('calls markUserAsHavingSeenTheLevelProgressAnimation after 2 seconds', () => {
        mount(ELevelProgressAvatar, options);
        expect(impactStore.markUserAsHavingSeenTheLevelProgressAnimation).not.toHaveBeenCalled();
        vi.runAllTimers();
        expect(impactStore.markUserAsHavingSeenTheLevelProgressAnimation).toHaveBeenCalledOnce();
      });

      if (isSeedsLevelsV2UIEnabled) {
        it('hides the user info', () => {
          const wrapper = mount(ELevelProgressAvatar, options);

          const AvatarInfo = wrapper.find(byTestId('level-progress-avatar-info'));

          expect(AvatarInfo.exists()).toBe(false);
        });
      } else {
        it('shows the user picture bar and info', () => {
          const wrapper = mount(ELevelProgressAvatar, options);

          const AvatarBar = wrapper.find(byTestId('level-progress-avatar-bar'));
          const AvatarInfo = wrapper.find(byTestId('level-progress-avatar-info'));

          expect(AvatarBar.exists()).toBe(true);
          expect(AvatarInfo.exists()).toBe(true);
        });
      }
    },
  );
});
