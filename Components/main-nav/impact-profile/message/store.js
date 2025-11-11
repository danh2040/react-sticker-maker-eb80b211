import { defineStore } from 'pinia';

import { useImpactStore } from '@ecosia/accounts-impact-client/store.js';
import { showMultiDeviceNavMenuMessage } from '@ecosia/constants/feature-flags.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import isLocalStorageAvailable from '@ecosia/universal/is-localstorage-available.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';
import { useUserEngagementStore } from '@ecosia/user-engagement-client2/user-engagement.store.js';

import EMainNavImpactProfileErrorMessage from './error-message/index.vue';
import EMainNavImpactProfileMultiDeviceMessage from './multi-device-message/index.vue';
import EMainNavImpactProfileOnboardingMessage from './onboarding-message/index.vue';
import EMainNavImpactProfileSignUpToLevelUpMessage from './sign-up-to-level-up-message/index.vue';
import EMainNavImpactProfileUserEngagementMessage from './user-engagement-message/index.vue';

const DISMISSED = 'dismissed';
const SEEN = 'seen';

const LOCALSTORAGE_KEY_PREFIX = 'impact-profile-message';
const LOCALSTORAGE_TRUE_VALUE = 'true';

const MESSAGE_ID_ERROR = 'error';
const MESSAGE_ID_MULTI_DEVICE = 'multi-device';
const MESSAGE_ID_ONBOARDING = 'onboarding';
const MESSAGE_ID_SIGN_UP_TO_LEVEL_UP = 'sign-up-to-level-up';
const MESSAGE_ID_USER_ENGAGEMENT_PREFIX = 'user-engagement';

const localStorageUserEngagementMessageId = (id) => {
  return `${MESSAGE_ID_USER_ENGAGEMENT_PREFIX}-${id}`;
};

export const localStorageKey = (type, messageId) => {
  return `${LOCALSTORAGE_KEY_PREFIX}-${type}-${messageId}`;
};

const isDataInLocalStorage = (type, messageId) => {
  /*
    if we don't know the value because
    localStorage isn't available act is
    as it's not in localstorage
  */
  if (!isLocalStorageAvailable()) {
    return true;
  }

  return localStorage.getItem(
    localStorageKey(type, messageId),
  ) === LOCALSTORAGE_TRUE_VALUE;
};

const storeDataInLocalStorage = (type, messageId) => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  localStorage.setItem(
    localStorageKey(type, messageId),
    LOCALSTORAGE_TRUE_VALUE,
  );
};

export const useNavMenuMessagesStore = defineStore('nav-menu-messages', {
  state: () => ({
    _hasAnyMessageBeenDismissed: false,
    _dismissedMessagesIds: [],
    _seenMessagesIds: [],
  }),

  getters: {
    // private getters

    _isMultiDeviceMessageShown() {
      const unleashStore = useUnleashStore();
      const userStore = useUserStore();

      const isFeatureFlagEnabled = unleashStore.isActiveToggleValue(
        showMultiDeviceNavMenuMessage.flag,
        showMultiDeviceNavMenuMessage.enabled,
      );
      return isFeatureFlagEnabled && userStore.isSignedIn;
    },
    _firstNonDismissedUserEngagementCard() {
      const userEngagementStore = useUserEngagementStore();
      return userEngagementStore.mainNavMenuCards.find(
        (userEngagementMessage) => {
          return !this._hasMessageBeenDismissed(
            localStorageUserEngagementMessageId(userEngagementMessage.id),
          );
        },
      );
    },

    // public getters

    hasNotification() {
      if (!this.message?.canNotifyUser) {
        return false;
      }

      return !this._hasMessageBeenSeen(this.message?.id);
    },

    message() {
      const impactStore = useImpactStore();

      if (impactStore.isImpactAPIResponseEmpty) {
        return {
          id: MESSAGE_ID_ERROR,
          componentName: EMainNavImpactProfileErrorMessage.name,
        };
      }

      /*
        if a user has dismissed one of the messages, wait until
        the nav menu gets opened again before showing another
      */
      if (this._hasAnyMessageBeenDismissed) {
        // don't render anything
        return null;
      }

      const isLevelLocked = impactStore.isSeedsLevelsV2UIEnabled ?
        impactStore.isGrowthPointsLevelLocked :
        impactStore.isUsersTotalLocked;

      if (
        isLevelLocked &&
        !this._hasMessageBeenDismissed(MESSAGE_ID_SIGN_UP_TO_LEVEL_UP)
      ) {
        return {
          id: MESSAGE_ID_SIGN_UP_TO_LEVEL_UP,
          componentName: EMainNavImpactProfileSignUpToLevelUpMessage.name,
          canNotifyUser: true,
        };
      }

      if (!this._hasMessageBeenDismissed(MESSAGE_ID_ONBOARDING)) {
        return {
          id: MESSAGE_ID_ONBOARDING,
          componentName: EMainNavImpactProfileOnboardingMessage.name,
          canNotifyUser: true,
        };
      }

      if (
        this._isMultiDeviceMessageShown &&
        !this._hasMessageBeenDismissed(MESSAGE_ID_MULTI_DEVICE)
      ) {
        return {
          id: MESSAGE_ID_MULTI_DEVICE,
          componentName: EMainNavImpactProfileMultiDeviceMessage.name,
          canNotifyUser: true,
        };
      }

      if (this._firstNonDismissedUserEngagementCard) {
        const card = this._firstNonDismissedUserEngagementCard;
        return {
          id: localStorageUserEngagementMessageId(card.id),
          componentName: EMainNavImpactProfileUserEngagementMessage.name,
          props: { card },
          canNotifyUser: true,
        };
      }

      return null;
    },
  },

  actions: {
    // private actions

    _setHasAnyMessageBeenDismissed(value) {
      this._hasAnyMessageBeenDismissed = value;
    },
    _addToDismissedMessagesIds(messageId) {
      if (!this._dismissedMessagesIds.includes(messageId)) {
        this._dismissedMessagesIds.push(messageId);
      }
    },
    _addToSeenMessagesIds(messageId) {
      if (!this._seenMessagesIds.includes(messageId)) {
        this._seenMessagesIds.push(messageId);
      }
    },
    _hasMessageBeenDismissed(messageId) {
      const wasDismissedThisSession = this._dismissedMessagesIds.includes(messageId);
      const wasDismissedBefore = isDataInLocalStorage(DISMISSED, messageId);
      return wasDismissedThisSession || wasDismissedBefore;
    },
    _hasMessageBeenSeen(messageId) {
      const wasSeenThisSession = this._seenMessagesIds.includes(messageId);
      const wasSeenBefore = isDataInLocalStorage(SEEN, messageId);
      return wasSeenThisSession || wasSeenBefore;
    },

    // public actions

    setMessageAsDismissed(messageId) {
      storeDataInLocalStorage(DISMISSED, messageId);
      this._addToDismissedMessagesIds(messageId);
      this._setHasAnyMessageBeenDismissed(true);
    },
    setMessageAsSeen(messageId) {
      storeDataInLocalStorage(SEEN, messageId);
      this._addToSeenMessagesIds(messageId);
    },
  },
});
