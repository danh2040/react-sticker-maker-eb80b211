import { createLocalVue, mount } from '@vue/test-utils';
import { PiniaVuePlugin, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import {
  iconDesktopBrowsers,
  mobileOs,
} from '@ecosia/constants/browsers.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import ECtaIcon from './icon.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);

const pinia = createTestingPinia({
  stubActions: false,
  initialState: {
    user: {
      browserName: 'Chrome',
      browserOs: 'Mac Os',
    },
  },
});

const options = {
  localVue,
  pinia,
  propsData: {
    size: 'm',
  },
};

describe('ECtaIcon', () => {
  setActivePinia(pinia);
  let wrapper;
  let userStore;

  beforeEach(() => {
    userStore = useUserStore();
    userStore.$reset();

    // setting the default from the initialState again
    userStore.$patch({
      browserName: 'Chrome',
      browserOs: 'Mac Os',
    });
  });

  it.each(iconDesktopBrowsers)('renders desktop browser vendor logo for %', async (browser) => {
    userStore.browserName = browser;
    wrapper = mount(ECtaIcon, { data: () => ({ isTabletUp: true }), ...options });
    const icon = wrapper.find(byTestId('cta-button-icon'));
    expect(icon).toBeVisible();
  });

  it('does not render desktop browser vendor logo of unsupported browser', () => {
    userStore.browserName = 'Opera';
    wrapper = mount(ECtaIcon, options);
    const icon = wrapper.find(byTestId('cta-button-icon'));
    expect(icon.exists()).toBe(false);
  });

  it.each(mobileOs)('renders mobile os vendor logo', (os) => {
    userStore.browserOs = os;
    wrapper = mount(ECtaIcon, { data: () => ({ isTabletUp: true }), ...options });
    const icon = wrapper.find(byTestId('cta-button-icon'));
    expect(icon).toBeVisible();
  });

  it('does not render mobile os vendor logo of unsupported os', () => {
    userStore.browserName = 'Symbian';
    userStore.browserOs = 'Symbian';
    wrapper = mount(ECtaIcon, options);
    const icon = wrapper.find(byTestId('cta-button-icon'));
    expect(icon.exists()).toBe(false);
  });

  it.each([
    { innerWidth: 900, isTabletUp: true },
    { innerWidth: 768, isTabletUp: true },
    { innerWidth: 400, isTabletUp: false },
  ])('render logo only on screens larger than tablet size', async ({ isTabletUp }) => {
    userStore.browserName = 'Chrome';
    wrapper = mount(ECtaIcon, options);
    await wrapper.setData({ isTabletUp });
    expect(wrapper.find(byTestId('cta-button-icon')).exists()).toBe(isTabletUp);
  });
});
