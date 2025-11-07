import { shallowMount } from '@vue/test-utils';

import ETooltip, { sides, sizes } from './index.vue';

vi.useFakeTimers();

describe('ETooltip', () => {
  itRendersAndIsVisible(shallowMount(ETooltip), 'div', 'tooltip');

  describe('Padding', () => {
    it('renders with padding by default', () => {
      const wrapper = shallowMount(ETooltip);
      expect(wrapper.classes('tooltip--padding')).toBe(true);
    });

    it('renders without padding', () => {
      const wrapper = shallowMount(ETooltip, { propsData: { padding: false } });
      expect(wrapper.classes('tooltip--padding')).toBe(false);
    });
  });

  describe('Sides', () => {
    it.each(sides)('renders with %s side', (side) => {
      const wrapper = shallowMount(ETooltip, { propsData: { side } });
      expect(wrapper.classes(`tooltip--side-${side}`)).toBe(true);
    });

    it('warns on invalid side', () => {
      expect(() => shallowMount(ETooltip, { propsData: { side: 'offside' } }))
        .toHaveInvalidProp('side');
    });

    it('changes it during lifecycle', async () => {
      const side = 'right-center';
      const wrapper = shallowMount(ETooltip, { propsData: { side } });
      expect(wrapper.classes(`tooltip--side-${side}`)).toBe(true);
      const updatedSide = 'left-bottom';
      wrapper.setProps({ side: updatedSide });
      await wrapper.vm.$nextTick();
      expect(wrapper.classes(`tooltip--side-${updatedSide}`)).toBe(true);
    });
  });

  describe('Sizes', () => {
    it.each(sizes)('renders with %s size', (size) => {
      const wrapper = shallowMount(ETooltip, { propsData: { size } });
      expect(wrapper.classes(`tooltip--size-${size}`)).toBe(true);
    });

    it('warns on invalid size', () => {
      expect(() => shallowMount(ETooltip, { propsData: { size: 'huge' } }))
        .toHaveInvalidProp('size');
    });
  });

  it('renders a visible tooltip when openOnStart is true', async () => {
    const wrapper = shallowMount(ETooltip, { propsData: { openOnStart: true } });
    expect(wrapper.find(byTestId('tooltip-content'))).toBeVisible();
    expect(wrapper.emitted('tooltip-opened')).toBeTruthy();
  });

  it('toggles visibility on mouseenter and mouseleave', async () => {
    const wrapper = shallowMount(ETooltip);
    expect(wrapper.find(byTestId('tooltip-content'))).not.toBeVisible();
    await wrapper.trigger('mouseenter');
    expect(wrapper.find(byTestId('tooltip-content'))).toBeVisible();
    await wrapper.trigger('mouseleave');
    vi.runOnlyPendingTimers();
    await wrapper.vm.$nextTick();
    expect(wrapper.find(byTestId('tooltip-content'))).not.toBeVisible();
    await wrapper.trigger('mouseenter');
    expect(wrapper.find(byTestId('tooltip-content'))).toBeVisible();
  });

  it('should close tooltip on mouseleave when closeOnMouseLeave is true', async () => {
    const wrapper = shallowMount(ETooltip, { propsData: { closeOnMouseLeave: true } });
    const toggle = wrapper.find(byTestId('tooltip-toggle'));

    await toggle.trigger('click');
    expect(wrapper.find(byTestId('tooltip-content'))).toBeVisible();

    await wrapper.trigger('mouseleave');
    vi.runOnlyPendingTimers();
    await wrapper.vm.$nextTick();

    expect(wrapper.find(byTestId('tooltip-content'))).not.toBeVisible();
  });

  it.each([
    { open: ['click'], close: ['click'] },
    { open: ['keypress', { key: 'Enter' }], close: ['keyup', { key: 'Escape' }] },
    { open: ['keypress', { key: 'Enter' }], close: ['keypress', { key: 'Enter' }] },
    { open: ['keypress', { key: ' ' }], close: ['keyup', { key: 'Escape' }] },
    { open: ['keypress', { key: ' ' }], close: ['keypress', { key: ' ' }] },
  ])('toggles visibility on %O, regardless of hover and out', async ({ open, close }) => {
    const wrapper = shallowMount(ETooltip);
    const toggle = wrapper.find(byTestId('tooltip-toggle'));
    expect(wrapper.find(byTestId('tooltip-content'))).not.toBeVisible();
    await toggle.trigger(...open);
    expect(wrapper.find(byTestId('tooltip-content'))).toBeVisible();
    await wrapper.trigger('mouseenter');
    expect(wrapper.find(byTestId('tooltip-content'))).toBeVisible();
    await wrapper.trigger('mouseleave');
    vi.runOnlyPendingTimers();
    expect(wrapper.find(byTestId('tooltip-content'))).toBeVisible();
    await toggle.trigger(...close);
    expect(wrapper.find(byTestId('tooltip-content'))).not.toBeVisible();
  });

  it('hides when the user scrolls the page', async () => {
    const wrapper = shallowMount(ETooltip);
    const toggle = wrapper.find(byTestId('tooltip-toggle'));
    expect(wrapper.find(byTestId('tooltip-content'))).not.toBeVisible();
    await toggle.trigger('click');
    expect(wrapper.find(byTestId('tooltip-content'))).toBeVisible();
    await document.dispatchEvent(new Event('scroll'));
    expect(wrapper.find(byTestId('tooltip-content'))).not.toBeVisible();
  });
});
