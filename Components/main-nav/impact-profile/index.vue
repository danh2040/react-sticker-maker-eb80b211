<template>
  <div class="impact-profile">
    <div class="impact-profile__content">
      <div class="impact-profile__top">
        <EMainNavMenuProfileLevelProgressAvatar />
        <div class="impact-profile__top__details">
          <h3
            :class="userNameClassNames"
            data-test-id="impact-profile-user-name"
          >
            {{ nameValue }}
          </h3>

          <EMainNavMenuProfileLevelDetails />
        </div>
      </div>

      <EMainNavImpactProfileMessage />

      <EMainNavMenuSignUpButton
        v-if="!isSignedIn"
        class="impact-profile__sign-up-button"
      />
    </div>

    <ImpactProfileWaveSVG class="impact-profile__wave" aria-hidden="true" />
  </div>
</template>

<script>
import { mapState } from 'pinia';

import { useUserStore } from '@ecosia/store/user/index.js';

import ImpactProfileWaveSVG from './ImpactProfileWave.svg';
import EMainNavMenuProfileLevelDetails from './level-details/index.vue';
import EMainNavMenuProfileLevelProgressAvatar from './level-progress-avatar/index.vue';
import EMainNavImpactProfileMessage from './message/index.vue';
import EMainNavMenuSignUpButton from './sign-up-button.vue';

export default {
  name: 'EMainNavImpactProfile',
  components: {
    EMainNavImpactProfileMessage,
    EMainNavMenuProfileLevelDetails,
    EMainNavMenuProfileLevelProgressAvatar,
    EMainNavMenuSignUpButton,
    ImpactProfileWaveSVG,
  },
  computed: {
    ...mapState(useUserStore, [
      'isSignedIn',
      'name',
      'email',
    ]),
    nameValue() {
      if (!this.isSignedIn) {
        return this.$t('common.header.menu.impact.username.guest');
      }

      return this.name || this.email;
    },
    userNameClassNames() {
      return {
        'impact-profile__top__details__user-name': true,
        'impact-profile__top__details__user-name--is-email-address': this.isSignedIn && !this.name,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$level-progress-avatar-size: 80px;
$close-button-size: 35px;

.impact-profile {
  background: var(--color-background-secondary);
}

.impact-profile__wave {
  width: 100%;
  height: auto;

  color: var(--color-background-elevation-2);
}

.impact-profile__content {
  padding: $space-s $space-m;

  @include tablet {
    padding: $space-m;
  }
}

.impact-profile__top {
  display: flex;
  align-items: center;
}

.impact-profile__top__details {
  flex-grow: 1;
  max-width: calc(100% - $level-progress-avatar-size);
  padding: $space-m $space-s;
  padding-right: 0;
}

.impact-profile__top__details__user-name {
  display: -webkit-box;
  width: 100%;
  max-width: calc(100% - $close-button-size);
  min-height: 1em; // if there's no username for whatever reason
  margin-top: 0;
  margin-bottom: $space-1s;
  padding-left: $space-2s; // align with the badge
  overflow: hidden;

  font-size: $font-1l;
  font-weight: $font-weight-700;

  -webkit-box-orient: vertical;

  @include desktop {
    max-width: 100%;
  }
}

.impact-profile__top__details__user-name--is-email-address {
  display: block;

  font-size: $font-l;
  text-overflow: ellipsis;
}

.impact-profile__sign-up-button {
  width: 100%;
  margin-top: $space-m;
}
</style>
