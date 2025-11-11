import { shallowMount } from '@vue/test-utils';

import EPanel, { sides } from './index.vue';

describe('EPanel', () => {
  const text = 'Test';

  itRendersAndIsVisible(
    shallowMount(EPanel, { slots: { default: `<span>${text}</span>` } }),
    'div',
  );

  it('renders panel content', () => {
    const wrapper = shallowMount(EPanel, { slots: { default: `<span>${text}</span>` } });
    expect(wrapper.find(byTestId('panel-content')).exists()).toBe(true);
    expect(wrapper.classes('panel--backdrop')).toBe(true);
    expect(wrapper.text()).toBe(text);
  });

  it.each(sides)('renders side %s', (side) => {
    const wrapper = shallowMount(EPanel, { propsData: { side } });
    expect(wrapper.classes(`panel--side-${side}`)).toBe(true);
  });

  it('renders without backdrop', () => {
    const wrapper = shallowMount(EPanel, { propsData: { backdrop: false } });
    expect(wrapper.classes('panel--backdrop')).toBe(false);
  });

  it('warns on invalid side', () => {
    expect(() => shallowMount(EPanel, { propsData: { side: 'abc' } }))
      .toHaveInvalidProp('side');
  });

  it('renders visible', () => {
    const wrapper = shallowMount(EPanel, { propsData: { visible: true } });
    expect(wrapper).toBeVisible();
  });

  it('warns on invalid visible', () => {
    expect(() => shallowMount(EPanel, { propsData: { visible: 'abc' } }))
      .toHaveInvalidProp('visible');
  });

  it('emits click event if panel itself is clicked', () => {
    const listeners = { click: vi.fn() };
    const wrapper = shallowMount(EPanel, { propsData: { visible: true }, listeners });
    wrapper.trigger('click');
    expect(listeners.click).toHaveBeenCalled();
  });

  it('does not emit click event if the content is clicked', () => {
    const testId = 'some-element';
    const slots = { default: `<span data-test-id="${testId}"></span>` };
    const listeners = { click: vi.fn() };
    const wrapper = shallowMount(EPanel, { propsData: { visible: true }, listeners, slots });
    wrapper.find(byTestId(testId)).trigger('click');
    expect(listeners.click).not.toHaveBeenCalled();
  });
});
