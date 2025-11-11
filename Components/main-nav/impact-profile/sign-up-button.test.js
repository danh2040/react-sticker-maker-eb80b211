import { mount } from '@vue/test-utils';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';

import EMainNavMenuSignUpButton from './sign-up-button.vue';

vi.mock('@ecosia/common-js/client/analytics.js');

describe('EMainNavMenuSignUpButton', () => {
  it('has the url for signing in', async () => {
    const wrapper = mount(EMainNavMenuSignUpButton);
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes('href')).toBe(
      'https://www.ecosia-staging.xyz/accounts/sign-up?returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
    );
  });

  it('sends analytics on click', async () => {
    const wrapper = mount(EMainNavMenuSignUpButton);
    await wrapper.vm.$nextTick();

    // remove the href value only for the click trigger to prevent
    // the jsdom "not implemented: navigation" error when trying to redirect
    wrapper.element.setAttribute('href', '');

    await wrapper.trigger('click');

    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith(
      'accountsMainNavMenuSignUpButtonClicked',
      {
        isSignedIn: false,
      },
    );
  });
});
