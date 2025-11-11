import { mount } from '@vue/test-utils';

import EIcon from './index.vue';

const propsData = { icon: 'check' };

describe('EIcon', () => {
  // Vitest does not run beforeEach if the function call is not `it`.
  // this is the case of itRendersAndIsVisible custom test block
  it('renders and is visible', async () => {
    const wrapper = mount(EIcon, { propsData });
    await vi.dynamicImportSettled();
    expect(wrapper.element).toHaveHtmlTag('svg');
    expect(wrapper).toBeVisible();
    expect(wrapper.classes('icon')).toBe(true);
  });

  it('warns on invalid size', () => {
    expect(
      () => mount(EIcon, { propsData: { ...propsData, size: 'xl' } }),
    ).toHaveInvalidProp('size');
  });

  it('throws on invalid icon', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mount(EIcon, { propsData: { icon: 'invalid' } });
    await vi.dynamicImportSettled();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
