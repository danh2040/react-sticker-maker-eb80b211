import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { getFooterAbout, getFooterLegal, getFooterWhatWeDo } from '@ecosia/common-js/universal/menus.js';
import { staging } from '@ecosia/common-js/universal/urls.js';

import { mobileOs } from '@ecosia/constants/browsers.js';
import { useExperienceStore } from '@ecosia/store/experience/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EFullFooter from './index.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
const locale = 'en';

const options = {
  localVue,
  pinia: createTestingPinia({
    stubActions: false,
    initialState: {
      unleash: {
        addon: false,
        browser: 'chrome',
        browserName: 'Chrome',
      },
    },
  }),
};

const mountFooter = () => mount(EFullFooter, { ...options, stubs: ['EMobileBadge'] });

describe('Full Footer', () => {
  let experienceStore;
  let userStore;

  beforeEach(() => {
    experienceStore = useExperienceStore();
    userStore = useUserStore();

    window.Didomi = { preferences: { show: vi.fn() } };
  });

  itRendersAndIsVisible(mountFooter(), 'footer');

  it('renders B-Corporation link', async () => {
    const wrapper = mountFooter();
    const bcorp = wrapper.find(byTestId('full-footer-bcorp'));

    expect(bcorp.exists()).toBe(true);
  });

  it('renders What we do', () => {
    const wrapper = mountFooter();
    const links = wrapper.findAll(byTestId('whattitle'));
    const whatwedo = getFooterWhatWeDo(locale, staging.BASE_URL).filter((item) => item.key !== 'advertising');

    expect(links.length).toBe(3);

    links.wrappers.forEach((link, index) => {
      expect(link.text().endsWith(whatwedo[index].key)).toBe(true);
      expect(link.attributes('href')).toBe(whatwedo[index].url);
    });
  });

  it('linksMenu doesnt include advertising', () => {
    const wrapper = mountFooter();
    const links = wrapper.vm.linksMenu;
    expect(links.length).toBe(2);

    links.forEach((link) => {
      expect(link.key === 'advertising').toBe(false);
    });
  });

  it('renders About', () => {
    const wrapper = mountFooter();
    const links = wrapper.findAll(byTestId('abouttitle'));
    const about = getFooterAbout(staging.BASE_URL, locale);
    expect(links.length).toBe(about.length);
  });

  it('renders Legal', () => {
    const wrapper = mountFooter();
    const links = wrapper.findAll(byTestId('legaltitle'));
    const legal = getFooterLegal(staging.BASE_URL, locale);

    expect(links.length).toBe(legal.length);
  });

  it('renders cookie preferences button', () => {
    const wrapper = mountFooter();
    const button = wrapper.find(byTestId('full-footer-cookies'));
    expect(button.element).toHaveHtmlTag('button');
  });

  it('commits consentPreferences to true on cookie preferences click if using Ecosia', async () => {
    const wrapper = mountFooter();
    const button = wrapper.find(byTestId('full-footer-cookies'));
    await button.trigger('click');
    expect(userStore.set).toHaveBeenCalledWith({ consentPreferences: true });
  });

  it('calls Didomi show preferences on cookie preferences click if using Didomi', async () => {
    experienceStore.$patch({
      tcfComplianceCountry: true,
    });
    const wrapper = mountFooter();
    const button = wrapper.find(byTestId('full-footer-cookies'));
    await button.trigger('click');
    expect(window.Didomi.preferences.show).toHaveBeenCalled();
  });

  it('renders mobile badges', () => {
    const wrapper = mountFooter();
    const links = wrapper.findAll(byTestId('mobile-badge'));

    expect(links.length).toBe(2);

    links.wrappers.forEach((link, index) => {
      expect(link.attributes('os')).toBe(mobileOs[index]);
    });
  });

  it('renders social section', () => {
    const wrapper = mountFooter();
    const social = wrapper.find('.footer-social');

    expect(social.exists()).toBe(true);
  });

  it('show apps on footer', () => {
    const wrapper = mountFooter();
    const apps = wrapper.find('.full-footer__mobile-badge');

    expect(apps.exists()).toBe(true);
  });
});
