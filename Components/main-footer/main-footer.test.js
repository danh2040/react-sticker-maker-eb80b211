import VueRouter from 'vue-router';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { getSocialMenu as socialMenu } from '@ecosia/common-js/universal/menus.js';
import { staging } from '@ecosia/common-js/universal/urls.js';

import { useExperienceStore } from '@ecosia/store/experience/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EMainFooter from './index.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
localVue.use(VueRouter);
const router = new VueRouter();

window.Didomi = { preferences: { show: vi.fn() } };

const $config = {
  baseUrl: staging.BASE_URL,
};
const options = {
  localVue,
  $config,
  router,
  pinia: createTestingPinia({
    stubActions: false,
  }),
};

describe('EMainFooter', () => {
  let experienceStore;
  let userStore;

  beforeEach(() => {
    vi.resetAllMocks();

    userStore = useUserStore();
    experienceStore = useExperienceStore();
  });

  itRendersAndIsVisible(shallowMount(EMainFooter, options), 'footer');

  it('renders content', () => {
    const wrapper = mount(EMainFooter, options);
    const links = wrapper.findAll(byTestId('main-footer-link'));
    const socialLinks = wrapper.findAll(byTestId('main-footer-social-link'));
    const feedback = wrapper.find(byTestId('main-footer-feedback'));

    expect(links.length).toBe(4);
    expect(socialLinks.length).toBe(7);

    const expectedLinks = [
      ['common.footer.privacy', `${staging.BASE_URL}/privacy`],
      ['common.footer.imprint', `${staging.BASE_URL}/imprint`],
      ['common.footer.faq', 'https://support.ecosia.org/'],
      ['common.footer.settings', 'https://www.ecosia-staging.xyz/settings'],
    ];
    links.wrappers.forEach((link, index) => {
      const [text, href] = expectedLinks[index];
      expect(link.text()).toBe(text);
      expect(link.attributes('href')).toBe(href);
      expect(link.attributes('rel')).toBe('noopener');
    });

    const expectedSocialLinks = socialMenu().map((menu) => menu.url);
    socialLinks.wrappers.forEach((link, index) => {
      expect(link.attributes('href').endsWith(expectedSocialLinks[index])).toBe(
        true,
      );
      expect(link.attributes('rel')).toBe('noopener');
    });

    expect(feedback.text()).toBe('common.footer.feedback');
  });

  it('does not render settings link', () => {
    const wrapper = mount(EMainFooter, {
      ...options,
      propsData: { settingsLink: false },
    });
    const links = wrapper.findAll(byTestId('main-footer-link'));
    expect(
      links.filter((wrp) => wrp.text() === 'common.footer.settings').exists(),
    ).toBe(false);
  });

  it('renders cookie preferences button', () => {
    const wrapper = mount(EMainFooter, options);
    const button = wrapper.find(byTestId('main-footer-cookies'));
    expect(button.element).toHaveHtmlTag('button');
  });

  it('commits consentPreferences to true on cookie preferences click if using Ecosia', async () => {
    const setSpy = vi.spyOn(userStore, 'set');
    const wrapper = mount(EMainFooter, options);
    const button = wrapper.find(byTestId('main-footer-cookies'));
    await button.trigger('click');
    expect(setSpy).toHaveBeenCalledWith({ consentPreferences: true });
  });

  it('calls Didomi preferences show on cookie preferences click if using Didomi', async () => {
    experienceStore.tcfComplianceCountry = true;
    const wrapper = mount(EMainFooter, options);
    const button = wrapper.find(byTestId('main-footer-cookies'));
    await button.trigger('click');
    expect(window.Didomi.preferences.show).toHaveBeenCalled();
  });
});
