import { mount } from '@vue/test-utils';

import { getAppUrl } from '@ecosia/common-js/universal/url-utils.js';

import { ANDROID, IOS } from '@ecosia/constants/browsers.js';

import EMobileBadge from './index.vue';

const mountWithOS = (os) => mount(EMobileBadge, {
  propsData: {
    locale: 'en',
    os,
  },
});

describe('EMobileBadge', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  itRendersAndIsVisible(mountWithOS(IOS), 'a');

  it('renders the store link in a blank page and ref noopener', () => {
    const wrapper = mountWithOS(IOS);
    expect(wrapper.attributes('target')).toBe('_blank');
    expect(wrapper.attributes('rel')).toBe('noopener');
  });

  it('renders the app store link when os is ios', () => {
    const wrapper = mountWithOS(IOS);
    expect(wrapper.attributes('href')).toBe(getAppUrl(IOS));
  });

  it('renders the play store link when os is android', () => {
    const wrapper = mountWithOS(ANDROID);
    expect(wrapper.attributes('href')).toBe(getAppUrl(ANDROID));
  });

  it('renders nothing when os is nothing', () => {
    // ignore the prop console error
    vi.spyOn(console, 'error').mockImplementation(() => null);

    const wrapper = mountWithOS();
    expect(wrapper.isVisible()).toBe(false);
  });
});
