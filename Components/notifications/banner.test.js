import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin, setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import $cookieManager from '@ecosia/common-vitest/mocks/cookie-manager.js';
import mock from '@ecosia/common-vitest/mocks/notifications.js';

import cloneDeep from '@ecosia/js-utils/clone-deep.js';

import { LAST_DISCARDED_NOTIFICATION as LAST_DISCARDED_NOTIFICATION_COOKIE } from '@ecosia/constants/cookies.js';
import { useNotificationsStore } from '@ecosia/store/notifications/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EBanner from './banner.vue';
import { NOTIFICATION_LEVEL_BANNER } from './constants.js';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
const mocks = { $cookieManager };

const notificationsMock = cloneDeep(mock);
const items = cloneDeep(notificationsMock);
const pinia = createTestingPinia({
  stubActions: false,
});

const options = {
  localVue,
  mocks,
  pinia,
};

describe('Notification Banner', () => {
  setActivePinia(pinia);
  let notificationsStore;

  beforeAll(() => {
    notificationsStore = useNotificationsStore();
  });

  beforeEach(() => {
    notificationsStore.$reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and is visible', () => {
    notificationsStore.$patch({ items: notificationsMock });
    const wrapper = shallowMount(EBanner, options);
    expect(wrapper.element).toHaveHtmlTag('div');
    expect(wrapper).toBeVisible();
  });

  it('renders banner and displays latest notification', () => {
    notificationsStore.$patch({ items: notificationsMock });
    const { target_url: url } = notificationsStore.items[0];
    const text = "Watch our first mini-documentary about Uganda's new forests";
    const wrapper = shallowMount(EBanner, options);
    const content = wrapper.find(byTestId('banner-link'));
    expect(content.text()).toBe(text);
    expect(content.attributes('href')).toBe(url);
    expect(content.attributes('rel')).toBe('noopener');
  });

  it('tracks impression', () => {
    notificationsStore.$patch({ items: notificationsMock });
    shallowMount(EBanner, options);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith(
      'all_notification_impression',
      {
        origin: 'banner',
        level: NOTIFICATION_LEVEL_BANNER,
        trackingname: 'EN_Ugandadoc',
      },
    );
  });

  it('tracks click', async () => {
    notificationsStore.$patch({ items: notificationsMock });
    const wrapper = mount(EBanner, options);
    const content = wrapper.find(byTestId('banner-link'));
    await content.trigger('click');
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(2);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith(
      'all_notification_click',
      {
        origin: 'banner',
        level: NOTIFICATION_LEVEL_BANNER,
        trackingname: 'EN_Ugandadoc',
      },
    );
  });

  it('does not render if there are no recent notifications', () => {
    notificationsStore.$patch({ items: [] });
    const wrapper = shallowMount(EBanner, options);
    // Check if it is a Vue Instance
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.element).toBeEmptyOrComment();
  });

  it('does not render if there are no level 3 notifications', () => {
    const notifications = cloneDeep(items);
    notifications[4].level = 2;
    notificationsStore.$patch({ items: notifications });
    const wrapper = shallowMount(EBanner, options);
    // Check if it is a Vue Instance
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.element).toBeEmptyOrComment();
  });

  it('does not render if level 3 is older than 3 days', () => {
    const date = new Date();
    date.setDate(date.getDate() - 3);
    const notifications = cloneDeep(items);
    notifications[4].publish_date = date.toISOString();
    notificationsStore.$patch({ items: notifications });
    const wrapper = shallowMount(EBanner, options);
    expect(wrapper.element).toBeEmptyOrComment();
  });

  it('removes Unicode HTML markup', () => {
    const notifications = cloneDeep(items);
    notifications[4].text = 'How do we count them? \u003cstrong\u003eWatch the video\u003c/strong\u003e to find out';
    notificationsStore.$patch({
      bannerVisible: true,
      items: notifications,
    });
    const wrapper = shallowMount(EBanner, options);
    const expected = 'How do we count them? Watch the video to find out';
    const content = wrapper.find(byTestId('banner-content'));
    expect(content.text()).toBe(expected);
  });

  it('removes HTML markup', () => {
    const notifications = cloneDeep(items);
    notifications[4].text = 'How <script%20type="application/javascript">maliciousStuff("xss");</script> got here?';
    notificationsStore.$patch({
      bannerVisible: true,
      items: notifications,
    });
    const wrapper = shallowMount(EBanner, options);
    const expected = 'How maliciousStuff("xss"); got here?';
    const content = wrapper.find(byTestId('banner-content'));
    expect(content.text()).toBe(expected);
  });

  it('syncs lastDiscardedNotification to user store on close', async () => {
    notificationsStore.$patch({
      bannerVisible: true,
      items: notificationsMock,
    });
    const wrapper = mount(EBanner, options);
    await wrapper.find(byTestId('banner-close')).trigger('click');
    const { calls } = $cookieManager.set.mock;
    expect(calls[0][0]).toBe(LAST_DISCARDED_NOTIFICATION_COOKIE);
    expect(useUserStore().lastDiscardedNotification.banner).toBe(calls[0][1].banner);
  });

  it('save timestamp in cookie on close', async () => {
    notificationsStore.$patch({
      bannerVisible: true,
      items: notificationsMock,
    });
    const wrapper = mount(EBanner, options);
    await wrapper.find(byTestId('banner-close')).trigger('click');
    const { calls } = $cookieManager.set.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(LAST_DISCARDED_NOTIFICATION_COOKIE);
    const date = new Date(calls[0][1].banner);
    const now = new Date();
    expect(date.getDate()).toBe(now.getDate());
    expect(date.getMonth()).toBe(now.getMonth());
    expect(date.getFullYear()).toBe(now.getFullYear());
    expect(wrapper.element).toBeEmptyOrComment();
  });

  it('calls unwatch on destroy', async () => {
    const unwatch = vi.fn();
    const wrapper = shallowMount(EBanner, options);
    wrapper.vm.unwatch = unwatch;
    await wrapper.destroy();
    expect(unwatch).toHaveBeenCalled();
  });
});
