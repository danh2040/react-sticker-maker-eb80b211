import { mount } from '@vue/test-utils';

import EPopover, { sides } from './index.vue';

describe('EPopover', () => {
  itRendersAndIsVisible(mount(EPopover), 'div', 'popover');

  describe('Sides', () => {
    it.each(sides)('renders with %s side', (side) => {
      const wrapper = mount(EPopover, { propsData: { side } });
      expect(wrapper.classes(`popover--side-${side}`)).toBe(true);
    });

    it('warns on invalid side', () => {
      expect(() => mount(EPopover, { propsData: { side: 'offside' } }))
        .toHaveInvalidProp('side');
    });

    it('changes it during lifecycle', async () => {
      const side = 'right-center';
      const wrapper = mount(EPopover, { propsData: { side } });
      expect(wrapper.classes(`popover--side-${side}`)).toBe(true);
      const updatedSide = 'left-bottom';
      wrapper.setProps({ side: updatedSide });
      await wrapper.vm.$nextTick();
      expect(wrapper.classes(`popover--side-${updatedSide}`)).toBe(true);
    });
  });

  it('is always visible when the visible prop is true', () => {
    const wrapper = mount(EPopover, { propsData: { visible: true } });
    expect(wrapper.find(byTestId('popover-content'))).toBeVisible();
  });
});
