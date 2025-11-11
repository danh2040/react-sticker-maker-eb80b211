import { shallowMount } from '@vue/test-utils';

import EDropdown, { sides } from './index.vue';

const getDropdown = (wrapper) => wrapper.find(byTestId('dropdown'));
const propsData = { visible: true };

describe('EDropdown', () => {
  itRendersAndIsVisible(shallowMount(EDropdown, { propsData }), 'transition-stub');

  it('is not visible by default', () => {
    const wrapper = shallowMount(EDropdown);
    const root = wrapper.find(byTestId('dropdown'));
    expect(root.exists()).toBe(false);
  });

  it('warns on invalid side', () => {
    expect(() => shallowMount(EDropdown, { propsData: { side: 'abc' } }))
      .toHaveInvalidProp('side');
  });

  it('warns on invalid visible', () => {
    expect(() => shallowMount(EDropdown, { propsData: { visible: 'abc' } }))
      .toHaveInvalidProp('visible');
  });

  it('renders visible', () => {
    const wrapper = shallowMount(EDropdown, { propsData });
    expect(getDropdown(wrapper)).toBeVisible();
  });

  it('renders content', () => {
    const text = 'Test';
    const wrapper = shallowMount(EDropdown, {
      propsData,
      slots: { default: `<span>${text}</span>` },
    });
    expect(wrapper.text()).toBe(text);
  });

  it('renders sides', () => {
    sides
      .forEach((side) => {
        const wrapper = shallowMount(EDropdown, { propsData: { ...propsData, side } });
        expect(getDropdown(wrapper).classes(`dropdown--side-${side}`)).toBe(true);
      });
  });

  it('focuses on first focusable child when visible', async () => {
    const wrapper = shallowMount(EDropdown, {
      attachTo: document.body,
      propsData: {
        visible: false,
      },
      slots: {
        default: '<button>Edit</button>',
      },
    });

    await wrapper.setProps({ visible: true });
    await wrapper.vm.$nextTick();

    const buttonWrapper = wrapper.find('button').element;

    expect(buttonWrapper).toBe(document.activeElement);
  });
});
