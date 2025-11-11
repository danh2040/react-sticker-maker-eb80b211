import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import EMainNavImpactProfile from './impact-profile/index.vue';
import EMainNavMenu from './menu.vue';
import EMenuLinks from './menu-links.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({
  stubActions: false,
  initialState: {
    user: {
      addon: false,
      browser: 'chrome',
      browserName: 'Chrome',
    },
  },
});

const unleashStore = useUnleashStore(pinia);

const createOptions = (propsData = {}) => {
  return {
    localVue,
    pinia,
    propsData: {
      isAccountsEnabled: true,
      isSignedIn: false,
      isImpactExperimentEnabled: false,
      ...propsData,
    },
  };
};

describe('MainMenu', () => {
  let options;
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    options = createOptions();
  });

  afterEach(() => {
    unleashStore.$reset();
  });

  itRendersAndIsVisible(
    mount(EMainNavMenu, options),
    'div',
    'main-nav-menu',
  );

  it('renders menu links', () => {
    wrapper = mount(EMainNavMenu, options);
    expect(wrapper.findComponent(EMenuLinks)).toBeTruthy();
  });

  it('renders menu footer links', () => {
    wrapper = mount(EMainNavMenu, options);

    const expectedFooterLinks = [
      ['common.header.menu.privacy', '/privacy'],
      ['common.header.menu.faq', 'https://support.ecosia.org/'],
    ];

    const footerLinks = wrapper.findAll(byTestIdPrefix('main-nav-footer-link-'));
    footerLinks.wrappers.forEach((link, index) => {
      const [expectedText, expectedLink] = expectedFooterLinks[index];
      const attributes = link.attributes();
      expect(link.text()).toEqual(expect.stringContaining(expectedText));
      expect(attributes.href.endsWith(expectedLink)).toBe(true);
      expect(attributes.rel).toBe('noopener');
    });
  });

  it('displays the feedback link if prop is true', () => {
    wrapper = mount(EMainNavMenu, {
      ...options,
      propsData: {
        showFeedbackLink: true,
      },
    });
    expect(wrapper.find(byTestId('main-nav-feedback-link')).exists()).toBe(true);
  });

  it('shows the sign-in button', () => {
    wrapper = mount(EMainNavMenu, options);
    const signInOutButton = wrapper.find(byTestId('sign-in-button'));
    expect(signInOutButton.exists()).toBe(true);
  });

  it("doesn't show the impact profile component", () => {
    wrapper = mount(EMainNavMenu, options);
    const impactProfile = wrapper.findComponent(EMainNavImpactProfile);
    expect(impactProfile.exists()).toBe(false);
  });

  describe('climate impact experience experiment is enabled', () => {
    const optionsWithImpactExperimentEnabled = createOptions({
      isImpactExperimentEnabled: true,
    });
    const optionsWithCIESignedInUser = createOptions({
      isSignedIn: true,
      isImpactExperimentEnabled: true,
    });

    it('does show the impact profile component', () => {
      wrapper = mount(EMainNavMenu, optionsWithImpactExperimentEnabled);
      const impactProfile = wrapper.findComponent(EMainNavImpactProfile);
      expect(impactProfile.exists()).toBe(true);
    });

    it('shows the sign-out button if user is signed-in', () => {
      wrapper = mount(EMainNavMenu, optionsWithCIESignedInUser);
      const signOutButton = wrapper.find(byTestId('sign-out-button'));
      const signInButton = wrapper.find(byTestId('sign-in-button'));
      expect(signInButton.exists()).toBe(false);
      expect(signOutButton.exists()).toBe(true);
    });

    it('doesn\'t show the sign-in and sign out button if user is not signed-in', () => {
      wrapper = mount(EMainNavMenu, optionsWithImpactExperimentEnabled);
      const signOutButton = wrapper.find(byTestId('sign-out-button'));
      const signInButton = wrapper.find(byTestId('sign-in-button'));
      expect(signInButton.exists()).toBe(false);
      expect(signOutButton.exists()).toBe(false);
    });
  });

  describe('user is signed-in', () => {
    const optionsWithSignedInUser = createOptions({
      isSignedIn: true,
    });

    it('shows the sign-out button', () => {
      wrapper = mount(EMainNavMenu, optionsWithSignedInUser);

      const signOutButton = wrapper.find(byTestId('sign-out-button'));
      expect(signOutButton.exists()).toBe(true);
    });
  });

  describe('accounts are not enabled', () => {
    const optionsWithAccountsDisabled = createOptions({
      isAccountsEnabled: false,
    });

    it("doesn't show the sign-in/sign-out button", () => {
      wrapper = mount(EMainNavMenu, optionsWithAccountsDisabled);

      const signInButton = wrapper.find(byTestId('sign-in-button'));
      expect(signInButton.exists()).toBe(false);

      const signOutButton = wrapper.find(byTestId('sign-out-button'));
      expect(signOutButton.exists()).toBe(false);
    });

    it("doesn't show the impact profile component", () => {
      wrapper = mount(EMainNavMenu, optionsWithAccountsDisabled);
      const impactProfile = wrapper.findComponent(EMainNavImpactProfile);
      expect(impactProfile.exists()).toBe(false);
    });
  });
});
