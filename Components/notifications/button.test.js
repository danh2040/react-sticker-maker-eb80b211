import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import $cookieManager from '@ecosia/common-vitest/mocks/cookie-manager.js';
import notificationsMock from '@ecosia/common-vitest/mocks/notifications';
import ENotificationPill from '@ecosia/common-vue2/components/notification-pill/index.vue';

import cloneDeep from '@ecosia/js-utils/clone-deep.js';

import { LAST_READ_NOTIFICATION as LAST_READ_NOTIFICATION_COOKIE } from '@ecosia/constants/cookies';
import { useNotificationsStore } from '@ecosia/store/notifications/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import ENotificationButton from './button.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
const mocks = { $cookieManager };
const items = cloneDeep(notificationsMock);
const options = {
  localVue,
  mocks,
  pinia: createTestingPinia({
    stubActions: false,
    initialState: {
      user: {
        treeCount: 5,
      },
      notifications: {
        items,
      },
    },
  }),
};

describe('Notification Button', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Vitest does not run beforeEach if the function call is not `it`.
  // this is the case of itRendersAndIsVisible custom test block
  it('renders and is visible', () => {
    const wrapper = mount(ENotificationButton, options);
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(wrapper).toBeVisible();
    expect(wrapper.classes('notification-pill-wrapper')).toBe(true);
  });

  it('tracks impression', () => {
    const date = new Date();
    date.setDate(date.getDate() - 4);
    const updatedItems = [...items];
    updatedItems[0].publish_date = date.toISOString();
    useNotificationsStore().$patch({ items: updatedItems });
    shallowMount(ENotificationButton, options);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('all_notification_impression', { origin: 'center' });
  });

  it('hasNotification is true and sent to notification pill', () => {
    const wrapper = shallowMount(ENotificationButton, options);
    const notificationPillComponent = wrapper.findComponent(ENotificationPill);
    expect(notificationPillComponent.props('hasNotification')).toBe(true);
  });

  it('renders as default if there are no recent level 1 notifications', () => {
    useNotificationsStore().$patch({
      items: notificationsMock.filter((item) => item.level !== 1),
    });
    const wrapper = shallowMount(ENotificationButton, options);
    const notificationPillComponent = wrapper.findComponent(ENotificationPill);
    expect(notificationPillComponent.props('hasNotification')).toBe(false);
  });

  it('removes highlighting and save timestamp in cookie on click', async () => {
    const wrapper = mount(ENotificationButton, options);
    const button = wrapper.find('button');
    button.trigger('click');
    await wrapper.vm.$nextTick();

    const { calls } = wrapper.vm.$cookieManager.set.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(LAST_READ_NOTIFICATION_COOKIE);
    const notificationPillComponent = wrapper.findComponent(ENotificationPill);
    expect(notificationPillComponent.props('hasNotification')).toBe(false);
  });

  it('renders as default if tree count is < 5', () => {
    const treeCount = 3;
    useUserStore().$patch({ treeCount });
    const wrapper = shallowMount(ENotificationButton, options);
    const notificationPillComponent = wrapper.findComponent(ENotificationPill);
    expect(notificationPillComponent.props('hasNotification')).toBe(false);
  });

  it('renders as default if notifications are disabled', () => {
    const notificationEnabled = false;
    const treeCount = 5;
    useUserStore().$patch({ treeCount, notificationEnabled });
    const wrapper = shallowMount(ENotificationButton, options);
    const notificationPillComponent = wrapper.findComponent(ENotificationPill);
    expect(notificationPillComponent.props('hasNotification')).toBe(false);
  });

  it('renders as default if cookie timestamp is younger than notification', () => {
    const lastReadNotificationTimestamp = Date.now();
    const notificationEnabled = true;
    const treeCount = 5;
    useUserStore().$patch({
      treeCount,
      notificationEnabled,
      lastReadNotificationTimestamp,
    });
    const wrapper = shallowMount(ENotificationButton, options);
    const notificationPillComponent = wrapper.findComponent(ENotificationPill);
    expect(notificationPillComponent.props('hasNotification')).toBe(false);
  });

  it('renders as highlighted if cookie timestamp is older than notification', () => {
    const lastRead = new Date();
    const treeCount = 5;
    lastRead.setDate(lastRead.getDate() - 1);
    useUserStore().$patch({
      treeCount,
      notificationEnabled: true,
      lastReadNotificationTimestamp: lastRead.getTime(),
    });
    useNotificationsStore().$patch({
      items: cloneDeep(notificationsMock),
    });
    const wrapper = shallowMount(ENotificationButton, options);
    const notificationPillComponent = wrapper.findComponent(ENotificationPill);
    expect(notificationPillComponent.props('hasNotification')).toBe(true);
  });

  it('calls the unwatch function on destroy', () => {
    const unwatch = vi.fn();
    const wrapper = shallowMount(ENotificationButton, options);
    wrapper.vm.unwatch = unwatch;
    wrapper.destroy();
    expect(unwatch).toHaveBeenCalled();
  });
});
