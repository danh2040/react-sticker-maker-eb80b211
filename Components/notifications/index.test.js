import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import flushPromises from 'flush-promises';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { staging } from '@ecosia/common-js/universal/urls.js';
import $cookieManager from '@ecosia/common-vitest/mocks/cookie-manager.js';
import notificationsMock from '@ecosia/common-vitest/mocks/notifications';

import cloneDeep from '@ecosia/js-utils/clone-deep.js';

import { useNotificationsStore } from '@ecosia/store/notifications/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import ENotificationButton from './button.vue';
import ENotifications from './index.vue';
import ENotificationList from './list.vue';
import ENotificationPopup from './popup.vue';
import { getNotifications } from './utils.js';

vi.mock('./utils.js');
vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
const apiUrl = staging.API_URL;
const $sentry = { captureException: vi.fn() };
const mocks = {
  $cookieManager,
  $sentry,
  $route: { query: {} },
  $config: { isDev: false, apiUrl },
};
const propsData = {
  readMoreLabel: 'Read More',
  blogUrl: 'http://example.blog',
};

const items = cloneDeep(notificationsMock);
const options = {
  localVue,
  mocks,
  propsData,
  pinia: createTestingPinia({
    stubActions: false,
    initialState: {
      user: {
        bingMarketCode: 'de-de',
        defaultMarket: 'en-us',
        treeCount: 5,
        browser: 'chrome',
      },
      notifications: {
        items,
      },
    },
  }),
};

describe('Notifications', () => {
  afterEach(() => {
    getNotifications.mockReturnValue(Promise.resolve(notificationsMock));
    vi.clearAllMocks();
  });

  itRendersAndIsVisible(shallowMount(ENotifications, options), 'div');

  it('does not render if there are no notifications', () => {
    useNotificationsStore().$patch({ items: [] });
    const wrapper = shallowMount(ENotifications, options);
    expect(wrapper.element).toBeEmptyOrComment();
  });

  it('tries to load notifications before mounting', async () => {
    useNotificationsStore().$patch({ items: [] });
    shallowMount(ENotifications, options);
    expect(getNotifications).toHaveBeenCalledWith(
      { locale: 'en', market: 'de-de', browser: 'chrome', apiUrl },
    );
  });

  it('does not load notifications if already loaded', () => {
    useNotificationsStore().$patch({ items });
    shallowMount(ENotifications, options);
    expect(getNotifications).not.toHaveBeenCalled();
  });

  it('tracks the exception if loading notifications fails', async () => {
    useNotificationsStore().$patch({ items: [] });
    getNotifications.mockReturnValue(Promise.reject(new Error('test')));
    shallowMount(ENotifications, options);
    await flushPromises();
    expect($sentry.captureException).toHaveBeenCalled();
  });

  it('use default market if bingMarketCode is not set', () => {
    useNotificationsStore().$patch({ items: [] });
    useUserStore().$patch({ bingMarketCode: null });
    shallowMount(ENotifications, options);
    expect(getNotifications).toHaveBeenCalledWith(
      { locale: 'en', market: 'en-us', browser: 'chrome', apiUrl },
    );
  });

  describe('if config is in dev mode', () => {
    it('returns a mock instead of loading notifications', async () => {
      useNotificationsStore().$patch({ items: [] });
      const newOptions = { ...options };
      newOptions.mocks.$config.isDev = true;
      shallowMount(ENotifications, newOptions);
      expect(getNotifications).not.toHaveBeenCalled();
    });
  });

  describe('if mocked query param is passed through', () => {
    it('returns a mock instead of loading notifications', async () => {
      useNotificationsStore().$patch({ items: [] });
      const newOptions = { ...options };
      newOptions.mocks.$route.query.mocked = 'true';
      shallowMount(ENotifications, newOptions);
      expect(getNotifications).not.toHaveBeenCalled();
    });
  });

  it('toggles list visibility', () => {
    const wrapper = shallowMount(ENotifications, options);
    wrapper.findComponent(ENotificationButton).trigger('click');
    expect(wrapper.findComponent(ENotificationList)).toBeVisible();
  });

  it('tracks toggle', () => {
    const wrapper = mount(ENotifications, options);
    const button = wrapper.find('button');
    // reset the mock explicitly after rendering to disregard the impression tracking calls
    sendCoreAnalyticsEvent.mockClear();
    button.trigger('click');
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendCoreAnalyticsEvent).toHaveBeenLastCalledWith('all_notification_toggleNotificationCenter', { origin: 'center' });
  });

  it('displays notifications popup', () => {
    const wrapper = mount(ENotifications, options);
    const popup = wrapper.findComponent(ENotificationPopup);
    expect(popup).toBeVisible();
  });
});
