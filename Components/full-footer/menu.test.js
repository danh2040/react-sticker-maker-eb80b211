import { mount } from '@vue/test-utils';

import EFooterMenu from './menu.vue';

const titleKey = 'title-key';
const menu = Array.from(
  { length: 5 },
  (__, index) => ({
    key: `item${index}-key`,
    url: `item${index}-url`,
  }),
);

const mountMenu = (items) => mount(EFooterMenu, {
  propsData: {
    items,
    titleKey,
  },
});

describe('Footer Social', () => {
  itRendersAndIsVisible(mountMenu(), 'div', 'footer-menu');

  it('renders menu title', () => {
    const wrapper = mountMenu();
    const title = wrapper.find('h2');

    expect(title.text()).toBe(`common.footer.${titleKey}`);
  });

  it('renders a link with rel noopener for each menu item', () => {
    const wrapper = mountMenu(menu);
    const links = wrapper.findAll(byTestId(titleKey));
    expect(links.length).toBe(menu.length);

    links.wrappers.forEach((link) => {
      expect(link.attributes('class')).toContain('link');
      expect(link.attributes('rel')).toBe('noopener');
    });
  });

  it('renders correct anchor text and url', () => {
    const wrapper = mountMenu(menu);
    const links = wrapper.findAll(byTestId(titleKey));

    links.wrappers.forEach((link, index) => {
      expect(link.text().endsWith(menu[index].key)).toBe(true);
      expect(link.attributes('href')).toBe(menu[index].url);
    });
  });
});
