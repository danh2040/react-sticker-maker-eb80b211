import VueRouter from 'vue-router';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import createFetchMock from 'vitest-fetch-mock';

import { staging } from '@ecosia/common-js/universal/urls.js';
import $cookieManager from '@ecosia/common-vitest/mocks/cookie-manager.js';
import ELogo from '@ecosia/common-vue2/components/logo/index.vue';
import { accessibleMenu, accessibleMenubar } from '@ecosia/common-vue2/directives/accessible-menu.js';

import {
  accountsFeaturesHoldoutGroup,
  climateImpactExperience,
} from '@ecosia/constants/feature-flags.js';
import { useUserStore } from '@ecosia/store/user/index.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import EMainHeader, { disableSearchBrowsers, headerFeatures } from './index.vue';
import EMainHeaderSignUpButton from './sign-up-button.vue';

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
localVue.use(VueRouter);
localVue.directive('accessible-menu', accessibleMenu);
localVue.directive('accessible-menubar', accessibleMenubar);
const $sentry = { captureException: vi.fn() };
const router = new VueRouter();

const query = { q: 'TEST_QUERY' };
router.push({ path: '/search', query });

const options = {
  localVue,
  mocks: {
    $cookieManager,
    $sentry,
  },
  router,
  pinia: createTestingPinia({
    stubActions: false,
    initialState: {
      user: {
        addon: false,
        browser: 'chrome',
        browserName: 'Chrome',
      },
    },
  }),
};
const fetchMock = createFetchMock(vi);

describe('EMainHeader', () => {
  let userStore;
  let unleashStore;

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    userStore = useUserStore();
    unleashStore = useUnleashStore();
  });

  afterEach(() => {
    userStore.$reset();
    unleashStore.$reset();
  });

  itRendersAndIsVisible(shallowMount(EMainHeader, options), 'div');

  it('does not render the disabled features', () => {
    const baseClass = '.main-header';
    const disableFeatures = ['logo', 'search', 'install-cta'];
    const propsData = { disableFeatures };
    const wrapper = shallowMount(EMainHeader, { ...options, propsData });
    disableFeatures.forEach((feature) => {
      expect(wrapper.find(`${baseClass}__${feature}`).exists()).toBe(false);
    });
    headerFeatures
      .filter((feature) => !disableFeatures.includes(feature))
      .forEach((feature) => {
        expect(wrapper.find(`${baseClass}__${feature}`)).toBeDefined();
      });
  });

  it('renders with the correct props', () => {
    const wrapper = shallowMount(EMainHeader, options);
    const props = wrapper.find(byTestId('main-header-search-form')).props();
    expect(props).toMatchObject({
      variant: 'medium',
      market: userStore.bingMarketCode,
      action: wrapper.vm.$route.path,
      prefillQuery: true,
      hasAutoFocus: false,
    });
  });

  it('if impact experiment is enabled, account is enabled, and user is not signed in show signup button', () => {
    unleashStore.$patch({
      featureToggles: {
        [climateImpactExperience.flag]: {
          value: climateImpactExperience.enabled,
        },
      },
    });
    userStore.$patch({
      isAccountsEnabled: true,
    });

    const headerWrapper = mount(EMainHeader, options);
    const signUpButtonElement = headerWrapper.findComponent(EMainHeaderSignUpButton);
    expect(signUpButtonElement.exists()).toBeTruthy();
  });

  it('if impact experiment is enabled, account is enabled, and user is signed in do not show signup button', () => {
    unleashStore.$patch({
      featureToggles: {
        [climateImpactExperience.flag]: {
          value: climateImpactExperience.enabled,
        },
      },
    });
    userStore.$patch({
      isAccountsEnabled: true,
      isSignedIn: true,
    });

    const headerWrapper = mount(EMainHeader, options);
    const signUpButtonElement = headerWrapper.findComponent(EMainHeaderSignUpButton);
    expect(signUpButtonElement.exists()).toBeFalsy();
  });

  it('if impact experiment is enabled, account is enabled, and user is in holdout group do not show signup button', () => {
    unleashStore.$patch({
      featureToggles: {
        [climateImpactExperience.flag]: {
          value: climateImpactExperience.enabled,
        },
        [accountsFeaturesHoldoutGroup.flag]: {
          value: accountsFeaturesHoldoutGroup.holdout,
        },
      },
    });
    userStore.$patch({
      isAccountsEnabled: true,
    });

    const headerWrapper = mount(EMainHeader, options);
    const signUpButtonElement = headerWrapper.findComponent(EMainHeaderSignUpButton);
    expect(signUpButtonElement.exists()).toBeFalsy();
  });

  it('if impact experiment is enabled, account is disabled, and user is not in holdout group do not show signup button', () => {
    unleashStore.$patch({
      featureToggles: {
        [climateImpactExperience.flag]: {
          value: climateImpactExperience.enabled,
        },
      },
    });
    userStore.$patch({
      isAccountsEnabled: false,
    });

    const headerWrapper = mount(EMainHeader, options);
    const signUpButtonElement = headerWrapper.findComponent(EMainHeaderSignUpButton);
    expect(signUpButtonElement.exists()).toBeFalsy();
  });

  it('if roundedLayout prop is true, accomodates adjusted layout with small margin', async () => {
    const propsData = { roundedLayout: true };
    const wrapper = shallowMount(EMainHeader, { ...options, propsData });
    await wrapper.vm.onNotificationsVisibilityChange(true);
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain('main-header--rounded-notifications');
  });

  it('renders logo keeping the features parameters', async () => {
    router.push({ path: '/search', query: { ...query, 'feature-test': 'test' } });
    const wrapper = mount(EMainHeader, options);
    const logo = wrapper.findComponent(ELogo);
    expect(logo.props('href')).toBe('#/?feature-test=test');
  });

  it('tracks search bar click on focus if func exists', async () => {
    const mockTrackFunc = vi.fn();
    const wrapper = shallowMount(EMainHeader, {
      ...options,
      propsData: {
        trackSearchBarClickFunc: mockTrackFunc,
      },
    });
    const searchForm = wrapper.find(byTestId('main-header-search-form'));
    await searchForm.vm.$emit('input-focused');

    expect(mockTrackFunc).toHaveBeenCalledTimes(1);
  });

  it('displays AI search button if slot is provided', () => {
    const wrapper = mount(EMainHeader, {
      ...options,
      slots: {
        'ai-search-button': '<button data-test-id="ai-search-button">AI Search</button>',
      },
    });
    expect(wrapper.find(byTestId('ai-search-button')).exists()).toBe(true);
  });

  it('does not display AI search button if slot is not provided', () => {
    const wrapper = mount(EMainHeader, options);
    expect(wrapper.find(byTestId('ai-search-button')).exists()).toBe(false);
  });

  describe('Search form', () => {
    it.each(disableSearchBrowsers)('does not render search feature if browser is %s', (browser) => {
      userStore.$patch({ browser });
      const wrapper = shallowMount(EMainHeader, options);
      expect(wrapper.find(byTestId('main-header-search'))).not.toBeDefined();
    });

    it.each([
      'https://localhost/zearch',
      '/zearch',
    ])('sets action to $config.searchUrl as %s', (searchUrl) => {
      const wrapper = shallowMount(EMainHeader, {
        ...options,
        mocks: {
          $config: {
            searchUrl,
          },
        },
      });
      expect(wrapper.find(byTestId('main-header-search-form')).props('action')).toBe(searchUrl);
    });

    it('sets the $route path if no config for search URL is given', () => {
      const wrapper = shallowMount(EMainHeader, options);
      const { path } = wrapper.vm.$route;
      expect(wrapper.find(byTestId('main-header-search-form')).props('action')).toBe(path);
    });

    it('disables search autocomplete if prop is false', () => {
      const wrapper = mount(EMainHeader, {
        ...options,
        propsData: {
          searchAutocomplete: false,
        },
      });
      expect(wrapper.find(byTestId('main-header-search-form')).props('autocompleteUrl')).toBe('');
    });

    it('enables search field autofocus if prop is true', () => {
      const wrapper = mount(EMainHeader, {
        ...options,
        propsData: {
          searchAutoFocus: true,
        },
      });
      expect(wrapper.find(byTestId('main-header-search-form')).props('hasAutoFocus')).toBe(true);
    });

    it('add search hidden inputs if prop exists', () => {
      const searchHiddenInputs = { hidden1: 'value' };
      const wrapper = mount(EMainHeader, {
        ...options,
        propsData: {
          searchHiddenInputs,
        },
      });
      expect(wrapper.find(byTestId('main-header-search-form')).props('hiddenInputs')).toBe(searchHiddenInputs);
    });

    it('adds a search origin if prop exists', () => {
      const searchOrigin = 'test-origin';
      const wrapper = mount(EMainHeader, {
        ...options,
        propsData: {
          searchOrigin,
        },
      });
      expect(wrapper.find(byTestId('main-header-search-form')).props('origin')).toBe(searchOrigin);
    });
  });

  describe('Install CTA', () => {
    let wrapper;

    beforeEach(() => {
      userStore.$patch({ addOn: 0, browser: 'chrome' });
      wrapper = shallowMount(EMainHeader, options);
      wrapper.setData({ isDesktopUp: true });
    });

    it('shows if conditions are met', async () => {
      expect(wrapper.find(byTestId('main-header-install-cta')).exists()).toBe(true);
    });

    it('does not show if addOn is not 0', async () => {
      await userStore.$patch({ addOn: 1 });
      expect(wrapper.find(byTestId('main-header-install-cta')).exists()).toBe(false);
    });

    it('does not show if viewport is smaller than desktop', async () => {
      await wrapper.setData({ isDesktopUp: false });
      expect(wrapper.find(byTestId('main-header-install-cta')).exists()).toBe(false);
    });

    it('doesn\'t show if cta slot is already in use', () => {
      const header = mount(EMainHeader, {
        ...options,
        slots: { cta: '<span>customCTA</span>' },
      });
      expect(header.find(byTestId('main-header-install-cta')).exists()).toBe(false);
    });

    // using named functions because it lets us describe the conditions in
    // the test output
    it.each([
      function defaultConditions() { },
      function addOnInstalled() {
        userStore.$patch({ addOn: 1 });
      },
      function iOSApp() {
        userStore.$patch({ browser: 'ecosia ios' });
      },
      function androidApp() {
        userStore.$patch({ browser: 'ecosia android' });
      },
      function vivaldiBrowser() {
        userStore.$patch({ browser: 'vivaldi' });
      },
      function waterfoxBrowser() {
        userStore.$patch({ browser: 'waterfox' });
      },
    ])('does not show if browser is not suported (%p)', (setConditions) => {
      setConditions();
      const header = shallowMount(EMainHeader, options);
      expect(header.find(byTestId('main-header-install-cta')).exists()).toBe(false);
    });
  });

  describe('Compact layout', () => {
    it('doesnt apply when is-compact prop is disabled', () => {
      const wrapper = mount(EMainHeader, {
        ...options,
        slots: { navigation: '<span>test</span>' },
      });
      expect(wrapper.find(byTestId('compact-layout-search-navigation')).exists()).toBe(false);
      expect(wrapper.findAll('.main-header__search-navigation')).toHaveLength(1);
    });

    it('applies when is-compact prop is enabled', () => {
      const wrapper = mount(EMainHeader, {
        ...options,
        propsData: {
          isCompact: true,
        },
        slots: { navigation: '<span>test</span>' },
      });
      expect(wrapper.find(byTestId('compact-layout-search-navigation')).exists()).toBe(true);
      expect(wrapper.find(byTestId('main-header-search-form')).exists()).toBe(false);
      expect(wrapper.findAll('.main-header__search-navigation')).toHaveLength(1);
    });
  });

  describe('Autocomplete', () => {
    it('uses correct autocomplete URL', () => {
      const wrapper = shallowMount(EMainHeader, options);

      expect(wrapper.vm.autocompleteUrl).toEqual(staging.AUTOCOMPLETE_URL);
    });
  });
});
