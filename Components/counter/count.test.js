import { shallowMount } from '@vue/test-utils';

import ECount from './count.vue';

vi.useFakeTimers();

// TODO: This function breaks if another class is added to .count__digit
//       which is not exactly 'count__digit'.
// It needs to be rewritten in a way that doesn't depend on an exact class list
const getCountFromClasses = (wrapper) => wrapper
  .findAll(byTestId('count-digit'))
  .wrappers
  .map((wrp) => wrp.classes().find((cls) => cls !== 'count__digit').split('--digit-')[1])
  .join('');

describe('ECount', () => {
  itRendersAndIsVisible(shallowMount(ECount, { propsData: { count: 123 } }), 'div');

  it('renders count', () => {
    const count = 123;
    const expected = count.toString();
    const wrapper = shallowMount(ECount, { propsData: { count } });
    expect(wrapper.find(byTestId('count-raw')).text()).toBe(expected);
    expect(getCountFromClasses(wrapper)).toBe(expected);
  });

  it('re-renders count', async () => {
    const count = 123;
    const wrapper = shallowMount(ECount, { propsData: { count } });
    const updated = 456;
    const expected = updated.toString();
    wrapper.setProps({ count: updated });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(byTestId('count-raw')).text()).toBe(expected);
    expect(getCountFromClasses(wrapper)).toBe(expected);
  });

  it('warns on missing count', () => {
    expect(() => shallowMount(ECount, { propsData: {} }))
      .toHaveMissingProp('count');
  });

  it.each([[0], [-1]])('warns on invalid count %d', (count) => {
    expect(() => shallowMount(ECount, { propsData: { count } }))
      .toHaveInvalidProp('count');
  });

  it.each([['missing', undefined], ['invalid', 0]])('does not render on %s count', (status, count) => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapper = shallowMount(ECount, { propsData: { count } });
    expect(wrapper.isVisible()).toBe(false);
    expect(wrapper.isEmpty()).toBe(true);
  });

  it.each([
    ['fr', false],
    ['en', true],
    [undefined, true],
  ])('renders count with number separators every 3 digits on locale %s', (locale, hasSeparator) => {
    const wrapper = shallowMount(ECount, { propsData: { count: 123456789, locale } });

    const digits = wrapper.findAll(byTestId('count-digit'));
    digits.wrappers.forEach((digit, index, all) => {
      // some locales might not show any separators (e.g. French)
      // others should show them for every 3 digits, apart from the last one
      const shouldShowSeparator = hasSeparator &&
        (index % 3 === 2) &&
        (index < all.length - 1);
      const textLength = shouldShowSeparator ? 2 : 1;
      const numbers = digit.findAll(byTestId('count-number')).wrappers;
      expect(numbers.every((number) => number.text().length === textLength)).toBe(true);
    });
  });
});
