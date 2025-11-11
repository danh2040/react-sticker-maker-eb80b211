import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';

import { collectibles } from '@ecosia/constants/feature-flags.js';
import { useUnleashStore } from '@ecosia/unleash-client/store.js';

import EMenuLinks, { LOCALSTORAGE_DISMISSED_KEY } from './menu-links.vue';

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
      isSignedIn: false,
      isImpactExperimentEnabled: false,
      ...propsData,
    },
  };
};

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

describe('MenuLinks', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    unleashStore.$reset();
  });

  it('calls analytics when nav menu link clicked', async () => {
    const wrapper = mount(EMenuLinks, createOptions());

    const navMenuLink = wrapper.get(byTestId('main-nav-menu-link-browser'));
    await triggerSafeLinkClick(navMenuLink);

    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith(
      'menuNavMenuClicked',
      { href: 'https://www.ecosia-staging.xyz/browser' },
    );
  });

  it('renders menu', () => {
    const wrapper = mount(EMenuLinks, createOptions());

    const expectedMenu = [
      {
        title: 'common.header.menu.group.ecosia',
        items: [
          ['common.header.menu.browser', '/browser'],
          ['common.header.menu.search', '/'],
          ['common.header.menu.forcompanies', 'https://companies.ecosia.org/'],
          ['common.header.menu.giftingtrees', 'https://plant.ecosia.org'],
        ],
      },
      {
        title: 'common.header.menu.group.search',
        items: [
          ['common.header.menu.settings', 'settings'],
        ],
      },
    ];

    const groups = wrapper.findAll(byTestIdPrefix('main-nav-menu-group-'));
    groups.wrappers.forEach((groupWrapper, groupIndex) => {
      const expectedGroup = expectedMenu[groupIndex];
      const groupTitleElement = groupWrapper.find(byTestId('main-nav-menu-title'));
      expect(groupTitleElement.text()).toStrictEqual(expectedGroup.title);
      const links = groupWrapper.findAll(byTestIdPrefix('main-nav-menu-link-'));
      links.wrappers.forEach((link, index) => {
        const [expectedText, expectedLink] = expectedGroup.items[index];
        const attributes = link.attributes();
        expect(link.text()).toEqual(expect.stringContaining(expectedText));
        expect(attributes.href.endsWith(expectedLink)).toBe(true);
        expect(attributes.rel).toBe('noopener');
      });
    });
  });

  describe('cie experiment is enabled and the user is signed-in', () => {
    const optionsWithCIESignedInUser = createOptions({
      isSignedIn: true,
      isImpactExperimentEnabled: true,
    });

    it('renders profile menu group', () => {
      const wrapper = mount(EMenuLinks, optionsWithCIESignedInUser);

      const expectedMenu = [
        {
          title: 'common.header.menu.group.account',
          items: [
            ['common.header.menu.profile', '/accounts/profile'],
          ],
        },
        {
          title: 'common.header.menu.group.ecosia',
          items: [
            ['common.header.menu.browser', '/browser'],
            ['common.header.menu.search', '/'],
            ['common.header.menu.forcompanies', 'https://companies.ecosia.org/'],
          ],
        },
        {
          title: 'common.header.menu.group.search',
          items: [
            ['common.header.menu.settings', 'settings'],
          ],
        },
      ];

      const groups = wrapper.findAll(byTestIdPrefix('main-nav-menu-group-'));
      groups.wrappers.forEach((groupWrapper, groupIndex) => {
        const expectedGroup = expectedMenu[groupIndex];
        const groupTitleElement = groupWrapper.find(byTestId('main-nav-menu-title'));
        expect(groupTitleElement.text()).toStrictEqual(expectedGroup.title);
        const links = groupWrapper.findAll(byTestIdPrefix('main-nav-menu-link-'));
        links.wrappers.forEach((link, index) => {
          const [expectedText, expectedLink] = expectedGroup.items[index];
          const attributes = link.attributes();
          expect(link.text()).toEqual(expect.stringContaining(expectedText));
          expect(attributes.href.endsWith(expectedLink)).toBe(true);
          expect(attributes.rel).toBe('noopener');
        });
      });
    });

    it("doesn't render the collectibles link", () => {
      const wrapper = mount(EMenuLinks, optionsWithCIESignedInUser);
      const collectiblesLink = wrapper.find(byTestId('main-nav-menu-link-collectibles'));
      expect(collectiblesLink.exists()).toBe(false);
    });

    describe('collectibles is enabled', () => {
      beforeEach(() => {
        unleashStore.$patch({
          featureToggles: {
            [collectibles.flag]: {
              value: collectibles.enabled,
            },
          },
        });
      });

      it('renders collectibles link', () => {
        const wrapper = mount(EMenuLinks, optionsWithCIESignedInUser);
        const collectiblesLink = wrapper.find(byTestId('main-nav-menu-link-collectibles'));
        expect(collectiblesLink.exists()).toBe(true);
      });
    });

    it('renders inline alert for profile menu link', async () => {
      const wrapper = mount(EMenuLinks, optionsWithCIESignedInUser);
      await wrapper.vm.$nextTick();
      const profileLinkAlert = wrapper.find(byTestId('main-nav-menu-link-alert'));
      expect(profileLinkAlert.isVisible()).toBeTruthy();
      expect(profileLinkAlert.text()).toContain('common.header.menu.profile.alert.body');
      expect(profileLinkAlert.props().title).toContain('common.header.menu.profile.alert.title');
    });

    it("doesn't show profile inline alert if it has been seen already", async () => {
      localStorage.setItem(LOCALSTORAGE_DISMISSED_KEY, 'true');

      const wrapper = mount(EMenuLinks, optionsWithCIESignedInUser);
      await wrapper.vm.$nextTick();
      expect(wrapper.find(byTestId('main-nav-menu-link-alert')).exists()).toBeFalsy();
    });

    it('hides profile inline alert if the profile link is clicked', async () => {
      const wrapper = mount(EMenuLinks, optionsWithCIESignedInUser);
      await wrapper.vm.$nextTick();
      const profileLink = wrapper.find(byTestId('main-nav-menu-link-profile'));

      // remove the href value only for the click trigger to prevent
      // the jsdom "not implemented: navigation" error when trying to redirect
      profileLink.element.setAttribute('href', '');
      await profileLink.trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.find(byTestId('main-nav-menu-link-alert')).exists()).toBeFalsy();
    });
  });
});
