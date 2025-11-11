import { shallowMount } from '@vue/test-utils';

import EHeading, { allowedTags, defaultTag } from './index.vue';

describe('EHeading', () => {
  let wrapper;

  itRendersAndIsVisible(shallowMount(EHeading), 'h1', 'heading');

  describe('default component', () => {
    beforeEach(() => {
      wrapper = shallowMount(EHeading);
    });

    it(`renders as ${defaultTag} with correct styling`, () => {
      expect(wrapper.element.tagName.toLowerCase()).toBe(defaultTag);
      expect(wrapper.classes(`heading--${defaultTag}`)).toBe(true);
    });
  });

  describe('Unsupported tag', () => {
    it('falls back to default and throws warning', () => {
      expect(wrapper.classes(`heading--${defaultTag}`)).toBe(true);
      expect(wrapper.element.tagName.toLowerCase()).toBe(defaultTag);
      expect(() => shallowMount(EHeading, { propsData: { as: 'span' } }))
        .toHaveInvalidProp('as');
    });
  });

  describe('with custom tag', () => {
    it.each(
      // We need to filter out the div tag since this is a special test case
      // div is tested separately beneath
      allowedTags.filter((tag) => tag !== 'div'),
    )(
      'renders %s and assigns correct styling',
      (value) => {
        wrapper = shallowMount(EHeading, { propsData: { as: value } });
        expect(wrapper.element.tagName.toLowerCase()).toBe(value);
        expect(wrapper.classes(`heading--${value}`)).toBe(true);
      },
    );
  });

  it(`renders as div and is styled as ${defaultTag}`, () => {
    wrapper = shallowMount(EHeading, { propsData: { as: 'div' } });
    expect(wrapper.element.tagName.toLowerCase()).toBe('div');
    expect(wrapper.classes(`heading--${defaultTag}`)).toBe(true);
  });

  it('renders as div and is styled as h1', () => {
    const styledAs = 'h1';
    wrapper = shallowMount(EHeading, { propsData: { as: 'div', styledAs } });
    expect(wrapper.element.tagName.toLowerCase()).toBe('div');
    expect(wrapper.classes(`heading--${styledAs}`)).toBe(true);
  });

  describe('with invalid tag', () => {
    it('renders defaults', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      wrapper = shallowMount(EHeading, { propsData: { as: 'span' } });
      expect(wrapper.element.tagName.toLowerCase()).toBe(defaultTag);
      expect(wrapper.classes(`heading--${defaultTag}`)).toBe(true);
    });
  });
});
