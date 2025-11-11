import { mount, shallowMount } from '@vue/test-utils';

import EModalDropdown from './index.vue';

const TEST_TITLE = 'Labore minim veniam consectetur.';
const propsData = {
  title: TEST_TITLE,
  visible: false,
};

describe('EModalDropdown', () => {
  itRendersAndIsVisible(
    mount(EModalDropdown, { propsData: { ...propsData, visible: true } }),
    'div',
  );

  it('is not visible by default', () => {
    const wrapper = mount(EModalDropdown, { propsData });
    const root = wrapper.find(byTestId('dropdown-wrapper'));
    expect(root.exists()).toBe(false);
  });

  it('renders content if visible', () => {
    const testContentId = 'test-content-id';
    const wrapper = shallowMount(EModalDropdown, {
      propsData: { ...propsData, visible: true },
      slots: {
        default: `<div data-test-id="${testContentId}"></div>`,
      },
    });

    const testContent = wrapper.find(byTestId(testContentId));
    expect(wrapper).toBeVisible();
    expect(testContent).toBeVisible();
  });

  it('renders the title', () => {
    const wrapper = shallowMount(EModalDropdown, { propsData: { ...propsData, visible: true } });
    const footer = wrapper.find(byTestId('modal-dropdown-footer'));
    expect(footer.text()).toEqual(expect.stringContaining(TEST_TITLE));
  });

  it.each([
    'close-button',
    'dropdown-wrapper',
  ])('fires the \'close\' event when the %s is clicked', (testId) => {
    const close = vi.fn();
    const wrapper = mount(EModalDropdown, {
      propsData: { ...propsData, visible: true },
      listeners: {
        close,
      },
    });

    const closeButton = wrapper.find(byTestId(testId));
    closeButton.trigger('click');
    expect(close).toHaveBeenCalled();
  });
});
