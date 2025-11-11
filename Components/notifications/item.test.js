import { createLocalVue, shallowMount } from '@vue/test-utils';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import notifications from '@ecosia/common-vitest/mocks/notifications';

import EItem from './item.vue';

vi.mock('../../../js/client/analytics.js');

const localVue = createLocalVue();
const notification = notifications[1];
const propsData = { eventOrigin: 'test', locale: 'en', notification };
const options = { localVue, propsData };

describe('Notification item', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  itRendersAndIsVisible(shallowMount(EItem, options), 'article', 'notifications-item');

  it('renders link with date', () => {
    const wrapper = shallowMount(EItem, options);
    const link = wrapper.find(byTestId('notifications-item-link'));
    const date = wrapper.find(byTestId('notifications-item-date'));
    expect(link.attributes('href')).toBe(notification.target_url);
    expect(link.attributes('rel')).toBe('noopener');
    expect(date.text()).toEqual(expect.stringContaining('ago'));
    expect(date.attributes('datetime')).toBe(notification.publish_date);
  });

  it('renders text with <strong /> tags', () => {
    const expected = "Our profits go towards trees, not shareholders – and we've just made that commitment legally binding. <strong>Learn more</strong>";
    const wrapper = shallowMount(EItem, options);
    expect(wrapper.find(byTestId('notifications-item-text')).html()).toContain(expected);
  });

  it('renders text without tags different than <strong />', () => {
    const notificationText = "Watch <script type=\"text/javascript\">var adr = '../evil.php?cakemonster=' + escape(document.cookie);</script> about Uganda's new forests";
    const wrapper = shallowMount(EItem, {
      ...options,
      propsData: {
        ...propsData,
        notification: {
          ...notification,
          text: notificationText,
        },
      },
    });
    expect(wrapper.find(byTestId('notifications-item-text')).html()).not.toContain('script');
  });

  it('tracks click', async () => {
    const wrapper = shallowMount(EItem, options);
    const link = wrapper.find(byTestId('notifications-item-link'));
    await triggerSafeLinkClick(link);
    const coreAnalytics = sendCoreAnalyticsEvent.mock;
    const { level, tracking_name: trackingname } = notification;
    expect(coreAnalytics.calls.length).toBe(1);
    expect(coreAnalytics.calls[0][0]).toBe('all_notification_click');
    expect(coreAnalytics.calls[0][1]).toMatchObject({ level, trackingname });
  });

  describe('Notification image', () => {
    it('has background image', () => {
      const wrapper = shallowMount(EItem, {
        ...options,
        propsData: {
          ...propsData,
          notification: {
            ...notification,
            has_background: true,
          },
        },
      });
      expect(wrapper.find('.notifications-item__background').exists()).toBe(true);
      expect(wrapper.find('img.notifications-item__image').exists()).toBe(false);
      expect(wrapper.find('.notifications-item__logo').exists()).toBe(false);
    });

    it('displays logo', () => {
      const wrapper = shallowMount(EItem, {
        ...options,
        propsData: {
          ...propsData,
          notification: {
            ...notification,
            image_url: null,
          },
        },
      });
      expect(wrapper.find('.notifications-item__background').exists()).toBe(false);
      expect(wrapper.find('img.notifications-item__image').exists()).toBe(false);
      expect(wrapper.find('.notifications-item__logo').exists()).toBe(true);
    });
  });

  describe('Notification date', () => {
    it('renders date', () => {
      const wrapper = shallowMount(EItem, options);
      const date = wrapper.find(byTestId('notifications-item-date'));
      expect(date.exists()).toBe(true);
    });

    it('does not render date if date visible is false', () => {
      const wrapper = shallowMount(EItem, {
        ...options,
        propsData: {
          ...propsData,
          dateVisible: false,
        },
      });
      const date = wrapper.find(byTestId('notifications-item-date'));
      expect(date.exists()).toBe(false);
    });

    it('render empty date if date is not valid', () => {
      const invalidNotification = {
        ...notification,
        publish_date: 'xxxxxxx',
      };
      const wrapper = shallowMount(EItem, {
        ...options,
        propsData: {
          ...propsData,
          notification: invalidNotification,
        },
      });
      const date = wrapper.find(byTestId('notifications-item-date'));
      expect(date.text()).toBe('');
    });
  });
});
