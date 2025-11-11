import { createPinia, setActivePinia } from 'pinia';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';
import { showMultiDeviceNavMenuMessage } from '@ecosia/constants/feature-flags.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';
import { useUserEngagementStore } from '@ecosia/user-engagement-client2/user-engagement.store.js';

import EMainNavMenuProfileErrorMessage from './error-message/index.vue';
import EMainNavImpactProfileMultiDeviceMessage from './multi-device-message/index.vue';
import EMainNavMenuProfileOnboardingMessage from './onboarding-message/index.vue';
import EMainNavMenuProfileSignUpToLevelUpMessage from './sign-up-to-level-up-message/index.vue';
import { localStorageKey, useNavMenuMessagesStore } from './store.js';
import EMainNavImpactProfileUserEngagementMessage from './user-engagement-message/index.vue';

describe('useNavMenuMessagesStore', () => {
  setActivePinia(createPinia());

  const impactStore = useImpactStore();
  const userStore = useUserStore();
  const unleashStore = useUnleashStore();
  const userEngagementStore = useUserEngagementStore();
  const navMenuMessagesStore = useNavMenuMessagesStore();

  const patchUserEngagementStoreWithCards = () => {
    userEngagementStore.$patch({
      cards: [
        {
          id: 'main-nav-menu-1',
          title: 'main nav menu card 1',
          description: 'main nav menu card desc 1',
          url: 'https://example.com/wow',
          linkText: "Wow i'm the first!",
          imageUrl: 'https://example.com/wow/cool-dog.jpg',
          extras: { location: 'main_nav_menu' },
        },
        {
          id: 'main-nav-menu-2',
          title: 'main nav menu card 2',
          description: 'main nav menu card desc 2',
          url: 'https://example.com/shucks',
          linkText: 'Aww shucks, im the second...',
          extras: { location: 'main_nav_menu' },
        },
      ],
    });
  };

  beforeEach(() => {
    localStorage.clear();
    impactStore.$reset();
    userStore.$reset();
    unleashStore.$reset();
    userEngagementStore.$reset();
    navMenuMessagesStore.$reset();
    vi.clearAllMocks();
  });

  describe('getters', () => {
    describe('hasNotification', () => {
      describe("if the message can't notify the user", () => {
        beforeEach(() => {
          impactStore.$patch({
            isImpactAPIResponseEmpty: true,
          });
        });

        it('there is no notification', () => {
          expect(navMenuMessagesStore.message.canNotifyUser).toBeFalsy();
          expect(navMenuMessagesStore.hasNotification).toBe(false);
        });
      });

      describe('if the message can notify the user', () => {
        beforeEach(() => {
          impactStore.$patch({
            isImpactAPIResponseEmpty: false,
          });

          localStorage.setItem(
            localStorageKey('dismissed', 'sign-up-to-level-up'),
            'true',
          );
          localStorage.setItem(
            localStorageKey('dismissed', 'onboarding'),
            'true',
          );
          localStorage.setItem(
            localStorageKey('dismissed', 'multi-device'),
            'true',
          );

          patchUserEngagementStoreWithCards();
        });

        it('there is a notification', () => {
          expect(navMenuMessagesStore.message.id).toBe('user-engagement-main-nav-menu-1');
          expect(navMenuMessagesStore.message.canNotifyUser).toBe(true);
          expect(navMenuMessagesStore.hasNotification).toBe(true);
        });

        describe('the user has seen the message connected to the notification', () => {
          beforeEach(() => {
            navMenuMessagesStore.setMessageAsSeen(
              'user-engagement-main-nav-menu-1',
            );
          });

          it('there is no notification', () => {
            expect(navMenuMessagesStore.message.canNotifyUser).toBe(true);
            expect(navMenuMessagesStore.hasNotification).toBe(false);
          });
        });
      });
    });

    describe('message', () => {
      describe("if every message doesn't meet it's criteria to show", () => {
        beforeEach(() => {
          impactStore.$patch({
            isImpactAPIResponseEmpty: false,
          });

          localStorage.setItem(
            localStorageKey('dismissed', 'sign-up-to-level-up'),
            'true',
          );
          localStorage.setItem(
            localStorageKey('dismissed', 'onboarding'),
            'true',
          );
          localStorage.setItem(
            localStorageKey('dismissed', 'multi-device'),
            'true',
          );
        });

        it('renders no message', async () => {
          expect(navMenuMessagesStore.message).toBe(null);
        });
      });

      describe('if a message gets dismissed with another message after', () => {
        beforeEach(() => {
          expect(navMenuMessagesStore.message?.id).toBe('onboarding');

          // simulate clicking close button
          navMenuMessagesStore.setMessageAsDismissed(
            navMenuMessagesStore.message?.id,
          );
        });

        it('calls localstorage correctly', async () => {
          const localStorageItem = localStorage.getItem(
            localStorageKey(
              'dismissed',
              'onboarding',
            ),
          );

          expect(localStorageItem).toBe('true');
        });

        it('returns null', () => {
          expect(navMenuMessagesStore.message).toBe(null);
        });
      });

      // EMainNavImpactProfileErrorMessage
      describe.each([
        { isImpactAPIResponseEmpty: false, isErrorMessage: false },
        { isImpactAPIResponseEmpty: true, isErrorMessage: true },
      ])(
        'EMainNavImpactProfileErrorMessage if isImpactAPIResponseEmpty is $isImpactAPIResponseEmpty',
        ({ isImpactAPIResponseEmpty, isErrorMessage }) => {
          beforeEach(() => {
            impactStore.$patch({
              isImpactAPIResponseEmpty,
            });
          });

          it(`${isErrorMessage ? 'is' : "isn't"} the error message`, async () => {
            if (isErrorMessage) {
              expect(navMenuMessagesStore.message?.id).toBe('error');
              expect(navMenuMessagesStore.message?.componentName).toBe(
                EMainNavMenuProfileErrorMessage.name,
              );
            } else {
              expect(navMenuMessagesStore.message?.id).not.toBe('error');
              expect(navMenuMessagesStore.message?.componentName).not.toBe(
                EMainNavMenuProfileErrorMessage.name,
              );
            }
          });
        },
      );

      // EMainNavImpactProfileSignUpToLevelUpMessage
      describe.each([
        { isUsersTotalLocked: false, isMessageDismissed: false, isSignUpToLevelUpMessage: false },
        { isUsersTotalLocked: true, isMessageDismissed: false, isSignUpToLevelUpMessage: true },
        { isUsersTotalLocked: false, isMessageDismissed: true, isSignUpToLevelUpMessage: false },
        { isUsersTotalLocked: true, isMessageDismissed: true, isSignUpToLevelUpMessage: false },
      ])(
        'EMainNavImpactProfileSignUpToLevelUpMessage if isUsersTotalLocked is $isUsersTotalLocked and isMessageDismissed is $isMessageDismissed',
        ({ isUsersTotalLocked, isMessageDismissed, isSignUpToLevelUpMessage }) => {
          beforeEach(() => {
            impactStore.$patch({
              level: isUsersTotalLocked ?
                  { seedsEarned: 3, seedsToEarn: 3 } :
                  { seedsEarned: 2, seedsToEarn: 4 },
            });

            if (isMessageDismissed) {
              localStorage.setItem(
                localStorageKey('dismissed', 'sign-up-to-level-up'),
                'true',
              );
            }
          });

          it(`${isSignUpToLevelUpMessage ? 'is' : "isn't"} the sign-up to level-up message`, async () => {
            if (isSignUpToLevelUpMessage) {
              expect(navMenuMessagesStore.message?.id).toBe('sign-up-to-level-up');
              expect(navMenuMessagesStore.message?.componentName).toBe(
                EMainNavMenuProfileSignUpToLevelUpMessage.name,
              );
            } else {
              expect(navMenuMessagesStore.message?.id).not.toBe('sign-up-to-level-up');
              expect(navMenuMessagesStore.message?.componentName).not.toBe(
                EMainNavMenuProfileSignUpToLevelUpMessage.name,
              );
            }
          });
        },
      );

      // EMainNavImpactProfileOnboardingMessage
      describe.each([
        { isMessageDismissed: false, isOnboardingMessage: true },
        { isMessageDismissed: true, isOnboardingMessage: false },
      ])(
        'EMainNavImpactProfileOnboardingMessage if isMessageDismissed is $isMessageDismissed',
        ({ isMessageDismissed, isOnboardingMessage }) => {
          beforeEach(() => {
            if (isMessageDismissed) {
              localStorage.setItem(
                localStorageKey('dismissed', 'onboarding'),
                'true',
              );
            }
          });

          it(`${isOnboardingMessage ? 'is' : "isn't"} the onboarding message`, async () => {
            if (isOnboardingMessage) {
              expect(navMenuMessagesStore.message?.id).toBe('onboarding');
              expect(navMenuMessagesStore.message?.componentName).toBe(
                EMainNavMenuProfileOnboardingMessage.name,
              );
            } else {
              expect(navMenuMessagesStore.message?.id).not.toBe('onboarding');
              expect(navMenuMessagesStore.message?.componentName).not.toBe(
                EMainNavMenuProfileOnboardingMessage.name,
              );
            }
          });
        },
      );

      // EMainNavImpactProfileMultiDeviceMessage
      describe.each([
        { isMessageDismissed: false, isSignedIn: false, isMultiDeviceMessage: false },
        { isMessageDismissed: true, isSignedIn: false, isMultiDeviceMessage: false },
        { isMessageDismissed: false, isSignedIn: true, isMultiDeviceMessage: true },
        { isMessageDismissed: true, isSignedIn: true, isMultiDeviceMessage: false },
      ])(
        'EMainNavImpactProfileMultiDeviceMessage if isMessageDismissed is $isMessageDismissed and if isSignedIn is $isSignedIn',
        ({ isMessageDismissed, isSignedIn, isMultiDeviceMessage }) => {
          beforeEach(() => {
            // enable the feature flag
            unleashStore.$patch({
              featureToggles: {
                [showMultiDeviceNavMenuMessage.flag]: {
                  value: showMultiDeviceNavMenuMessage.enabled,
                },
              },
            });

            userStore.$patch({ isSignedIn });

            /*
                dismiss the other messages as it
                overrides the multi-device message
              */
            localStorage.setItem(
              localStorageKey('dismissed', 'sign-up-to-level-up'),
              'true',
            );
            localStorage.setItem(
              localStorageKey('dismissed', 'onboarding'),
              'true',
            );

            if (isMessageDismissed) {
              localStorage.setItem(
                localStorageKey('dismissed', 'multi-device'),
                'true',
              );
            }
          });

          it(`${isMultiDeviceMessage ? 'is' : "isn't"} the multi-device message`, async () => {
            if (isMultiDeviceMessage) {
              expect(navMenuMessagesStore.message?.id).toBe('multi-device');
              expect(navMenuMessagesStore.message?.componentName).toBe(
                EMainNavImpactProfileMultiDeviceMessage.name,
              );
            } else {
              expect(navMenuMessagesStore.message?.id).not.toBe('multi-device');
              expect(navMenuMessagesStore.message?.componentName).not.toBe(
                EMainNavImpactProfileMultiDeviceMessage.name,
              );
            }
          });
        },
      );

      // EMainNavImpactProfileUserEngagementMessage
      describe('EMainNavImpactProfileUserEngagementMessage has mainNavMenuCards but none dismissed', () => {
        beforeEach(() => {
          patchUserEngagementStoreWithCards();

          /*
            dismiss the other messages as it
            overrides the user-engagement message
          */
          localStorage.setItem(
            localStorageKey('dismissed', 'sign-up-to-level-up'),
            'true',
          );
          localStorage.setItem(
            localStorageKey('dismissed', 'onboarding'),
            'true',
          );
          localStorage.setItem(
            localStorageKey('dismissed', 'multi-device'),
            'true',
          );
        });

        it('is the first mainNavMenuCard as an user-engagement message', async () => {
          expect(navMenuMessagesStore.message?.id).toBe('user-engagement-main-nav-menu-1');
          expect(navMenuMessagesStore.message?.componentName).toBe(
            EMainNavImpactProfileUserEngagementMessage.name,
          );
          expect(navMenuMessagesStore.message?.props).toStrictEqual({
            card: {
              id: 'main-nav-menu-1',
              title: 'main nav menu card 1',
              imageUrl: 'https://example.com/wow/cool-dog.jpg',
              url: 'https://example.com/wow',
              linkText: "Wow i'm the first!",
              description: 'main nav menu card desc 1',
              extras: { location: 'main_nav_menu' },
            },
          });
        });

        describe('first message is dismissed', () => {
          beforeEach(() => {
            navMenuMessagesStore.setMessageAsDismissed(
              'user-engagement-main-nav-menu-1',
            );

            // simulate page refresh
            navMenuMessagesStore._setHasAnyMessageBeenDismissed(false);
          });

          it('shows the second mainNavMenuCard as an user-engagement message', async () => {
            expect(navMenuMessagesStore.message?.id).toBe('user-engagement-main-nav-menu-2');
            expect(navMenuMessagesStore.message?.componentName).toBe(
              EMainNavImpactProfileUserEngagementMessage.name,
            );
            expect(navMenuMessagesStore.message?.props).toStrictEqual({
              card: {
                id: 'main-nav-menu-2',
                title: 'main nav menu card 2',
                url: 'https://example.com/shucks',
                linkText: 'Aww shucks, im the second...',
                description: 'main nav menu card desc 2',
                extras: { location: 'main_nav_menu' },
              },
            });
          });

          describe('second message is dismissed', () => {
            beforeEach(() => {
              navMenuMessagesStore.setMessageAsDismissed(
                'user-engagement-main-nav-menu-2',
              );

              // simulate page refresh
              navMenuMessagesStore._setHasAnyMessageBeenDismissed(false);
            });

            it("doesn't show an user-engagement message", async () => {
              expect(navMenuMessagesStore.message?.id).not.toBe('user-engagement-main-nav-menu-1');
              expect(navMenuMessagesStore.message?.id).not.toBe('user-engagement-main-nav-menu-2');
              expect(navMenuMessagesStore.message?.componentName).not.toBe(
                EMainNavImpactProfileUserEngagementMessage.name,
              );
            });
          });
        });
      });
    });
  });

  describe('actions', () => {
    describe('setMessageAsDismissed', () => {
      describe('no message id', () => {
        it('doesnt set anything', () => {
          expect(navMenuMessagesStore.message?.id).toBe('onboarding');

          navMenuMessagesStore.setMessageAsDismissed();

          // simulate page refresh
          navMenuMessagesStore._setHasAnyMessageBeenDismissed(false);

          expect(navMenuMessagesStore.message?.id).toBe('onboarding');
        });
      });

      describe('with a random message id', () => {
        it('doesnt set anything', () => {
          expect(navMenuMessagesStore.message?.id).toBe('onboarding');

          navMenuMessagesStore.setMessageAsDismissed('lol-ok');

          // simulate page refresh
          navMenuMessagesStore._setHasAnyMessageBeenDismissed(false);

          expect(navMenuMessagesStore.message?.id).toBe('onboarding');
        });
      });

      describe("with the current message's id", () => {
        it('dismisses the current message', () => {
          expect(navMenuMessagesStore.message?.id).toBe('onboarding');

          navMenuMessagesStore.setMessageAsDismissed('onboarding');

          // simulate page refresh
          navMenuMessagesStore._setHasAnyMessageBeenDismissed(false);

          expect(navMenuMessagesStore.message?.id).toBe(undefined);
        });
      });
    });

    describe('setMessageAsSeen', () => {
      beforeEach(() => {
        // have message that can be seen
        patchUserEngagementStoreWithCards();
        localStorage.setItem(
          localStorageKey('dismissed', 'sign-up-to-level-up'),
          'true',
        );
        localStorage.setItem(
          localStorageKey('dismissed', 'onboarding'),
          'true',
        );
        localStorage.setItem(
          localStorageKey('dismissed', 'multi-device'),
          'true',
        );
      });

      describe('no message id', () => {
        it('doesnt do anything', () => {
          expect(navMenuMessagesStore.hasNotification).toBe(true);

          navMenuMessagesStore.setMessageAsSeen();

          expect(navMenuMessagesStore.hasNotification).toBe(true);
        });
      });

      describe('with a random message id', () => {
        it('doesnt do anything', () => {
          expect(navMenuMessagesStore.hasNotification).toBe(true);

          navMenuMessagesStore.setMessageAsSeen('lol-alright');

          expect(navMenuMessagesStore.hasNotification).toBe(true);
        });
      });

      describe("with the current message's id", () => {
        it('sets it to not have a notificaton', () => {
          expect(navMenuMessagesStore.hasNotification).toBe(true);

          navMenuMessagesStore.setMessageAsSeen(
            'user-engagement-main-nav-menu-1',
          );

          expect(navMenuMessagesStore.hasNotification).toBe(false);
        });
      });
    });
  });
});
