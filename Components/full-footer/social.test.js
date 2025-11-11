import { mount, shallowMount } from '@vue/test-utils';

import { sendCoreAnalyticsEvent } from '@ecosia/common-js/client/analytics.js';
import { getSocialMenu } from '@ecosia/common-js/universal/menus.js';

import EFooterSocial from './social.vue';

vi.mock('@ecosia/common-js/client/analytics.js', () => ({
  sendCoreAnalyticsEvent: vi.fn(),
}));

const menu = getSocialMenu(true);
const options = { propsData: { menu } };

describe('Footer Social', () => {
  itRendersAndIsVisible(shallowMount(EFooterSocial, options), 'div');

  it('renders the 7 social links', () => {
    const wrapper = shallowMount(EFooterSocial, options);
    const socialLinks = wrapper.findAll(byTestId('footer-social__link'));
    expect(socialLinks.length).toBe(7);

    socialLinks.wrappers.forEach((link, index) => {
      expect(link.attributes('href')).toBe(menu[index].url);
      expect(link.attributes('rel')).toBe('noopener noreferrer');
    });
  });

  it('renders legal text', () => {
    const wrapper = shallowMount(EFooterSocial, options);
    expect(wrapper.find('.footer-social__legal').exists()).toBe(true);
  });

  it('tracks click', async () => {
    const wrapper = mount(EFooterSocial, options);
    const link = wrapper.find(byTestId('footer-social__link'));
    await link.trigger('click');
    expect(sendCoreAnalyticsEvent).toHaveBeenCalled();
  });
});
