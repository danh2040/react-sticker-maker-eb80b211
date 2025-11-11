import { mount } from '@vue/test-utils';

import ESheet from './index.vue';

const options = {
  propsData: {
    isVisible: true,
    ariaLabel: 'Navigation menu',
  },
};

const optionsWhileNotVisible = {
  ...options,
  propsData: {
    ...options.propsData,
    isVisible: false,
  },
};

describe('ESheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('is visible prop is false', () => {
    it('isnt visible', () => {
      const wrapper = mount(ESheet, optionsWhileNotVisible);
      const sheet = wrapper.find(byTestId('sheet'));
      expect(sheet.exists()).toBe(false);
    });
  });

  it('is visible', () => {
    const wrapper = mount(ESheet, options);
    const sheet = wrapper.find(byTestId('sheet'));
    expect(sheet.exists()).toBe(true);
  });

  // this is required for dialog accessibility
  it('sets aria-label from prop', async () => {
    const wrapper = mount(ESheet, options);
    expect(wrapper.attributes('aria-label')).toEqual('Navigation menu');
  });

  it('the close button has a default aria-label', async () => {
    const wrapper = mount(ESheet, options);
    const closeButton = wrapper.find(byTestId('sheet-close-button'));
    expect(closeButton.attributes('aria-label')).toEqual('common.generic.close');
  });

  describe('a close button aria-label is sent as a prop', () => {
    it('the close button has a default aria-label', async () => {
      const optionsWithCloseButtonAriaLabel = {
        ...options,
        propsData: {
          ...options.propsData,
          closeButtonAriaLabel: 'Close navigation menu',
        },
      };
      const wrapper = mount(ESheet, optionsWithCloseButtonAriaLabel);
      const closeButton = wrapper.find(byTestId('sheet-close-button'));
      expect(closeButton.attributes('aria-label')).toEqual('Close navigation menu');
    });
  });

  it('the close button emits event when clicked', async () => {
    const wrapper = mount(ESheet, options);
    const closeButton = wrapper.find(byTestId('sheet-close-button'));

    await closeButton.trigger('click');

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('calls trapFocus and unTrapFocus', async () => {
    // start not visible
    const wrapper = mount(ESheet, optionsWhileNotVisible);

    vi.spyOn(wrapper.vm, 'trapFocus').mockImplementation(() => {});
    vi.spyOn(wrapper.vm, 'unTrapFocus').mockImplementation(() => {});

    // change to visible
    wrapper.setProps({ isVisible: true });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.trapFocus).toHaveBeenCalledTimes(1);

    // change to invisible
    wrapper.setProps({ isVisible: false });
    await wrapper.vm.$nextTick();

    // ensure trapFocus isn't called again and only unTrapFocus
    expect(wrapper.vm.trapFocus).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.unTrapFocus).toHaveBeenCalledTimes(1);
  });
});
