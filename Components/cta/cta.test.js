import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { SUPPORT_DOMAINS } from '@ecosia/common-js/universal/support-url-utils.js';
import { getSwitchToEcosiaUrl } from '@ecosia/common-js/universal/url-utils';
import { staging } from '@ecosia/common-js/universal/urls.js';

import * as appUrls from '@ecosia/constants/app-urls.js';
import * as ctaPromotions from '@ecosia/constants/cta-promotions';
import { chromeDefaultSwitchGif } from '@ecosia/constants/feature-flags.js';
import { locales } from '@ecosia/constants/i18n';
import { SUPPORT_PATHS } from '@ecosia/constants/urls.js';
import { useExperienceStore } from '@ecosia/store/experience/index.js';
import { useGlobalStore } from '@ecosia/store/global/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import ECta from './index.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

const baseUrl = staging.BASE_URL;

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({
  stubActions: false,
  initialState: {
    user: {
      addon: false,
      browser: 'chrome',
    },
  },
});

const positionTracking = 'test';

const options = {
  localVue,
  pinia,
  propsData: {
    positionTracking,
  },
  mocks: {
    $config: {
      baseUrl,
    },
  },
};

describe('CTA', () => {
  setActivePinia(pinia);
  const experienceStore = useExperienceStore();
  const globalStore = useGlobalStore();
  const userStore = useUserStore();
  const unleashStore = useUnleashStore();

  let button;
  let wrapper;

  beforeEach(() => {
    window.gtag_report_conversion = undefined;
    window.mntn_report_conversion = undefined;

    experienceStore.$reset();
    globalStore.$reset();
    userStore.$reset();
    unleashStore.$reset();

    userStore.$patch({
      addon: false,
      browser: 'chrome',
    });

    options.propsData = { positionTracking };
  });

  itRendersAndIsVisible(shallowMount(ECta, options), 'div');

  it('install CTA contains install string', () => {
    wrapper = shallowMount(ECta, options);
    button = wrapper.find(byTestId('cta-button'));
    expect(button.text()).toBe('common.install.cta.switch');
  });

  it('sets global state isACtaComponentVisible to true', () => {
    shallowMount(ECta, options);
    expect(experienceStore.isACtaComponentVisible).toBe(true);
  });

  it('does not show the installer overlay', async () => {
    wrapper = await mount(ECta, options);
    button = wrapper.find(byTestId('cta-button'));
    expect(wrapper.find(byTestId('installer')).exists()).toBe(false);
    await button.trigger('click');
    expect(wrapper.find(byTestId('installer')).exists()).toBe(false);
  });

  it.each([
    ['Mac OS', 'firefox', appUrls.FIREFOX_EXTENSION_DOWNLOAD],
    ['Mac OS', 'brave', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.BRAVE_ON_DESKTOP}`],
    ['Mac OS', 'opera', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.OPERA_ON_DESKTOP}`],
    ['Mac OS', 'safari', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.SAFARI_ON_DESKTOP}`],
    ['Mac OS', 'vivaldi', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.VIVALDI_ON_DESKTOP}`],
    ['Mac OS', 'chrome', getSwitchToEcosiaUrl(baseUrl)],
    ['Ubuntu', 'brave', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.BRAVE_ON_DESKTOP}`],
    ['Ubuntu', 'firefox', appUrls.FIREFOX_EXTENSION_DOWNLOAD],
    ['Ubuntu', 'opera', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.OPERA_ON_DESKTOP}`],
    ['Ubuntu', 'vivaldi', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.VIVALDI_ON_DESKTOP}`],
    ['Windows', 'brave', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.BRAVE_ON_DESKTOP}`],
    ['Windows', 'chrome', getSwitchToEcosiaUrl(baseUrl)],
    ['Windows', 'edge', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.EDGE_ON_DESKTOP}`],
    ['Windows', 'edge', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.EDGE_ON_DESKTOP}`],
    ['Windows', 'firefox', appUrls.FIREFOX_EXTENSION_DOWNLOAD],
    ['Windows', 'opera', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.OPERA_ON_DESKTOP}`],
    ['Windows', 'vivaldi', `${SUPPORT_DOMAINS.en}/article/${SUPPORT_PATHS.USE_ECOSIA_ON_DESKTOP.en}${appUrls.VIVALDI_ON_DESKTOP}`],
  ])('cta url is correct for OS %s and browser %s', async (os, browser, expected) => {
    experienceStore.$patch({ isEcosiaSearchOptionChrome: true });
    userStore.$patch({
      browser,
      browserOs: os,
      browserVersion: '125.0.0',
    });
    wrapper = mount(ECta, options);
    const { element } = wrapper.find(byTestId('cta-button'));
    expect(element).toHaveAttribute('href', expected);
  });

  describe('Chrome browser', () => {
    it('props of CTA when in Chrome browser', async () => {
      wrapper = await mount(ECta, options);
      const { element } = wrapper.find(byTestId('cta-button'));
      expect(element).toHaveAttribute('href', appUrls.CHROME_EXTENSION);
    });

    it.each(
      locales,
    )('redirects to GIF instructions page for %s when toggle is enabled', async (locale) => {
      globalStore.$patch({
        locale,
      });
      experienceStore.$patch({
        isEcosiaSearchOptionChrome: true,
      });
      userStore.$patch({
        browserOs: 'Mac OS',
        browserVersion: '125.0.0',
      });
      wrapper = await mount(ECta, options);
      await wrapper.vm.$nextTick();
      button = wrapper.find(byTestId('cta-button'));
      const href = getSwitchToEcosiaUrl(baseUrl);

      expect(button.attributes('href')).toBe(href);
    });
  });

  describe('Tracking CTA', () => {
    it.each([
      ['iOS', 'safari', ctaPromotions.APP_STORE],
      ['Android', 'chrome', ctaPromotions.PLAY_STORE],
      ['Mac OS', 'firefox', ctaPromotions.BROWSER_EXTENSION],
      ['Mac OS', 'chrome', ctaPromotions.BROWSER_EXTENSION],
      ['Windows', 'edge', ctaPromotions.BROWSER_EXTENSION],
      ['Mac OS', 'brave', ctaPromotions.DEFAULT_SWITCH],
    ])('track display cta on %s device and %p browser', async (os, browser, usageType) => {
      userStore.$patch({
        browser,
        browserOs: os,
      });
      wrapper = mount(ECta, options);

      expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('ctaDisplayed', {
        position: positionTracking,
        usage: usageType,
      });

      const ctaButton = wrapper.find(byTestId('cta-button'));
      await triggerSafeLinkClick(ctaButton);

      expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('ctaClicked', {
        position: positionTracking,
        usage: usageType,
      });
    });
  });

  describe('Firefox browser', () => {
    beforeEach(() => {
      userStore.$patch({
        addOn: false,
        browser: 'firefox',
      });
    });

    it('props of CTA when in firefox browser', async () => {
      wrapper = await mount(ECta, options);
      const { element } = wrapper.find(byTestId('cta-button'));
      expect(element).toHaveAttribute('href', appUrls.FIREFOX_EXTENSION_DOWNLOAD);
    });

    it('shows the installer overlay', async () => {
      wrapper = await mount(ECta, options);
      button = wrapper.find(byTestId('cta-button'));
      expect(wrapper.find(byTestId('installer')).exists()).toBe(false);
      await triggerSafeLinkClick(button);
      expect(wrapper.find(byTestId('installer')).exists()).toBe(true);
    });

    it('closes the installer overlay on close event', async () => {
      wrapper = await mount(ECta, options);
      button = wrapper.find(byTestId('cta-button'));
      expect(wrapper.find(byTestId('installer')).exists()).toBe(false);
      await triggerSafeLinkClick(button);
      expect(wrapper.find(byTestId('installer')).exists()).toBe(true);
      const installer = wrapper.find(byTestId('installer'));
      await installer.trigger('click');
      expect(installer.emitted()['installer-closed']).toBeDefined();
    });
  });

  describe('Browser link', () => {
    it('does not show link to browser page when prop is false', () => {
      options.propsData.hasLinkToBrowserPage = false;
      wrapper = shallowMount(ECta, options);
      const linkToBrowserPage = wrapper.find(byTestId('cta-link-to-browser-page'));
      expect(linkToBrowserPage.exists()).toBe(false);
    });

    it('shows link to browser page when prop is true', () => {
      options.propsData.hasLinkToBrowserPage = true;
      wrapper = shallowMount(ECta, options);
      const linkToBrowserPage = wrapper.find(byTestId('cta-link-to-browser-page'));
      expect(linkToBrowserPage.exists()).toBe(true);
    });
  });

  describe('CTA with engt-1699-default-switcher-gif-in-modal feature flag', () => {
    beforeEach(() => {
      experienceStore.$patch({ isEcosiaSearchOptionChrome: true });
      userStore.$patch({ browser: 'chrome', browserVersion: '125.0.0' });
    });

    it('does not render modal when feature flag is disabled', async () => {
      unleashStore.$patch({
        featureToggles: {
          [chromeDefaultSwitchGif.flag]: {
            value: 'control',
          },
        },
      });
      wrapper = mount(ECta, options);
      await wrapper.setData({ isDesktopUp: true });

      expect(wrapper.find(byTestId('cta-switch-modal')).exists()).toBe(false);
      button = wrapper.find(byTestId('cta-button'));
      await button.trigger('click');
      expect(wrapper.find(byTestId('cta-switch-modal')).exists()).toBe(false);
    });

    it('does render modal when feature flag is enabled on chrome and desktop', async () => {
      unleashStore.$patch({
        featureToggles: {
          [chromeDefaultSwitchGif.flag]: {
            value: chromeDefaultSwitchGif.displayGifInModal,
          },
        },
      });

      wrapper = mount(ECta, options);
      await wrapper.setData({ isDesktopUp: true });
      expect(wrapper.find(byTestId('cta-switch-modal')).exists()).toBe(false);

      button = wrapper.find(byTestId('cta-button'));
      await button.trigger('click');
      expect(wrapper.find(byTestId('cta-switch-modal')).exists()).toBe(true);

      expect(button.attributes('href')).toBeUndefined();
      expect(wrapper.find(byTestId('installer')).exists()).toBe(false);
    });

    it('does not render modal when the viewport is smaller than desktop', async () => {
      unleashStore.$patch({
        featureToggles: {
          [chromeDefaultSwitchGif.flag]: {
            value: chromeDefaultSwitchGif.displayGifInModal,
          },
        },
      });
      userStore.$patch({ browser: 'chrome' });

      wrapper = mount(ECta, options);
      await wrapper.setData({ isDesktopUp: false });
      expect(wrapper.find(byTestId('cta-switch-modal')).exists()).toBe(false);

      button = wrapper.find(byTestId('cta-button'));
      await button.trigger('click');
      expect(wrapper.find(byTestId('cta-switch-modal')).exists()).toBe(false);

      expect(button.attributes('href')).toBeDefined();
    });

    it.each(
      ['Edge', 'Safari', 'Firefox', 'Edge'],
    )('does not render modal for other browsers', async (browser) => {
      unleashStore.$patch({
        featureToggles: {
          [chromeDefaultSwitchGif.flag]: {
            value: chromeDefaultSwitchGif.displayGifInModal,
          },
        },
      });
      userStore.$patch({ browser });

      wrapper = mount(ECta, options);
      await wrapper.setData({ isDesktopUp: false });
      expect(wrapper.find(byTestId('cta-switch-modal')).exists()).toBe(false);

      button = wrapper.find(byTestId('cta-button'));
      await button.trigger('click');
      expect(wrapper.find(byTestId('cta-switch-modal')).exists()).toBe(false);

      expect(button.attributes('href')).toBeDefined();
    });
  });

  describe('Paid conversion', () => {
    describe('Google Tag', () => {
      it('sends a conversion event when the CTA is clicked if the conversion exists', async () => {
        window.gtag_report_conversion = vi.fn();
        wrapper = mount(ECta, options);
        button = wrapper.find(byTestId('cta-button'));
        await button.trigger('click');
        expect(window.gtag_report_conversion).toHaveBeenCalled();
      });
    });

    describe('MNTN conversion', () => {
      it('sends a MNTN conversion event when the CTA is clicked if the script is loaded', async () => {
        window.mntn_report_conversion = vi.fn();
        wrapper = mount(ECta, options);
        button = wrapper.find(byTestId('cta-button'));
        await button.trigger('click');
        expect(window.mntn_report_conversion).toHaveBeenCalled();
      });
    });
  });

  describe('Button Size', () => {
    it('is l on large screen by default', async () => {
      options.propsData = { positionTracking };
      wrapper = mount(ECta, options);
      await wrapper.setData({ isTabletUp: true });
      expect(wrapper.find(byTestId('cta-button')).props()['size']).toBe('l');
    });

    it('sizes down for small screens by default', async () => {
      options.propsData = { positionTracking };
      wrapper = mount(ECta, options);
      await wrapper.setData({ isTabletUp: false });
      expect(wrapper.find(byTestId('cta-button')).props()['size']).toBe('m');
    });

    it('doesn\'t size down if size is set', async () => {
      options.propsData = { size: 'l', positionTracking };
      wrapper = mount(ECta, options);
      await wrapper.setData({ isTabletUp: false });
      expect(wrapper.find(byTestId('cta-button')).props()['size']).toBe('l');
    });

    it.each([
      ['s', 'm'],
      ['m', 'l'],
    ])('sets icon size to %s when button size is %s', async (iconSize, buttonSize) => {
      options.propsData = { size: buttonSize, positionTracking };
      wrapper = mount(ECta, options);
      expect(wrapper.vm.iconSize).toBe(iconSize);
    });
  });
});
