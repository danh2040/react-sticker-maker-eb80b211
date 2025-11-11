<template>
  <footer :class="classes">
    <EMainFooterVisual v-if="showTrees" :show-cards="showCards" />

    <div class="main-footer__content">
      <div class="main-footer__menu">
        <h2 class="sr-only">
          {{ $t('common.footer.heading.supportlinks') }}
        </h2>
        <ul class="main-footer__menu-list">
          <li v-for="item in menu" :key="item.key" :class="menuItemClass(item.key)">
            <ELink
              :href="item.url"
              color="secondary"
              class="main-footer__link"
              rel="noopener"
              :aria-label="item.label"
              :title="item.name"
              data-test-id="main-footer-link"
            >
              {{ menuItem(item.key) }}
            </ELink>
          </li>
          <li :class="menuItemClass('cookies')">
            <ELink
              as="button"
              color="secondary"
              class="main-footer__link"
              :aria-label="cookiePreferences"
              :title="cookiePreferences"
              data-test-id="main-footer-cookies"
              @click="showCookiePreferences"
            >
              {{ cookiePreferences }}
            </ELink>
          </li>
        </ul>
      </div>
      <div class="main-footer__secondary-menu">
        <div class="main-footer__menu main-footer__menu-social">
          <h2 class="sr-only">
            {{ $t('common.footer.heading.socialmedialinks') }}
          </h2>
          <ul class="main-footer__menu-list">
            <li v-for="item in socialMenu" :key="item.key" class="main-footer__menu-item">
              <a
                :href="item.url"
                class="main-footer__link"
                rel="noopener"
                target="_blank"
                :aria-label="item.label"
                data-test-id="main-footer-social-link"
              >
                <EIcon :icon="item.label" size="m" class="main-footer__social-icon" />
              </a>
            </li>
          </ul>
        </div>

        <EMainFooterFeedback
          class="main-footer__feedback"
          data-test-id="main-footer-feedback"
        />
      </div>
    </div>
  </footer>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getFooterMenu, getSocialMenu } from '@ecosia/common-js/universal/menus.js';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';
import ELink from '@ecosia/common-vue2/components/link/index.vue';
import classes, { getModifierClass } from '@ecosia/common-vue2/mixins/classes.js';

import { useExperienceStore } from '@ecosia/store/experience/index.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EMainFooterFeedback from './feedback.vue';
import EMainFooterVisual from './visual.vue';

export default {
  name: 'EMainFooter',
  components: {
    EIcon,
    ELink,
    EMainFooterVisual,
    EMainFooterFeedback,
  },
  mixins: [classes],
  props: {
    settingsLink: {
      type: Boolean,
      default: true,
    },
    showCards: {
      type: Boolean,
      default: true,
    },
    showTrees: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useExperienceStore, ['useTCFCompliantCMP']),
    cookiePreferences() {
      return this.$t('common.footer.cookies');
    },
    menu() {
      return getFooterMenu(this.$config.baseUrl, this.settingsLink);
    },
    socialMenu() {
      return getSocialMenu(this.locale);
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      updateUserState: 'set',
    }),
    menuItemClass(key) {
      const baseClass = 'main-footer__menu-item';
      return [baseClass, getModifierClass(baseClass, key)];
    },
    menuItem(key) {
      // @TODO refactor when rebrand is ready
      // Change faq to help in translation keys
      return key === 'help' ? this.$t('common.footer.faq') : this.$t(`common.footer.${key}`);
    },
    showCookiePreferences() {
      sendCoreAnalyticsEvent('footerCookiePreferences', { tcf: this.useTCFCompliantCMP });
      if (this.useTCFCompliantCMP) {
        window.Didomi?.preferences.show();
      } else {
        this.updateUserState({ consentPreferences: true });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$social-menu-spacing: 10px;
$social-icon-size-mobile: 30px;

.main-footer {
  position: relative;
  width: 100%;
  padding-top: $space-m;

  background: var(--color-background-primary);

  color: var(--color-text-secondary);
  font-size: $font-m;

  @include desktop {
    padding-top: $space-2l;
  }
}

.main-footer__content {
  width: 100%;
  padding: $space-1l $space-2l;

  background-color: var(--color-background-quaternary);

  text-align: center;

  @include desktop {
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: $space-1s $space-1l;
  }
}

.main-footer__link {
  transition: color $timing-2s $easing;

  white-space: nowrap;

  &:hover,
  &:focus {
    color: var(--color-link-secondary);
  }

  &:first-of-type {
    padding-left: 0;
  }
}

.main-footer__menu {
  display: flex;
  align-items: center;
}

.main-footer__menu-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.main-footer__menu-item {
  margin-bottom: $space-s;
  padding: 0 $space-s;

  @include tablet {
    &:first-of-type {
      padding-left: 0;
    }

    &:last-of-type {
      padding-right: 0;
    }
  }

  @include desktop {
    margin-bottom: 0;
  }
}

.main-footer__menu-social {
  display: inline-block;
  width: 100%;

  @include desktop {
    width: auto;
  }

  .main-footer__menu-item {
    display: inline-block;
    width: $social-icon-size-mobile;
    height: $social-icon-size-mobile;
    margin-bottom: 0;
    padding: 0;

    @include desktop {
      width: unset;
      height: unset;
    }

    & + .main-footer__menu-item {
      margin-left: $space-s;

      @include desktop {
        margin-left: $social-menu-spacing;
      }
    }
  }

  // For A11Y, we need to set the dimension, see: https://ecosia.atlassian.net/browse/FE-371
  .main-footer__link {
    display: inline-block;
    width: $social-icon-size-mobile;
    height: $social-icon-size-mobile;

    @include desktop {
      width: $icon-size-m;
      height: $icon-size-m;
    }
  }
}

.main-footer__social-icon {
  width: $social-icon-size-mobile;
  height: $social-icon-size-mobile;

  color: $c-gray-70;

  &:hover {
    color: $c-gray-50;
  }

  @include desktop {
    width: unset;
    height: unset;
  }
}

.main-footer__feedback {
  margin-top: $space-s;

  @include desktop {
    display: inline-flex;
    margin-top: 0;
    margin-left: $social-menu-spacing;
  }
}

.dark {
  .main-footer__social-icon {
    color: $white;

    &:hover {
      color: $c-gray-30;
    }
  }
}
</style>
