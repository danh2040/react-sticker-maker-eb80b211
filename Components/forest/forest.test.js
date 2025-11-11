import { mount, shallowMount } from '@vue/test-utils';
import { mockIntersectionObserver } from 'jsdom-testing-mocks';

import EWaveSeparator from '../wave-separator/index.vue';
import EForest from './index.vue';

const intersectionObserver = mockIntersectionObserver();

describe('Forest', () => {
  itRendersAndIsVisible(mount(EForest), 'div');

  it('renders forest on show forest', async () => {
    const wrapper = mount(EForest);
    const forestElement = wrapper.find(byTestId('forest-section-forest'));
    expect(forestElement.classes().includes('forest-section__forest--visible')).toBe(false);
    await intersectionObserver.enterNode(wrapper.element);
    expect(forestElement.classes().includes('forest-section__forest--visible')).toBe(true);
  });

  it('renders forest if lazy loading is bypassed', async () => {
    const wrapper = mount(EForest, { propsData: { bypassLazyLoading: true } });
    const forestElement = wrapper.find(byTestId('forest-section-forest'));
    expect(forestElement.classes().includes('forest-section__forest--visible')).toBe(true);
  });

  it('does not render wave by default', () => {
    const wrapper = mount(EForest);
    expect(wrapper.find(byTestId('forest-section-wave')).exists()).toBe(false);
  });

  it('render waves when showWave is true', () => {
    const wrapper = mount(EForest, { propsData: { showWave: true } });
    expect(wrapper.find(byTestId('forest-section-wave')).exists()).toBe(true);
  });

  it('renders secondary wave by default', () => {
    const wrapper = mount(EForest, { propsData: { showWave: true } });
    const wave = wrapper.findComponent(EWaveSeparator);
    expect(wave.exists()).toBe(true);
    expect(wave.props('variant')).toBe('secondary');
  });

  it('applies the wave variant', () => {
    const wrapper = mount(EForest, { propsData: { showWave: true, waveVariant: 'primary' } });
    const wave = wrapper.findComponent(EWaveSeparator);
    expect(wave.props('variant')).toBe('primary');
  });

  it('warns on invalid background', () => {
    expect(() => shallowMount(EForest, { propsData: { background: 'thirtiray' } })).toHaveInvalidProp('background');
  });
});
