<template>
  <EList>
    <li
      v-for="(group, index) in mainMenu"
      :key="group.key"
      class="main-nav-menu__group"
      :data-test-id="`main-nav-menu-group-${index}`"
    >
      <span
        v-if="group.title"
        class="main-nav-menu__title"
        data-test-id="main-nav-menu-title"
      >
        {{ group.title }}
      </span>
      <EList class="main-nav-menu__list-items">
        <EListItem
          v-for="item in group.items"
          :key="item.key"
          content-style
        >
          <a
            :href="item.url"
            :class="{
              'main-nav-menu__link': true,
              'main-nav-menu__link--is-nested': item.isNested,
            }"
            :data-test-id="`main-nav-menu-link-${item.key}`"
            rel="noopener"
            @click="onMenuLinkClick(item.key, item.url)"
          >
            {{ $t(`common.header.menu.${item.key}`) }}
            <EBadge
              v-if="item.isNew"
              class="main-nav-menu__badge"
            >
              {{ $t("common.header.menu.new") }}
            </EBadge>
          </a>
        </EListItem>
      </EList>
      <EInlineAlert
        v-if="shouldShowProfileAlert(group.key)"
        :title="$t('common.header.menu.profile.alert.title')"
        variant="info"
        subtle
        action-icon="close"
        class="main-nav-menu__alert"
        data-test-id="main-nav-menu-link-alert"
        @action="dismissProfileAlert"
      >
        {{ $t('common.header.menu.profile.alert.body') }}
      </EInlineAlert>
    </li>
  </EList>
</template>

<script>
import { mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics';
import { getMainMenu, profileMenuGroup } from '@ecosia/common-js/universal/menus';

import { collectibles } from '@ecosia/constants/feature-flags.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import EBadge from '../badge/index.vue';
import EInlineAlert from '../inline-alert/index.vue';
import EList from '../list/index.vue';
import EListItem from '../list-item/index.vue';

export const LOCALSTORAGE_DISMISSED_KEY = 'menu-cie-profile-alert-dismissed';

export default {
  name: 'EMenuLinks',
  components: { EList, EInlineAlert, EListItem, EBadge },
  props: {
    isImpactExperimentEnabled: {
      type: Boolean,
      default: false,
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasSeenProfileAlert: true,
    };
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useUnleashStore, ['isActiveToggleValue']),
    isCollectiblesEnabled() {
      return this.isActiveToggleValue(collectibles.flag, collectibles.enabled);
    },
    settingsUrl() {
      return this.$config.settingsUrl;
    },
    mainMenu() {
      const mainMenu = getMainMenu(
        this.$config.baseUrl,
        this.locale,
        this.settingsUrl,
      );

      const profileMenu = this.profileMenuItem;
      if (profileMenu) {
        mainMenu.unshift(profileMenu);
      }

      return mainMenu.map((group) => {
        const newGroup = { ...group };

        const translationKey = `common.header.menu.group.${newGroup.key}`;
        newGroup.title = this.$t(translationKey);

        return newGroup;
      });
    },
    profileMenuItem() {
      if (this.isImpactExperimentEnabled && this.isSignedIn) {
        return profileMenuGroup(this.isCollectiblesEnabled);
      }

      return null;
    },
  },
  mounted() {
    this.hasSeenProfileAlert = localStorage.getItem(LOCALSTORAGE_DISMISSED_KEY) === 'true';
  },
  methods: {
    onMenuLinkClick(key, href) {
      const isProfileLink = this.profileMenuItem && this.profileMenuItem.items[0].key === key;
      if (isProfileLink && !this.hasSeenProfileAlert) {
        this.dismissProfileAlert();
      }

      sendCoreAnalyticsEvent('menuNavMenuClicked', {
        href,
      });
    },
    shouldShowProfileAlert(groupKey) {
      return groupKey === this.profileMenuItem?.key && !this.hasSeenProfileAlert;
    },
    dismissProfileAlert() {
      this.hasSeenProfileAlert = true;
      localStorage.setItem(LOCALSTORAGE_DISMISSED_KEY, 'true');
    },
  },
};
</script>

<style lang="scss" scoped>
.main-nav-menu__group {
  margin-bottom: $space-m;
}

.main-nav-menu__list-items {
  overflow: hidden;

  border-radius: 5px;

  background: var(--color-background-secondary);
}

.main-nav-menu__title {
  display: inline-block;
  margin: 0;
  padding: $space-s;

  color: var(--color-text-secondary);
  font-size: $font-s;
  line-height: $space-m;
}

.main-nav-menu__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: $tappable-area-size-mobile;
  padding: 0 $space-s;

  white-space: nowrap;

  &.main-nav-menu__link--is-nested {
    padding-left: $space-1l;
  }

  @include desktop {
    min-height: $space-3l;
  }
}

.main-nav-menu__badge {
  margin-left: $space-1s;
}

.main-nav-menu__alert {
  margin-top: $space-m;
}
</style>
