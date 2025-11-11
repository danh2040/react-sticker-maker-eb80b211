import { mount } from '@vue/test-utils';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import useIsServerSideRendered from '@ecosia/common-vue2/composables/is-server-side-rendered.js';

import EMainHeaderSignUpButton from './sign-up-button.vue';

vi.mock('@ecosia/common-vue2/composables/is-server-side-rendered.js');
vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

describe('EMainHeaderSignInButton', () => {
  let wrapper;
  let options;

  beforeAll(() => {
    options = {
      propsData: {
        isSignedIn: false,
        isACtaComponentVisible: false,
      },
    };
    wrapper = mount(EMainHeaderSignUpButton, options);
  });

  beforeEach(() => {
    useIsServerSideRendered.mockReturnValue(false);
    vi.resetAllMocks();
  });

  it('has the url for signing up', () => {
    expect(wrapper.attributes('href')).toBe(
      'https://www.ecosia-staging.xyz/accounts/sign-up?returnTo=http%3A%2F%2Flocal.ecosia.org%2F',
    );
  });

  it('has a sign-up text', () => {
    expect(wrapper.text()).toBe('common.header.menu.impact.signup');
  });

  it.each([
    { isACtaComponentVisible: true, buttonVariant: 'solid-white', type: 'secondary' },
    { isACtaComponentVisible: false, buttonVariant: 'solid-grellow', type: 'primary' },
  ])(
    'sets the button to $type, if isACtaComponentVisible is $isACtaComponentVisible',
    ({ isACtaComponentVisible, buttonVariant }) => {
      options.propsData.isACtaComponentVisible = isACtaComponentVisible;
      wrapper = mount(EMainHeaderSignUpButton, options);
      expect(wrapper.attributes('variant')).toBe(buttonVariant);
    },
  );

  it('is a secondary button', () => {
    useIsServerSideRendered.mockReturnValueOnce(true);
    wrapper = mount(EMainHeaderSignUpButton, options);
    expect(wrapper.attributes('variant')).toBe('solid-white');
  });

  it('calls the analytics correctly on click', async () => {
    await triggerSafeLinkClick(wrapper);

    expect(sendCoreAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith(
      'accountsSignUpButtonClicked',
      { buttonVariant: 'solid-white' },
    );
  });
});
