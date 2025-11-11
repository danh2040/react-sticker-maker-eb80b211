import { mount } from '@vue/test-utils';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

import ESignInOutButton from './sign-in-out-button.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

describe('ESignInOutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('user is signed out', () => {
    let wrapper;

    beforeAll(() => {
      const options = {
        propsData: {
          isSignedIn: false,
        },
      };
      wrapper = mount(ESignInOutButton, options);
    });

    it('has the url for signing in', () => {
      expect(wrapper.attributes('href')).toBe(
        'https://www.ecosia-staging.xyz/accounts/sign-in?returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
      );
    });

    it('has the correct test id', () => {
      expect(wrapper.attributes('data-test-id')).toBe(
        'sign-in-button',
      );
    });

    it('has a sign-in icon', () => {
      const icon = wrapper.findComponent(EIcon);
      expect(icon.props('icon')).toBe('sign-in');
    });

    it('has a sign-in text', () => {
      expect(wrapper.text()).toBe('common.header.accounts.signin');
    });

    describe('button is clicked', () => {
      beforeEach(async () => {
        await triggerSafeLinkClick(wrapper);
      });

      it('calls the analytics correctly', async () => {
        expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
        expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith(
          'accountsSignInButtonClicked',
        );
      });
    });
  });

  describe('user is signed in', () => {
    let wrapper;

    beforeAll(() => {
      const options = {
        propsData: {
          isSignedIn: true,
        },
      };
      wrapper = mount(ESignInOutButton, options);
    });

    it('has the url for signing out', () => {
      expect(wrapper.attributes('href')).toBe(
        'https://www.ecosia-staging.xyz/accounts/sign-out?returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
      );
    });

    it('has the correct test id', () => {
      expect(wrapper.attributes('data-test-id')).toBe(
        'sign-out-button',
      );
    });

    it('has a sign-out icon', () => {
      const icon = wrapper.findComponent(EIcon);
      expect(icon.props('icon')).toBe('sign-out');
    });

    it('has a sign-out text', () => {
      expect(wrapper.text()).toBe('common.header.accounts.signout');
    });

    describe('button is clicked', () => {
      beforeEach(async () => {
        await triggerSafeLinkClick(wrapper);
      });

      it('calls the analytics correctly', async () => {
        expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
        expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith(
          'accountsSignOutButtonClicked',
        );
      });
    });
  });
});
