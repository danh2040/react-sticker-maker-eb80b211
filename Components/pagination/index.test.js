import VueRouter from 'vue-router';
import { createLocalVue, mount, shallowMount } from '@vue/test-utils';

import omit from '@ecosia/js-utils/omit.js';

import EPagination, { invalidCurrentError, MAX_SHOWN_PAGES } from './index.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
const propsData = { current: 1, pages: 4 };
const options = { localVue, propsData };

describe('EPagination', () => {
  beforeEach(() => {
    options.router = new VueRouter();
  });

  itRendersAndIsVisible(
    mount(EPagination, { localVue, propsData, router: new VueRouter() }),
    'nav',
    'pagination',
  );

  it('renders controls', () => {
    const wrapper = mount(EPagination, options);
    expect(wrapper.find(byTestId('pagination-current')).text()).toEqual(expect.stringContaining(String(propsData.current + 1)));
    expect(wrapper.find(byTestId('pagination-control-previous')).attributes('href'))
      .toEqual(expect.stringContaining(`p=${propsData.current - 1}`));
    expect(wrapper.find(byTestId('pagination-control-next')).attributes('href'))
      .toEqual(expect.stringContaining(`p=${propsData.current + 1}`));
  });

  it.each(['current', 'pages'])('warns on missing %s', (prop) => {
    expect(() => shallowMount(EPagination, { ...options, propsData: omit(propsData, [prop]) }))
      .toHaveMissingProp(prop);
  });

  it.each([['current', -4, 0], ['pages', 0, -4]])('warns on invalid %s', (prop, current, pages) => {
    expect(() => {
      shallowMount(EPagination, { ...options, propsData: { ...propsData, current, pages } });
    }).toHaveInvalidProp(prop);
  });

  it('warns on current page higher or equal pages', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    shallowMount(EPagination, { ...options, propsData: { ...propsData, current: 4 } });
    expect(console.error).toHaveBeenCalledWith(invalidCurrentError);
  });

  it('does not render on only one page', () => {
    const wrapper = shallowMount(EPagination, {
      ...options,
      propsData: { ...propsData, current: 0, pages: 1 },
    });
    expect(wrapper.element).toBeEmptyOrComment();
  });

  describe('Current page is first', () => {
    const current = 0;

    it('renders pages', () => {
      const wrapper = shallowMount(
        EPagination,
        { ...options, propsData: { ...propsData, current } },
      );
      const pages = wrapper.findAll(byTestId('pagination-page'));
      const expectedParams = [1, 2, 3];
      expect(pages.length).toBe(propsData.pages - 1);
      pages.wrappers.forEach((page, index) => {
        const expected = expectedParams[index];
        expect(page.attributes('href')).toEqual(expect.stringContaining(`p=${expected}`));
        expect(page.text()).toEqual(expect.stringContaining(String(expected + 1)));
      });
    });

    it('renders centered and only next page control', () => {
      const wrapper = shallowMount(
        EPagination,
        { ...options, propsData: { ...propsData, current } },
      );
      const control = wrapper.find(byTestId('pagination-control-next'));
      expect(control.exists()).toBe(true);
      expect(control.attributes('href')).toEqual(expect.stringContaining(`p=${current + 1}`));
      expect(wrapper.find(byTestId('pagination-control-previous')).exists()).toBe(false);
    });
  });

  describe('Current page is last', () => {
    const current = propsData.pages - 1;

    it('renders pages', () => {
      const wrapper = shallowMount(
        EPagination,
        { ...options, propsData: { ...propsData, current } },
      );
      const pages = wrapper.findAll(byTestId('pagination-page'));
      const expectedParams = [0, 1, 2];
      expect(pages.length).toBe(propsData.pages - 1);
      pages.wrappers.forEach((page, index) => {
        const expected = expectedParams[index];
        expect(page.attributes('href')).toEqual(expect.stringContaining(`p=${expected}`));
        expect(page.text()).toEqual(expect.stringContaining(String(expected + 1)));
      });
    });

    it('renders centered and only previous page control', () => {
      const wrapper = shallowMount(
        EPagination,
        { ...options, propsData: { ...propsData, current } },
      );
      const control = wrapper.find(byTestId('pagination-control-previous'));
      expect(control.exists()).toBe(true);
      expect(control.attributes('href')).toEqual(expect.stringContaining(`p=${current - 1}`));
      expect(wrapper.find(byTestId('pagination-control-next')).exists()).toBe(false);
    });
  });

  it('renders max number of pages when exceeding', () => {
    const current = 5;
    const wrapper = shallowMount(EPagination, {
      ...options,
      propsData: {
        ...propsData,
        current,
        pages: MAX_SHOWN_PAGES + 10,
      },
    });
    const pages = wrapper.findAll(byTestId('pagination-page'));
    const expectedParams = [3, 4, 6, 7];
    expect(pages.length).toBe(MAX_SHOWN_PAGES - 1);
    pages.wrappers.forEach((page, index) => {
      const expected = expectedParams[index];
      expect(page.attributes('href')).toEqual(expect.stringContaining(`p=${expected}`));
      expect(page.text()).toEqual(expect.stringContaining(String(expected + 1)));
    });
  });
});
