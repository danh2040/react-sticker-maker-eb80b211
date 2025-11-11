import { mount } from '@vue/test-utils';

import EBreadcrumbNav from './index.vue';

describe('EBreadcrumbNav', () => {
  describe('no links sent', () => {
    it('doesnt render anything', () => {
      const wrapper = mount(EBreadcrumbNav);
      expect(wrapper.isVisible()).toBe(false);
    });
  });

  describe('has links sent', () => {
    const expectedLinks = [
      { href: '/accounts/profile', text: 'Your profile' },
      { href: '/accounts/profile/personal-info', text: 'Personal info' },
    ];
    const options = {
      propsData: {
        links: expectedLinks,
      },
    };

    it('renders the links', () => {
      const wrapper = mount(EBreadcrumbNav, options);
      const linkElements = wrapper.findAll(byTestId('breadcrumb-nav-item-link'));
      expect(linkElements.length).toBe(2);
      linkElements.wrappers.forEach((linkElement, index) => {
        const expectedLink = expectedLinks[index];
        expect(linkElement.isVisible()).toBe(true);
        expect(linkElement.attributes('href')).toBe(expectedLink.href);
        expect(linkElement.text()).toBe(expectedLink.text);
      });
    });
  });
});
