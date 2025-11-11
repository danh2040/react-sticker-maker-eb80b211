import { mount } from '@vue/test-utils';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';

import EBrowserPageLink from './browser-page-link.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

const positionTracking = 'test';

const propsData = {
  color: 'primary',
  href: 'https://www.ecosia.org/browser',
  positionTracking,
};

describe('EBrowserPageLink', () => {
  itRendersAndIsVisible(mount(EBrowserPageLink, { propsData }), 'a');

  it('sends a tracking event on click', async () => {
    const wrapper = mount(EBrowserPageLink, { propsData });
    const link = wrapper.find(byTestId('cta-link-to-browser-page'));
    await triggerSafeLinkClick(link);
    expect(sendCoreAnalyticsEvent).toHaveBeenCalledWith('ctaBrowserInstall', positionTracking);
  });
});
