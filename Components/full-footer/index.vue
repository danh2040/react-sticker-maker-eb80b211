<template>
  <footer v-intersect="loadBCorp" class="full-footer">
    <div class="full-footer__content">
      <EFooterBcorp :show-logo="showBCorp" data-test-id="full-footer-bcorp" />
      <EFooterMenu
        v-for="linklist in linksMenu"
        :key="linklist.title"
        :items="linklist.items"
        :title-key="linklist.title"
      />
      <EFooterMenu
        :items="legalMenu"
        title-key="legaltitle"
      >
        <template #extra>
          <ELink
            as="button"
            color="secondary"
            :aria-label="cookiePreferences"
            :title="cookiePreferences"
            data-test-id="full-footer-cookies"
            @click="showCookiePreferences"
          >
            {{ cookiePreferences }}
          </ELink>
        </template>
      </EFooterMenu>
      <EFooterMenu
        title-key="apps"
      >
        <ul>
          <li
            v-for="os in mobileOs"
            :key="os"
            class="full-footer__mobile-badge"
          >
            <EMobileBadge
              data-test-id="mobile-badge"
              :os="os"
              :locale="locale"
            />
          </li>
        </ul>
      </EFooterMenu>
    </div>
    <EFooterSocial
      :menu="socialMenu"
      class="full-footer__social"
    />
  </footer>
</template>

<script>
import { mapActions, mapState } from 'pinia';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import {
  getFooterAbout,
  getFooterLegal,
  getFooterWhatWeDo,
  getSocialMenu,
} from '@ecosia/common-js/universal/menus.js';
import ELink from '@ecosia/common-vue2/components/link/index.vue';
import EMobileBadge from '@ecosia/common-vue2/components/mobile-badge/index.vue';

import { mobileOs } from '@ecosia/constants/browsers.js';
import { useExperienceStore } from '@ecosia/store/experience/index.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EFooterBcorp from './bcorp.vue';
import EFooterMenu from './menu.vue';
import EFooterSocial from './social.vue';

export default {
  name: 'EFullFooter',
  components: {
    EFooterBcorp,
    EFooterMenu,
    EFooterSocial,
    ELink,
    EMobileBadge,
  },
  data() {
    return {
      showBCorp: false,
    };
  },
  computed: {
    ...mapState(useGlobalStore, ['locale']),
    ...mapState(useExperienceStore, ['useTCFCompliantCMP']),
    cookiePreferences() {
      return this.$t('common.footer.cookies');
    },
    linksMenu() {
      const footerWhatWeDo = getFooterWhatWeDo(this.locale, this.$config.baseUrl)
        .filter((item) => item.key !== 'advertising');

      return [{
        title: 'whattitle',
        items: footerWhatWeDo,
      }, {
        title: 'abouttitle',
        items: getFooterAbout(this.$config.baseUrl, this.locale),
      }];
    },
    legalMenu() {
      return getFooterLegal(this.$config.baseUrl, this.locale);
    },
    socialMenu() {
      return getSocialMenu(this.locale);
    },
    mobileOs() {
      return mobileOs;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      updateUserState: 'set',
    }),
    loadBCorp() {
      this.showBCorp = true;
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

.full-footer {
  position: relative;
  padding: $space-2l 60px $space-l;

  background-color: var(--color-background-primary);

  text-align: center;
}

.full-footer__content {
  padding-bottom: $space-m;

  @include desktop {
    display: flex;
    gap: $space-l;
    justify-content: space-between;
    padding-bottom: $space-3l;

    text-align: left;
  }
}

.full-footer__content,
.full-footer__social {
  @include desktop {
    max-width: 980px;
    margin: 0 auto;
  }
}

.full-footer__mobile-badge {
  width: 135px;
  height: 40px;
  margin: 0 auto $space-s;

  @include desktop {
    margin: 0 0 $space-s;
  }
}
</style>
