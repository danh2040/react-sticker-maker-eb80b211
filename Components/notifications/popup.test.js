import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { PiniaVuePlugin } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

import $cookieManager from '@ecosia/common-vitest/mocks/cookie-manager.js';
import mock from '@ecosia/common-vitest/mocks/notifications';

import cloneDeep from '@ecosia/js-utils/clone-deep.js';

import { LAST_DISCARDED_NOTIFICATION as LAST_DISCARDED_NOTIFICATION_COOKIE } from '@ecosia/constants/cookies';
import { useNotificationsStore } from '@ecosia/store/notifications/index.js';
import { useUserStore } from '@ecosia/store/user/index.js';

import EPopup from './popup.vue';

vi.mock('../../../js/client/analytics.js');

const localVue = createLocalVue();
localVue.use(PiniaVuePlugin);
const mocks = { $cookieManager };

const transitionStub = () => ({
  render() {
    return this.$options._renderChildren;
  },
});

const notificationsMock = cloneDeep(mock);
notificationsMock[0].level = 2;
const items = cloneDeep(notificationsMock);

const options = {
  localVue,
  mocks,
  stubs: { transition: transitionStub() },
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

describe('Notification Popup', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Vitest does not run beforeEach if the function call is not `it`.
  // this is the case of itRendersAndIsVisible custom test block
  it('renders and is visible', () => {
    const wrapper = shallowMount(EPopup, options);
    expect(wrapper.element).toHaveHtmlTag('div');
    expect(wrapper).toBeVisible();
    expect(wrapper.classes('notifications-popup')).toBe(true);
  });

  it('does not render if notifications are disabled', async () => {
    useUserStore().$patch({
      notificationEnabled: false,
    });
    const wrapper = shallowMount(EPopup, options);
    await wrapper.vm.$nextTick();
    // Check if it is a Vue Instance
    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.find(byTestId('notifications-popup')).exists()).toBe(false);
  });

  it('does not render if tree count < 5', async () => {
    useUserStore().$patch({ treeCount: 4 });
    const wrapper = shallowMount(EPopup, options);
    await wrapper.vm.$nextTick();
    expect(wrapper.find(byTestId('notifications-popup')).exists()).toBe(false);
  });

  it('does not render if notification is older than 5 days', async () => {
    useNotificationsStore().$patch({ items });
    const wrapper = shallowMount(EPopup, options);
    await wrapper.vm.$nextTick();
    expect(wrapper.find(byTestId('notifications-popup')).exists()).toBe(false);
  });

  it('does not render if user already discarded it', async () => {
    useUserStore().$patch({
      lastDiscardedNotification: {
        banner: null,
        popup: Date.now(),
      },
    });
    const wrapper = shallowMount(EPopup, options);
    await wrapper.vm.$nextTick();
    expect(wrapper.find(byTestId('notifications-popup')).exists()).toBe(false);
  });

  it('hides on click', async () => {
    const wrapper = mount(EPopup, options);
    await wrapper.find(byTestId('notifications-popup-item')).trigger('click');
    expect(wrapper.find(byTestId('notifications-popup')).exists()).toBe(false);
  });

  it('syncs lastDiscardedNotification to user store on close', async () => {
    useNotificationsStore().$patch({
      bannerVisible: true,
      popupVisible: true,
    });
    const wrapper = mount(EPopup, options);
    await wrapper.find(byTestId('notifications-popup-close')).trigger('click');
    const { calls } = $cookieManager.set.mock;
    expect(useUserStore().lastDiscardedNotification.popup).toBe(calls[0][1].popup);
  });

  it('hides and stores dismiss time in cookie on close', async () => {
    useNotificationsStore().$patch({ popupVisible: true });
    useUserStore().$patch({
      lastDiscardedNotification: {
        banner: Date.now(),
        popup: null,
      },
    });
    const wrapper = mount(EPopup, options);
    await wrapper.find(byTestId('notifications-popup-close')).trigger('click');
    const { calls } = $cookieManager.set.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(LAST_DISCARDED_NOTIFICATION_COOKIE);
    const date = new Date(calls[0][1].popup);
    const now = new Date();
    expect(date.getDate()).toBe(now.getDate());
    expect(date.getMonth()).toBe(now.getMonth());
    expect(date.getFullYear()).toBe(now.getFullYear());
    expect(wrapper.find(byTestId('notifications-popup')).exists()).toBe(false);
    // expect(wrapper.element).toBeEmptyOrComment();
  });

  it('hides and store dismiss time in cookie on click', async () => {
    useNotificationsStore().$patch({ popupVisible: true });
    useUserStore().$patch({
      lastDiscardedNotification: {
        banner: Date.now(),
        popup: null,
      },
    });
    const wrapper = mount(EPopup, options);
    await wrapper.find(byTestId('notifications-popup-item')).trigger('click');
    const { calls } = $cookieManager.set.mock;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(LAST_DISCARDED_NOTIFICATION_COOKIE);
    const date = new Date(calls[0][1].popup);
    const now = new Date();
    expect(date.getDate()).toBe(now.getDate());
    expect(date.getMonth()).toBe(now.getMonth());
    expect(date.getFullYear()).toBe(now.getFullYear());
    expect(wrapper.find(byTestId('notifications-popup')).exists()).toBe(false);
  });

  it('removes watcher on destroy', () => {
    const wrapper = mount(EPopup, options);
    wrapper.vm.unwatch = vi.fn();
    wrapper.destroy();
    expect(wrapper.vm.unwatch).toHaveBeenCalled();
  });
});
