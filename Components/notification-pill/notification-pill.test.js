import { mount } from '@vue/test-utils';

import ENotificationPill from './index.vue';

describe('ENotificationPill', () => {
  it("doesn't show anything", () => {
    const wrapper = mount(ENotificationPill);
    expect(wrapper.isVisible()).toBe(false);
  });

  describe('hasNotification is true', () => {
    const options = {
      propsData: {
        hasNotification: true,
      },
    };

    it('shows the notification pill', () => {
      const wrapper = mount(ENotificationPill, options);
      expect(wrapper.isVisible()).toBe(true);
    });
  });
});
