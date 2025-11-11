import { mount, shallowMount } from '@vue/test-utils';

import EIcon from '@ecosia/common-vue2/components/icon/index.vue';

import EToast from './index.vue';

describe('EToast', () => {
  itRendersAndIsVisible(shallowMount(EToast), 'transition-stub');

  it('renders the toast when the show prop is true', async () => {
    const wrapper = mount(EToast);

    let toast = wrapper.find(byTestId('toast'));
    expect(toast.exists()).toBe(false);

    await wrapper.setProps({ show: true });
    toast = wrapper.find(byTestId('toast'));
    expect(toast.exists()).toBe(true);
  });

  it.each([
    ['neutral', null],
    ['informative', 'info-circle'],
    ['positive', 'check-circle'],
    ['negative', 'problem'],
  ])('renders with the correct variant class and icon for %s', async (variant, iconName) => {
    const wrapper = mount(EToast, {
      propsData: {
        variant,
        show: true,
      },
    });

    expect(wrapper.classes(`toast--variant-${variant}`)).toBe(true);
    const icons = wrapper.findAllComponents(EIcon);
    if (iconName) {
      expect(icons.at(0).props('icon')).toBe(iconName);
      expect(icons.at(1).props('icon')).toBe('close');
    } else {
      expect(icons.at(0).props('icon')).toBe('close');
    }
  });

  it('renders with the right class when right prop is true', () => {
    const wrapper = mount(EToast, {
      propsData: {
        right: true,
        show: true,
      },
    });

    expect(wrapper.classes()).toContain('toast--right');
  });

  it('emits dismiss event when close button is clicked', async () => {
    const wrapper = mount(EToast, {
      propsData: {
        show: true,
      },
    });

    await wrapper.find(byTestId('dismiss')).trigger('click');
    expect(wrapper.emitted('dismiss')).toBeTruthy();
  });

  it('renders slot content', () => {
    const wrapper = mount(EToast, {
      propsData: {
        show: true,
      },
      slots: {
        default: 'This is a toast message',
      },
    });

    expect(wrapper.text()).toContain('This is a toast message');
  });
});
